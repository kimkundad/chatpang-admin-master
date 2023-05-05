const initialState = {
	isLoading: false,
	collapsedSider: false,
	selectedKey: [],
	openKey: [],
	isMobile: false,
	selectedHeaderKey: [],
	socket: null,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOADING':
			return {
				...state,
				isLoading: action.isLoading,
			};
		case 'SET_SOCKET':
			return {
				...state,
				socket: action.socket,
			};
		case 'SELECTEDKEY':
			return {
				...state,
				selectedKey: action.selectedKey,
			};
		case 'SELECTEDHEADERKEY':
			return {
				...state,
				selectedHeaderKey: action.selectedHeaderKey,
			};
		case 'OPENKEY':
			return {
				...state,
				openKey: action.openKey,
			};
		case 'COLLAPSED':
			return {
				...state,
				collapsedSider: action.collapsedSider,
			};
		case 'ISMOBILE':
			return {
				...state,
				isMobile: action.isMobile,
			};
		default:
			return state;
	}
};

export default reducer;
