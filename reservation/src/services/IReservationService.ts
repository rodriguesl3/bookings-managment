import { Reservation } from '../domain/Reservation';
import { ReservationStatusViewModel } from '../domain/ViewModel/ReservationStatusViewModel';
import { ReservationViewModel } from '../domain/ViewModel/ReservationViewModel';

export interface IReservationService {
	getAvailability(restaurantId: string): Promise<ReservationViewModel[] | undefined>;
	addReservation(newReservation: Reservation): Promise<ReservationStatusViewModel>;
	updateReservation(newReservation: Reservation): Promise<ReservationStatusViewModel>;
}
