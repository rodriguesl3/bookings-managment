import { Reservation } from '../domains/Reservation';
import { ReservationStatusViewModel } from '../domains/ViewModel/ReservationStatusViewModel';
import { IRedisRepository } from '../repositories/IRedisRepository';
import { IReservationRepository } from '../repositories/IReservationRepository';
import { IReservationService } from './IReservationService';
import axios from 'axios';
import { config } from '../config';

export class ReservationService implements IReservationService {
	constructor(private reservationRepository: IReservationRepository, private redisRepository: IRedisRepository) {}

	async updateReservation(reservation: Reservation): Promise<boolean> {
		const axiosResponse = await axios.put<ReservationStatusViewModel>(
			`${config.reservationApi}/reservations/${reservation.id}/restaurants/${reservation.restaurantId}`,
			reservation,
		);
		return !!axiosResponse.data;
	}

	async addReservation(newReservation: Reservation): Promise<ReservationStatusViewModel> {
		const axiosResponse = await axios.post<ReservationStatusViewModel>(
			`${config.reservationApi}/reservations/restaurants/${newReservation.restaurantId}`,
			newReservation,
		);
		return axiosResponse.data;
	}

	getAllByRestaurant(restaurantId: string): Promise<Reservation[] | null> {
		return this.reservationRepository.getByFilter<Reservation>({ restaurantId });
	}

	getById(reservationId: string): Promise<Reservation | null> {
		return this.reservationRepository.getById<Reservation>(reservationId);
	}

	async deleteReservation(reservationId: string): Promise<boolean> {
		const response = await this.reservationRepository.deleteRegister<Reservation>(reservationId);

		if (response) {
			const reservation = await this.redisRepository.subscribeMessage<Reservation>();
			if (reservation) {
				const reservationAdded = await this.addReservation(reservation);
				return !!reservationAdded;
			}
		}
		return response;
	}
}
