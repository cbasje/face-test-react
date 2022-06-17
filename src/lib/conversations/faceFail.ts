import { Door } from '../../types/door';
import { Message } from '../../types/message';

export const faceFailConversation = (
	name: string,
	lang: string
): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: [''],
		children: [1, 2, 3, 4],
	},
	1: {
		id: 1,
		text: [{ text: '¡Hola, Sofía! ¿Cómo estás?', lang: 'es-CR' }],
		children: [5],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	2: {
		id: 2,
		text: [{ text: 'Ehi, Dan! Come stai?', lang: 'it-IT' }],
		children: [5],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	3: {
		id: 3,
		text: [{ text: '嗨，周文！你还好吗？', lang: 'zh-Hans' }],
		children: [5],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	4: {
		id: 4,
		text: [{ text: 'Hoi, Sebastiaan! Hoe gaat het?', lang: 'nl-NL' }],
		children: [5],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	5: {
		id: 5,
		text: ['I will open the front door for you.'],
		children: [6],
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
	6: {
		id: 6,
		text: ['Oh no, I am sorry', { text: name, lang }],
		children: [7],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	7: {
		id: 7,
		text: ['Please come in to set up more ways for me to recognise you.'],
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
});
