import { ReactP5Wrapper } from 'react-p5-wrapper';
import { sketch } from './faceDetectionSketch';

function Home() {
	return <ReactP5Wrapper sketch={sketch} />;
}

export default Home;
