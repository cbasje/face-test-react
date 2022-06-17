import { Door } from './door';

export type MessageText = string | { text: string; lang: string };

export interface Message {
	id: number;
	text: MessageText[];
	children?: number[];
	callback?: MessageCallback;
	preventSpeak?: boolean;
}

interface MessageCallback {
	functionName:
		| 'sendWelcome'
		| 'openDoor'
		| 'changeDoor'
		| 'closeDoor'
		| 'sendLoading'
		| 'sendConfirmation'
		| 'startPairing'
		| 'stopPairing';
	args?: string[] | number[] | Door[];
}
