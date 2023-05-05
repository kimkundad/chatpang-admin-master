const initialState = {
    lineData: [],
    lineDetail: {},
    actionPage: 'view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GETDATA':
            return {
                ...state,
                lineData: action.lineData,
            };
        case 'GETDETAIL':
            return {
                ...state,
                lineDetail: action.lineDetail,
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
