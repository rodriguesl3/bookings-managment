import { Reservation } from '../Reservation';
import { DateTime } from 'luxon';

export class ReservationViewModel {
	public from: string;
	public to: string;
	public tablesAvailable: number;

	constructor(from: number, to: number, tables: number) {
		this.from = DateTime.fromMillis(from).toUTC().toString();
		this.to = DateTime.fromMillis(to).toUTC().toString();
		this.tablesAvailable = tables;
	}
}
