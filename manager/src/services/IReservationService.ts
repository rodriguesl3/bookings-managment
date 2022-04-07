import { Reservation } from '../domains/Reservation';
import { ReservationStatusViewModel } from '../domains/ViewModel/ReservationStatusViewModel';

export interface IReservationService {
	getAllByRestaurant(restaurantId: string): Promise<Reservation[] | null>;
	getById(reservationId: string): Promise<Reservation | null>;

	updateReservation(reservation: Reservation): Promise<boolean>;
	deleteReservation(reservationId: string): Promise<boolean>;
	addReservation(newReservation: Reservation): Promise<ReservationStatusViewModel>;
}
