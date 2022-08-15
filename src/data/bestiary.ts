export interface IBestiary {
	id: number;
	name: string;
	initiative: number;
	maxHealth: number;
	type: "ally" | "enemy";
	challenge: number;
}

export class Bestiary implements IBestiary {
	id!: number;
	name!: string;
	initiative!: number;
	maxHealth!: number;
	type!: "ally" | "enemy";
	challenge!: number;

	constructor() {
	}
}
