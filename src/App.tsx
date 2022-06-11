import './App.css';
import { SocketProvider } from './contexts/SocketContext';
import { MantineProvider, useMantineTheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { RecoilRoot } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import Home from './components/Home';

function App() {
	const theme = useMantineTheme();
	const [id, setId] = useLocalStorage({ key: 'id', defaultValue: uuidv4() });

	return (
		<RecoilRoot>
			<MantineProvider
				theme={{
					colors: { brand: theme.colors.blue },
					primaryColor: 'brand',
				}}
			>
				<SocketProvider id={id}>
					<Home />
				</SocketProvider>
			</MantineProvider>
		</RecoilRoot>
	);
}

export default App;
