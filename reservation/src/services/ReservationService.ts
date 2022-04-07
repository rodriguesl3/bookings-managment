import { Reservation } from '../domain/Reservation';
import { Restaurant } from '../domain/Restaurant';
import { ReservationViewModel } from '../domain/ViewModel/ReservationViewModel';
import { calculateAvailability } from './helpers/calculateAvailability';
import { IReservationRepository } from '../repositories/IReservationRepository';
import { IRestaurantRepository } from '../repositories/IRestaurantRepository';
import { IReservationService } from './IReservationService';
import { IRedisRepository } from '../repositories/RedisRepository';
import { ObjectId } from 'mongodb';
import { ReservationStatus, ReservationStatusViewModel } from '../domain/ViewModel/ReservationStatusViewModel';

export class ReservationService implements IReservationService {
	constructor(
		private reservationRepository: IReservationRepository,
		private restaurantRepository: IRestaurantRepository,
		private redisRepository: IRedisRepository,
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

		return reservationAvailable;
	}

	async addReservation(newReservation: Reservation): Promise<ReservationStatusViewModel> {
		const [restaurant, reservation] = await Promise.all([
			this.restaurantRepository.getById<Restaurant>(newReservation.restaurantId),
			this.reservationRepository.getReservationByDate(newReservation),
		]);

		if (restaurant?.tables === reservation?.length) {
			const id = new ObjectId().toJSON();
			const response = await this.redisRepository.dispatchMessage({ ...newReservation, id });
			if (response) {
				return { reservationId: id, status: ReservationStatus.Wait };
			}
			throw new Error('Error to queue reservation');
		}

		const insertedId = await this.reservationRepository.addRegister<Reservation>(newReservation);

		return { reservationId: insertedId, status: ReservationStatus.Reserved };
	}

	async updateReservation(newReservation: Reservation): Promise<ReservationStatusViewModel> {
		const [restaurant, reservation] = await Promise.all([
			this.restaurantRepository.getById<Restaurant>(newReservation.restaurantId),
			this.reservationRepository.getReservationByDate(newReservation),
		]);

		if (restaurant?.tables === reservation?.length) {
			return { reservationId: newReservation.id, status: ReservationStatus.Overbooked };
		}

		const response = this.reservationRepository.upsertReservation(newReservation);

		return { reservationId: newReservation.id, status: ReservationStatus.Reserved };
	}
}
