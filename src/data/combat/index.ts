import {Condition, ICombatant, IEncounter, pfdb} from "../index";

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
	participants: Array<{
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
	}>;

	constructor(name: string) {
		this.name = name;
		this.participants = [];
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
