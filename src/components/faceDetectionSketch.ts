import * as faceapi from 'face-api.js';
import { P5CanvasInstance, Sketch, SketchProps } from 'react-p5-wrapper';
import { Graphics } from 'p5';
import _ from 'lodash';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { showNotification } from '@mantine/notifications';

const MODEL_URL = '/models';
const HISTORY_LENGTH = 7;

let capture: any;
let graphics: Graphics;
let startDetection: boolean;

let detectionBox: faceapi.Box;

let prevAmounts: number[] = [];
let tempAmounts;
let currentAmount = 0;

let videoWidth = 1280 / 2,
	videoHeight = 960 / 2;

let emitToSocket: (event: string, payload: any) => void;

type MySketchProps = SketchProps & {
	emitToSocket: (event: string, payload: any) => void;
};

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

	emitToSocket('send-state', message);
}

async function loadModels() {
	await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
	await faceapi.loadFaceLandmarkModel(MODEL_URL);
	await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export const sketch: Sketch<MySketchProps> = (p5) => {
	p5.setup = async function () {
		await loadModels();

		const canvas = p5.createCanvas(videoWidth, videoHeight);
		canvas.id('canvas');
		canvas.removeAttribute('style');

		let constraints = {
			video: {
				mandatory: {
					minWidth: videoWidth,
					minHeight: videoHeight,
				},
				optional: [{ maxFrameRate: 15, facingMode: 'user' }],
			},
			audio: false,
		};
		capture = p5.createCapture(constraints, (stream) => {
			console.log(stream);
		});

		capture.id('video');
		capture.hide();

		graphics = p5.createGraphics(videoWidth, videoHeight);

		startDetection = true;
	};

	p5.updateWithProps = (props) => {
		if (props.emitToSocket) {
			emitToSocket = props.emitToSocket;
		}
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

		graphics.image(capture, 0, 0);
		p5.image(graphics, 0, 0, videoWidth, videoHeight);

		faceDescriptions.forEach((description, i) => {
			detectionBox = description.detection.box;

			drawBox(p5, detectionBox);
		});

		updateState(faceDescriptions.length);
	};

	document.querySelector('#snap')?.addEventListener('click', () => {
		graphics.loadPixels();

		const temp = graphics.get(
			detectionBox.x - 25,
			detectionBox.y - 40,
			detectionBox.width + 50,
			detectionBox.height + 80
		);
		p5.save(temp, `image-${Date.now()}.jpg`);
	});
};

function drawBox(p5: P5CanvasInstance<MySketchProps>, box: faceapi.Box) {
	p5.strokeWeight(4);
	p5.stroke(255, 0, 0);
	p5.rect(box.x, box.y, box.width, box.height);
}
