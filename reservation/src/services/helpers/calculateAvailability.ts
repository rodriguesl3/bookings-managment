import { Reservation } from '../../domain/Reservation';
import { Restaurant } from '../../domain/Restaurant';
import { DateTime } from 'luxon';
import { ReservationViewModel } from '../../domain/ViewModel/ReservationViewModel';

export function calculateAvailability(restaurant: Restaurant, reservationList: Reservation[]) {
	const hoursRange = restaurant.close - restaurant.open;

	const result: ReservationViewModel[] = [];

	for (let index = 0; index < hoursRange; index++) {
		const referenceIndex = restaurant.open + index;

		const from = DateTime.utc().set({ hour: referenceIndex, minute: 0, second: 0, millisecond: 0 });
		const to = DateTime.utc().set({ hour: referenceIndex + 1, minute: 0, second: 0, millisecond: 0 });

		const reservation = reservationList.filter(
			(reservation) => from.toMillis() === reservation.from && to.toMillis() === reservation.to,
		);

		const tablesAvailable = restaurant.tables - reservation.length;

		if (!reservation || tablesAvailable > 0) {
			result.push({
				from: from.toFormat("yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"),
				to: to.toFormat("yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"),
				tablesAvailable,
			});
		}
	}

	return result;
}
