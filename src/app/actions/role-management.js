import { fetch } from '../../utils/fetch';

const getMasterPage = (roleLevel) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/master/page',
      query: { roleLevel },
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setMasterPage(res.data.data));
          dispatch(onLoading(false));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
const getHubList = (query) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/hub/dropdown',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setHubList(res.data.data));
          dispatch(onLoading(false));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
const getAgencyList = (query) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/agency/dropdown',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setAgencyList(res.data.data));
          dispatch(onLoading(false));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
const getMasterRole = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/role',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setRoleList(res.data.data));
          dispatch(onLoading(false));
          resolve(true);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getRoleData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/role',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setRoleData(res.data.data));
          dispatch(onLoading(false));
          resolve(true);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getRoleDetail = (roleId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/role/${roleId}`,
      // query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setRoleDetail(res.data.data));
          dispatch(onLoading(false));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const createRoleManagementDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/role',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(onLoading(false));
          resolve(true);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const updateRoleManagementDetail = (roleId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/role/${roleId}`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(onLoading(false));
          resolve(true);
        } else {
          console.log('eee', res.data);
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const deleteRoleManagementDetail = (roleId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/role/${roleId}`,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(onLoading(false));
          resolve(true);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const setActionPage = (value) => ({
  type: 'SETACTION',
  actionPage: value,
});

const setMasterPage = (data) => ({
  type: 'MASTERPAGE',
  masterPageList: data,
});

const setHubList = (data) => ({
  type: 'MASTERHUB',
  masterHubList: data,
});

const setAgencyList = (data) => ({
  type: 'MASTERAGENCY',
  masterAgencyList: data,
});

const setRoleList = (data) => ({
  type: 'MASTERROLE',
  masterRoleList: data,
});

const setRoleData = (data) => ({
  type: 'GETROLEDATA',
  roleData: data,
});

const setRoleDetail = (data) => ({
  type: 'GETROLEDETAIL',
  roleDetail: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});
const setExpandList = (data) => ({
  type: 'SETEXPAND',
  expandList: data,
});
const setCheckList = (data) => ({
  type: 'SETCHECKLIST',
  checkList: data,
});
const setDataList = (data) => ({
  type: 'SETDATALIST',
  dataList: data,
});

const setResultList = (data) => ({
  type: 'SETRESULT',
  resultList: data,
});

export default {
  setActionPage,
  getMasterPage,
  getMasterRole,
  getHubList,
  getAgencyList,
  getRoleData,
  getRoleDetail,
  createRoleManagementDetail,
  updateRoleManagementDetail,
  deleteRoleManagementDetail,
  setExpandList,
  setCheckList,
  setDataList,
  setResultList,
};
