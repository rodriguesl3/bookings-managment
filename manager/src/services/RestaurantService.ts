import { Restaurant } from '../domains/Restaurant';
import { IRestaurantRepository } from '../repositories/IRestaurantRepository';
import { IRestaurantService } from './IRestaurantService';
export class RestaurantService implements IRestaurantService {
	constructor(private restaurantRepository: IRestaurantRepository) {}

	getAll(): Promise<Restaurant[]> {
		return this.restaurantRepository.getAll<Restaurant>();
	}

	getById(restaurantId: string): Promise<Restaurant | null> {
		return this.restaurantRepository.getById<Restaurant>(restaurantId);
	}

	addRestaurant(restaurant: Restaurant): Promise<string> {
		return this.restaurantRepository.addRegister<Restaurant>(restaurant);
	}

	updateRestaurant(restaurant: Restaurant): Promise<boolean> {
		return this.restaurantRepository.updateRegister<Restaurant>(restaurant);
	}

	deleteRestaurant(restaurantId: string): Promise<boolean> {
		return this.restaurantRepository.deleteRegister<Restaurant>(restaurantId);
	}
}
