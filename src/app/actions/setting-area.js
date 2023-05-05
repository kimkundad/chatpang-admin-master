/* eslint-disable no-const-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { format } from 'date-fns';
import { fetch, fetchDownload } from '../../utils/fetch';

const getSettingAreaData = (companyId) => (dispatch) => {
  dispatch(onLoading(true));
  if (companyId === undefined) {
    companyId = undefined;
  }
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/specialArea/${companyId}`,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          const resData = data.specialAreaList.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          let x = 0;
          for (x = 0; x < resData.length; x++) {
            const obj = {
              id: x + 1,
              companyName: resData[x].companyData.companyName,
              sector: resData[x].sector,
              province: resData[x].province,
              district: resData[x].district,
              subDistrict: resData[x].subDistrict,
              postcode: resData[x].postcode,
              minShippingAmt: resData[x].minShippingAmt,
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

const filterSpecialArea = (query) => (dispatch) => {
  dispatch(onLoading(true));
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/specialArea',
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
              sector: resData[x].sector,
              province: resData[x].province,
              district: resData[x].district,
              subDistrict: resData[x].subDistrict,
              postcode: resData[x].postcode,
              minShippingAmt: resData[x].minShippingAmt,
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

const getCompanyData = (specialAreaData) => (dispatch) => {
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
          dispatch(setSettingAreaData(specialAreaData, resData));
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

const importPostcode = (fileExcel, companyId) => (dispatch) => {
  dispatch(onLoading(true));
  const form = new FormData();
  form.append('file', fileExcel);
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: `/master/postcode/upload`,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          resolve(true);
          dispatch(onLoading(false));
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
      url: `/specialArea/upload/${companyId}`,
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
              sector: resData[x].sector,
              province: resData[x].province,
              district: resData[x].district,
              subDistrict: resData[x].subDistrict,
              postcode: resData[x].postcode,
              minShippingAmt: resData[x].minShippingAmt,
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
    url: `/specialArea/download/${companyId}`,
    fileName: `specialArea-${format(new Date(), 'dd-MM-yyyy')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};

const setSettingAreaData = (data, dataCompany) => ({
  type: 'GETDATA',
  settingAreaData: data,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getSettingAreaData,
  filterSpecialArea,
  importFile,
  importPostcode,
  exportFile,
};
