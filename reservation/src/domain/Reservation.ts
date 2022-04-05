import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';

export class Reservation {
	public to: number;
	public from: number;
	public restaurantId: string;
	public id: string;

	constructor(from: string, to: string, restaurantId: string, id?: string) {
		this.from = DateTime.fromISO(from).toUTC().toMillis();
		this.to = DateTime.fromISO(to).toUTC().toMillis();
		this.restaurantId = restaurantId;
		this.id = new ObjectId(id).toJSON();
	}
}
