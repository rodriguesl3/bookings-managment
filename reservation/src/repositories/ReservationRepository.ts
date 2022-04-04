import { Reservation } from '../domain/Reservation';
import { IReservationRepository } from './IReservationRepository';
import { MongoRepository } from './MongoRepository';

export class ReservationRepository extends MongoRepository implements IReservationRepository {
	constructor() {
		super('reservations');
	}

	async getAvailabilityByRestaurantId(restaurantId: string) {
		const collection = await this.getConnection();
		return collection.find<Reservation>({ restaurantId }).toArray();
	}
}
