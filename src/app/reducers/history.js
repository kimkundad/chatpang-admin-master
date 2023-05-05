const initialState = {
    historyData: [],
    historyDetail: {},
    actionPage: 'view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GETDATA':
            return {
                ...state,
                historyData: action.historyData,
            };
        case 'GETDETAIL':
            return {
                ...state,
                historyDetail: action.historyDetail,
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
