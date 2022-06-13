import { Button, Grid, Select, Stack, Title } from '@mantine/core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { doorState } from '../store/atoms';
import { useSocket } from '../contexts/SocketContext';
import { Door, getDoorLabel } from '../types/door';

function ManualControl() {
	const { openDoor, closeDoor } = useSocket();

	const [door, setDoor] = useRecoilState(doorState);

	return (
		<Stack>
			<Title order={2}>Manual control</Title>

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
						Open {getDoorLabel(door)}
					</Button>
				</Grid.Col>
				<Grid.Col span={6}>
					<Button
						onClick={() => closeDoor(door)}
						style={{ width: '100%' }}
					>
						Close {getDoorLabel(door)}
					</Button>
				</Grid.Col>
			</Grid>
		</Stack>
	);
}

export default ManualControl;
