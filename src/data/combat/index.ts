import {ICombatant, IEncounter, IParticipantInfo, pfdb} from "../index";

export class Combatant implements ICombatant {
	id?: number;
	name: string;
	initiative: number;
	maxHealth: number;
	type: "ally" | "enemy";

	constructor(name: string) {
		this.name = name;
		this.initiative = 0;
		this.maxHealth = 1;
		this.type = "ally";
	}
}

export class Encounter implements IEncounter {
	id?: number;
	name: string;
	participants: Array<IParticipantInfo>;

	constructor(name: string) {
		this.name = name;
		this.participants = [];
	}

	get sortedParticipants(): Array<IParticipantInfo & { index: number }> {
		return this.participants.map((info, index) => ({index, ...info}))
			.sort((a, b) => {
				const iniA = a.initiativeRoll + a.combatant.initiative + (a.combatant.type === "ally" ? a.combatant.initiative / 100 : 0);
				const iniB = b.initiativeRoll + b.combatant.initiative + (b.combatant.type === "ally" ? b.combatant.initiative / 100 : 0);

				if (iniA < iniB) {
					return 1;
				}
				if (iniA > iniB) {
					return -1;
				}
				return 0;
			});
	}

	async addCombatant(id: number) {
		const combatant = await pfdb.combatants.get(id);
		if (combatant === undefined) {
			throw new Error(`Combatant #${id} does not exist`);
		}

		this.participants.push({
			combatant: {...combatant},
			initiativeRoll: 0,
			temporaryHealth: 0,
			nonlethalDamage: 0,
			lethalDamage: 0,
			conditions: [],
			linkedParticipants: [],
		});
		if (this.id) {
			await pfdb.encounters.update(this.id, {participants: this.participants});
		}
	}
}
