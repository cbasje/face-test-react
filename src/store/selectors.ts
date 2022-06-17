import { selector } from 'recoil';
import {
	conversationState,
	doorState,
	eventState,
	heightState,
	langState,
	nameState,
	objectState,
} from './atoms';
import { ConversationType } from '../types/conversation';
import { introductionConversation } from '../lib/conversations/introduction';
import { objectFailConversation } from '../lib/conversations/objectFail';
import { finalConversation } from '../lib/conversations/final';
import { faceFailConversation } from '../lib/conversations/faceFail';
import { dirtyCameraConversation } from '../lib/conversations/dirtyCamera';

export const messagesState = selector({
	key: 'messagesState',
	get: ({ get }) => {
		const height = get(heightState);
		const name = get(nameState);
		const lang = get(langState);
		const door = get(doorState);
		const object = get(objectState);
		const event = get(eventState);
		const conv = get(conversationState);

		switch (conv) {
			case ConversationType.Introduction:
				return introductionConversation(height, name, lang);
			case ConversationType.ObjectFail:
				return objectFailConversation(name, lang, door, object);
			case ConversationType.DirtyCamera:
				return dirtyCameraConversation(name, lang);
			case ConversationType.FaceFail:
				return faceFailConversation();
			case ConversationType.Final:
				return finalConversation(name, lang, event);
		}
	},
});
