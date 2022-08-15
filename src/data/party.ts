import {IBestiary, Condition} from "./index";

export type Combatant = Omit<IBestiary, "id"> & {
	initiativeRoll: number;
	nonlethalDamage: number;
	lethalDamage: number;
	conditions: Array<Condition>;
};

export interface IParty {
	id: number;
	name: string;
	currentExp: number;
	nextLevelExp: number;
	combatants: Array<Combatant>;
}

export class Party implements IParty {
	id!: number;
	name!: string;
	currentExp!: number;
	nextLevelExp!: number;
	combatants!: Array<Combatant>;

	constructor() {
	}
}
