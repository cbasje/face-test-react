import './App.css';
import {
	NotificationsProvider,
	showNotification,
} from '@mantine/notifications';
import { useSocket } from './contexts/SocketContext';
import { useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch } from './components/faceDetectionSketch';

function App() {
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
		<NotificationsProvider>
			<ReactP5Wrapper
				sketch={sketch}
				emitToSocket={(event: string, payload: any) => {
					socket?.emit(event, payload);
				}}
			/>
		</NotificationsProvider>
	);
}

export default App;
