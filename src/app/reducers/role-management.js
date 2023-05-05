const initialState = {
  masterPageList: [],
  masterHubList: [],
  masterAgencyList: [],
  masterRoleList: [],
  roleData: [],
  roleDetail: {},
  actionPage: 'view',
  expandList: [],
  checkList: [],
  dataList: [],
  resultList: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GETROLEDATA':
      return {
        ...state,
        roleData: action.roleData,
      };
    case 'GETROLEDETAIL':
      return {
        ...state,
        roleDetail: action.roleDetail,
      };
    case 'MASTERPAGE':
      return {
        ...state,
        masterPageList: action.masterPageList,
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
    case 'SETEXPAND':
      return {
        ...state,
        expandList: action.expandList,
      }; case 'SETCHECKLIST':
      return {
        ...state,
        checkList: action.checkList,
      }; case 'SETDATALIST':
      return {
        ...state,
        dataList: action.dataList,
      }; case 'SETRESULT':
      return {
        ...state,
        resultList: action.resultList,
      };
    default:
      return state;
  }
};

export default reducer;
