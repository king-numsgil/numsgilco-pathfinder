import {Condition} from "./index";

export interface IPartyMember {
	id: number;
	name: string;
	partyId: number;
	initiative: number;
	maxHealth: number;
	nonlethalDamage: number;
	lethalDamage: number;
	conditions: Array<Condition>;
	linkedWith: number | null;
}

export class PartyMember implements IPartyMember {
	id!: number;
	name!: string;
	partyId!: number;
	initiative!: number;
	maxHealth!: number;
	nonlethalDamage!: number;
	lethalDamage!: number;
	conditions!: Array<Condition>;
	linkedWith!: number | null;

	constructor() {
	}
}
