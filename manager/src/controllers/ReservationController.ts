import { Context } from 'koa';
import Router from 'koa-router';
import { Reservation } from '../domains/Reservation';
import { RedisRepository } from '../repositories/RedisRepository';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { ReservationService } from '../services/ReservationService';
import { IController } from './IController';

export default class ReservationController implements IController {
	public path = '/reservations';
	public router = new Router();

	constructor() {
		this.buildRoutes();
	}

	private buildRoutes() {
		this.router.post(`${this.path}/restaurants/:id`, this.addReservation);
		this.router.get(`${this.path}/restaurants/:id`, this.getAllReservationByRestaurantId);
		this.router.del(`${this.path}/:id`, this.deleteReservation);
		this.router.put(`${this.path}/:reservationId/restaurants/:id`, this.updateReservation);
	}

	public buildInjection() {
		const reservationRepository = new ReservationRepository();
		const redisRepository = new RedisRepository('wait_list');
		const reservationService = new ReservationService(reservationRepository, redisRepository);

		return reservationService;
	}

	private async updateReservation(context: Context) {
		const reservationRepository = new ReservationRepository();
		const redisRepository = new RedisRepository('wait_list');
		const reservationService = new ReservationService(reservationRepository, redisRepository);

		const restaurantId = context.params.id;
		const reservationId = context.params.reservationId;
		const { from, to } = context.request.body;

		const reservation = new Reservation(from, to, restaurantId, reservationId);

		const response = await reservationService.updateReservation(reservation);

		context.status = 200;
		context.body = response;
	}

	private async addReservation(context: Context) {
		const reservationRepository = new ReservationRepository();
		const redisRepository = new RedisRepository('wait_list');
		const reservationService = new ReservationService(reservationRepository, redisRepository);

		const restaurantId = context.params.id;
		const { from, to } = context.request.body;

		const reservation = new Reservation(from, to, restaurantId);

		const response = await reservationService.addReservation(reservation);

		context.body = response;
		context.status = 200;
	}

	private async getAllReservationByRestaurantId(context: Context) {
		const reservationRepository = new ReservationRepository();
		const redisRepository = new RedisRepository('wait_list');
		const reservationService = new ReservationService(reservationRepository, redisRepository);

		const restaurantId = context.params.id;

		const response = await reservationService.getAllByRestaurant(restaurantId);

		context.body = response;
		context.status = 200;
	}

	private async deleteReservation(context: Context) {
		const reservationRepository = new ReservationRepository();
		const redisRepository = new RedisRepository('wait_list');
		const reservationService = new ReservationService(reservationRepository, redisRepository);

		const reservationId = context.params.id;
		const response = await reservationService.deleteReservation(reservationId);

		context.body = response;
		context.status = 204;
	}
}
