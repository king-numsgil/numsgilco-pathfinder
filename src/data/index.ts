import Dexie from "dexie";

import {IPartyMember, PartyMember} from "./partyMember";
import {Bestiary, IBestiary} from "./bestiary";
import {IParty, Party} from "./party";

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

class PathfinderDatabase extends Dexie {
	public party!: Dexie.Table<IParty, number>;
	public bestiary!: Dexie.Table<IBestiary, number>;
	public partyMember!: Dexie.Table<IPartyMember, number>;

	constructor() {
		super("NumsgilCoPf");

		this.version(1).stores({
			partyMember: "++id, name, partyId",
			bestiary: "++id, name",
			party: "++id, name",
		});

		this.partyMember.mapToClass(PartyMember);
		this.bestiary.mapToClass(Bestiary);
		this.party.mapToClass(Party);
	}
}

export const pfdb = new PathfinderDatabase();

export * from "./partyMember";
export * from "./bestiary";
export * from "./party";
