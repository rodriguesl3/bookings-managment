import { Reservation } from '../../domain/Reservation';
import { Restaurant } from '../../domain/Restaurant';

import { calculateAvailability } from './calculateAvailability';

import { DateTime } from 'luxon';

const formatParam = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'";

describe('calculateAvailability', () => {
	it('returns 1 time slots available', () => {
		const reservationListMock: Reservation[] = [
			{
				from: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-id-1',
			},
			{
				from: DateTime.utc().set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-id-2',
			},
			{
				from: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-id-1',
			},
			{
				from: DateTime.utc().set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: DateTime.utc().set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: 'some-id-2',
			},
		];

		const restaurant: Restaurant = {
			open: 12,
			close: 15,
			id: 'some-id',
			tables: 2,
		};

		const result = calculateAvailability(restaurant, reservationListMock);

		expect(result).toHaveLength(1);
		expect(DateTime.fromFormat(result![0].from, formatParam).hour).toEqual(12);
		expect(DateTime.fromFormat(result![0].to, formatParam).hour).toEqual(13);
	});

	it('returns 7 time slots available and not contains time slots already reserved', () => {
		const todayUTC = DateTime.utc();

		const reservationListMock: Reservation[] = [
			{
				from: todayUTC.set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: todayUTC.set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: '1',
			},
			{
				from: todayUTC.set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: todayUTC.set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: '2',
			},
			{
				from: todayUTC.set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: todayUTC.set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id',
				id: '3',
			},
			{
				from: todayUTC.set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				to: todayUTC.set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				restaurantId: 'some-id-2',
				id: '4',
			},
		];

		const restaurant: Restaurant = {
			open: 9,
			close: 15,
			id: 'some-id',
			tables: 2,
		};

		const result = calculateAvailability(restaurant, reservationListMock);

		expect(result).toHaveLength(4);
		expect(result).not.toEqual(
			expect.arrayContaining([
				{
					from: todayUTC.set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toMillis(),
					to: todayUTC.set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toMillis(),
				},
			]),
		);
	});
});
