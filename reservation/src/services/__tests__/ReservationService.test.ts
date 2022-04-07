import { IReservationRepository } from '../../repositories/IReservationRepository';
import { IRestaurantRepository } from '../../repositories/IRestaurantRepository';
import { ReservationService } from '../ReservationService';
import { DateTime } from 'luxon';
import { IRedisRepository } from '../../repositories/RedisRepository';

const formatParam = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'";

const reservationRepoMock: jest.Mocked<IReservationRepository> = {
	getById: jest.fn(),
	addRegister: jest.fn(),
	getReservationByDate: jest.fn(),
	upsertReservation: jest.fn(),
	getAvailabilityByRestaurantId: jest.fn(),
};
const restaurantRepoMock: jest.Mocked<IRestaurantRepository> = {
	addRegister: jest.fn(),
	getById: jest.fn(),
};
const redisRepository: jest.Mocked<IRedisRepository> = {
	dispatchMessage: jest.fn(),
};

describe('ReservationService', () => {
	it('returns 2 time slots when restaurant has 4 available time slots and 2 reservations', async () => {
		reservationRepoMock.getAvailabilityByRestaurantId = jest.fn().mockResolvedValue([
			{
				from: DateTime.utc().set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-1',
			},
			{
				from: DateTime.utc().set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-2',
			},
			{
				from: DateTime.utc().set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-3',
			},
			{
				from: DateTime.utc().set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-4',
			},

			{
				from: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-5',
			},
			{
				from: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-6',
			},
			{
				from: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-7',
			},
			{
				from: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-8',
			},
			{
				from: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-9',
			},
		]);

		restaurantRepoMock.getById = jest.fn().mockResolvedValue({
			id: 'some-id',
			open: 12,
			close: 16,
			tables: 4,
		});

		const instance = new ReservationService(reservationRepoMock, restaurantRepoMock, redisRepository);

		const result = await instance.getAvailability('some-id');

		const test = DateTime.fromFormat(result![0].from, formatParam);

		expect(result).toHaveLength(2);
		expect(DateTime.fromFormat(result![0].from, formatParam).hour).toEqual(14);
		expect(DateTime.fromFormat(result![0].to, formatParam).hour).toEqual(15);

		expect(DateTime.fromFormat(result![1].from, formatParam).hour).toEqual(15);
		expect(DateTime.fromFormat(result![1].to, formatParam).hour).toEqual(16);
	});

	it('returns 2 time slots when 1 table is available for one of the time slots', async () => {
		reservationRepoMock.getAvailabilityByRestaurantId = jest.fn().mockResolvedValue([
			{
				from: DateTime.utc().set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-1',
			},
		]);

		restaurantRepoMock.getById = jest.fn().mockResolvedValue({
			id: 'some-id',
			open: 12,
			close: 14,
			tables: 2,
		});

		const instance = new ReservationService(reservationRepoMock, restaurantRepoMock, redisRepository);

		const result = await instance.getAvailability('some-id');

		expect(result).toHaveLength(2);

		expect(DateTime.fromFormat(result![0].from, formatParam).hour).toEqual(12);
		expect(DateTime.fromFormat(result![0].to, formatParam).hour).toEqual(13);

		expect(DateTime.fromFormat(result![1].from, formatParam).hour).toEqual(13);
		expect(DateTime.fromFormat(result![1].to, formatParam).hour).toEqual(14);
	});

	it('checks available tables for each time slots', async () => {
		reservationRepoMock.getAvailabilityByRestaurantId = jest.fn().mockResolvedValue([
			{
				from: DateTime.utc().set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-reservation-id-1',
			},
		]);

		restaurantRepoMock.getById = jest.fn().mockResolvedValue({
			id: 'some-id',
			open: 12,
			close: 14,
			tables: 2,
		});

		const instance = new ReservationService(reservationRepoMock, restaurantRepoMock, redisRepository);

		const result = await instance.getAvailability('some-id');

		expect(result).toHaveLength(2);
		expect(result![0].tablesAvailable).toEqual(1);
		expect(result![1].tablesAvailable).toEqual(2);
	});
});
