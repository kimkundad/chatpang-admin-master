const initialState = {
  masterLevelList: [],
  orderItemStoreData: [],
  actionPage: 'view',
  masterItemStatus: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ORDER_ITEM_STORE_DATA':
      return {
        ...state,
        orderItemStoreData: action.orderItemStoreData,
      };
    case 'MASTER_ITEM_STATUS':
      return {
        ...state,
        masterItemStatus: action.masterItemStatus,
      };
    default:
      return state;
  }
};

export default reducer;
