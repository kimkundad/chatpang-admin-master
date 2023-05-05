const initialState = {
  storeCustomeData: [],
  storeCustomerDetail: {},
  companyData: [],
  actionPage: 'view',
  customerType: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETDATA':
      return {
        ...state,
        storeCustomeData: action.storeCustomeData,
      };
    case 'GETDETAIL':
      return {
        ...state,
        storeCustomerDetail: action.storeCustomerDetail,
      }; case 'GETCSTYPE':
      return {
        ...state,
        customerType: action.customerType,
        // companyData: action.companyData,
      };
    case 'GETCOM':
      return {
        ...state,
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
