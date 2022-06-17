import { Message } from '../../types/message';

export const finalConversation = (): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: '',
		// children: [1],
	},
});
