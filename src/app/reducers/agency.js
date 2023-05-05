const initialState = {
  agencyData: [],
  companyData: [],
  agencyDetail: {},
  hubSelected: {},
  hubData: [],
  actionPage: 'view',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        agencyData: action.agencyData,
        companyData: action.companyData,
        hubData: action.hubData
      };
    case 'GETSEARCHDATA':
      return {
        ...state,
        agencyData: action.agencyData
      };
    case 'GETSEARCHCOMPDATA':
      return {
        ...state,
        agencyData: action.agencyData,
        hubData: action.hubData
      };
    case 'GETHUBLISTDATA':
      return {
        ...state,
        hubData: action.hubData
      };
    case 'GETDETAIL':
      return {
        ...state,
        agencyDetail: action.agencyDetail,
        companyData: action.companyData
      };
    case 'SETACTION':
      return {
        ...state,
        actionPage: action.actionPage,
      };
    case 'SELECTHUB':
      return {
        ...state,
        hubSelected: action.hubSelected,
      };
    case 'GETDETAIL':
      return {
        ...state,
        agencyDetail: action.agencyDetail,
        companyData: action.companyData
      };
    default:
      return state;
  }
};

export default reducer;