const initialState = {
  hubData: [],
  companyData: [],
  hubDetail: {},
  actionPage: 'view',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        hubData: action.hubData,
        companyData: action.companyData
      };
    case 'GETSEARCHDATA':
      return {
        ...state,
        hubData: action.hubData
      };
    case 'GETDETAIL':
      return {
        ...state,
        hubDetail: action.hubDetail,
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
