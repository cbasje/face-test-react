import * as faceapi from 'face-api.js';
import { P5CanvasInstance, Sketch } from 'react-p5-wrapper';
import _ from 'lodash';
import { io } from 'socket.io-client';

const MODEL_URL = '/models';
const HISTORY_LENGTH = 7;

let capture: any;
let startDetection: boolean;

let prevAmounts: number[] = [];
let tempAmounts;
let currentAmount = 0;

const id = '9d6af4c7-a4a0-4f15-977f-bb505bab8061';
const socket = io('https://localhost:3000/', {
	transports: ['websocket', 'polling'],
	query: { id },
});

export function resetState() {
	currentAmount = 0;
	throttledSendState();
}

export function updateDetectionFromUI(value: boolean) {
	startDetection = value;
}

export function updateStateFromUI(value: number) {
	currentAmount = value;
	throttledSendState();
}

const updateState = (value: number) => {
	if (prevAmounts.length == 1) {
		prevAmounts.push(value);
		currentAmount = value;
		throttledSendState();
		return;
	} else if (prevAmounts.length >= HISTORY_LENGTH) {
		tempAmounts = _.tail(prevAmounts);
	} else {
		tempAmounts = prevAmounts;
	}

	tempAmounts.push(value);

	const prevMean = _.round(_.mean(prevAmounts));
	const currentMean = _.round(_.mean(tempAmounts));

	if (prevMean != currentMean) {
		currentAmount = currentMean;
		throttledSendState();
	}

	prevAmounts = tempAmounts;
};

const throttledSendState = _.throttle(sendState, 100, {
	trailing: true,
});

async function sendState() {
	let message,
		state = currentAmount;
	if (typeof state === 'number') message = state.toString();
	else message = state;

	socket?.emit('send-state', message);
}

async function loadModels() {
	await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
	await faceapi.loadFaceLandmarkModel(MODEL_URL);
	await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export const sketch: Sketch = (p5) => {
	p5.setup = async function () {
		await loadModels();

		p5.createCanvas(1280, 720);
		let constraints = {
			video: {
				mandatory: {
					minWidth: 1280,
					minHeight: 720,
				},
				optional: [{ maxFrameRate: 10 }],
			},
			audio: false,
		};
		capture = p5.createCapture(constraints, (stream) => {
			console.log(stream);
		});

		capture.id('video');
		// capture.size(1280, 720);
		capture.hide();

		startDetection = true;
	};

	p5.draw = async () => {
		if (!capture || !startDetection) return;

		// p5.background(255);
		// p5.image(capture, 0, 0);
		p5.fill(0, 0, 0, 0);

		let faceDescriptions = await faceapi
			.detectAllFaces(capture.id())
			.withFaceLandmarks()
			.withFaceDescriptors();

		p5.image(capture, 0, 0);

		faceDescriptions.forEach((description, i) => {
			const box = description.detection.box;

			drawBox(p5, box);
		});

		updateState(faceDescriptions.length);
	};
};

function drawBox(p5: P5CanvasInstance, box: faceapi.Box) {
	p5.strokeWeight(4);
	p5.stroke(255, 0, 0);
	p5.rect(box.x, box.y, box.width, box.height);
}
