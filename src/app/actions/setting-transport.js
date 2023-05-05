/* eslint-disable */
import { format } from 'date-fns';
import { fetch, fetchDownload } from '../../utils/fetch';

import { message } from 'antd';

const getSettingTransportData = (companyId) => (dispatch) => {
  dispatch(onLoading(true));
  if (companyId === null) {
    companyId = undefined;
  }
  let listColumns;
  let finalDataList;
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/transportationService/${companyId}`,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          if (
            data.transportationServiceList.listColumns.length != 0 &&
            data.transportationServiceList.finalDataList.length != 0
          ) {
            listColumns = data.transportationServiceList.listColumns;
            finalDataList = data.transportationServiceList.finalDataList;

            if (data?.serviceTemp) {
              dispatch(setEffectiveDate(data?.serviceTemp?.effectiveAt));
            }

            dispatch(getCompanyData(finalDataList, listColumns));
            resolve(true);
            dispatch(onLoading(false));
          } else {
            const listColumnselse = [];
            const finalDataListelse = [];
            const objColumns = {
              title: 'น้ำหนัก/ขนาด',
              width: 10,
              dataIndex: 'weight',
              key: 'weight',
              align: 'center',
            };
            listColumnselse.push(objColumns);
            dispatch(getCompanyData(finalDataListelse, listColumnselse));
            resolve(true);
            dispatch(onLoading(false));
          }
        } else {
          const listColumnselse = [];
          const finalDataListelse = [];
          const objColumns = {
            title: 'น้ำหนัก/ขนาด',
            width: 10,
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
          };
          listColumnselse.push(objColumns);
          dispatch(getCompanyData(finalDataListelse, listColumnselse));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const filterSettingTransport = (query) => (dispatch) => {
  dispatch(onLoading(true));
  let listColumns;
  let finalDataList;
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/transportationService',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          if (
            data.transportationServiceList.listColumns.length != 0 &&
            data.transportationServiceList.finalDataList.length != 0
          ) {
            listColumns = data.transportationServiceList.listColumns;
            finalDataList = data.transportationServiceList.finalDataList;
            dispatch(getCompanyData(finalDataList, listColumns));
            resolve(true);
            dispatch(onLoading(false));
          } else {
            const listColumnselse = [];
            const finalDataListelse = [];
            const objColumns = {
              title: 'น้ำหนัก/ขนาด',
              width: 10,
              dataIndex: 'weight',
              key: 'weight',
              align: 'center',
            };
            listColumnselse.push(objColumns);
            dispatch(getCompanyData(finalDataListelse, listColumnselse));
            resolve(true);
            dispatch(onLoading(false));
          }
        } else {
          const listColumnselse = [];
          const finalDataListelse = [];
          const objColumns = {
            title: 'น้ำหนัก/ขนาด',
            width: 10,
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
          };
          listColumnselse.push(objColumns);
          dispatch(getCompanyData(finalDataListelse, listColumnselse));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getCompanyData = (settingTransportData, listColumns) => (dispatch) => {
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
          dispatch(
            setsettingTransportData(settingTransportData, listColumns, resData)
          );
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

const importFile = (fileExcel, companyId, effectiveAt) => (dispatch) => {
  dispatch(onLoading(true));
  const form = new FormData();
  form.append('file', fileExcel);
  let listColumns;
  let finalDataList;
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: `/transportationService/upload/${companyId}`,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        console.log("importFile",res)
        if (res.data.success) {
          const { data } = res;

          if (
            data.transportationServiceList.listColumns.length != 0 &&
            data.transportationServiceList.finalDataList.length != 0
          ) {
            listColumns = data.transportationServiceList.listColumns;
            finalDataList = data.transportationServiceList.finalDataList;

            if (data?.serviceTemp) {
              dispatch(setEffectiveDate(data?.serviceTemp?.effectiveAt));
            }

            dispatch(getCompanyData(finalDataList, listColumns));
            resolve(true);
            dispatch(onLoading(false));
          } else {
            const listColumnselse = [];
            const finalDataListelse = [];
            const objColumns = {
              title: 'น้ำหนัก/ขนาด',
              width: 10,
              dataIndex: 'weight',
              key: 'weight',
              align: 'center',
            };
            listColumnselse.push(objColumns);
            dispatch(getCompanyData(finalDataListelse, listColumnselse));
            resolve(true);
            dispatch(onLoading(false));
          }
        } else {
          const listColumnselse = [];
          const finalDataListelse = [];
          const objColumns = {
            title: 'น้ำหนัก/ขนาด',
            width: 10,
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
          };
          listColumnselse.push(objColumns);
          // dispatch(getCompanyData(finalDataListelse, listColumnselse));
          dispatch(onLoading(false));
          message.error(res.data?.message)
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error(error?.error?.error)
      });
  });
};

const uploadFile = (fileExcel, companyId, effectiveAt) => (dispatch) => {
  dispatch(onLoading(true));
  const form = new FormData();
  form.append('file', fileExcel);
  // form.append('effectiveAt', effectiveAt);
  let listColumns;
  let finalDataList;
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: `/transportationServiceTemp/upload/${companyId}`,
      data: form,
      query: { effectiveAt },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;

          if (data?.serviceTemp) {
            dispatch(setEffectiveDate(data?.serviceTemp?.effectiveAt));
          }

          resolve(true);
          dispatch(onLoading(false));
        } else {
          dispatch(onLoading(false));
          message.error(res.data?.message)
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error(error?.error?.error)
      });
  });
};

const calculate = (companyId, weight, dimension, cacheCalRef) => (dispatch) => {

  // if (cacheCalRef?.current)
  //   if (cacheCalRef.current.hasOwnProperty(`${companyId}_${weight}_${dimension}`)) {
  //     return new Promise((resolve, reject) => {
  //       let price = cacheCalRef.current[`${companyId}_${weight}_${dimension}`]
  //       dispatch(calculatePrice(price));
  //       dispatch(onLoading(false));
  //       console.log("price", price)
  //       resolve(price)
  //     })
  //   }
  return new Promise((resolve, reject) => {
    // dispatch(onLoading(true));
    fetch({
      method: 'get',
      url: `/transportationService/calculate/${companyId}/${weight}/${dimension}`,
    })
      .then((res) => {
        if (res.data.success) {
          if (res.data.priceReturn.length != 0) {
            const obj = {
              price: res.data.priceReturn[0].price,
            };

            // if (cacheCalRef?.current)
            //   cacheCalRef.current[`${companyId}_${weight}_${dimension}`] = obj.price

            dispatch(calculatePrice(obj.price));
            dispatch(onLoading(false));





            resolve(obj.price);
          }
        } else {
          const obj = {
            price: '-',
          };
          dispatch(calculatePrice(obj.price));
          dispatch(onLoading(false));
          reject(res.data);
          // console.log(res?.message);
        }
      })
      .catch((error) => {
        dispatch(onLoading(false));
        console.log(error);
      });
  });
}

// eslint-disable-next-line no-unused-vars
const exportFile = (companyId) => (dispatch) => {
  fetchDownload({
    method: 'post',
    url: `/transportationService/download/${companyId}`,
    fileName: `Transport-Service-${format(new Date(), 'dd-MM-yyyy')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};

const setsettingTransportData = (data, listColumns, dataCompany) => ({
  type: 'GETDATA',
  settingTransportData: data,
  columns: listColumns,
  companyData: dataCompany,
});

const calculatePrice = (price) => ({
  type: 'CALCULATE',
  calculatePrice: price,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

const setEffectiveDate = (effectiveAt) => ({
  type: 'SET_EFFECTIVE_DATE',
  effectiveAt,
});

export default {
  getSettingTransportData,
  filterSettingTransport,
  importFile,
  exportFile,
  calculate,
  uploadFile,
};
