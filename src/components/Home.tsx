import { AppShell, Container, Stack, Tabs, Title } from '@mantine/core';
import Conversation from './Conversation';
import ManualControl from './ManualControl';

function Home() {
	return (
		<AppShell styles={{ main: { height: '100vh' } }}>
			<Container size="xs">
				<Tabs grow position="center">
					<Tabs.Tab label="Conversation">
						<Conversation />
					</Tabs.Tab>
					<Tabs.Tab label="Manual control">
						<ManualControl />
					</Tabs.Tab>
				</Tabs>
			</Container>
		</AppShell>
	);
}

export default Home;
