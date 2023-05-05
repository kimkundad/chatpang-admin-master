import { format } from 'date-fns';
import { fetch,fetchDownload } from '../../utils/fetch';

const getCodBalanceList = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/log/list',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setReportBALANCE(res.data.data));
          dispatch(onLoading(false));
          resolve(true);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch(() => {});
  });
};

const exportLogBalance = (query) => (dispatch) => {
  console.log('query', query);
  fetchDownload({
    method: 'get',
    url: '/log/export',
    query,
    fileName: `Wallet-log-${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};


const clearData = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve) => {
    dispatch(setReportBALANCE([]));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const setReportBALANCE = (data) => ({
  type: 'SET_REPORT_BALANCE',
  reportBalanceData: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getCodBalanceList,
  setReportBALANCE,
  clearData,
  exportLogBalance
};
