import Dexie from "dexie";

import {Feat} from "./feats";

export type FeatType = "General" | "Combat" | "Item Creation" | "Metamagic" | "Achievement" | "Story" | "Mythic";

export enum FeatExtendedType {
	Teamwork,
	Monster,
	Critical,
	Grit,
	Style,
	Performance,
	Racial,
	CompanionFamiliar,
	Panache,
	Betrayal,
	Targeting,
	Esoteric,
	Stare,
	WeaponMastery,
	ItemMastery,
	ArmorMastery,
	ShieldMastery,
	BloodHex,
	Trick,
}

export enum MagicType {
	Arcane,
	Divine,
	Occult,
}

export interface IFeat {
	id?: number;
	name: string;
	type: FeatType;
	description: string;
	prerequisites?: {
		feats: Array<number>;
		skills?: {
			[key: string]: number;
		};
		raceNames?: Array<string>;
		attackBonus?: number;
		casterLevel?: number;
		spellLevel?: number;
		magicType?: MagicType;
		special?: string;
	};
	benefit: string;
	normal: string;
	special: string;
	source: string;
	fulltext: string;
	multiples: boolean;
	extendedTypes: Array<FeatExtendedType>;

	note?: string;
	goal?: string;
	completionBenefit?: string;
	suggestedTraits?: string;
	className?: string;
}

export class PathfinderDatabase extends Dexie {
	public feats!: Dexie.Table<IFeat, number>;

	constructor() {
		super("NumsgilCo_Pf1e");

		this.version(1).stores({
			feats: "++id, name, type, *extendedTypes",
		});
		this.feats.mapToClass(Feat);
	}
}

export {Feat} from "./feats";
