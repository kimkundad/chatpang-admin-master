/* eslint-disable no-const-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { format } from 'date-fns';
import { fetch, fetchDownload } from '../../utils/fetch';

const getParcelTypeData = (companyId) => (dispatch) => {
  dispatch(onLoading(true));
  if (companyId === undefined) {
    companyId = undefined;
  }
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/parcelType/${companyId}`,
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
              companyName: resData[x].companyData.companyName,
              category: resData[x].category,
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

const filterParcelType = (query) => (dispatch) => {
  dispatch(onLoading(true));
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/parcelType',
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
              companyName: resData[x].companyData.companyName,
              category: resData[x].category,
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

const getCompanyData = (parcelTypeData) => (dispatch) => {
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
          dispatch(setParcelTypeData(parcelTypeData, resData));
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

const importFile = (fileExcel, companyId) => (dispatch) => {
  dispatch(onLoading(true));
  const form = new FormData();
  form.append('file', fileExcel);
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: `/parcelType/upload/${companyId}`,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
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
              companyName: resData[x].companyData.companyName,
              category: resData[x].category,
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

// eslint-disable-next-line no-unused-vars
const exportFile = (companyId) => (dispatch) => {
  fetchDownload({
    method: 'post',
    url: `/parcelType/download/${companyId}`,
    fileName: `parcelType-${format(new Date(), 'dd-MM-yyyy')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};

const setParcelTypeData = (data, dataCompany) => ({
  type: 'GETDATA',
  parcelTypeData: data,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getParcelTypeData,
  filterParcelType,
  importFile,
  exportFile,
};
