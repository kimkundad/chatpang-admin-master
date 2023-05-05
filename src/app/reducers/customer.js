const initialState = {
	customerData: [],
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GETDATA':
			return {
				...state,
				customerData: action.customerData,
			}
		default:
			return state
	}
}

export default reducer
