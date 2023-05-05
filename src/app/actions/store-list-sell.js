import { fetch } from '../../utils/fetch';

const getOrderItemInAgencyWarehouse = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/order-item/agency-warehouse',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setOrderItemData(res.data.data));
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

const clearData = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    dispatch(setOrderItemData([]));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const setOrderItemData = (data) => ({
  type: 'SET_ORDER_ITEM_DATA',
  orderItemData: data,
});

const setHubList = (data) => ({
  type: 'MASTERHUB',
  masterHubList: data,
});

const setAgencyList = (data) => ({
  type: 'MASTERAGENCY',
  masterAgencyList: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getOrderItemInAgencyWarehouse,
  getHubList,
  getAgencyList,
  clearData,
};
