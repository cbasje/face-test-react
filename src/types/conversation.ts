export enum ConversationType {
	Introduction = 'intro',
	ObjectFail = 'object',
	DirtyCamera = 'cam',
	FaceFail = 'face',
	Final = 'final',
}

export const getConversationTypeLabel = (conversation: ConversationType) => {
	switch (conversation) {
		case ConversationType.Introduction:
			return 'Intro';
		case ConversationType.ObjectFail:
			return 'Object fail';
		case ConversationType.DirtyCamera:
			return 'Dirty camera';
		case ConversationType.FaceFail:
			return 'Face fail';
		case ConversationType.Final:
			return 'Final';
	}
};
