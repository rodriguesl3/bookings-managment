import { Reservation } from '../Reservation';

export class ReservationViewModel {
	public from: Date;
	public to: Date;
	public tableAvailable: number;

	constructor(reservation: Reservation) {
		this.from = reservation.from;
		this.to = reservation.to;
		this.tableAvailable = reservation.tables;
	}
}
