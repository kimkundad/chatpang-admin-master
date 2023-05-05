const initialState = {
  sellOrderData: [],
  masterStatus: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELL_ORDER_DATA':
      return {
        ...state,
        sellOrderData: action.sellOrderData,
      };
    case 'SET_MASTER_STATUS':
      return {
        ...state,
        masterStatus: action.masterStatus,
      };
    default:
      return state;
  }
};

export default reducer;
