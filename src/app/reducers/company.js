const initialState = {
	companyData: [],
	companyDetail: {},
	adminDetail: {},
	actionPage: 'view',
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GETDATA':
			return {
				...state,
				companyData: action.companyData,
			};
		case 'GETDETAIL':
			return {
				...state,
				companyDetail: action.companyDetail,
				adminDetail: action.adminDetail,
			};
		case 'SETNEWCOMPANY':
			return {
				...state,
				companyDetail: action.companyDetail,
			};
		case 'SETNEWADMIN':
			return {
				...state,
				adminDetail: action.adminDetail,
			};
		case 'SETACTION':
			return {
				...state,
				actionPage: action.actionPage,
			};
		default:
			return state;
	}
};

export default reducer;
