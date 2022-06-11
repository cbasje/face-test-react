import { Door } from '../types/door';
import { Message } from '../types/message';

export const messages = (
	height: number,
	name: string
): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: '',
		children: [1],
	},
	1: {
		id: 1,
		text: 'Hi, I am Fordy',
		children: [2],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	2: {
		id: 2,
		text: "Let's get to know each other",
		children: [3],
	},
	3: {
		id: 3,
		text: 'What is your name?',
		children: [4, 5],
	},
	4: {
		id: 4,
		text: `Nice to meet you, ${name}`,
		children: [6],
	},
	5: {
		id: 5,
		text: 'I could not hear your name properly, can you repeat it?',
		children: [4, 5],
	},
	6: {
		id: 6,
		text: 'Now, you can make a gesture that is only for you so that I will always recognize you.',
		children: [7, 8],
	},
	7: {
		id: 7,
		text: 'Okay',
		children: [9],
		preventSpeak: true,
		callback: {
			functionName: 'sendLoading',
		},
	},
	8: {
		id: 8,
		text: 'No',
		children: [13],
		preventSpeak: true,
	},
	9: {
		id: 9,
		text: 'That is a great gesture, I will save it in my memory.',
		children: [10],
		callback: {
			functionName: 'sendConfirmation',
		},
	},
	10: {
		id: 10,
		text: 'Do you want to test it out now to open the car door?',
		children: [11, 12],
	},
	11: {
		id: 11,
		text: 'Okay',
		children: [14],
		preventSpeak: true,
		callback: {
			functionName: 'sendLoading',
		},
	},
	12: {
		id: 12,
		text: 'No',
		children: [13],
		preventSpeak: true,
	},
	13: {
		id: 13,
		text: 'Ok, we will do it next time, but I might not recognize it correctly. The more we practice, the better I learn.',
		children: [15],
	},
	14: {
		id: 14,
		text: 'Good! Now I definitely remember!',
		children: [15],
		callback: {
			functionName: 'sendConfirmation',
		},
	},
	15: {
		id: 15,
		text: "Knowing more about you will help me support you better, for example, knowing your schedule will help me prepare for when you are going to get in the car, make decisions towards fuel consumption or turn the airco in advance so i'm waiting with the perfect temperature. Do you mind connecting your smart devices with me?",
		children: [16, 17],
	},
	16: {
		id: 16,
		text: 'Okay',
		children: [18],
		preventSpeak: true,
		callback: {
			functionName: 'startPairing',
		},
	},
	17: {
		id: 17,
		text: 'No',
		children: [19],
		preventSpeak: true,
	},
	18: {
		id: 18,
		text: "Awesome! Let's get started. Come in!",
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
	19: {
		id: 19,
		text: "Are you sure? I won't be able to fully show you my potential and make your life easier.",
		children: [20, 21],
	},
	20: {
		id: 20,
		text: 'Yes',
		children: [22],
		preventSpeak: true,
	},
	21: {
		id: 21,
		text: 'No. I changed my mind.',
		children: [18],
		preventSpeak: true,
		callback: {
			functionName: 'startPairing',
		},
	},
	22: {
		id: 22,
		text: "Ok then, let's get started. Come in!",
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
});
