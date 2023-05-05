const initialState = {
  masterHubList: [],
  orderData: [],
  orderItemData: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ORDER_DATA':
      return {
        ...state,
        orderData: action.orderData,
      };
    case 'SET_ORDER_ITEM_SSO':
      return {
        ...state,
        orderItemData: action.orderItemData,
      };

    case 'MASTERHUB':
      return {
        ...state,
        masterHubList: action.masterHubList,
      };
    default:
      return state;
  }
};

export default reducer;
