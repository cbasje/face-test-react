import './App.css';
import { NotificationsProvider } from '@mantine/notifications';
import Home from './components/Home';

function App() {
	return (
		<NotificationsProvider>
			<Home />
		</NotificationsProvider>
	);
}

export default App;
