const initialState = {
  masterHubList: [],
  masterAgencyList: [],
  transportationOrderData: [],
  actionPage: 'view',
  // sumOrderItem: null,
  transportationOrderDetail: null,
  activeDriverList: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TRANSPORTATION_ORDER_DATA':
      return {
        ...state,
        transportationOrderData: action.transportationOrderData,
      };
    case 'SET_TRANSPORTATION_ORDER_DETAIL':
      return {
        ...state,
        transportationOrderDetail: action.transportationOrderDetail,
      };
    // case 'SET_SUM_ORDER_ITEM':
    //   return {
    //     ...state,
    //     sumOrderItem: action.sumOrderItem,
    //   };
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
    case 'SET_ACTIVE_DRIVER':
      return {
        ...state,
        activeDriverList: action.activeDriverList,
      };
    default:
      return state;
  }
};

export default reducer;
