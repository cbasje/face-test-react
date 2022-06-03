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
	},
	2: {
		id: 2,
		text: "Let's get to know each other. What is your name?",
		children: [3],
	},
	3: {
		id: 3,
		text: `Nice to meet you, ${name}`,
		children: [4],
	},
	4: {
		id: 4,
		text: `Please come closer, so I can recognize your face`,
		children: [5],
	},
	5: {
		id: 5,
		text: 'To adjust my settings, please take 2 steps back and open you arms.',
		children: [6],
	},
	6: {
		id: 6,
		text: `Okay, thank you! Your height is approximately ${height} cm.`,
		children: [7],
	},
	7: {
		id: 7,
		text: 'Now you can create you own special greeting gesture.',
		children: [8],
	},
	8: {
		id: 8,
		text: 'In order for me to learn your preferences, we will do a few try-outs of my default way of opening the door. Let me know if you like it this way or not and I will try again.',
		children: [9],
	},
	9: {
		id: 9,
		text: 'Do you like this speed?',
		children: [10],
	},
	10: {
		id: 10,
		text: 'Do you want it faster or slower?',
		children: [11],
	},
	11: {
		id: 11,
		text: `Okay, thank you for the feedback, ${name}! I am ready to go now`,
	},
});
