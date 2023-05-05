const initialState = {
  agencyBankData: [],
  companyData: [],
  agencyBankDetail: {},
  actionPage: 'view',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        agencyBankData: action.agencyBankData,
        companyData: action.companyData
      };
    case 'GETSEARCHDATA':
      return {
        ...state,
        agencyBankData: action.agencyBankData
      };
    case 'GETDETAIL':
      return {
        ...state,
        agencyBankDetail: action.agencyBankDetail,
        companyData: action.companyData
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
