import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch, resetState } from './faceDetectionSketch';

function Home() {
	// const { socket } = useSocket();

	// const sendState = (state: string) => {
	// 	socket?.emit('send-state', state);
	// 	addMessage(newMessage);
	// };

	return (
		<div>
			<button onClick={resetState}>Reset state</button>
			<ReactP5Wrapper sketch={sketch} />
		</div>
	);
}

export default Home;
