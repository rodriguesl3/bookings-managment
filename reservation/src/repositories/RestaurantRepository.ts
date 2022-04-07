import { IRestaurantRepository } from './IRestaurantRepository';
import { MongoRepository } from './MongoRepository';

export class RestaurantRepository extends MongoRepository implements IRestaurantRepository {
	constructor() {
		super('restaurants');
	}
}
