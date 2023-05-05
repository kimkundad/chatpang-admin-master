const initialState = {
  actionModal: 'view',
  masterTransportationType: [],
  masterPaymentType: [],
  customerDetail: {},
  draftData: {},
  flagHeader: false,
  flagButtonHeader: false,
  agencyCodList: [],
  agencyDiscountList: [],
  itemTypeTrans: false,
  orderDetail: {},
  parcelTypeData: [],
  detailPrintOrder: null,
  itemCount: 0,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ACTIONMODAL':
      return {
        ...state,
        actionModal: action.actionModal,
      };
    case 'SETITEMCOUNT':
      return {
        ...state,
        itemCount: action.itemCount,
      };
    case 'SETMASTERTRANTYPE':
      return {
        ...state,
        masterTransportationType: action.masterTransportationType,
      };
    case 'SETMASTERPAYMENTTYPE':
      return {
        ...state,
        masterPaymentType: action.masterPaymentType,
      };
    case 'GETCUSTOMERDETAIL':
      return {
        ...state,
        customerDetail: action.customerDetail,
      };
    case 'GETDRAFT':
      return {
        ...state,
        draftData: action.draftData,
      };
    case 'SETFLAGHEADER':
      return {
        ...state,
        flagHeader: action.flagHeader,
      };
    case 'SETFLAGBUTTONHEADER':
      return {
        ...state,
        flagButtonHeader: action.flagButtonHeader,
      };
    case 'SETAGENCYCOD':
      return {
        ...state,
        agencyCodList: action.agencyCodList,
      };
    case 'SETAGENCYDIS':
      return {
        ...state,
        agencyDiscountList: action.agencyDiscountList,
      };
    case 'CHECKEX':
      return {
        ...state,
        itemTypeTrans: action.itemTypeTrans,
      };
    case 'SETDETAILPRINTORDER':
      return {
        ...state,
        detailPrintOrder: action.detailPrintOrder,
      };
    case 'SETORDERDETAIL':
      return {
        ...state,
        orderDetail: action.orderDetail,
      };
    case 'SET_PARCEL_DATA':
      return {
        ...state,
        parcelTypeData: action.parcelTypeData,
      };
    default:
      return state;
  }
};

export default reducer;
