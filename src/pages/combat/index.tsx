import {FaChevronLeft, FaChevronRight, FaMinus, FaPlay, FaPlus, FaStop} from "react-icons/all";
import {Outlet, Route} from "@tanstack/react-location";
import {useLiveQuery} from "dexie-react-hooks";
import {FC, useState} from "react";
import {Helmet} from "react-helmet-async";
import {Dice} from "dice-typescript";
import {
	Button,
	ButtonGroup,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	useColorModeValue,
	useDisclosure,
	useToast
} from "@chakra-ui/react";

import {DiceFormula} from "components/DiceFormula";
import {CombatantsModal} from "./CombatantsModal";
import {EncounterModal} from "./EncounterModal";
import {Condition, Encounter, pfdb} from "data";
import {RouteGenerics} from "../index";

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
					{info.initiativeRoll === 0 ? 0 : info.initiativeRoll + info.combatant.initiative}
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
				{encounter.participants.map((info, index) => <ParticipantItem key={index} info={info} index={index} />)
					.sort((a, b) => {
						const infoA = (a.props as { info: IParticipant, index: number }).info;
						const infoB = (b.props as { info: IParticipant, index: number }).info;
						const iniA = infoA.initiativeRoll + infoA.combatant.initiative + (infoA.combatant.type === "ally" ? infoA.combatant.initiative / 100 : 0);
						const iniB = infoB.initiativeRoll + infoB.combatant.initiative + (infoB.combatant.type === "ally" ? infoB.combatant.initiative / 100 : 0);

						if (iniA < iniB) {
							return 1;
						}
						if (iniA > iniB) {
							return -1;
						}
						return 0;
					})
				}
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
