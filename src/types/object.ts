export enum ObjectType {
	Baby = 'baby',
	Grocery = 'grocery',
	Box = 'box',
	Purse = 'purse',
}

export const getObjectTypeLabel = (type: ObjectType) => {
	switch (type) {
		case ObjectType.Baby:
			return 'a baby seat';
		case ObjectType.Grocery:
			return 'groceries';
		case ObjectType.Box:
			return 'a big box';
		case ObjectType.Purse:
			return 'a purse';
	}
};
