import {DATA_TYPE, ITable} from "jsstore";

import {connection} from "../connection";

export interface IParty {
	id: number;
	name: string;
	currentExp: number;
	nextLevelExp: number;
}

export class PartyService {
	public static Table: ITable = {
		name: "Party",
		columns: {
			id: {
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				dataType: DATA_TYPE.String,
				unique: true,
				notNull: true,
			},
			currentExp: {
				dataType: DATA_TYPE.Number,
				notNull: true,
				default: 0,
			},
			nextLevelExp: {
				dataType: DATA_TYPE.Number,
				notNull: true,
				default: 0,
			},
		},
	};

	get connection() {
		return connection;
	}

	get(): Promise<Array<IParty>>;
	get(id: number): Promise<IParty>;
	async get(id?: number): Promise<Array<IParty> | IParty> {
		if (id) {
			return (await this.connection.select<IParty>({
				from: PartyService.Table.name,
				where: {
					id,
				},
			}))[0];
		} else {
			return await this.connection.select<IParty>({
				from: PartyService.Table.name,
			});
		}
	}

	async set(value: {id?: number} & Omit<IParty, "id">): Promise<IParty> {
		const data = await this.connection.insert<IParty>({
			into: PartyService.Table.name,
			values: [value],
			return: true,
			upsert: true,
		});

		// @ts-ignore
		return data[0];
	}
}
