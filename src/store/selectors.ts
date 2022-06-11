import { selector } from 'recoil';
import {
	conversationState,
	doorState,
	heightState,
	nameState,
	objectState,
} from './atoms';
import { ConversationType } from '../types/conversation';
import { messages as learningConversation } from '../util/learningConversation';
import { messages as trainingConversation } from '../util/trainingConversation';
import { messages as finalConversation } from '../util/finalConversation';

export const messagesState = selector({
	key: 'messagesState',
	get: ({ get }) => {
		const height = get(heightState);
		const name = get(nameState);
		const door = get(doorState);
		const object = get(objectState);
		const conv = get(conversationState);

		switch (conv) {
			case ConversationType.Learning:
				return learningConversation(height, name);
			case ConversationType.Talking:
				return trainingConversation(name, door, object);
			case ConversationType.Final:
				return finalConversation();
		}
	},
});
