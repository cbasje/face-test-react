export interface Message {
	id: number;
	text: string;
	children?: number[];
	callback?: () => void;
	preventSpeak?: boolean;
}
