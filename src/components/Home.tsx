import { AppShell, Container, Stack, Tabs, Title } from '@mantine/core';
import Conversation from './Conversation';
import ManualControl from './ManualControl';

function Home() {
	return (
		<AppShell styles={{ main: { height: '100vh' } }}>
			<Container size="xs">
				<Tabs grow position="center">
					<Tabs.Tab label="Conversation">
						<Stack>
							<Title order={3}>Conversation</Title>

							<Conversation />
						</Stack>
					</Tabs.Tab>
					<Tabs.Tab label="Manual control">
						<Stack>
							<Title order={3}>Manual control</Title>

							<ManualControl />
						</Stack>
					</Tabs.Tab>
				</Tabs>
			</Container>
		</AppShell>
	);
}

export default Home;
