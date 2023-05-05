const initialState = {
  reportCodData: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_REPORT_COD':
      return {
        ...state,
        reportCodData: action.reportCodData,
      };
    default:
      return state;
  }
};

export default reducer;
