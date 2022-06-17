import { Message } from '../../types/message';

export const faceFailConversation = (): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: '',
		// children: [1],
	},
});
