import {FC, useState} from "react";
import {
	FaCheck,
	FaMinus,
	FaPlus,
	GiBleedingWound,
	GiBlindfold,
	GiBottledBolt,
	GiBrainstorm,
	GiCircleClaws,
	GiDeadHead,
	GiDeathSkull,
	GiDragonHead,
	GiEntangledTyphoon,
	GiFeatherWound,
	GiGrab,
	GiJumpingRope,
	GiLightningShout,
	GiRunningShoe,
	GiScreaming,
	GiSleepy,
	GiStomach,
	GiTiredEye
} from "react-icons/all";
import {
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	Text,
	useColorModeValue
} from "@chakra-ui/react";

import {Condition, Encounter, ILinkedParticipantInfo, IParticipantInfo, pfdb} from "data";
import {ToggleIconButton} from "components/ToggleIconButton";

export interface ParticipantItemProps {
	encounter: Encounter;
	info: IParticipantInfo & { index: number };
	active: boolean;
	isLinked?: ILinkedParticipantInfo & { index: number };
}

export const ParticipantItem: FC<ParticipantItemProps> = ({encounter, info, active, isLinked}) => {
	const [nonlethalDamage, setNonlethalDamage] = useState<number>(0);
	const [lethalDamage, setLethalDamage] = useState<number>(0);
	const [linkTarget, setLinkTarget] = useState<number>(-1);
	const {index} = info;

	const applyLethalDamage = async () => {
		if (encounter.id) {
			if (isLinked === undefined) {
				encounter.participants[index].lethalDamage += lethalDamage;
			} else {
				encounter.participants[index].linkedParticipants[isLinked.index].lethalDamage += lethalDamage;
			}
			setLethalDamage(0);
			await pfdb.encounters.update(encounter.id, {participants: encounter.participants});
		}
	};

	const applyNonlethalDamage = async () => {
		if (encounter.id) {
			if (isLinked === undefined) {
				encounter.participants[index].nonlethalDamage += nonlethalDamage;
			} else {
				encounter.participants[index].linkedParticipants[isLinked.index].nonlethalDamage += nonlethalDamage;
			}
			setNonlethalDamage(0);
			await pfdb.encounters.update(encounter.id, {participants: encounter.participants});
		}
	};

	const applyHeal = async () => {
		if (encounter.id) {
			if (isLinked === undefined) {
				encounter.participants[index].lethalDamage -= lethalDamage;
				if (encounter.participants[index].lethalDamage < 0) {
					encounter.participants[index].lethalDamage = 0;
				}
			} else {
				encounter.participants[index].linkedParticipants[isLinked.index].lethalDamage -= lethalDamage;
				if (encounter.participants[index].linkedParticipants[isLinked.index].lethalDamage < 0) {
					encounter.participants[index].linkedParticipants[isLinked.index].lethalDamage = 0;
				}
			}
			setLethalDamage(0);
			await pfdb.encounters.update(encounter.id, {participants: encounter.participants});
		}
	};

	const applyNonlethalHeal = async () => {
		if (encounter.id) {
			if (isLinked === undefined) {
				encounter.participants[index].nonlethalDamage -= nonlethalDamage;
				if (encounter.participants[index].nonlethalDamage < 0) {
					encounter.participants[index].nonlethalDamage = 0;
				}
			} else {
				encounter.participants[index].linkedParticipants[isLinked.index].nonlethalDamage -= nonlethalDamage;
				if (encounter.participants[index].linkedParticipants[isLinked.index].nonlethalDamage < 0) {
					encounter.participants[index].linkedParticipants[isLinked.index].nonlethalDamage = 0;
				}
			}
			setNonlethalDamage(0);
			await pfdb.encounters.update(encounter.id, {participants: encounter.participants});
		}
	};

	return <>
		<Flex
			direction="row"
			m={2}
			borderColor={useColorModeValue("gray.400", "gray.600")}
			borderWidth="1px"
			borderRadius={8}
			backgroundColor={useColorModeValue(
				active ? "gray.400" : "inherit",
				active ? "gray.600" : "inherit"
			)}
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
				<Text textAlign="center">{isLinked === undefined ? info.combatant.name : isLinked.combatant.name}</Text>
				<Text fontSize="small">
					{isLinked === undefined && `Initiative Modifier: ${info.combatant.initiative > 0 ? "+" : ""}${info.combatant.initiative}`}
					{isLinked !== undefined && `Initiative Modifier: ${isLinked.combatant.initiative > 0 ? "+" : ""}${isLinked.combatant.initiative}`}
				</Text>
			</Flex>
			{isLinked === undefined && <Flex
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
			</Flex>}
			<Flex
				direction="column"
				borderColor={useColorModeValue("gray.400", "gray.600")}
				borderRightWidth="1px"
				p={1}
			>
				<Text textAlign="center">
					{isLinked === undefined && `Current Health: ${info.combatant.maxHealth - info.lethalDamage}/${info.combatant.maxHealth}`}
					{isLinked !== undefined && `Current Health: ${isLinked.combatant.maxHealth - isLinked.lethalDamage}/${isLinked.combatant.maxHealth}`}
				</Text>
				<InputGroup size="md">
					<Input
						pr=".5rem"
						type="number"
						min={0}
						value={lethalDamage}
						onChange={e => setLethalDamage(parseInt(e.target.value))}
						onKeyDown={e => {
							if (e.key === "Enter") {
								e.preventDefault();
								applyLethalDamage().catch(console.error);
							}
						}}
						onFocus={e => e.target.select()}
					/>
					<InputRightElement width="4.7rem">
						<ButtonGroup isAttached size="sm" h="1.75rem">
							<IconButton h="1.75rem" aria-label="Heal" icon={<FaPlus />} onClick={applyHeal} />
							<IconButton h="1.75rem"
							            aria-label="Damage"
							            icon={<FaMinus />}
							            onClick={applyLethalDamage} />
						</ButtonGroup>
					</InputRightElement>
				</InputGroup>
			</Flex>
			<Flex
				direction="column"
				borderColor={useColorModeValue("gray.400", "gray.600")}
				borderRightWidth="1px"
				p={1}
			>
				<Text textAlign="center">
					Nonlethal Damage: {info.nonlethalDamage}
				</Text>
				<InputGroup size="md">
					<Input
						pr=".5rem"
						type="number"
						min={0}
						value={nonlethalDamage}
						onChange={e => setNonlethalDamage(parseInt(e.target.value))}
						onKeyDown={e => {
							if (e.key === "Enter") {
								e.preventDefault();
								applyNonlethalDamage().catch(console.error);
							}
						}}
						onFocus={e => e.target.select()}
					/>
					<InputRightElement width="4.7rem">
						<ButtonGroup isAttached size="sm" h="1.75rem">
							<IconButton h="1.75rem" aria-label="Heal" icon={<FaPlus />} onClick={applyNonlethalHeal} />
							<IconButton h="1.75rem"
							            aria-label="Damage"
							            icon={<FaMinus />}
							            onClick={applyNonlethalDamage} />
						</ButtonGroup>
					</InputRightElement>
				</InputGroup>
			</Flex>
			<Flex
				direction="column"
				justifyContent="center"
				alignItems="center"
				borderColor={useColorModeValue("gray.400", "gray.600")}
				borderRightWidth="1px"
				p={1}
			>
				<ButtonGroup isAttached size="sm" borderBottomRadius={0}>
					{[
						{value: Condition.Blinded, text: "Blinded", icon: GiBlindfold},
						{value: Condition.Confused, text: "Confused", icon: GiBrainstorm},
						{value: Condition.Dead, text: "Dead", icon: GiDeathSkull},
						{value: Condition.Dying, text: "Dying", icon: GiBleedingWound},
						{value: Condition.Entangled, text: "Entangled", icon: GiEntangledTyphoon},
						{value: Condition.Exhausted, text: "Exhausted", icon: GiSleepy},
						{value: Condition.Fatigued, text: "Fatigued", icon: GiTiredEye},
						{value: Condition.Frightened, text: "Frightened", icon: GiDragonHead},
						{value: Condition.Grappled, text: "Grappled", icon: GiGrab},
					].map(({value, text, icon}, i) => <ToggleIconButton
						key={i}
						aria-label={text}
						icon={icon}
						state={isLinked === undefined
							? info.conditions.find(i => i === value) !== undefined
							: isLinked.conditions.find(i => i === value) !== undefined}
						onToggle={state => {
							if (encounter.id) {
								if (isLinked === undefined) {
									if (state) {
										encounter.participants[index].conditions.push(value);
									} else {
										const j = encounter.participants[index].conditions.findIndex(i => i === value);
										if (j >= 0) {
											encounter.participants[index].conditions.splice(j, 1);
										}
									}
								} else {
									if (state) {
										encounter.participants[index].linkedParticipants[isLinked.index].conditions.push(value);
									} else {
										const j = encounter.participants[index].linkedParticipants[isLinked.index].conditions.findIndex(i => i === value);
										if (j >= 0) {
											encounter.participants[index].linkedParticipants[isLinked.index].conditions.splice(j, 1);
										}
									}
								}

								pfdb.encounters.update(encounter.id, {participants: encounter.participants})
									.catch(console.error);
							}
						}}
					/>)}
				</ButtonGroup>
				<ButtonGroup isAttached size="sm" borderTopRadius={0}>
					{[
						{value: Condition.Nauseated, text: "Nauseated", icon: GiLightningShout},
						{value: Condition.Panicked, text: "Panicked", icon: GiRunningShoe},
						{value: Condition.Paralyzed, text: "Paralyzed", icon: GiBottledBolt},
						{value: Condition.Pinned, text: "Pinned", icon: GiJumpingRope},
						{value: Condition.Shaken, text: "Shaken", icon: GiScreaming},
						{value: Condition.Sickened, text: "Sickened", icon: GiStomach},
						{value: Condition.Staggered, text: "Staggered", icon: GiFeatherWound},
						{value: Condition.Stunned, text: "Stunned", icon: GiCircleClaws},
						{value: Condition.Unconscious, text: "Unconscious", icon: GiDeadHead},
					].map(({value, text, icon}, i) => <ToggleIconButton
						key={i + 9}
						aria-label={text}
						icon={icon}
						state={isLinked === undefined
							? info.conditions.find(i => i === value) !== undefined
							: isLinked.conditions.find(i => i === value) !== undefined}
						onToggle={state => {
							if (encounter.id) {
								if (isLinked === undefined) {
									if (state) {
										encounter.participants[index].conditions.push(value);
									} else {
										const j = encounter.participants[index].conditions.findIndex(i => i === value);
										if (j >= 0) {
											encounter.participants[index].conditions.splice(j, 1);
										}
									}
								} else {
									if (state) {
										encounter.participants[index].linkedParticipants[isLinked.index].conditions.push(value);
									} else {
										const j = encounter.participants[index].linkedParticipants[isLinked.index].conditions.findIndex(i => i === value);
										if (j >= 0) {
											encounter.participants[index].linkedParticipants[isLinked.index].conditions.splice(j, 1);
										}
									}
								}

								pfdb.encounters.update(encounter.id, {participants: encounter.participants})
									.catch(console.error);
							}
						}}
					/>)}
				</ButtonGroup>
			</Flex>
			{isLinked === undefined && <FormControl id={`link${index}`} w="11rem" p={1}>
				<FormLabel>
					Link with...
					<IconButton
						aria-label="Link"
						ml={8}
						size="xs"
						colorScheme="green"
						icon={<FaCheck />}
						disabled={linkTarget < 0}
						onClick={() => {
							if (encounter.id) {
								encounter.participants[linkTarget].linkedParticipants.push({
									combatant: {
										name: info.combatant.name,
										initiative: info.combatant.initiative,
										maxHealth: info.combatant.maxHealth,
									},
									conditions: info.conditions,
									lethalDamage: info.lethalDamage,
									nonlethalDamage: info.nonlethalDamage,
									temporaryHealth: info.temporaryHealth,
								});
								encounter.participants.splice(index, 1);
								pfdb.encounters.update(encounter.id, {participants: encounter.participants})
									.catch(console.error);
							}
						}}
					/>
				</FormLabel>
				<Select value={linkTarget} onChange={e => setLinkTarget(parseInt(e.currentTarget.value))}>
					<option value={-1}>Select link target</option>
					{encounter.participants
						.map((item, i) => ({index: i, ...item}))
						.filter((item) => item.index !== index && item.combatant.type === info.combatant.type)
						.map((item) => <option key={item.index} value={item.index}>{item.combatant.name}</option>)}
				</Select>
			</FormControl>}
		</Flex>
		{isLinked === undefined && info.linkedParticipants.map((item, index) =>
			<ParticipantItem
				encounter={encounter}
				info={info}
				active={active}
				isLinked={{index, ...item}}
				key={index + 20}
			/>)}
	</>;
};
