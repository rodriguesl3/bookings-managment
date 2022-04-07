import { IReservationRepository } from './IReservationRepository';
import { MongoRepository } from './MongoRepository';

export class ReservationRepository extends MongoRepository implements IReservationRepository {
	constructor() {
		super('reservations');
	}
}
