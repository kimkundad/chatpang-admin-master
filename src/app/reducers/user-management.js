const initialState = {
  masterLevelList: [],
  masterHubList: [],
  masterAgencyList: [],
  masterRoleList: [],
  userData: [],
  userDetail: {},
  actionPage: 'view',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETUSERDATA':
      return {
        ...state,
        userData: action.userData,
      };
    case 'GETUSERDETAIL':
      return {
        ...state,
        userDetail: action.userDetail,
      };
    case 'MASTERLEVEL':
      return {
        ...state,
        masterLevelList: action.masterLevelList,
      };
    case 'MASTERHUB':
      return {
        ...state,
        masterHubList: action.masterHubList,
      };
    case 'MASTERAGENCY':
      return {
        ...state,
        masterAgencyList: action.masterAgencyList,
      };
    case 'MASTERROLE':
      return {
        ...state,
        masterRoleList: action.masterRoleList,
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
