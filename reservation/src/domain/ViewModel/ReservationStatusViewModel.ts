export enum ReservationStatus {
	Reserved = 'reserved',
	Wait = 'wait',
}

export interface ReservationStatusViewModel {
	reservationId: string;
	status: ReservationStatus;
}
