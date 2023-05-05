const initialState = {
  agencyLevelData: [],
  companyData: [],
  agencyLevelDetail: {},
  actionPage: 'view',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        agencyLevelData: action.agencyLevelData,
        companyData: action.companyData,
      };
    case 'GETSEARCHDATA':
      return {
        ...state,
        agencyLevelData: action.agencyLevelData,
      };
    case 'GETDETAIL':
      return {
        ...state,
        agencyLevelDetail: action.agencyLevelDetail,
        companyData: action.companyData,
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
