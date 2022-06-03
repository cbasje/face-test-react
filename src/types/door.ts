export enum Door {
	Front = 'f',
	Back = 'b',
	Trunk = 't',
}

export const getDoorLabel = (door: Door) => {
	switch (door) {
		case Door.Front:
			return 'front door';
		case Door.Back:
			return 'back door';
		case Door.Trunk:
			return 'trunk';
	}
};
