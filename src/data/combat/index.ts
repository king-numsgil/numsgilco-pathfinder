import {ITable} from "jsstore";

import {PartyMemberService} from "./PartyMemberService";
import {PartyService} from "./PartyService";

export const CombatTables: Array<ITable> = [
	PartyMemberService.Table,
	PartyService.Table,
]

export * from "./PartyMemberService";
export * from "./PartyService";
