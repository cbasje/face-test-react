import './App.css';

import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch, getPorts } from './faceDetectionSketch';

function App() {
	return (
		<div>
			<button onClick={getPorts}>Get ports</button>
			<ReactP5Wrapper sketch={sketch} />
		</div>
	);
}

export default App;
