const initialState = {
  manageDriverData: [],
  companyData: [],
  hubData: [],
  actionPage: 'view',
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        manageDriverData: action.manageDriverData,
        companyData: action.companyData,
        hubData: action.hubData,
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
