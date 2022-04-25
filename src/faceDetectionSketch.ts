import * as faceapi from 'face-api.js';
import { Sketch } from 'react-p5-wrapper';
import { SerialPort } from 'serialport';
import { Person } from './types/person';

const MODEL_URL = '/models';

const people = [
	new Person(10, 'Dan', '#0000FF', 'images/dan.jpeg'),
	new Person(11, 'Sebas', '#5DfDfD', 'images/sebas.jpeg'),
	new Person(12, 'Sofia', '#FFFF00', 'images/sofia.jpeg'),
	new Person(13, 'Zhouwen', '#9900F0', 'images/zhouwen.jpeg'),
];

let capture: any;

let labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];

const DEFAULT_STATE = 0;
const RESET_STATE = 1;

let previousState: number, currentState: number;
let previousLabel = '',
	currentLabel = '';
let startDetection = false;

const BOX_WIDTH_THRESHOLD = 100;
const FACE_MATCHER_THRESHOLD = 0.6;

let port: SerialPort;

export function resetState() {
	sendState(RESET_STATE);
}

export async function getPorts() {
	port = new SerialPort('/dev/tty.usbmodem1301', {
		baudRate: 9600,
	});

	port.on('error', (err: Error) => {
		console.log('Error: ', err.message);
	});

	startDetection = true;
}

async function sendState(state: string | number) {
	let message;
	if (typeof state === 'number') message = state.toString();
	else message = state;

	port.write(message, (err: Error) => {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		console.log('message written');
	});
}

async function loadModels() {
	await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
	await faceapi.loadFaceLandmarkModel(MODEL_URL);
	await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

async function detectStoredFaces() {
	labeledFaceDescriptors = await Promise.all(
		people.map(async (person) => {
			const imgUrl = person.getImage();
			const img = await faceapi.fetchImage(imgUrl);

			// detect the face with the highest score in the image and compute it's landmarks and face descriptor
			const fullFaceDescription = await faceapi
				.detectSingleFace(img)
				.withFaceLandmarks()
				// .withAgeAndGender()
				.withFaceDescriptor();

			if (!fullFaceDescription) {
				throw new Error(`No faces detected for ${person.getLabel()}`);
			}

			const faceDescriptors = [fullFaceDescription.descriptor];
			return new faceapi.LabeledFaceDescriptors(
				person.getLabel(),
				faceDescriptors
			);
		})
	).catch((error) => {
		console.error(error);
		return [];
	});
}

export const sketch: Sketch = (p5) => {
	p5.setup = async function () {
		await loadModels();
		await detectStoredFaces();

		p5.createCanvas(1280, 720);
		const constraints = {
			video: {
				mandatory: {
					minWidth: 1280,
					minHeight: 720,
				},
				optional: [{ maxFrameRate: 10 }],
			},
			audio: false,
		};

		capture = p5.createCapture(constraints, () => {});

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

		const faceMatcher = new faceapi.FaceMatcher(
			labeledFaceDescriptors,
			FACE_MATCHER_THRESHOLD
		);

		const results = faceDescriptions.map((fd) =>
			faceMatcher.findBestMatch(fd.descriptor)
		);

		p5.image(capture, 0, 0);

		results.forEach((bestMatch, i) => {
			const box = faceDescriptions[i].detection.box;
			const text = bestMatch.toString();

			p5.textSize(15);
			p5.strokeWeight(1);

			const textX = box.x + box.width;
			const textY = box.y + box.height;

			const textWidth = p5.textWidth(text);
			p5.text(text, textX, textY);

			p5.strokeWeight(4);
			p5.stroke(255, 0, 0);
			p5.rect(box.x, box.y, box.width, box.height);

			if (bestMatch.label == 'unknown') return;

			const person = people.find((p) => p.getLabel() === bestMatch.label);
			if (!person) return;

			if (
				bestMatch.label == previousLabel &&
				previousState == currentState
			)
				return;
			else {
				previousLabel = bestMatch.label;
				currentLabel = person.getLabel();
			}

			if (port) {
				sendState(person.getId());
			}

			previousState = currentState;
		});
	};
};
