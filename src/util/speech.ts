import { MessageText } from '../types/message';

const wait = async (milliseconds: number) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

export const speak = (text: string, lang: string = 'en-GB') => {
	if ('speechSynthesis' in window) {
		let utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = lang;
		window.speechSynthesis.speak(utterance);
	} else {
		console.error('Browser not supported');
	}
};

export const speakMessageText = (text: MessageText[]) => {
	text.forEach(async (t) => {
		if (typeof t === 'string') {
			speak(t);
			await wait(500);
		} else speak(t.text, t.lang);
	});
};
