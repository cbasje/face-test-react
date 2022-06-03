import './App.css';
import { SocketProvider } from './contexts/SocketContext';
import { useLocalStorage } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import Home from './components/Home';

function App() {
	const [id, setId] = useLocalStorage({ key: 'id', defaultValue: uuidv4() });

	return (
		<SocketProvider id={id}>
			<Home />
		</SocketProvider>
	);
}

export default App;
