import { Reservation } from '../domain/Reservation';
import { IMongoRepository } from './IMongoRepository';

export interface IReservationRepository extends IMongoRepository {
	getAvailabilityByRestaurantId(restaurantId: string): Promise<Reservation[] | null>;
	getReservationByDate(reservation: Reservation): Promise<Reservation[] | null>;
	upsertReservation(reservation: Reservation): Promise<string>;
}
