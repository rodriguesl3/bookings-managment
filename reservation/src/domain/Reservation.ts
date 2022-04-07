import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';

export class Reservation {
	public to: number;
	public from: number;
	public restaurantId: string;
	public id: string;

	constructor(from: string | number, to: string | number, restaurantId: string, id?: string) {
		this.from = typeof from === 'number' ? from : DateTime.fromISO(from).toUTC().toMillis();
		this.to = typeof to === 'number' ? to : DateTime.fromISO(to).toUTC().toMillis();
		this.restaurantId = restaurantId;
		this.id = new ObjectId(id).toJSON();
	}
}
