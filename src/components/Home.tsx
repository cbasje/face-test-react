import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch } from '../components/faceDetectionSketch';
import { useSocket } from '../contexts/SocketContext';

function Home() {
	const { socket } = useSocket();

	const speakName = (text: string, lang: string = 'en-GB') => {
		if ('speechSynthesis' in window) {
			let utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = lang;
			window.speechSynthesis.speak(utterance);
		} else {
			console.error('Browser not supported');
		}
	};

	const addMessage = (message: string) => {
		speakName(message);

		showNotification({
			disallowClose: true,
			autoClose: 5000,
			// title: "You've been compromised",
			message,
			color: 'red',
			// icon: <Cross1Icon />,
		});
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
