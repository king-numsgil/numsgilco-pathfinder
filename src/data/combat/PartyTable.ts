import {connection} from "../connection";
import {ITable} from "jsstore";

export class PartyTable {
	public static Definition: ITable = {
		name: "Party",
		columns: {
			Id: {
				primaryKey: true,
				autoIncrement: true,
			},
		},
	};

	get connection() {
		return connection;
	}
}
