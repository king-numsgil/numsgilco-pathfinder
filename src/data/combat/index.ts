import {ITable} from "jsstore";

import {PartyTable} from "./PartyTable";

export const CombatTables: Array<ITable> = [
	PartyTable.Definition,
]

export * from "./PartyTable";

