import {ITable, DATA_TYPE} from "jsstore";

import {connection} from "../connection";

export interface IParty {
	id: number;
	name: string;
}

export class PartyTable {
	public static Definition: ITable = {
		name: "Party",
		columns: {
			id: {
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				dataType: DATA_TYPE.String,
				unique: true,
			},
		},
	};

	get connection() {
		return connection;
	}
}
