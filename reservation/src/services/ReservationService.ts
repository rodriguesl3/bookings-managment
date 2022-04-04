import { Reservation } from '../domain/Reservation';
import { Restaurant } from '../domain/Restaurant';
import { ReservationViewModel } from '../domain/ViewModel/ReservationViewModel';
import { calculateAvailability } from './helpers/calculateAvailability';
import { IReservationRepository } from '../repositories/IReservationRepository';
import { IRestaurantRepository } from '../repositories/IRestaurantRepository';
import { IReservationService } from './IReservationService';

export class ReservationService implements IReservationService {
	constructor(
		private reservationRepository: IReservationRepository,
		private restaurantRepository: IRestaurantRepository,
	) {}

	async getAvailability(restaurantId: string): Promise<ReservationViewModel[] | undefined> {
		const [restaurant, reservation] = await Promise.all([
			this.restaurantRepository.getById<Restaurant>(restaurantId),
			this.reservationRepository.getAvailabilityByRestaurantId(restaurantId),
		]);

		if (!restaurant) {
			return undefined;
		}

		const reservationAvailable = calculateAvailability(restaurant, reservation ?? []);

		return reservationAvailable.map((reservation: Reservation) => new ReservationViewModel(reservation));
	}
}
