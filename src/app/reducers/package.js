const initialState = {
    packageData: [],
    packageDetail: {},
    actionPage: 'view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GETDATA':
            return {
                ...state,
                packageData: action.packageData,
            };
        case 'GETDETAIL':
            return {
                ...state,
                packageDetail: action.packageDetail,
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
