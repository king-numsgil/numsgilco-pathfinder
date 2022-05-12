import Dexie from "dexie";

import {Combatant, Encounter} from "./combat";
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

export enum Condition {
	Blinded,
	Confused,
	Dead,
	Dying,
	Entangled,
	Exhausted,
	Fatigued,
	Frightened,
	Grappled,
	Nauseated,
	Panicked,
	Paralyzed,
	Pinned,
	Shaken,
	Sickened,
	Staggered,
	Stunned,
	Unconscious,
}

export interface ICombatant {
	id?: number;
	name: string;
	initiative: number;
	maxHealth: number;
	type: "ally" | "enemy";
}

export interface IEncounter {
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
}

class PathfinderDatabase extends Dexie {
	public combatants!: Dexie.Table<ICombatant, number>;
	public encounters!: Dexie.Table<IEncounter, number>;
	public feats!: Dexie.Table<IFeat, number>;

	constructor() {
		super("NumsgilCo_Pf1e");

		this.version(1).stores({
			combatants: "++id, name",
			encounters: "++id, name",
			feats: "++id, name, type, *extendedTypes",
		});
		this.combatants.mapToClass(Combatant);
		this.encounters.mapToClass(Encounter);
		this.feats.mapToClass(Feat);
	}
}

export const pfdb = new PathfinderDatabase();

export {Combatant, Encounter} from "./combat";
export {Feat} from "./feats";
