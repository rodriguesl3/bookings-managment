import { ObjectId } from 'mongodb';

export class Restaurant {
	public id: string;
	public open: number;
	public close: number;
	public tables: number;

	constructor(open: number, close: number, tables: number, id?: string) {
		this.open = open;
		this.close = close;
		this.tables = tables;
		this.id = new ObjectId(id).toJSON();
	}
}
