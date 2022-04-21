import {FeatExtendedType, FeatType, IFeat, MagicType} from "../index";

export class Feat implements IFeat {
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
	special: string = "";
	source: string;
	fulltext: string;
	multiples: boolean = false;
	extendedTypes: Array<FeatExtendedType> = [];

	note?: string;
	goal?: string;
	completionBenefit?: string;
	suggestedTraits?: string;
	className?: string;

	constructor(name: string, type: FeatType, description: string, benefit: string, normal: string, source: string, fulltext: string) {
		this.name = name;
		this.type = type;
		this.description = description;
		this.benefit = benefit;
		this.normal = normal;
		this.source = source;
		this.fulltext = fulltext;
	}
}
