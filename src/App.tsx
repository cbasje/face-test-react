import './App.css';
import { NotificationsProvider } from '@mantine/notifications';
import { SocketProvider } from './contexts/SocketContext';
import { useLocalStorage } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import Home from './components/Home';

function App() {
	const [id, setId] = useLocalStorage({ key: 'id', defaultValue: uuidv4() });

	return (
		<NotificationsProvider>
			<SocketProvider id={id}>
				<Home />
			</SocketProvider>
		</NotificationsProvider>
	);
}

export default App;
