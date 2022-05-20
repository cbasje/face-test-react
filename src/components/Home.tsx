import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch } from '../components/faceDetectionSketch';
import { useSocket } from '../contexts/SocketContext';

function Home() {
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
		<ReactP5Wrapper
			sketch={sketch}
			emitToSocket={(event: string, payload: any) => {
				socket?.emit(event, payload);
			}}
		/>
	);
}

export default Home;
