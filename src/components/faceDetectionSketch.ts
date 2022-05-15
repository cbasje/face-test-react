import { P5CanvasInstance, Sketch } from 'react-p5-wrapper';
import _ from 'lodash';
import { io, Socket } from 'socket.io-client';

let currentAmount = 0;

const id = '9d6af4c7-a4a0-4f15-977f-bb505bab8061';
let socket: Socket = io('https://localhost:3000/', {
	transports: ['websocket', 'polling'],
	query: { id },
});

export function resetState() {
	currentAmount = 0;
	sendState();
}

export function updateStateFromUI(value: number) {
	currentAmount = value;
	sendState();
}

async function sendState() {
	let message,
		state = currentAmount;
	if (typeof state === 'number') message = state.toString();
	else message = state;

	socket?.emit('send-state', message);
}

export const sketch: Sketch = (p5) => {
	p5.setup = async function () {};

	p5.draw = async () => {};
};
