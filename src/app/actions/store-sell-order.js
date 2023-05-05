import { fetch, fetchDownload } from '../../utils/fetch';

import {
  orderItemsApi
} from '../../app/api/orderItemsApi';

const getMasterStatus = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: '/master/order-status/ASO',
    })
      .then((res) => {
        // console.log(res);
        if (res.data.success) {
          dispatch(setMasterStatus(res.data.data));
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

const getSellOrderList = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: '/orders',
      query,

    })
      .then((res) => {
        // console.log(res);
        if (res.data.success) {
          dispatch(setSellOrderData(res.data.data));
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

const cancelOrder = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'DELETE',
      url: `/v2/orders/${orderId}`,

    })
      .then((res) => {
        // console.log(res);
        if (res.data.success) {
          resolve(res.data.data);
          dispatch(onLoading(false));

          dispatch(orderItemsApi.util.invalidateTags(['OrderItems', 'Recipient', 'Orders']))
          console.log("orderItemsApi.util")
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

const setSellOrderData = (action) => ({
  type: 'SET_SELL_ORDER_DATA',
  sellOrderData: action,
});

const setMasterStatus = (action) => ({
  type: 'SET_MASTER_STATUS',
  masterStatus: action,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getSellOrderList,
  cancelOrder,
  getMasterStatus,
};
