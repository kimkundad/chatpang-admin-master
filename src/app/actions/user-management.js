import { fetch } from '../../utils/fetch';

const getMeDetail = () => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/users/me',
    })
      .then(async (res) => {
        if (res.data.success) {
          dispatch(setUserDetail(res.data.data));
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

const updatePassword = (newPassword) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: '/users/me/change-password',
      data: newPassword,
    })
      .then(async (res) => {
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

const getMasterLevel = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/master/level',
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setMasterLevel(res.data.data));
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

const getUserData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/users',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setUserData(res.data.data));
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

const getUserDetail = (userId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/users/${userId}`,
      // query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setUserDetail(res.data.data));
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

const createUserManagementDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/users',
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

const updateUserManagementDetail = (userId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/users/${userId}`,
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

const deleteUserManagementDetail = (userId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/users/${userId}`,
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

const setMasterLevel = (data) => ({
  type: 'MASTERLEVEL',
  masterLevelList: data,
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

const setUserData = (data) => ({
  type: 'GETUSERDATA',
  userData: data,
});

const setUserDetail = (data) => ({
  type: 'GETUSERDETAIL',
  userDetail: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  setActionPage,
  getMasterLevel,
  getMasterRole,
  getHubList,
  getAgencyList,
  getUserData,
  getUserDetail,
  createUserManagementDetail,
  updateUserManagementDetail,
  deleteUserManagementDetail,
  updatePassword,
  getMeDetail,
};
