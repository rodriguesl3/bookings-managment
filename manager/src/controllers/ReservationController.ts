import { Context } from 'koa';
import Router from 'koa-router';
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
		this.router.del(`${this.path}/:id`, this.deleteReservation);
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
