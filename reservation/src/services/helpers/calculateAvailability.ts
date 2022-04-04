import { Reservation } from '../../domain/Reservation';
import { Restaurant } from '../../domain/Restaurant';

function currentDateInfo(restaurant: Restaurant) {
	const openToday = new Date(new Date().toDateString());
	openToday.setHours(restaurant.open);
	const closeToday = new Date(new Date().toDateString());
	closeToday.setHours(restaurant.close);

	return {
		currentYear: openToday.getFullYear(),
		currentMonth: openToday.getMonth() + 1,
		currentDate: openToday.getDate(),
		openToday,
		closeToday,
	};
}

export function calculateAvailability(restaurant: Restaurant, reservationList: Reservation[]) {
	const hoursRange = restaurant.close - restaurant.open;

	const { currentDate, currentMonth, currentYear } = currentDateInfo(restaurant);
	const result: Reservation[] = [];

	for (let index = 0; index < hoursRange; index++) {
		const referenceIndex = restaurant.open + index;
		const dateReference = new Date(`${currentYear}-${currentMonth}-${currentDate} 00:00:00`);
		const from = new Date(dateReference);
		from.setHours(referenceIndex);
		const to = new Date(dateReference);
		to.setHours(referenceIndex + 1);

		const reservation = reservationList.find(
			(reservation) => from.getTime() === reservation.from.getTime() && to.getTime() === reservation.to.getTime(),
		);

		const tablesAvailable = restaurant.tables - (reservation?.tables ?? 0);

		if (!reservation || (tablesAvailable > 0 && result.length <= tablesAvailable)) {
			result.push({ from, to, tables: tablesAvailable, restaurantId: restaurant.id });
		}
	}

	return result;
}
