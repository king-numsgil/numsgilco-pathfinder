import {Button, ButtonGroup, Flex, IconButton, Text, useDisclosure, useToast} from "@chakra-ui/react";
import {FaChevronLeft, FaChevronRight, FaPlay, FaStop} from "react-icons/all";
import {Outlet, Route} from "@tanstack/react-location";
import {useLiveQuery} from "dexie-react-hooks";
import {Helmet} from "react-helmet-async";
import {Dice} from "dice-typescript";
import {FC, useState} from "react";

import {DiceFormula} from "components/DiceFormula";
import {ParticipantItem} from "./ParticipantItem";
import {CombatantsModal} from "./CombatantsModal";
import {EncounterModal} from "./EncounterModal";
import {RouteGenerics} from "../index";
import {Encounter, pfdb} from "data";

const Page: FC = () => {
	const [activeParticipant, setActiveParticipant] = useState<number>(-1);
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
			setActiveParticipant(0);
		}
	};

	return <>
		<Helmet>
			<title>Combat Tracker - Numsgil Co</title>
		</Helmet>
		<Flex direction="column" alignItems="center">
			<Flex direction="row" justifyContent={{base: "center", md: "flex-end"}} flexWrap="wrap" w="100%">
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
				<Flex direction="row" justifyContent="center" alignItems="center" w="100%">
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
							onClick={() => {
								setEncounterStarted(false);
								setActiveParticipant(-1);
							}}
						/>
						<IconButton
							aria-label="Previous"
							icon={<FaChevronLeft />}
							disabled={!encounterStarted}
							onClick={() => {
								setActiveParticipant(activeParticipant - 1);
								if (activeParticipant <= 0) {
									setActiveParticipant(encounter?.sortedParticipants.length - 1);
								}
							}}
						/>
						<IconButton
							aria-label="Next"
							icon={<FaChevronRight />}
							disabled={!encounterStarted}
							onClick={() => {
								setActiveParticipant(activeParticipant + 1);
								if (activeParticipant >= encounter?.sortedParticipants.length - 1) {
									setActiveParticipant(0);
								}
							}}
						/>
					</ButtonGroup>
				</Flex>
				{encounter.sortedParticipants.map((info, index) =>
					<ParticipantItem key={info.index}
					                 encounter={encounter}
					                 info={info}
					                 active={activeParticipant === index} />
				)}
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
