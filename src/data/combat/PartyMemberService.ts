import {ITable, DATA_TYPE} from "jsstore";

import {connection} from "../connection";

export interface IPartyMember {
	id: number;
	name: string;
	party: number;
	maxHealth: number;
	initiative: number;
	lethalDmg: number;
	nonlethalDmg: number;
}

export class PartyMemberService {
	public static Table: ITable = {
		name: "PartyMember",
		columns: {
			id: {
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				dataType: DATA_TYPE.String,
				notNull: true,
			},
			party: {
				dataType: DATA_TYPE.Number,
				notNull: true,
			},
			maxHealth: {
				dataType: DATA_TYPE.Number,
				notNull: true,
			},
			initiative: {
				dataType: DATA_TYPE.Number,
				notNull: true,
			},
			lethalDmg: {
				dataType: DATA_TYPE.Number,
				notNull: true,
				default: 0,
			},
			nonlethalDmg: {
				dataType: DATA_TYPE.Number,
				notNull: true,
				default: 0,
			},
		},
	};

	get connection() {
		return connection;
	}
}
