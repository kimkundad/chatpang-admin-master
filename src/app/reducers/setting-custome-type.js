const initialState = {
  settingCustomeType: [],
  companyData: [],
  actionPage: 'view',
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        settingCustomeType: action.settingCustomeType,
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
