export enum ReservationStatus {
	Reserved = 'reserved',
	Wait = 'wait',
	Overbooked = 'overbooked',
}

export interface ReservationStatusViewModel {
	reservationId: string;
	status: ReservationStatus;
}
