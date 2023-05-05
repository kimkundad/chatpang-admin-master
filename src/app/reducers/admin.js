const initialState = {
    adminData: [],
    adminDetail: {},
    actionPage: 'view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GETDATA':
            return {
                ...state,
                adminData: action.adminData,
            };
        case 'GETDETAIL':
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
