export function formatDate(dateString: string, mockHour: number) {
	const mockDate = new Date(dateString);
	mockDate.setHours(mockHour);

	return mockDate;
}
