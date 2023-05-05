const initialState = {
  parcelTypeData: [],
  companyData: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        parcelTypeData: action.parcelTypeData,
        companyData: action.companyData,
      };
    default:
      return state;
  }
};

export default reducer;
