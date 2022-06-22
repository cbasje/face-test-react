import { Door } from '../../types/door';
import { Message } from '../../types/message';

export const silentConversation = (): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: [''],
		children: [1],
	},
	1: {
		id: 1,
		text: ['Face detected'],
		preventSpeak: true,
		children: [2],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	2: {
		id: 2,
		text: ['Gesture'],
		preventSpeak: true,
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
});
