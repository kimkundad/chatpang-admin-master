import { fetch } from '../../utils/fetch';

const createOrderHubReturn = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/orders/rl-ex',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
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

const getOrderHubReturn = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/orders/rl-ex',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(onLoading(false));
          dispatch(setDataRlEx(res.data.data));
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

const clearData = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, _reject) => {
    dispatch(setDataRlEx([]));
    dispatch(onLoading(false));
    return resolve(true);
  });
};
const setDataRlEx = (action) => ({
  type: 'SET_DATA_RL_EX',
  dataRlEx: action,
});
const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getOrderHubReturn,
  createOrderHubReturn,
  clearData,
};
