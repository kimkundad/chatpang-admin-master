const initialState = {
  settingAreaData: [],
  companyData: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        settingAreaData: action.settingAreaData,
        companyData: action.companyData,
      };
    default:
      return state;
  }
};

export default reducer;
