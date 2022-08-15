export interface IParty {
	id: number;
	name: string;
	currentExp: number;
	nexLevelExp: number;
}

export class Party implements IParty {
	id!: number;
	name!: string;
	currentExp!: number;
	nexLevelExp!: number;

	constructor() {
	}
}
