import {useLiveQuery} from "dexie-react-hooks";
import {FaPen, FaTrash} from "react-icons/all";
import {FC, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {
	Button,
	ButtonGroup,
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
	Select,
	Text,
	useDisclosure,
	UseModalProps
} from "@chakra-ui/react";

import {ICombatant, pfdb} from "data";

interface CombatantFormProps {
	combatantId: number;
}

const CombatantFormModal: FC<CombatantFormProps & UseModalProps> = ({combatantId, ...props}) => {
	const {register, reset, clearErrors, handleSubmit, formState: {errors, isSubmitting}} = useForm<ICombatant>({
		defaultValues: {
			id: undefined,
			name: "",
			initiative: 0,
			maxHealth: 1,
			type: "ally",
		},
	});

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
	}, [props.isOpen]);

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
						<Input
							type="number"
							id="initiative"
							{...register("initiative", {
								min: {value: -20, message: "Initiative modifier can't be lower than -20"},
								max: {value: 20, message: "Initiative modifier can't be higher than 20"},
								valueAsNumber: true,
							})}
						/>
						<FormErrorMessage>
							{errors.initiative && errors.initiative.message}
						</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={errors.maxHealth !== undefined}>
						<FormLabel htmlFor="maxHealth">Maximum HP</FormLabel>
						<Input
							type="number"
							id="maxHealth"
							{...register("maxHealth", {
								min: {value: 1, message: "Maximum Health can't be lower than 1"},
								valueAsNumber: true,
							})}
						/>
						<FormErrorMessage>
							{errors.maxHealth && errors.maxHealth.message}
						</FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor="type">Combatant Type</FormLabel>
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

export const CombatantsModal: FC<CombatantsModalProps & UseModalProps> = ({selectCombatant, ...props}) => {
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
