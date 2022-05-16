import {Outlet, Route} from "@tanstack/react-location";
import {useLiveQuery} from "dexie-react-hooks";
import {FaPen, FaTrash} from "react-icons/all";
import {FC, useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {useForm} from "react-hook-form";
import {
	Button,
	ButtonGroup,
	Editable,
	EditableInput,
	EditablePreview,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	IconButton,
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
	UseModalProps,
	useToast
} from "@chakra-ui/react";

import {DiceFormula} from "components/DiceFormula";
import {Encounter, ICombatant, pfdb} from "data";
import {RouteGenerics} from "../index";

interface CombatantFormProps {
	combatantId: number;
}

const CombatantFormModal: FC<CombatantFormProps & UseModalProps> = ({combatantId, ...props}) => {
	const {register, reset, clearErrors, handleSubmit, formState: {errors, isSubmitting}} = useForm<ICombatant>();

	useEffect(() => {
		clearErrors();
		if (combatantId === 0) {
			reset({
				id: undefined,
				name: "",
				initiative: 0,
				maxHealth: 1,
				type: "ally",
			});
		} else {
			pfdb.combatants.get(combatantId).then(reset).catch(console.error);
		}
	}, [combatantId]);

	async function onSubmit(value: ICombatant) {
		if (value.id === undefined) {
			await pfdb.combatants.add(value);
		} else {
			await pfdb.combatants.update(value.id, value);
		}
		props.onClose();
	}

	return <Modal autoFocus={false} size="md" {...props}>
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
	</Modal>;
};

interface CombatantsModalProps {
	selectCombatant: (id: number) => void;
}

const CombatantsModal: FC<CombatantsModalProps & UseModalProps> = ({selectCombatant, ...props}) => {
	const combatants = useLiveQuery(() =>
		pfdb.combatants.toArray().then(value => value.sort((a, b) => a.name.localeCompare(b.name)))
	);
	const [editing, setEditing] = useState<number>(0);
	const {isOpen, onOpen, onClose} = useDisclosure();

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
						<Text>{value.name} - {value.maxHealth}HP ({value.initiative > 0 ? "+" : ""}{value.initiative})
							- {value.type}</Text>
						<ButtonGroup isAttached size="sm" variant="outline">
							<IconButton aria-label="Edit" icon={<FaPen />} onClick={() => {
								setEditing(value.id ?? 0);
								onOpen();
							}} />
							<IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => {
								if (value.id) {
									pfdb.combatants.delete(value.id).catch(console.error);
								}
							}} />
							<Button size="sm" variant="outline" onClick={() => selectCombatant(value.id ?? 0)}>
								Add to Encounter
							</Button>
						</ButtonGroup>
					</Flex>)}
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={props.onClose}>
						Close
					</Button>
					<Button variant="ghost" onClick={() => {
						setEditing(0);
						onOpen();
					}}>
						Create Combatant
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
		<CombatantFormModal combatantId={editing} isOpen={isOpen} onClose={onClose} />
	</>;
};

interface EncounterModalProps {
	selectEncounter: (id: number) => void;
}

const EncounterModal: FC<EncounterModalProps & UseModalProps> = ({selectEncounter, ...props}) => {
	const encounters = useLiveQuery(() =>
		pfdb.encounters.toArray().then(value => value
			.map(value => value as Encounter)
			.sort((a, b) => a.name.localeCompare(b.name))
		)
	);

	return <Modal size="lg" autoFocus={false} {...props}>
		<ModalOverlay />
		<ModalContent>
			<ModalHeader>Encounters</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				{encounters?.map(value => <Flex
					direction="row"
					justifyContent="space-between"
					mt={1}
					key={value.id}
				>
					<Editable defaultValue={value.name} onSubmit={name => {
						if (value.id) {
							pfdb.encounters.update(value.id, {name});
						}
					}}>
						<EditablePreview />
						<EditableInput />
					</Editable>
					<ButtonGroup isAttached size="sm" variant="outline">
						<IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => {
							if (value.id) {
								pfdb.encounters.delete(value.id).catch(console.error);
							}
						}} />
						<Button size="sm" variant="outline" onClick={() => selectEncounter(value.id ?? 0)}>
							Load
						</Button>
					</ButtonGroup>
				</Flex>)}
			</ModalBody>
			<ModalFooter>
				<Button colorScheme="blue" mr={3} onClick={props.onClose}>
					Close
				</Button>
				<Button variant="ghost" onClick={() => pfdb.encounters.add({name: "New Encounter", participants: []})}>
					Create Encounter
				</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>;
}

const Page: FC = () => {
	const [encounterId, setEncounterId] = useState<number>(0)
	const combatantsDisclosure = useDisclosure();
	const encountersDisclosure = useDisclosure();
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
					<Button onClick={encountersDisclosure.onOpen}>
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
		<EncounterModal
			selectEncounter={(id) => setEncounterId(id)}
			isOpen={encountersDisclosure.isOpen}
			onClose={encountersDisclosure.onClose}
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
