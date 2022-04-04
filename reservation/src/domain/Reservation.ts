export interface Reservation {
	to: Date;
	from: Date;
	restaurantId: string;
	id?: string;
	tables: number;
}
