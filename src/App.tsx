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

	useEffect(() => {
		socket?.on('receive-message', (message: string) => {
			console.log(message);
			showNotification({ message });
		});

		return () => {
			socket?.off('receive-message');
		};
	}, [socket]);

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
