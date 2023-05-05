/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { fetch } from '../../utils/fetch';

const getSettingMorePrice = (companyId) => (dispatch) => {
  dispatch(onLoading(true));
  if (companyId === null) {
    companyId = 0;
  }
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/incrementalPrice/${companyId}`,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          const resData = data.incrementalPriceList.map((val, i) => {
            val.key = i + 1;
            return val;
          });

          let x = 0;
          for (x = 0; x < resData.length; x++) {
            const obj = {
              id: x + 1,
              incrementalPriceId: resData[x].incrementalPriceId,
              companyName: resData[x].companyData.companyName,
              description: resData[x].description,
              price: resData[x].price,
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

const filterSettingMorePrice = (query) => (dispatch) => {
  dispatch(onLoading(true));
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/incrementalPrice',
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
              incrementalPriceId: resData[x].incrementalPriceId,
              companyName: resData[x].companyData.companyName,
              description: resData[x].description,
              price: resData[x].price,
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
const createSettingMorePrice = (data, companyId) => (dispatch) => {
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: `/incrementalPrice/${companyId}`,
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

const getOneById = (incrementalPriceId) => (dispatch) => {
  let listdata;
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/incrementalPrice/getOneList/${incrementalPriceId}`,
    })
      .then((res) => {
        if (res.data.success) {
          listdata = res.data.data;
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

const updateSettingMorePriceDetail = (incrementalPriceId, data) => (dispatch) => {
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/incrementalPrice/${incrementalPriceId}`,
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

const deleteSettingMorePriceDetail = (incrementalPriceId) => (dispatch) => {
  dispatch(onLoading(true));
  const resData = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/incrementalPrice/${incrementalPriceId}`,
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

const getCompanyData = (settingMorePriceData) => (dispatch) => {
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
          dispatch(setSettingMorePrice(settingMorePriceData, resData));
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

const setSettingMorePrice = (data, dataCompany) => ({
  type: 'GETDATA',
  settingMorePriceData: data,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getSettingMorePrice,
  filterSettingMorePrice,
  createSettingMorePrice,
  getOneById,
  deleteSettingMorePriceDetail,
  setActionPage,
  updateSettingMorePriceDetail,
  getCompanyData,
};
