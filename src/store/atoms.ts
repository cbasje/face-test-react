import { atom } from 'recoil';
import { ConversationType } from '../types/conversation';
import { Door } from '../types/door';
import { ObjectType } from '../types/object';

export const nameState = atom({
	key: 'nameState',
	default: '',
});
export const heightState = atom({
	key: 'heightState',
	default: 0,
});
export const objectState = atom({
	key: 'objectState',
	default: ObjectType.Baby,
});
export const doorState = atom({
	key: 'doorState',
	default: Door.Front,
});
export const conversationState = atom({
	key: 'conversationState',
	default: ConversationType.Learning,
});
