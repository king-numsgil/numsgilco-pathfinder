import workerPath from "jsstore/dist/jsstore.worker.min.js?url";
import {Connection} from "jsstore";

import {CombatTables} from "./combat";

export const connection = new Connection(new Worker(workerPath));

export const initJsStore = () => {
	connection.initDb({
		name: "NumsgilCo",
		tables: [
			...CombatTables,
		],
	}).catch(console.error);
};
