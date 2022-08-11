import workerPath from "jsstore/dist/jsstore.worker.min.js?url";
import {Connection} from "jsstore";

import {PartyTable} from "./combat";

export const connection = new Connection(new Worker(workerPath));

export const initJsStore = () => {
	connection.initDb({
		name: "NumsgilCo",
		tables: [
			PartyTable.Definition,
		],
	}).catch(console.error);
};
