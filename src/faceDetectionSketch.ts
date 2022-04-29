import * as faceapi from 'face-api.js';
import { P5CanvasInstance, Sketch } from 'react-p5-wrapper';
import _ from 'lodash';

const MODEL_URL = '/models';
const HISTORY_LENGTH = 20;

let capture: any;

let prevAmounts: number[] = [];
let tempAmounts;
let currentAmount = 0;

let startDetection = false;

let port: any;

export function resetState() {
	currentAmount = 0;
	throttledSendState();
}

export async function getPorts() {
	const nav = window.navigator as any;
	const ports = await nav.serial.getPorts();

	if (!ports.length) return;
	port = ports[0];

	try {
		// Wait for the serial port to open.
		await port.open({ baudRate: 9600 });

		startDetection = true;
	} catch (error) {
		console.error(error);
	}
}

export async function requestPort() {
	const nav = window.navigator as any;

	// Prompt user to select any serial port.
	port = await nav.serial.requestPort();

	try {
		// Wait for the serial port to open.
		await port.open({ baudRate: 9600 });

		console.log('Port opened');
		startDetection = true;
	} catch (error) {
		console.error(error);
	}
}

export async function closePort() {
	await port.close();
	console.log('Port closed');
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
	console.log('Updated state');
};

const throttledSendState = _.throttle(sendState, 500, {
	trailing: true,
});

async function sendState() {
	if (!port) {
		console.error('No port found');
		return;
	}

	let message,
		state = currentAmount;
	if (typeof state === 'number') message = state.toString();
	else message = state;

	const textEncoder = new TextEncoderStream();
	const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

	const writer = textEncoder.writable.getWriter();

	console.log(`Sending: ${message}`);
	await writer.write(message);

	await writer.close();
	writer.releaseLock();

	await writableStreamClosed;
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

		capture.id('video_element');
		capture.size(1280, 720);
		capture.hide();
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
