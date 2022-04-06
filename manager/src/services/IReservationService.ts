import { Reservation } from '../domains/Reservation';
import { ReservationStatusViewModel } from '../domains/ViewModel/ReservationStatusViewModel';

export interface IReservationService {
	getAll(): Promise<Reservation[]>;
	getById(reservationId: string): Promise<Reservation | null>;

	updateReservation(reservation: Reservation): Promise<boolean>;
	deleteReservation(reservationId: string): Promise<boolean>;
	addReservation(newReservation: Reservation): Promise<ReservationStatusViewModel>;
}
