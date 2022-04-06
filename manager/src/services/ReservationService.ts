import { Reservation } from '../domains/Reservation';
import { ReservationStatusViewModel } from '../domains/ViewModel/ReservationStatusViewModel';
import { IRedisRepository } from '../repositories/IRedisRepository';
import { IReservationRepository } from '../repositories/IReservationRepository';
import { IRestaurantRepository } from '../repositories/IRestaurantRepository';
import { IReservationService } from './IReservationService';

export class ReservationService implements IReservationService {
	constructor(private reservationRepository: IReservationRepository, private redisRepository: IRedisRepository) {}
	updateReservation(reservation: Reservation): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	addReservation(newReservation: Reservation): Promise<ReservationStatusViewModel> {
		throw new Error('Method not implemented.');
	}

	getAll(): Promise<Reservation[]> {
		return this.reservationRepository.getAll<Reservation>();
	}
	getById(reservationId: string): Promise<Reservation | null> {
		return this.reservationRepository.getById<Reservation>(reservationId);
	}

	async deleteReservation(reservationId: string): Promise<boolean> {
		const response = await this.reservationRepository.deleteRegister<Reservation>(reservationId);

		if (response) {
			const reservation = await this.redisRepository.subscribeMessage<Reservation>();
			if (reservation) {
				const reservationAdded = this.addReservation(reservation);
				return !!reservationAdded;
			}
		}
		return response;
	}
}
