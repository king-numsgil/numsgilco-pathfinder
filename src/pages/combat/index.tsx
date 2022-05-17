import {Button, ButtonGroup, Flex, IconButton, Text, useDisclosure, useToast} from "@chakra-ui/react";
import {FaChevronLeft, FaChevronRight, FaPlay, FaStop} from "react-icons/all";
import {Outlet, Route} from "@tanstack/react-location";
import {useLiveQuery} from "dexie-react-hooks";
import {Helmet} from "react-helmet-async";
import {Dice} from "dice-typescript";
import {FC, useState} from "react";

import {ParticipantItem, ParticipantItemProps} from "./ParticipantItem";
import {DiceFormula} from "components/DiceFormula";
import {CombatantsModal} from "./CombatantsModal";
import {EncounterModal} from "./EncounterModal";
import {RouteGenerics} from "../index";
import {Encounter, pfdb} from "data";

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
				{encounter.participants.map((info, index) =>
						<ParticipantItem key={index} encounter={encounter} info={info} index={index} />
					)
					.sort((a, b) => {
						const infoA = (a.props as ParticipantItemProps).info;
						const infoB = (b.props as ParticipantItemProps).info;
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
