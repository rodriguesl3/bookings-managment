import { IReservationRepository } from '../../repositories/IReservationRepository';
import { IRestaurantRepository } from '../../repositories/IRestaurantRepository';
import { ReservationService } from '../ReservationService';
import { formatDate } from '../../test-helpers/formatDateHelper';

describe('ReservationService', () => {
	it('returns 2 time slots when restaurant has 4 available time slots and 2 reservations', async () => {
		const reservationRepoMock: jest.Mocked<IReservationRepository> = {
			getAvailabilityByRestaurantId: jest.fn().mockResolvedValue([
				{
					from: formatDate(new Date().toDateString(), 12),
					to: formatDate(new Date().toDateString(), 13),
					restaurantId: 'some-id',
					id: 'some-reservation-id',
					tables: 4,
				},
				{
					from: formatDate(new Date().toDateString(), 13),
					to: formatDate(new Date().toDateString(), 14),
					restaurantId: 'some-id',
					id: 'some-reservation-id-2',
					tables: 4,
				},
			]),
			getById: jest.fn(),
			addRegister: jest.fn(),
		};
		const restaurantRepoMock: jest.Mocked<IRestaurantRepository> = {
			getById: jest.fn().mockResolvedValue({
				id: 'some-id',
				open: 12,
				close: 16,
				tables: 4,
			}),
			addRegister: jest.fn(),
		};

		const instance = new ReservationService(reservationRepoMock, restaurantRepoMock);

		const result = await instance.getAvailability('some-id');

		expect(result).toHaveLength(2);
		expect(result![0].from.getHours()).toEqual(14);
		expect(result![0].to.getHours()).toEqual(15);

		expect(result![1].from.getHours()).toEqual(15);
		expect(result![1].to.getHours()).toEqual(16);
	});

	it('returns 2 time slots when 1 table is available for one of the time slots', async () => {
		const reservationRepoMock: jest.Mocked<IReservationRepository> = {
			getAvailabilityByRestaurantId: jest.fn().mockResolvedValue([
				{
					from: formatDate(new Date().toDateString(), 12),
					to: formatDate(new Date().toDateString(), 13),
					restaurantId: 'some-id',
					id: 'some-reservation-id',
					tables: 1,
				},
			]),
			getById: jest.fn(),
			addRegister: jest.fn(),
		};

		const restaurantRepoMock: jest.Mocked<IRestaurantRepository> = {
			getById: jest.fn().mockResolvedValue({
				id: 'some-id',
				open: 12,
				close: 14,
				tables: 2,
			}),
			addRegister: jest.fn(),
		};

		const instance = new ReservationService(reservationRepoMock, restaurantRepoMock);

		const result = await instance.getAvailability('some-id');

		expect(result).toHaveLength(2);
		expect(result![0].from.getHours()).toEqual(12);
		expect(result![0].to.getHours()).toEqual(13);

		expect(result![1].from.getHours()).toEqual(13);
		expect(result![1].to.getHours()).toEqual(14);
	});

	it('checks available tables for each time slots', async () => {
		const reservationRepoMock: jest.Mocked<IReservationRepository> = {
			getAvailabilityByRestaurantId: jest.fn().mockResolvedValue([
				{
					from: formatDate(new Date().toDateString(), 12),
					to: formatDate(new Date().toDateString(), 13),
					restaurantId: 'some-id',
					id: 'some-reservation-id',
					tables: 1,
				},
			]),
			getById: jest.fn(),
			addRegister: jest.fn(),
		};

		const restaurantRepoMock: jest.Mocked<IRestaurantRepository> = {
			getById: jest.fn().mockResolvedValue({
				id: 'some-id',
				open: 12,
				close: 14,
				tables: 2,
			}),
			addRegister: jest.fn(),
		};

		const instance = new ReservationService(reservationRepoMock, restaurantRepoMock);

		const result = await instance.getAvailability('some-id');

		expect(result).toHaveLength(2);
		expect(result![0].tableAvailable).toEqual(1);
		expect(result![1].tableAvailable).toEqual(2);
	});
});
