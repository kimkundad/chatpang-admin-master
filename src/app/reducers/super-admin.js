const initialState = {
	superAdminData: [],
	superAdminDetail: {},
	actionPage: 'view',
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GETDATA':
			return {
				...state,
				superAdminData: action.superAdminData,
			}
		case 'GETDETAIL':
			return {
				...state,
				superAdminDetail: action.superAdminDetail,
			}
		case 'SETACTION':
			return {
				...state,
				actionPage: action.actionPage,
			}
		default:
			return state
	}
}

export default reducer
