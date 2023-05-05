import { fetch } from '../../utils/fetch';

const getOrderItemStore = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/v2/orderItem',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          console.log('api', res.data.data);
          dispatch(setOrderItemStoreData(res.data.data));
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
const updateOrderFound = (orderItemId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/v2/orderItem/${orderItemId}/found`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          console.log('api', res.data.data);
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

const updateOrderBypass = (orderItemId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/v2/orderItem/${orderItemId}/by-pass`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          console.log('api', res.data.data);
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

const getMasterItemStatus = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: '/master/order-item-status',
    })
      .then((res) => {
        // console.log(res);
        if (res.data.success) {
          dispatch(setMasterItemStatus(res.data.data));
          resolve(res.data.data);
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

const clearData = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    dispatch(setOrderItemStoreData([]));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const setOrderItemStoreData = (data) => ({
  type: 'SET_ORDER_ITEM_STORE_DATA',
  orderItemStoreData: data,
});

const setMasterItemStatus = (data) => ({
  type: 'MASTER_ITEM_STATUS',
  masterItemStatus: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getOrderItemStore,
  updateOrderFound,
  updateOrderBypass,
  getMasterItemStatus,
  clearData,
};
