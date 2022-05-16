import {Outlet, Route} from "@tanstack/react-location";
import {useLiveQuery} from "dexie-react-hooks";
import {Helmet} from "react-helmet-async";
import {useForm} from "react-hook-form";
import {FC, useState} from "react";
import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Text,
	useDisclosure,
	UseModalProps, useToast
} from "@chakra-ui/react";

import {DiceFormula} from "components/DiceFormula";
import {RouteGenerics} from "../index";
import {Encounter, ICombatant, pfdb} from "data";

interface CombatantsModalProps {
	selectCombatant: (id: number) => void;
}

const CombatantsModal: FC<CombatantsModalProps & UseModalProps> = ({selectCombatant, ...props}) => {
	const {register, reset, clearErrors, handleSubmit, formState: {errors, isSubmitting}} = useForm<ICombatant>();
	const combatants = useLiveQuery(() => pfdb.combatants.toArray());
	const {isOpen, onOpen, onClose} = useDisclosure({
		onOpen() {
			clearErrors();
			reset({
				id: undefined,
				name: "",
				type: "ally",
				initiative: 0,
				maxHealth: 1,
			});
		}
	});

	async function onSubmit(value: ICombatant) {
		await pfdb.combatants.add(value);
		onClose();
	}

	return <>
		<Modal size="lg" autoFocus={false} {...props}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Combatants</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{combatants?.map(value => <Flex
						direction="row"
						justifyContent="space-between"
						mt={1}
						key={value.id}
					>
						<Text>{value.name} - {value.maxHealth}HP ({value.initiative > 0 ? "+" : ""}{value.initiative}) - {value.type}</Text>
						<Button size="sm" variant="outline" onClick={() => selectCombatant(value.id ?? 0)}>
							Add to Encounter
						</Button>
					</Flex>)}
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={props.onClose}>
						Close
					</Button>
					<Button variant="ghost" onClick={onOpen}>
						Create Combatant
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
		<Modal autoFocus={false} size="md" isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create a new Combatant</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl isInvalid={errors.name !== undefined}>
							<FormLabel htmlFor="name">Name</FormLabel>
							<Input
								type="text"
								id="name"
								{...register("name", {
									required: "This is required",
								})}
							/>
							<FormErrorMessage>
								{errors.name && errors.name.message}
							</FormErrorMessage>
						</FormControl>
						<FormControl isInvalid={errors.initiative !== undefined}>
							<FormLabel htmlFor="initiative">Initiative Modifier</FormLabel>
							<NumberInput
								min={-20}
								max={20}
								id="initiative"
								{...register("initiative")}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</FormControl>
						<FormControl isInvalid={errors.maxHealth !== undefined}>
							<FormLabel htmlFor="maxHealth">Maximum HP</FormLabel>
							<NumberInput
								min={1}
								id="maxHealth"
								{...register("maxHealth")}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</FormControl>
						<FormControl isInvalid={errors.type !== undefined}>
							<FormLabel htmlFor="type">Maximum HP</FormLabel>
							<Select id="type" {...register("type")}>
								<option value="ally">Ally</option>
								<option value="enemy">Enemy</option>
							</Select>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</form>
		</Modal>
	</>;
};

const Page: FC = () => {
	const [encounterId, setEncounterId] = useState<number>(0)
	const combatantsDisclosure = useDisclosure();
	const toast = useToast();

	const encounter = useLiveQuery(async () => await pfdb.encounters.get(encounterId) as Encounter);

	const selectCombatant = (id: number) => {
		if (encounter === undefined) {
			toast({
				position: "bottom",
				isClosable: true,
				description: "There is no encounter loaded!",
				status: "error",
				duration: 2500,
			});
		} else {
		}
	};

	return <>
		<Helmet>
			<title>Combat Tracker - Numsgil Co</title>
		</Helmet>
		<Flex direction="column">
			<Flex direction="row" justifyContent={{base: "center", md: "flex-end"}} flexWrap="wrap">
				<DiceFormula width={{base: "100%", md: "20rem"}} m={2} />
				<ButtonGroup size="md" variant="solid" isAttached m={2}>
					<Button onClick={combatantsDisclosure.onOpen}>
						Combatants
					</Button>
					<Button>
						Encounters
					</Button>
				</ButtonGroup>
			</Flex>
		</Flex>
		<CombatantsModal
			selectCombatant={selectCombatant}
			isOpen={combatantsDisclosure.isOpen}
			onClose={combatantsDisclosure.onClose}
		/>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "combat",
	element: <Outlet />,
	children: [
		{
			path: "/",
			element: <Page />,
		},
	],
	meta: {},
};

export default route;
