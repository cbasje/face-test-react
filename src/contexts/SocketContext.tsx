import { createContext, useContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { Door } from '../types/door';

const SocketContext = createContext({
	socket: undefined as Socket | undefined,
	openDoor: (door: Door) => {},
	closeDoor: (door: Door) => {},
	sendWelcome: () => {},
});

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const url = 'https://localhost:3000/';
	const socket = io(url, {
		transports: ['websocket', 'polling'],
		query: { id },
	});

	const openDoor = (door: Door) => {
		socket.emit('send-open-door', door);
	};

	const closeDoor = (door: Door) => {
		socket.emit('send-close-door', door);
	};

	const sendWelcome = () => {
		socket.emit('send-welcome');
	};

	return (
		<SocketContext.Provider
			value={{ socket, openDoor, closeDoor, sendWelcome }}
		>
			{children}
		</SocketContext.Provider>
	);
}
