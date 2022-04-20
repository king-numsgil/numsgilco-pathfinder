import Dexie from "dexie";

export interface IFeat {
	id?: number;
	name: string;
	type: "General" | "Combat" | "Item Creation" | "Metamagic" | "Achievement" | "Story" | "Mythic";
	description: string;
	prerequisites: string;
	prerequisiteFeats: Array<number>;
	prerequisiteSkills?: {
		[key: string]: number;
	};
	benefit: string;
	normal: string;
	special: string;
	source: string;
	fulltext: string;
	multiples: boolean;
	extendedType: {
		monster?: boolean;
		critical?: boolean;
		grit?: boolean;
		style?: boolean;
		performance?: boolean;
		racial?: boolean;
		companionFamiliar?: boolean;
		panache?: boolean;
		betrayal?: boolean;
		targeting?: boolean;
		esoteric?: boolean;
		stare?: boolean;
		weaponMastery?: boolean;
		itemMastery?: boolean;
		armorMastery?: boolean;
		shieldMastery?: boolean;
		bloodHex?: boolean;
		trick?: boolean;
	};

	raceName?: string;
	note?: string;
	goal?: string;
	completionBenefit?: string;
	suggestedTraits?: string;
}

export class PathfinderDatabase extends Dexie {
	constructor() {
		super("NumsgilCo_Pf1e");
	}
}
