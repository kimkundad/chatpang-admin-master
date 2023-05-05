const initialState = {
    reviewData: [],
    reviewDetail: {},
    actionPage: 'view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GETDATA':
            return {
                ...state,
                reviewData: action.reviewData,
            };
        case 'GETDETAIL':
            return {
                ...state,
                reviewDetail: action.reviewDetail,
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
