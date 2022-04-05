import { Reservation } from '../domain/Reservation';
import { IReservationRepository } from './IReservationRepository';
import { MongoRepository } from './MongoRepository';

export class ReservationRepository extends MongoRepository implements IReservationRepository {
	constructor() {
		super('reservations');
	}

	async getReservationByDate(restaurantId: string, from: number, to: number): Promise<Reservation[] | null> {
		const collection = await this.getConnection();

		return collection.find<Reservation>({ restaurantId, from, to }).toArray();
	}

	async getAvailabilityByRestaurantId(restaurantId: string) {
		const collection = await this.getConnection();
		return collection.find<Reservation>({ restaurantId }).toArray();
	}

	async upsertReservation(reservation: Reservation): Promise<string> {
		const collection = await this.getConnection();

		const response = await collection.updateOne(
			{ id: reservation.id },
			{
				$set: { ...reservation },
			},
			{
				upsert: true,
			},
		);

		return response.upsertedId.toJSON();
	}
}
