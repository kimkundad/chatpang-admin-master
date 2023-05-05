import { format } from 'date-fns';
import { fetch, fetchDownload } from '../../utils/fetch';

const getCodList = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/report/report_cod',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.data);
          dispatch(setReportCOD(res.data.data));
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

const clearData = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, _reject) => {
    dispatch(setReportCOD([]));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const setReportCOD = (data) => ({
  type: 'SET_REPORT_COD',
  reportCodData: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

// eslint-disable-next-line no-unused-vars
const exportFile = (query) => (dispatch) => {
  console.log('query', query);
  fetchDownload({
    method: 'get',
    url: '/report/report_cod/download',
    query,
    fileName: `Report-Cod-${format(new Date(), 'dd-MM-yyyy')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};

// eslint-disable-next-line no-unused-vars
const exportItemAll = (query) => (dispatch) => {
  console.log('query', query);
  fetchDownload({
    method: 'get',
    url: '/report/report_do/download',
    query,
    fileName: `Order-Items-${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};

// eslint-disable-next-line no-unused-vars
const exportOrder = (query) => (dispatch) => {
  console.log('query', query);
  fetchDownload({
    method: 'get',
    url: '/report/report_order/download',
    query,
    fileName: `Order-${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};

export default {
  exportOrder,
  getCodList,
  setReportCOD,
  clearData,
  exportFile,
  exportItemAll
};
