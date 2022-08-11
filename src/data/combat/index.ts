import {ITable} from "jsstore";

import {PartyMemberTable} from "./PartyMemberTable";
import {PartyTable} from "./PartyTable";

export const CombatTables: Array<ITable> = [
	PartyMemberTable.Definition,
	PartyTable.Definition,
]

export * from "./PartyMemberTable";
export * from "./PartyTable";
