const initialState = {
  masterLevelList: [],
  masterHubList: [],
  masterAgencyList: [],
  orderItemData: [],
  actionPage: 'view',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ORDER_ITEM_DATA':
      return {
        ...state,
        orderItemData: action.orderItemData,
      };
    case 'MASTERHUB':
      return {
        ...state,
        masterHubList: action.masterHubList,
      };
    case 'MASTERAGENCY':
      return {
        ...state,
        masterAgencyList: action.masterAgencyList,
      };
    default:
      return state;
  }
};

export default reducer;
