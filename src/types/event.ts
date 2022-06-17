export enum EventType {
	Meeting = 'm',
	FootballPractice = 'fp',
	FamilyDinner = 'fd',
	BeachParty = 'bp',
}

export const getEventTypeLabel = (event: EventType): string => {
	switch (event) {
		case EventType.Meeting:
			return 'a meeting';
		case EventType.FootballPractice:
			return 'football practice';
		case EventType.FamilyDinner:
			return 'a family dinner';
		case EventType.BeachParty:
			return 'a beach party';
		default:
			return '';
	}
};
