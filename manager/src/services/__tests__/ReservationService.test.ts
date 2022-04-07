import { ReservationStatus } from '../../domains/ViewModel/ReservationStatusViewModel';
import { IRedisRepository } from '../../repositories/IRedisRepository';
import { IReservationRepository } from '../../repositories/IReservationRepository';
import { ReservationService } from '../ReservationService';

describe('ReservationService', () => {
	const reservationRepo: jest.Mocked<IReservationRepository> = {
		addRegister: jest.fn(),
		deleteRegister: jest.fn(),
		getAll: jest.fn(),
		getById: jest.fn(),
		updateRegister: jest.fn(),
		getByFilter: jest.fn(),
	};

	const redisRepository: jest.Mocked<IRedisRepository> = {
		subscribeMessage: jest.fn(),
	};

	it('deletes a reservation and invoke a message with message successfully', async () => {
		reservationRepo.deleteRegister.mockResolvedValue(true);

		redisRepository.subscribeMessage.mockResolvedValue({
			from: 1649149200000,
			to: 1649152800000,
			restaurantId: 'some-id',
			id: '624c7ab69e1462515dfad9ba',
		});
		const instance = new ReservationService(reservationRepo, redisRepository);
		instance.addReservation = jest
			.fn()
			.mockResolvedValue({ reservationId: '624c7ab69e1462515dfad9ba', status: ReservationStatus.Reserved });

		const response = await instance.deleteReservation(expect.any(String));
		expect(instance.addReservation).toBeCalled();
		expect(response).toEqual(true);
	});

	it('deletes a reservation and invoke an empty message successfully', async () => {
		reservationRepo.deleteRegister.mockResolvedValue(true);

		redisRepository.subscribeMessage.mockResolvedValue(undefined);
		const instance = new ReservationService(reservationRepo, redisRepository);
		instance.addReservation = jest.fn();

		const response = await instance.deleteReservation(expect.any(String));
		expect(instance.addReservation).not.toBeCalled();
		expect(response).toEqual(true);
	});
});
