/* eslint-disable no-const-assign */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { fetch } from '../../utils/fetch';

const getManageDriver = (query) => (dispatch) => {
  dispatch(onLoading(true));
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: '/managedriver',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          const resData = data.data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          let x = 0;
          for (x = 0; x < resData.length; x++) {
            const obj = {
              id: x + 1,
              userId: resData[x].userId,
              companyId: resData[x].userData.companyData.companyId,
              companyName: resData[x].userData.companyData.companyName,
              hubName: resData[x].userData.hubData == null ? '' : resData[x].userData.hubData.hubName,
              isActive: resData[x].isActive,
              name: resData[x].userData.name,
              phone: resData[x].phoneNo,
            };
            listdata.push(obj);
          }
          dispatch(getCompanyData(listdata, query.companyId));
          resolve(true);
          dispatch(onLoading(false));
        } else {
          dispatch(getCompanyData(listdata, query.companyId));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const filterManageDriver = (query) => (dispatch) => {
  dispatch(onLoading(true));
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: '/manageDriver/filter',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          const resData = data.data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          let x = 0;
          for (x = 0; x < resData.length; x++) {
            const obj = {
              id: x + 1,
              userId: resData[x].userId,
              companyName: resData[x].userData.companyData.companyName,
              hubName: resData[x].userData.hubData == null ? '' : resData[x].userData.hubData.hubName,
              isActive: resData[x].isActive,
              name: resData[x].userData.name,
              phone: resData[x].phoneNo,
            };
            listdata.push(obj);
          }
          dispatch(getCompanyData(listdata, query.companyId));
          resolve(true);
          dispatch(onLoading(false));
        } else {
          dispatch(getCompanyData(listdata, query.companyId));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getOneDriverByUserId = (userId) => (dispatch) => {
  let listdata;
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: `/manageDriver/getOneDriverByUserId/${userId}`,
    })
      .then((res) => {
        if (res.data.success) {
          listdata = res.data.data;
          dispatch(getCompanyData(listdata, 0));
          resolve(true);
        } else {
          dispatch(getCompanyData(listdata, 0));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const createManageDriver = (datas, companyId) => (dispatch) => {
  const data = {
    userLevel: 'HUB',
    companyId,
    hubId: datas.hubId,
    name: datas.fistnameLastName,
    email: datas.phone,
    phoneNo: datas.phone,
    roleId: 5,
    password: datas.confirmPassword,
    isActive: datas.isActive,
    isDriver: true,
  };
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/manageDriver',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(getCompanyData(listdata, 0));
          resolve(true);
        } else {
          dispatch(getCompanyData(listdata, 0));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const updateManageDriverDetail = (userId, data) => (dispatch) => {
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'PUT',
      url: `/manageDriver/${userId}`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(getCompanyData(listdata, 0));
          resolve(true);
        } else {
          dispatch(getCompanyData(listdata, 0));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const deleteManageDriverDetail = (userId) => (dispatch) => {
  dispatch(onLoading(true));
  const resData = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'DELETE',
      url: `/manageDriver/${userId}`,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(getCompanyData(resData, 0));
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

const getCompanyData = (manageDriverData, findHub) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/company',
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          dispatch(getHubList(manageDriverData, resData, findHub));
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

const getHubList = (manageDriverData, companyData, findHub) => (dispatch) => new Promise((resolve, reject) => {
  const query = {
    companyId: findHub === 0 ? '' : findHub,
  };
  fetch({
    method: 'get',
    url: '/hub/dropdown',
    query,
  })
    .then((res) => {
      if (res.data.success) {
        dispatch(setManageDriver(manageDriverData, companyData, res.data.data));
        resolve(res.data.data);
      } else {
        reject(res.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
const setActionPage = (value) => ({
  type: 'SETACTION',
  actionPage: value,
});

const setManageDriver = (data, dataCompany, hubData) => ({
  type: 'GETDATA',
  manageDriverData: data,
  companyData: dataCompany,
  hubData,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getManageDriver,
  filterManageDriver,
  createManageDriver,
  getOneDriverByUserId,
  deleteManageDriverDetail,
  setActionPage,
  updateManageDriverDetail,
  getCompanyData,
};
