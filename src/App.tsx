import './App.css';
import {
	NotificationsProvider,
	showNotification,
} from '@mantine/notifications';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import { useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch } from './components/faceDetectionSketch';
import { useLocalStorage } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';

function App() {
	const [id, setId] = useLocalStorage({ key: 'id', defaultValue: uuidv4() });

	const { socket } = useSocket();

	const addMessage = (message: string) => {
		console.log(message);
		showNotification({ message });
	};

	useEffect(() => {
		if (socket == null) return;

		socket.on('receive-message', addMessage);

		return () => {
			socket.off('receive-message');
		};
	}, [socket, addMessage]);

	return (
		<SocketProvider id={id}>
			<NotificationsProvider>
				<ReactP5Wrapper
					sketch={sketch}
					emitToSocket={(event: string, payload: any) => {
						socket?.emit(event, payload);
					}}
				/>
			</NotificationsProvider>
		</SocketProvider>
	);
}

export default App;
