import { Restaurant } from '../domains/Restaurant';

export interface IRestaurantService {
	getAll(): Promise<Restaurant[]>;
	getById(restaurantId: string): Promise<Restaurant | null>;
	addRestaurant(restaurant: Restaurant): Promise<string>;
	updateRestaurant(restaurant: Restaurant): Promise<boolean>;
	deleteRestaurant(restaurantId: string): Promise<boolean>;
}
