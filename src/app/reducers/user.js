const initialState = {
    userData: [],
    userDetail: {},
    actionPage: 'view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GETDATA':
            return {
                ...state,
                userData: action.userData,
            };
        case 'GETDETAIL':
            return {
                ...state,
                userDetail: action.userDetail,
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
