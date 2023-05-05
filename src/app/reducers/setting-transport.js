const initialState = {
  settingTransportData: [],
  columns: [],
  companyData: [],
  calculatePrice: [],
  effectiveAt: null,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        settingTransportData: action.settingTransportData,
        columns: action.columns,
        companyData: action.companyData,
      };
    case 'CALCULATE':
      return {
        ...state,
        calculatePrice: action.calculatePrice,
      };
    case 'SET_EFFECTIVE_DATE':
      return {
        ...state,
        effectiveAt: action.effectiveAt,
      };
    default:
      return state;
  }
};

export default reducer;
