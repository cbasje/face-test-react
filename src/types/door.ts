export enum Door {
	Front = 'f',
	Back = 'b',
	Trunk = 't',
}

export const getDoorLabel = (door: Door) => {
	switch (door) {
		case Door.Front:
			return "driver's door";
		case Door.Back:
			return 'door to the back seat';
		case Door.Trunk:
			return 'trunk';
	}
};
