import {Condition, ICombatant, IEncounter} from "../index";

export class Combatant implements ICombatant {
	id?: number;
	name: string;
	initiative: number
	maxHealth: number;
	type: "ally" | "enemy";

	constructor(name: string, maxHealth: number, initiative: number, type: "ally" | "enemy") {
		this.name = name;
		this.type = type;
		this.initiative = initiative;
		this.maxHealth = maxHealth;
	}
}

export class Encounter implements IEncounter {
	id?: number;
	name: string;
	participants: Array<{
		id: number;
		initiativeRoll: number;
		temporaryHealth: number;
		nonlethalDamage: number;
		lethalDamage: number;
		conditions: Array<Condition>;
		linkedWith?: number;
	}>;

	constructor(name: string) {
		this.name = name;
		this.participants = [];
	}
}
