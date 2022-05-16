import {FaChevronLeft, FaChevronRight, FaMinus, FaPen, FaPlay, FaPlus, FaStop, FaTrash} from "react-icons/all";
import {Outlet, Route} from "@tanstack/react-location";
import {useLiveQuery} from "dexie-react-hooks";
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
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
	useColorModeValue,
	useDisclosure,
	UseModalProps,
	useToast
} from "@chakra-ui/react";

import {DiceFormula} from "components/DiceFormula";
import {Condition, Encounter, ICombatant, pfdb} from "data";
import {RouteGenerics} from "../index";
import {Dice} from "dice-typescript";

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

interface IParticipant {
	combatant: {
		name: string;
		initiative: number;
		maxHealth: number;
		type: "ally" | "enemy";
	};
	initiativeRoll: number;
	temporaryHealth: number;
	nonlethalDamage: number;
	lethalDamage: number;
	conditions: Array<Condition>;
	linkedParticipants: Array<{
		combatant: {
			name: string;
			initiative: number;
			maxHealth: number;
		};
		temporaryHealth: number;
		nonlethalDamage: number;
		lethalDamage: number;
		conditions: Array<Condition>;
	}>;
}

const Page: FC = () => {
	const [encounterStarted, setEncounterStarted] = useState<boolean>(false);
	const [encounterId, setEncounterId] = useState<number>(0);
	const combatantsDisclosure = useDisclosure();
	const encountersDisclosure = useDisclosure();
	const toast = useToast();

	const encounter = useLiveQuery(async () => await pfdb.encounters.get(encounterId) as Encounter, [encounterId]);

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
			encounter.addCombatant(id).catch(console.error);
		}
	};

	const startEncounter = async () => {
		const dice = new Dice();
		if (encounter) {
			encounter.participants.forEach(info => {
				info.initiativeRoll = dice.roll("1d20").total;
				info.nonlethalDamage = 0;
				info.lethalDamage = 0;
			});
			await pfdb.encounters.update(encounterId, {participants: encounter.participants});
			setEncounterStarted(true);
		}
	};

	const ParticipantItem: FC<{ info: IParticipant, index: number }> = ({info, index}) => {
		const [damage, setDamage] = useState<number>(0);

		const applyDamage = async () => {
			if (encounter) {
				encounter.participants[index].lethalDamage += damage;
				setDamage(0);
				await pfdb.encounters.update(encounterId, {participants: encounter.participants});
			}
		};

		const applyHeal = async () => {
			if (encounter) {
				encounter.participants[index].lethalDamage -= damage;
				if (encounter.participants[index].lethalDamage < 0) {
					encounter.participants[index].lethalDamage = 0;
				}
				setDamage(0);
				await pfdb.encounters.update(encounterId, {participants: encounter.participants});
			}
		};

		return <Flex
			direction="row"
			m={2}
			borderColor={useColorModeValue("gray.400", "gray.600")}
			borderWidth="1px"
			borderRadius={8}
		>
			<Flex
				direction="column"
				justifyContent="center"
				backgroundColor={useColorModeValue(
					info.combatant.type === "ally" ? "green.200" : "red.300",
					info.combatant.type === "ally" ? "green.600" : "red.800"
				)}
				borderColor={useColorModeValue("gray.400", "gray.600")}
				borderRightWidth="1px"
				borderLeftRadius={7}
				p={3}
			>
				<Text textAlign="center">{info.combatant.name}</Text>
				<Text fontSize="small">Initiative
					Modifier: {info.combatant.initiative > 0 ? "+" : ""}{info.combatant.initiative}</Text>
			</Flex>
			<Flex
				direction="column"
				justifyContent="center"
				borderColor={useColorModeValue("gray.400", "gray.600")}
				borderRightWidth="1px"
				px={3}
			>
				<Text textAlign="center">Initiative</Text>
				<Text fontSize="larger" fontWeight="bold" textAlign="center">
					{info.initiativeRoll === 0 ? 0 : parseInt(String(info.initiativeRoll)) + parseInt(String(info.combatant.initiative))}
				</Text>
			</Flex>
			<Flex
				direction="column"
				borderColor={useColorModeValue("gray.400", "gray.600")}
				borderRightWidth="1px"
				p={1}
			>
				<Text textAlign="center">
					Current Health: {info.combatant.maxHealth - info.lethalDamage}/{info.combatant.maxHealth}
				</Text>
				<InputGroup size="md">
					<Input
						pr=".5rem"
						type="number"
						min={0}
						value={damage}
						onChange={e => setDamage(parseInt(e.target.value))}
						onKeyDown={e => {
							if (e.key === "Enter") {
								e.preventDefault();
								applyDamage().catch(console.error);
							}
						}}
						onFocus={e => e.target.select()}
					/>
					<InputRightElement width="4.7rem">
						<ButtonGroup isAttached size="sm" h="1.75rem">
							<IconButton h="1.75rem" aria-label="Heal" icon={<FaPlus />} onClick={applyHeal} />
							<IconButton h="1.75rem" aria-label="Damage" icon={<FaMinus />} onClick={applyDamage} />
						</ButtonGroup>
					</InputRightElement>
				</InputGroup>
			</Flex>
		</Flex>
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
			{encounter === undefined && <Text as="h3" textAlign="center">No Encounter Loaded</Text>}
			{encounter !== undefined && <>
				<Flex direction="row" justifyContent="center" alignItems="center">
					<Text as="h3" mx={3}>{encounter.name}</Text>
					<ButtonGroup isAttached size="sm" variant="outline">
						<IconButton
							aria-label="Start"
							icon={<FaPlay />}
							disabled={encounterStarted}
							onClick={startEncounter}
						/>
						<IconButton
							aria-label="Stop"
							icon={<FaStop />}
							disabled={!encounterStarted}
							onClick={() => setEncounterStarted(false)}
						/>
						<IconButton
							aria-label="Previous"
							icon={<FaChevronLeft />}
							disabled={!encounterStarted}
						/>
						<IconButton
							aria-label="Next"
							icon={<FaChevronRight />}
							disabled={!encounterStarted}
						/>
					</ButtonGroup>
				</Flex>
				{encounter.participants.map((info, index) => <ParticipantItem key={index} info={info} index={index} />)}
			</>}
		</Flex>
		<CombatantsModal
			selectCombatant={selectCombatant}
			isOpen={combatantsDisclosure.isOpen}
			onClose={combatantsDisclosure.onClose}
		/>
		<EncounterModal
			selectEncounter={(id) => {
				setEncounterStarted(false);
				setEncounterId(id);
			}}
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
