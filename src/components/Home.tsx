import { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Message } from '../types/message';
import { messages as learningConversation } from '../util/learningConversation';
import { messages as trainingConversation } from '../util/trainingConversation';
import { messages as finalConversation } from '../util/finalConversation';
import { getObjectTypeLabel, ObjectType } from '../types/object';
import { Door, getDoorLabel } from '../types/door';
import { useLocalStorage } from '@mantine/hooks';

function Home() {
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
		<div className="container">
			<button
				onClick={() => {
					resetMessages();
					setMessages(learningConversation(height, name));
				}}
			>
				Learning
			</button>
			<button
				onClick={() => {
					resetMessages();
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
				}}
			>
				Training
			</button>
			<button
				onClick={() => {
					resetMessages();
					setMessages(finalConversation());
				}}
			>
				Final
			</button>
			<div className="instellingen">
				<div className="input-group">
					<label htmlFor="name">Name</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Name"
					/>
				</div>

				<div className="input-group">
					<label htmlFor="height">Height</label>
					<input
						id="height"
						type="number"
						value={height}
						onChange={(e) => setHeight(Number(e.target.value))}
						pattern="[0-9]*"
						placeholder="Height"
					/>
				</div>

				<div className="input-group">
					<label htmlFor="object">Object</label>
					<select
						id="object"
						value={object}
						onChange={(e) =>
							setObject(e.target.value as ObjectType)
						}
					>
						{Object.values(ObjectType).map((o) => (
							<option key={o} value={o}>
								{getObjectTypeLabel(o)}
							</option>
						))}
					</select>
				</div>

				<div className="input-group">
					<label htmlFor="door">Door</label>
					<select
						id="door"
						value={door}
						onChange={(e) => setDoor(e.target.value as Door)}
					>
						{Object.values(Door).map((d) => (
							<option key={d} value={d}>
								{getDoorLabel(d)}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="messages">
				{messages[selectedMessage].children?.map((child, index) => (
					<button
						onClick={() => clickMessage(messages[child])}
						key={messages[child].id}
						data-prevent-speak={messages[child].preventSpeak}
					>
						{messages[child].text}
					</button>
				))}

				{!messages[selectedMessage].children && (
					<button type="reset" onClick={() => resetMessages()}>
						Reset
					</button>
				)}
			</div>
		</div>
	);
}

export default Home;
