import { createContext, useContext } from 'react';
import io, { Socket } from 'socket.io-client';

const SocketContext = createContext({
	socket: undefined as Socket | undefined,
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
	const url = import.meta.env.DEV
		? 'https://localhost:3000/'
		: 'https://face-test-cbasje.herokuapp.com/';
	const socket = io(url, {
		transports: ['websocket', 'polling'],
		query: { id },
	});

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
}
