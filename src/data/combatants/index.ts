import {Condition, ICombatant} from "../index";

export class Combatant implements ICombatant {
	id?: number;
	name: string;
	initiative: {
		modifier: number;
		roll: number;
	};
	maxHealth: number;
	temporaryHealth: number = 0;
	lethalDamage: number = 0;
	nonlethalDamage: number = 0;
	type: "ally" | "enemy";
	conditions: Array<Condition> = [];

	constructor(name: string, maxHealth: number, initiative: number, type: "ally" | "enemy") {
		this.name = name;
		this.type = type;
		this.initiative = {
			modifier: initiative,
			roll: 0,
		};
		this.maxHealth = maxHealth;
	}
}
