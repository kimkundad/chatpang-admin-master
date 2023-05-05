const initialState = {
  reportBalanceData: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_REPORT_BALANCE':
      return {
        ...state,
        reportBalanceData: action.reportBalanceData,
      };
    default:
      return state;
  }
};

export default reducer;
