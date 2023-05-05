import { format } from 'date-fns';
import { fetch, fetchDownload } from '../../utils/fetch';

const getTransportationOrderByAgency = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/transportation-order',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setTransportationOrder(res.data.data));
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

const getTransportationOrderDetail = (transportationOrderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/transportation-order/${transportationOrderId}`,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          // const listITM = [];
          // const listNoITM = [];
          // for (const d of res?.data?.data?.orderItemData) {
          //   if (d.orderItemStatusCode) {
          //     listITM.push(d);
          //   } else {
          //     listNoITM.push(d);
          //   }
          // }
          // const newValue = {
          //   ...res.data.data,
          //   orderItemData: listITM.concat(listNoITM),
          // };
          dispatch(setTransportationOrderDetail(res?.data?.data));
          dispatch(onLoading(false));
          resolve(true);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        dispatch(onLoading(false));
        console.log(error);
      });
  });
};

//  getSumOrderItemByAgencyId

const getSumOrderItemByAgencyId = (query) => (dispatch) => {
  // dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/order-item/agency-warehouse/${query.agencyId}/sum`,
      // query,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setSumOrderItem(res.data.data));
          dispatch(onLoading(false));
          resolve(true);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        dispatch(onLoading(false));
        console.log(error);
      });
  });
};
const createTransportationOrder = (agencyId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/transportation-order',
      data: { agencyId },
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
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

const deleteTransportationOrder = (transportationOrderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/transportation-order/${transportationOrderId}`,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
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

const verifyTransportationOrder = (transportationOrderId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/transportation-order/${transportationOrderId}/status/ACH`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
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

const reScanTransportationOrder = (transportationOrderId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/v2/transportation-order/${transportationOrderId}/agency/re-scan`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
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
    dispatch(setTransportationOrder([]));
    dispatch(setTransportationOrderDetail(null));
    dispatch(setSumOrderItem(null));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const clearTransportationOrderDetail = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    dispatch(setTransportationOrderDetail(null));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

// eslint-disable-next-line no-unused-vars
const exportDOFile = (transportationOrderId, transportationOrderNo) => (dispatch) => {
  console.log('transportationOrderId', transportationOrderId);
  fetchDownload({
    method: 'get',
    url: '/report/report_transportation/download',
    query: { transportationOrderId },
    fileName: `TransportOrder-[${transportationOrderNo}]-${format(new Date(), 'dd-MM-yyyy')}.xlsx`,
  }).then((res) => {
    if (res?.success) {
      console.log('Download Success');
    } else {
      console.log(res?.message);
    }
  });
};

const setTransportationOrder = (data) => ({
  type: 'SET_TRANSPORTATION_ORDER_DATA',
  transportationOrderData: data,
});

const setTransportationOrderDetail = (data) => ({
  type: 'SET_TRANSPORTATION_ORDER_DETAIL',
  transportationOrderDetail: data,
});
const setSumOrderItem = (data) => ({
  type: 'SET_SUM_ORDER_ITEM',
  sumOrderItem: data,
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
  getTransportationOrderByAgency,
  getTransportationOrderDetail,
  getSumOrderItemByAgencyId,
  getHubList,
  getAgencyList,
  clearData,
  createTransportationOrder,
  deleteTransportationOrder,
  verifyTransportationOrder,
  clearTransportationOrderDetail,
  exportDOFile,
  reScanTransportationOrder,
};
