import './App.css';

import { ReactP5Wrapper } from 'react-p5-wrapper';
import {
	sketch,
	requestPort,
	resetState,
	closePort,
} from './faceDetectionSketch';

function App() {
	return (
		<div>
			<button onClick={requestPort}>Get port</button>
			<button onClick={closePort}>Close port</button>
			<button onClick={resetState}>Reset state</button>
			<ReactP5Wrapper sketch={sketch} />
		</div>
	);
}

export default App;
