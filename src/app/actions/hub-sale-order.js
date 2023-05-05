import { fetch } from '../../utils/fetch';

const getOrderForManageSo = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/orders/manage-so',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setOrderData(res.data.data));
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

const getOrderItemByDo = (payload) => (dispatch) => {
  const { doNo, hubId } = payload;
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/order-item/do/${doNo}`,
      query: { hubId },
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setOrderItemData(res.data.data));
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

const updateOrderItem = (data, orderItemId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/order-item/${orderItemId}/checked`,
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

const clearData = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, _reject) => {
    dispatch(setOrderData([]));
    dispatch(setOrderItemData(null));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const clearOrderItem = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, _reject) => {
    dispatch(setOrderItemData(null));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const setOrderData = (data) => ({
  type: 'SET_ORDER_DATA',
  orderData: data,
});
const setOrderItemData = (data) => ({
  type: 'SET_ORDER_ITEM_SSO',
  orderItemData: data,
});

const setHubList = (data) => ({
  type: 'MASTERHUB',
  masterHubList: data,
});
const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getOrderForManageSo,
  clearData,
  getHubList,
  getOrderItemByDo,
  clearOrderItem,
  updateOrderItem,
};
