import { Button, Grid, Select } from '@mantine/core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { doorState } from '../atoms';
import { useSocket } from '../contexts/SocketContext';
import { Door, getDoorLabel } from '../types/door';

function ManualControl() {
	const { openDoor, closeDoor } = useSocket();

	const [door, setDoor] = useRecoilState(doorState);

	return (
		<Grid grow justify="center">
			<Grid.Col span={12}>
				<Select
					label="Door"
					value={door}
					onChange={(e) => setDoor(e as Door)}
					data={Object.values(Door).map((d) => ({
						value: d,
						label: getDoorLabel(d),
					}))}
				/>
			</Grid.Col>
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
