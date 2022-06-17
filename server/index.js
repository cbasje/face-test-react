const https = require('https');
const fs = require('fs');
const express = require('express');
const os = require('os');
const socketIo = require('socket.io');
const five = require('johnny-five');
const pixel = require('node-pixel');
const _ = require('lodash');
const { scheduler } = require('node:timers/promises');

const app = express();
const port = process.env.PORT || 3000;
const hostname = 'localhost';

const localIP =
	process.env.NODE_ENV !== 'production'
		? os.networkInterfaces().en0.find((a) => a.family === 'IPv4').address
		: undefined;

// Set up socket server
const key = fs.readFileSync('server/localhost-key.pem', 'utf-8');
const cert = fs.readFileSync('server/localhost.pem', 'utf-8');

const server = https.createServer({ key, cert }, app);
const io = new socketIo.Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
		transport: ['websocket'],
	},
});

// ENUM
const FRONT_DOOR = 'f';
const BACK_DOOR = 'b';
const TRUNK = 't';
const SIDE = 's';

// Pins
const PIN_SERVO_FRONT = 3;
const PIN_SERVO_BACK = 4;
const PIN_STRIP_SIDE = 5;
const PIN_STRIP_TRUNK = 6;

// Number of LEDs in strip
const NUM_LEDS_SIDE = 120;
const NUM_LEDS_TRUNK = 30;

const ledsFrontDoor = [0, 52];
const ledsBackDoor = [53, 120];

const subscribers = new Map();

const subscribe = (id, socket) => {
	if (subscribers.has(id)) {
		console.log(
			`Client with ID ${id} already connected. Disconnecting older client.`
		);
		unsubscribe(id);
	}
	subscribers.set(id, socket);
	console.log(`Connected to ${id}.`);
};

const unsubscribe = (id) => {
	subscribers.delete(id);
	console.log(`Disconnected from ${id}.`);
};

const TRUNK_TIMEOUT = 15 * 1000;

let frontDoor = null;
let trunk = null;
let sideStrip = null;

const board = new five.Board({ repl: false });
board.on('ready', function () {
	// Define our hardware
	frontDoor = new five.Servo({
		pin: PIN_SERVO_FRONT,
		range: [0, 180],
		startAt: 0,
	});
	trunk = new five.Motor({
		controller: 'GROVE_I2C_MOTOR_DRIVER',
		pin: 'A',
	});

	sideStrip = new pixel.Strip({
		board: this,
		controller: 'FIRMATA',
		strips: [{ pin: PIN_STRIP_SIDE, length: NUM_LEDS_SIDE }],
		gamma: 2.8,
	});
	trunkStrip = new pixel.Strip({
		board: this,
		controller: 'FIRMATA',
		strips: [{ pin: PIN_STRIP_TRUNK, length: NUM_LEDS_TRUNK }],
		gamma: 2.8,
	});

	trunk.on('forward', async () => {
		await scheduler.wait(TRUNK_TIMEOUT);
		trunk.stop();
	});

	trunk.on('reverse', async () => {
		await scheduler.wait(TRUNK_TIMEOUT);
		trunk.stop();
	});

	sideStrip.on('ready', function () {
		console.log("Strip ready, let's go");
	});

	const turnOnStripPartly = async (
		begin = 0,
		end = NUM_LEDS_SIDE,
		color = '#FFF',
		delay = 10
	) => {
		for (index = 0; index < NUM_LEDS_SIDE; index++) {
			if (index >= begin && index <= end) {
				sideStrip.pixel(index).color(color);
				sideStrip.show();

				await scheduler.wait(delay);
			} else {
				sideStrip.pixel(index).off();
				sideStrip.show();
			}
		}
	};
	const turnOnStrip = (color = '#FFF', strip = SIDE) => {
		if (strip === TRUNK) {
			trunkStrip.color(color);
			trunkStrip.show();
		} else {
			sideStrip.color(color);
			sideStrip.show();
		}
	};
	const turnOffStrip = () => {
		if (strip === TRUNK) {
			trunkStrip.off();
			// trunkStrip.show();
		} else {
			sideStrip.off();
			// sideStrip.show();
		}
	};

	const turnOnDoor = async (door) => {
		let begin, end;
		switch (door) {
			case FRONT_DOOR:
				[begin, end] = ledsFrontDoor;
				turnOnStripPartly(begin, end, '#FFF');
				break;
			case BACK_DOOR:
				[begin, end] = ledsBackDoor;
				turnOnStripPartly(begin, end, '#FFF');
				break;
			case TRUNK:
				turnOnStrip('#FFF', TRUNK);
				break;
		}
	};

	// Turn the Led on or off and update the state
	const openDoor = async (door, id) => {
		console.log(`Open door: ${door}`);

		turnOffStrip();
		turnOnDoor(door);
		await scheduler.wait(1000);

		switch (door) {
			case 'f':
				frontDoor.to(180);
				break;
			case 'b':
				break;
			case 't':
				trunk.fwd(255);
				break;
		}
	};

	const closeDoor = async (door, id) => {
		console.log(`Close door: ${door}`);

		turnOffStrip();
		await scheduler.wait(1000);

		switch (door) {
			case 'f':
				frontDoor.to(0);
				break;
			case 'b':
				break;
			case 't':
				trunk.rev(255);
				break;
		}
	};

	// Send a welcome to the user
	const sendWelcome = async (id) => {
		console.log(`Welcome`);
		// FIXME: Send welcome message
		// turnOnStrip('#ffffff');

		// await scheduler.wait(5000);
		// turnOffStrip();

		turnOnStrip('#FFF');
		await scheduler.wait(100);
		turnOffStrip();

		await scheduler.wait(200);

		turnOnStrip('#FFF');
		await scheduler.wait(100);
		turnOffStrip();
	};

	const sendLoading = async (id) => {
		console.log(`Loading`);

		const radius = 5;
		const begin = 0 - radius;
		const end = NUM_LEDS_SIDE + radius;
		const color = '#aaa';
		const delay = 25;

		for (index = begin; index <= end; index++) {
			for (let n = -radius; n <= radius; n++) {
				if (_.inRange(index - 6, 0, NUM_LEDS_SIDE))
					sideStrip.pixel(index - 6).off();
				if (_.inRange(index + n, 0, NUM_LEDS_SIDE))
					sideStrip.pixel(index + n).color(color);
			}

			sideStrip.show();
			await scheduler.wait(delay);
		}
	};

	const sendConfirmation = async (id) => {
		console.log(`Confirmation`);

		turnOnStrip('#153478');
		await scheduler.wait(100);
		turnOffStrip();

		await scheduler.wait(200);

		turnOnStrip('#153478');
		await scheduler.wait(100);
		turnOffStrip();
	};

	const startPairing = (id) => {
		console.log(`Start pairing`);

		sendLoading(id);
	};

	const stopPairing = (id) => {
		console.log(`Stop pairing`);

		turnOffStrip();
	};

	io.on('connection', (socket) => {
		const { id } = socket.handshake.query;
		console.log(`Connection: ${id}`);

		// Add subscriber for each new connection
		subscribe(id, socket);

		// Listener for event
		socket.on('send-open-door', (door) => {
			openDoor(door, id);
		});

		socket.on('send-close-door', (door) => {
			closeDoor(door, id);
		});

		socket.on('send-welcome', () => {
			sendWelcome(id);
		});

		socket.on('send-loading', () => {
			sendLoading(id);
		});

		socket.on('send-confirmation', () => {
			sendConfirmation(id);
		});

		socket.on('start-pairing', () => {
			startPairing(id);
		});

		socket.on('stop-pairing', () => {
			stopPairing(id);
		});

		// Clean up when client disconnects
		socket.on('disconnect', () => {
			unsubscribe(id);
		});
	});
});

app.get('/', (req, res) => {
	res.send(`Listening at https://${hostname}:${port}`);
});

// Start up server and log addresses for local and network
const startServer = () => {
	server.listen(port, '0.0.0.0', () => {
		console.log(`Listening at https://${hostname}:${port}`);
		if (localIP) console.log(`On Network at http://${localIP}:${port}`);
	});
};

startServer();
