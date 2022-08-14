import {ITable, DATA_TYPE} from "jsstore";

import {connection} from "../connection";

export interface IParty {
	id: number;
	name: string;
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
			},
		},
	};

	get connection() {
		return connection;
	}

	async get(id?: number): Promise<Array<IParty>> {
		return await this.connection.select<IParty>({
			from: PartyService.Table.name,
			where: id === undefined ? undefined : {
				id,
			},
		});
	}

	async add(value: Omit<IParty, "id">): Promise<IParty> {
		const data = await this.connection.insert<IParty>({
			into: PartyService.Table.name,
			values: [value],
			return: true,
		});

		// @ts-ignore
		return data[0];
	}

	async update(value: {id: number;} & Partial<Omit<IParty, "id">>): Promise<void> {
		await this.connection.update({
			in: PartyService.Table.name,
			where: {id: value.id},
			set: {
				name: value.name,
			},
		});
	}
}
