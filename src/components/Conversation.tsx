import {
	Button,
	Grid,
	NumberInput,
	SegmentedControl,
	Select,
	Stack,
	TextInput,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Door, getDoorLabel } from '../types/door';
import { Message } from '../types/message';
import { getObjectTypeLabel, ObjectType } from '../types/object';
import { messages as learningConversation } from '../util/learningConversation';
import { messages as trainingConversation } from '../util/trainingConversation';
import { messages as finalConversation } from '../util/finalConversation';

function Conversation() {
	const [name, setName] = useLocalStorage<string>({
		key: 'name',
		defaultValue: '',
	});
	const [height, setHeight] = useLocalStorage<number>({
		key: 'height',
		defaultValue: 0,
	});
	const [object, setObject] = useLocalStorage<ObjectType>({
		key: 'object',
		defaultValue: ObjectType.Baby,
	});
	const [door, setDoor] = useLocalStorage({
		key: 'door',
		defaultValue: Door.Front,
	});

	const [conv, setConv] = useLocalStorage<string>({
		key: 'conv',
		defaultValue: 'learn',
	});
	const [selectedMessage, setSelectedMessage] = useState(0);
	const [messages, setMessages] = useState(
		learningConversation(height, name)
	);

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

		if (!!message.callback) message.callback();
	};

	const resetMessages = () => {
		setSelectedMessage(0);
	};

	return (
		<Grid grow justify="center">
			<Grid.Col span={12}>
				<SegmentedControl
					value={conv}
					onChange={(value) => {
						setConv(value);
						resetMessages();

						if (value === 'learn') {
							setMessages(learningConversation(height, name));
						}
						if (value === 'train') {
							setMessages(
								trainingConversation(
									name,
									door,
									object,
									sendWelcome,
									closeDoor,
									openDoor
								)
							);
						}
						if (value === 'final') {
							setMessages(finalConversation());
						}
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
				{messages[selectedMessage].children?.map((child, index) => (
					<Button
						color={
							messages[child].preventSpeak ? 'pink' : 'primary'
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
					>
						Reset conversation
					</Button>
				)}
			</Stack>
		</Grid>
	);
}

export default Conversation;
