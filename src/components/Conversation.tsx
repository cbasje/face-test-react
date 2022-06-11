import {
	ActionIcon,
	Button,
	Grid,
	Group,
	NumberInput,
	SegmentedControl,
	Select,
	Stack,
	TextInput,
	Title,
} from '@mantine/core';
import { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Door, getDoorLabel } from '../types/door';
import { Message } from '../types/message';
import { getObjectTypeLabel, ObjectType } from '../types/object';
import { ConversationType } from '../types/conversation';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	conversationState,
	doorState,
	heightState,
	nameState,
	objectState,
} from '../store/atoms';
import { messagesState } from '../store/selectors';
import { ArrowClockwise } from 'phosphor-react';

function Conversation() {
	const [selectedMessage, setSelectedMessage] = useState(0);

	const [conv, setConv] = useRecoilState(conversationState);
	const [name, setName] = useRecoilState(nameState);
	const [height, setHeight] = useRecoilState(heightState);
	const [object, setObject] = useRecoilState(objectState);
	const [door, setDoor] = useRecoilState(doorState);

	const messages = useRecoilValue(messagesState);

	const { openDoor, closeDoor, sendWelcome } = useSocket();

	const speakMessage = (text: string, lang: string = 'en-GB') => {
		if ('speechSynthesis' in window) {
			let utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = lang;
			window.speechSynthesis.speak(utterance);
		} else {
			console.error('Browser not supported');
		}
	};

	const clickMessage = (message: Message) => {
		setSelectedMessage(message.id);
		if (!message.preventSpeak) speakMessage(message.text);

		if (!!message.callback) {
			switch (message.callback.functionName) {
				case 'sendWelcome':
					sendWelcome();
					break;
				case 'openDoor':
					openDoor(
						message.callback.args
							? (message.callback.args[0] as Door)
							: door
					);
					break;
				case 'changeDoor':
					if (message.callback.args) {
						const newDoor = message.callback.args[0] as Door;
						setDoor(newDoor);

						if (newDoor !== door) {
							closeDoor(door);
							speakMessage(
								'Switching to the ' + getDoorLabel(newDoor)
							);
							openDoor(newDoor);
						}
					}

					break;
				case 'closeDoor':
					openDoor(
						message.callback.args
							? (message.callback.args[0] as Door)
							: door
					);
					break;
				case 'sendLoading':
					break;
				case 'sendConfirmation':
					break;
				case 'startPairing':
					break;
				default:
					console.warn('Unsupported callback function');
					break;
			}
		}
	};

	const resetMessages = () => {
		setSelectedMessage(0);
	};

	return (
		<Stack>
			<Title order={2}>Conversation controls</Title>

			<Grid grow justify="center">
				<Grid.Col span={12}>
					<SegmentedControl
						value={conv}
						onChange={(value) => {
							setConv(value as ConversationType);
							resetMessages();
						}}
						data={[
							{ label: 'Learning', value: 'learn' },
							{ label: 'Training', value: 'train' },
							{ label: 'Final', value: 'final' },
						]}
					/>
				</Grid.Col>

				<Grid.Col span={6}>
					<TextInput
						placeholder="Name"
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<NumberInput
						placeholder="Height"
						label="Height"
						value={height}
						onChange={(e) => setHeight(e!)}
						min={150}
						max={220}
						required
					/>
				</Grid.Col>

				<Grid.Col span={6}>
					<Select
						label="Object detected"
						value={object}
						onChange={(e) => setObject(e as ObjectType)}
						data={Object.values(ObjectType).map((o) => ({
							value: o,
							label: getObjectTypeLabel(o),
						}))}
					/>
				</Grid.Col>

				<Grid.Col span={6}>
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

				<Stack
					styles={(theme) => ({
						root: {
							marginTop: theme.spacing.xl,
							padding: theme.spacing.xs,
							width: '100%',
						},
					})}
				>
					<Group position="apart">
						<Title order={4}>Conversation</Title>

						<ActionIcon
							title="Repeat previous message"
							color="gray"
							onClick={() => {
								const msg = messages[selectedMessage];
								if (!msg.preventSpeak) speakMessage(msg.text);
							}}
						>
							<ArrowClockwise size={20} weight="bold" />
						</ActionIcon>
					</Group>

					{messages[selectedMessage].children?.map((child, index) => (
						<Button
							color={
								messages[child].preventSpeak
									? 'pink'
									: 'primary'
							}
							styles={(theme) => ({
								root: {
									width: '100%',
									height: 'auto',
									paddingBlock: theme.spacing.xs,
									lineHeight: 'normal',
								},
								label: { whiteSpace: 'normal' },
							})}
							onClick={() => clickMessage(messages[child])}
							key={messages[child].id}
						>
							{messages[child].text}
						</Button>
					))}

					{!messages[selectedMessage].children && (
						<Button
							color="gray"
							type="reset"
							onClick={() => resetMessages()}
							leftIcon={
								<ArrowClockwise size={20} weight="bold" />
							}
						>
							Reset conversation
						</Button>
					)}
				</Stack>
			</Grid>
		</Stack>
	);
}

export default Conversation;
