/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { fetch } from '../../utils/fetch';

const getSettingCustomeType = (query) => (dispatch) => {
  dispatch(onLoading(true));
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/customer-type',
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
              customerTypeId: resData[x].customerTypeId,
              companyName: resData[x].companyData.companyName,
              description: resData[x].description,
              discount: resData[x].discount,
            };
            listdata.push(obj);
          }
          dispatch(getCompanyData(listdata));
          resolve(true);
          dispatch(onLoading(false));
        } else {
          dispatch(getCompanyData(listdata));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
const filterSettingCustomeType = (query) => (dispatch) => {
  dispatch(onLoading(true));
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/customer-type/filterCustomerType',
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
              customerTypeId: resData[x].customerTypeId,
              companyName: resData[x].companyData.companyName,
              description: resData[x].description,
              discount: resData[x].discount,
            };
            listdata.push(obj);
          }
          dispatch(getCompanyData(listdata));
          resolve(true);
          dispatch(onLoading(false));
        } else {
          dispatch(getCompanyData(listdata));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
const createSettingCustomeType = (data) => (dispatch) => {
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/customer-type',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(getCompanyData(listdata));
          resolve(true);
        } else {
          dispatch(getCompanyData(listdata));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const updateSettingCustomeTypeDetail = (customerTypeId, data) => (dispatch) => {
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/customer-type/${customerTypeId}`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(getCompanyData(listdata));
          resolve(true);
        } else {
          dispatch(getCompanyData(listdata));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const deleteSettingCustomeTypeDetail = (customerTypeId) => (dispatch) => {
  dispatch(onLoading(true));
  const resData = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/customer-type/${customerTypeId}`,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(getCompanyData(resData));
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

const getCompanyData = (settingCustomeTypeData) => (dispatch) => {
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
          dispatch(setSettingCustomeType(settingCustomeTypeData, resData));
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

const setSettingCustomeType = (data, dataCompany) => ({
  type: 'GETDATA',
  settingCustomeType: data,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getSettingCustomeType,
  filterSettingCustomeType,
  createSettingCustomeType,
  deleteSettingCustomeTypeDetail,
  setActionPage,
  updateSettingCustomeTypeDetail,
};
