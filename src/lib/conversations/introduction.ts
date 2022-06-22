import { Door } from '../../types/door';
import { Message } from '../../types/message';

export const introductionConversation = (
	height: number,
	name: string,
	lang: string
): { [id: number]: Message } => ({
	0: {
		id: 0,
		text: [''],
		children: [1],
	},
	1: {
		id: 1,
		text: ['Hi, I am Fordy'],
		children: [2],
		callback: {
			functionName: 'sendWelcome',
		},
	},
	2: {
		id: 2,
		text: ["Let's get to know each other"],
		children: [3],
	},
	3: {
		id: 3,
		text: ['What is your name?'],
		children: [4, 5],
		callback: {
			functionName: 'sendLoading',
		},
	},
	4: {
		id: 4,
		text: ['Nice to meet you,', { text: name, lang }],
		children: [6],
	},
	5: {
		id: 5,
		text: ['I could not hear your name properly.', 'Can you repeat it?'],
		children: [4, 5],
	},
	6: {
		id: 6,
		text: [
			'Now, you can make your unique gesture to open the door.',
			'You can use it when I am in silent mode',
		],
		children: [7, 13],
	},
	7: {
		id: 7,
		text: ['Ok! Please do your gesture now.'],
		children: [9],
		callback: {
			functionName: 'sendLoading',
		},
	},
	9: {
		id: 9,
		text: ['That is a great gesture, I will save it in my memory.'],
		children: [10],
		callback: {
			functionName: 'sendConfirmation',
		},
	},
	10: {
		id: 10,
		text: ['Do you want to test it out now to open the car door?'],
		children: [11, 13],
	},
	11: {
		id: 11,
		text: ['Ok! Please do your gesture now.'],
		children: [14],
		callback: {
			functionName: 'sendLoading',
		},
	},
	13: {
		id: 13,
		text: [
			'Ok, we will do it next time, but I might not recognize it correctly',
			'The more we practice, the better I learn.',
		],
		children: [15],
	},
	14: {
		id: 14,
		text: ['Good! Now I definitely remember!'],
		children: [15],
		callback: {
			functionName: 'sendConfirmation',
		},
	},
	15: {
		id: 15,
		text: [
			'To support you better, a connection to your smart devices will help me more.',
			'Do you want to set it up now?',
		],
		children: [23, 19, 26],
	},
	23: {
		id: 23,
		text: [
			'Please open the Ford Pass app on your phone and accept my request to pair with you.',
			'After you do, you can always access and change my permissions.',
		],
		children: [24],
		callback: {
			functionName: 'startPairing',
		},
	},
	24: {
		id: 24,
		text: ['Done!'],
		children: [18],
		preventSpeak: true,
		callback: {
			functionName: 'stopPairing',
		},
	},
	25: {
		id: 25,
		text: ['I will do it later.'],
		children: [19],
		preventSpeak: true,
		callback: {
			functionName: 'stopPairing',
		},
	},
	26: {
		id: 26,
		text: [
			'Examples include preparing for when you are going to get in the car and making decisions towards fuel consumption.',
		],
		children: [16, 17],
	},
	18: {
		id: 18,
		text: ["Awesome! Let's get started.", 'Come in!'],
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
	19: {
		id: 19,
		text: [
			'Are you sure?',
			"I won't be able to fully show you my potential and make your life easier.",
		],
		children: [20, 21],
	},
	20: {
		id: 20,
		text: ["Yes. I don't want it"],
		children: [22],
		preventSpeak: true,
	},
	21: {
		id: 21,
		text: ['No. I changed my mind.'],
		children: [18],
		preventSpeak: true,
		callback: {
			functionName: 'startPairing',
		},
	},
	22: {
		id: 22,
		text: ["Ok then, let's get started. Come in!"],
		callback: {
			functionName: 'openDoor',
			args: [Door.Front],
		},
	},
});
