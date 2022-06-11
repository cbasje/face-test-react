import { Door } from './door';

export interface Message {
	id: number;
	text: string;
	children?: number[];
	callback?: MessageCallback;
	preventSpeak?: boolean;
}

interface MessageCallback {
	functionName: 'sendWelcome' | 'openDoor' | 'changeDoor' | 'closeDoor';
	args?: string[] | number[] | Door[];
}
