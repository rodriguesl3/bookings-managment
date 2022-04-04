import { Reservation } from '../../domain/Reservation';
import { Restaurant } from '../../domain/Restaurant';
import { formatDate } from '../../test-helpers/formatDateHelper';
import { calculateAvailability } from './calculateAvailability';

describe('calculateAvailability', () => {
	it('returns 1 time slots available', () => {
		const reservationListMock: Reservation[] = [
			{
				from: formatDate(new Date().toDateString(), 13),
				to: formatDate(new Date().toDateString(), 14),
				restaurantId: 'some-id',
				tables: 4,
				id: '123123',
			},
			{
				from: formatDate(new Date().toDateString(), 14),
				to: formatDate(new Date().toDateString(), 15),
				restaurantId: 'some-id',
				tables: 4,
				id: '123123',
			},
		];

		const restaurant: Restaurant = {
			open: 12,
			close: 15,
			id: 'some-id',
			tables: 4,
		};

		const result = calculateAvailability(restaurant, reservationListMock);

		expect(result).toHaveLength(1);
		expect(result[0].from).toEqual<Date>(formatDate(new Date().toDateString(), 12));
		expect(result[0].to).toEqual<Date>(formatDate(new Date().toDateString(), 13));
		expect(result[0].restaurantId).toEqual('some-id');
	});

	it('returns 7 time slots available and not contains time slots already reserved', () => {
		const reservationListMock: Reservation[] = [
			{
				from: new Date('2022-04-03T13:00:00'),
				to: new Date('2022-04-03T14:00:00'),
				restaurantId: 'some-id',
				tables: 2,
			},
			{
				from: new Date('2022-04-03T14:00:00'),
				to: new Date('2022-04-03T15:00:00'),
				restaurantId: 'some-id',
				tables: 2,
			},
		];

		const restaurant: Restaurant = {
			open: 9,
			close: 15,
			id: 'some-id',
			tables: 2,
		};

		const result = calculateAvailability(restaurant, reservationListMock);

		expect(result).toHaveLength(6);
		expect(result).not.toEqual(
			expect.arrayContaining([
				{
					from: new Date('2022-04-03T14:00:00'),
					to: new Date('2022-04-03T15:00:00'),
				},
			]),
		);
	});
});
