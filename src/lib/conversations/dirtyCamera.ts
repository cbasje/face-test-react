import { Door } from '../../types/door';
import { Message } from '../../types/message';

export const dirtyCameraConversation = (
	name: string,
	lang: string
): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: [''],
		children: [1],
	},
	1: {
		id: 1,
		text: [{ text: name, lang }, ', is that you?'],
		children: [2],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	2: {
		id: 2,
		text: [
			"I can't recognize you because the camera is dirty.",
			"Please clean it and let's try again!",
		],
		children: [3],
	},
	3: {
		id: 3,
		text: ['Oh', { text: name, lang }, ', now I can see you!', 'Come in!'],
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
});
