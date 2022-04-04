import { Reservation } from '../domain/Reservation';
import { ReservationViewModel } from '../domain/ViewModel/ReservationViewModel';

export interface IReservationService {
	getAvailability(restaurantId: string): Promise<ReservationViewModel[] | undefined>;
}
