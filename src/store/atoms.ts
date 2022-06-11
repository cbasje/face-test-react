import { atom } from 'recoil';
import { ConversationType } from '../types/conversation';
import { Door } from '../types/door';
import { ObjectType } from '../types/object';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

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
	effects_UNSTABLE: [persistAtom],
});
export const doorState = atom({
	key: 'doorState',
	default: Door.Front,
	effects_UNSTABLE: [persistAtom],
});
export const conversationState = atom({
	key: 'conversationState',
	default: ConversationType.Learning,
	effects_UNSTABLE: [persistAtom],
});
