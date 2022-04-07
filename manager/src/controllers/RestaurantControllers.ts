import { Context } from 'koa';
import Router from 'koa-router';
import { Restaurant } from '../domains/Restaurant';
import { RestaurantRepository } from '../repositories/RestaurantRepository';
import { RestaurantService } from '../services/RestaurantService';

export default class RestaurantController {
	public path = '/restaurants';
	public router = new Router();

	constructor() {
		this.buildRoutes();
	}

	private buildRoutes() {
		this.router.get(`${this.path}/:id`, this.getRestaurantById);

		this.router.put(`${this.path}/:id`, this.updateRestaurant);
		this.router.del(`${this.path}/:id`, this.deleteRepository);

		this.router.get(`${this.path}`, this.getRestaurants);
		this.router.post(`${this.path}`, this.addRestaurants);
	}

	private async getRestaurants(context: Context) {
		const restaurantRepo = new RestaurantRepository();
		const restaurantService = new RestaurantService(restaurantRepo);

		const response = await restaurantService.getAll();

		context.body = response;
		context.status = 200;
	}

	private async addRestaurants(context: Context) {
		const restaurantRepo = new RestaurantRepository();
		const restaurantService = new RestaurantService(restaurantRepo);
		const { open, close, tables, id } = context.request.body;

		const restaurant = new Restaurant(open, close, tables, id);

		const response = await restaurantService.addRestaurant(restaurant);

		context.body = { restaurantId: response };
		context.status = 200;
	}

	private async getRestaurantById(context: Context) {
		const restaurantRepo = new RestaurantRepository();
		const restaurantService = new RestaurantService(restaurantRepo);
		const restaurantId = context.params.id;

		const response = await restaurantService.getById(restaurantId);

		context.body = response;
		context.status = 200;
	}

	private async updateRestaurant(context: Context) {
		const restaurantRepo = new RestaurantRepository();
		const restaurantService = new RestaurantService(restaurantRepo);

		const { open, close, tables } = context.request.body;
		const restaurantId = context.params.id;

		const restaurant = new Restaurant(open, close, tables, restaurantId);

		const response = await restaurantService.updateRestaurant(restaurant);

		context.body = response;
		context.status = 200;
	}

	private async deleteRepository(context: Context) {
		const restaurantRepo = new RestaurantRepository();
		const restaurantService = new RestaurantService(restaurantRepo);
		const restaurantId = context.params.id;

		const response = await restaurantService.deleteRestaurant(restaurantId);

		if (response) {
			context.status = 204;
			return;
		}

		context.status = 404;
	}
}
