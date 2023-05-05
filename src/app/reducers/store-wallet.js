const initialState = {
  storeWalletData: [],
  masterPaymentType: [],
  agencyWallet: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WALLET_DATA':
      return {
        ...state,
        storeWalletData: action.storeWalletData,
      };
    case 'SET_MASTER_PAYMENT_TYPE':
      return {
        ...state,
        masterPaymentType: action.masterPaymentType,
      };
    case 'SET_AGENCY_WALLET':
      return {
        ...state,
        agencyWallet: action.agencyWallet,
      };
    default:
      return state;
  }
};

export default reducer;
