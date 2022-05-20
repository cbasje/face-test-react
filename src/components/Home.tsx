import { useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch, resetState, updateStateFromUI } from './faceDetectionSketch';

function Home() {
	const [url, setUrl] = useState('');

	return (
		<div>
			<div style={{ margin: '1rem', display: 'flex', gap: '2rem' }}>
				<button onClick={resetState}>Reset state</button>
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					<button onClick={() => updateStateFromUI(1)}>Send 1</button>
					<button onClick={() => updateStateFromUI(2)}>Send 2</button>
					<button id="snap">Snap</button>
				</div>
			</div>
			<ReactP5Wrapper sketch={sketch} />
		</div>
	);
}

export default Home;
