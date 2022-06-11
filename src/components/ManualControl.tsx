import { Button, Grid } from '@mantine/core';
import { useRecoilValue } from 'recoil';
import { doorState } from '../atoms';
import { useSocket } from '../contexts/SocketContext';

function ManualControl() {
	const { openDoor, closeDoor } = useSocket();

	const door = useRecoilValue(doorState);

	return (
		<Grid grow justify="center">
			<Grid.Col span={6}>
				<Button
					onClick={() => openDoor(door)}
					style={{ width: '100%' }}
				>
					Open door
				</Button>
			</Grid.Col>
			<Grid.Col span={6}>
				<Button
					onClick={() => closeDoor(door)}
					style={{ width: '100%' }}
				>
					Close door
				</Button>
			</Grid.Col>
		</Grid>
	);
}

export default ManualControl;
