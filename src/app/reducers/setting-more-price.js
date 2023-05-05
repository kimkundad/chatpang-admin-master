const initialState = {
  settingMorePriceData: [],
  companyData: [],
  actionPage: 'view',
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        settingMorePriceData: action.settingMorePriceData,
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
