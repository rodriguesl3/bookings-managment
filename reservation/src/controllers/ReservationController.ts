import { Context, Next } from 'koa';
import Router from 'koa-router';
import { IReservationRepository } from '../repositories/IReservationRepository';
import { IRestaurantRepository } from '../repositories/IRestaurantRepository';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { RestaurantRepository } from '../repositories/RestaurantRepository';
import { ReservationService } from '../services/ReservationService';
import { RestaurantService } from '../services/RestaurantService';
import { IController } from './IController';

export default class ReservationController implements IController {
	public path = '/reservations';
	public router = new Router();

	constructor() {
		this.buildRoutes();
	}

	private buildRoutes() {
		this.router.get(`${this.path}/restaurants/:id/availability`, this.getReservationById);
	}

	private async getReservationById(context: Context) {
		//TODO: Improve Dependency Injection
		const reservationRepo = new ReservationRepository();
		const restaurantRepo = new RestaurantRepository();
		const service = new ReservationService(reservationRepo, restaurantRepo);

		const response = await service.getAvailability(context.params.id);

		context.body = response;
		context.status = 200;
	}
}
