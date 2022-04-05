import { Context } from 'koa';
import Router from 'koa-router';
import { ReservationViewModel } from '../domain/ViewModel/ReservationViewModel';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { RestaurantRepository } from '../repositories/RestaurantRepository';
import { ReservationService } from '../services/ReservationService';
import { IController } from './IController';
import { DateTime } from 'luxon';

export default class ReservationController implements IController {
	public path = '/reservations';
	public router = new Router();

	constructor() {
		this.buildRoutes();
	}

	private buildRoutes() {
		this.router.get(`${this.path}/restaurants/:id/availability`, this.getReservationById);
		this.router.post(`${this.path}/restaurants/:id/reservations`, this.addReservation);
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

	private async addReservation(context: Context) {
		const restaurantId = context.params.id;
		const { from, to } = context.request.body;

		const reservationRepo = new ReservationRepository();
		const restaurantRepo = new RestaurantRepository();
		const service = new ReservationService(reservationRepo, restaurantRepo);

		const toUTC = DateTime.fromISO(to).toUTC().toMillis();
		const fromUTC = DateTime.fromISO(from).toUTC().toMillis();

		const response = await service.addReservation(restaurantId, fromUTC, toUTC);

		context.status = 200;
		context.body = { reservationId: response };
	}
}
