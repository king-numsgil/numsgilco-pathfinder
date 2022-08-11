import {IDataBase} from "jsstore";

import {PartyTable} from "./PartyTable";

export const CombatDb: IDataBase = {
	name: "Combat",
	tables: [
		PartyTable.Definition,
	],
};

export {
	PartyTable,
};

export * from "./PartyTable";

