import { Door, getDoorLabel } from '../types/door';
import { Message } from '../types/message';
import { getObjectTypeLabel, ObjectType } from '../types/object';

export const messages = (
	name: string,
	door: Door,
	object: ObjectType,
	sendWelcome: () => void,
	closeDoor: (door: Door) => void,
	openDoor: (door: Door) => void
): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: '',
		children: [1],
	},
	1: {
		id: 1,
		text: `Hey, ${name}!`,
		children: [2],
		callback: () => {
			sendWelcome();
		},
	},
	2: {
		id: 2,
		text: `I see you are carrying ${getObjectTypeLabel(object)}!`,
		children: [3],
	},
	3: {
		id: 3,
		text: `I'll open the ${getDoorLabel(door)} for you.`,
		children: [4, 5, 6],
		callback: () => {
			openDoor(door);
		},
	},
	4: {
		id: 4,
		text: 'Open front door',
		children: [7],
		preventSpeak: true,
		callback: () => {
			if (door !== Door.Front) openDoor(Door.Front);
		},
	},
	5: {
		id: 5,
		text: 'Open back door',
		children: [7],
		preventSpeak: true,
		callback: () => {
			if (door !== Door.Back) openDoor(Door.Back);
		},
	},
	6: {
		id: 6,
		text: 'Open trunk',
		children: [7],
		preventSpeak: true,
		callback: () => {
			if (door !== Door.Trunk) openDoor(Door.Trunk);
		},
	},
	7: {
		id: 7,
		text: 'Close the door',
		children: [8],
		preventSpeak: true,
		callback: () => {
			// FIXME: Not the right door
			closeDoor(door);
		},
	},
	8: {
		id: 8,
		text: 'Are we leaving?',
		children: [9, 11],
	},
	9: {
		id: 9,
		text: 'Yes',
		children: [10],
		preventSpeak: true,
		callback: () => {
			openDoor(Door.Front);
		},
	},
	10: {
		id: 10,
		text: 'Close the front door',
		preventSpeak: true,
		callback: () => {
			closeDoor(Door.Front);
		},
	},
	11: {
		id: 11,
		text: 'Okay, I will wait until you are ready',
	},
});
