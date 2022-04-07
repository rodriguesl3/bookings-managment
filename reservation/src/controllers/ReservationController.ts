import { Context } from 'koa';
import Router from 'koa-router';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { RestaurantRepository } from '../repositories/RestaurantRepository';
import { ReservationService } from '../services/ReservationService';
import { IController } from './IController';
import { RedisRepository } from '../repositories/RedisRepository';
import { Reservation } from '../domain/Reservation';

export default class ReservationController implements IController {
	public path = '/reservations';
	public router = new Router();

	constructor() {
		this.buildRoutes();
	}

	private buildRoutes() {
		this.router.get(`${this.path}/restaurants/:id/availability`, this.getAvailability);
		this.router.post(`${this.path}/restaurants/:id`, this.addReservation);
		this.router.post(`${this.path}/restaurants/:id/wait-list`, this.dispatchWaitList);
		this.router.put(`${this.path}/:reservationId/restaurants/:id`, this.updateReservation);
	}

	private async updateReservation(context: Context) {
		const restaurantId = context.params.id;
		const reservationId = context.params.reservationId;
		const { from, to } = context.request.body;

		const reservationRepo = new ReservationRepository();
		const restaurantRepo = new RestaurantRepository();
		const redisRepo = new RedisRepository('wait_list');
		const service = new ReservationService(reservationRepo, restaurantRepo, redisRepo);

		const reservation = new Reservation(from, to, restaurantId, reservationId);

		const response = await service.updateReservation(reservation);

		context.status = 200;
		context.body = response;
	}

	private async getAvailability(context: Context) {
		//TODO: Improve Dependency Injection
		const reservationRepo = new ReservationRepository();
		const restaurantRepo = new RestaurantRepository();
		const redisRepo = new RedisRepository('wait_list');
		const service = new ReservationService(reservationRepo, restaurantRepo, redisRepo);

		const response = await service.getAvailability(context.params.id);

		context.body = response;
		context.status = 200;
	}

	private async addReservation(context: Context) {
		// TODO: validate user request
		const restaurantId = context.params.id;
		const { from, to } = context.request.body;

		//TODO: Improve Dependency Injection
		const reservationRepo = new ReservationRepository();
		const restaurantRepo = new RestaurantRepository();
		const redisRepo = new RedisRepository('wait_list');

		const service = new ReservationService(reservationRepo, restaurantRepo, redisRepo);

		const reservation = new Reservation(from, to, restaurantId);

		const response = await service.addReservation(reservation);

		context.status = 200;
		context.body = response;
	}

	private async dispatchWaitList(context: Context) {
		// TODO: validate user request
		const reservation: Reservation = context.request.body;
		reservation.restaurantId = context.params.id;

		const redisRepo = new RedisRepository('wait_list');
		const response = await redisRepo.dispatchMessage(reservation);

		if (response) {
			context.status = 200;
			context.body = { message: 'reservation added in wait list successfully.' };
			return;
		}

		context.status = 500;
		context.body = { message: 'error to add reservation in wait list' };
	}
}
