const initialState = {
  agencyTypeData: [],
  companyData: [],
  agencyTypeDetail: {},
  actionPage: 'view',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        agencyTypeData: action.agencyTypeData,
        companyData: action.companyData
      };
    case 'GETSEARCHDATA':
      return {
        ...state,
        agencyTypeData: action.agencyTypeData
      };
    case 'GETDETAIL':
      return {
        ...state,
        agencyTypeDetail: action.agencyTypeDetail,
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
