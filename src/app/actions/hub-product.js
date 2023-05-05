import { format } from 'date-fns';
import { fetch, fetchDownload } from '../../utils/fetch';

const getTransportationOrderByHub = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/transportation-order/hub',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setTransportationOrder(
            res.data.data.map((val, i) => ({
              ...val,
              key: val?.transportationOrderId,
            })),
          ));
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
          dispatch(setTransportationOrderDetail(res.data.data));
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

const updateTransportationOrderToTOC = (transportationOrderId, remark) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/transportation-order/${transportationOrderId}/status/TOC`,
      data: { remark },
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
    // dispatch(setSumOrderItem(null));
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

const getActiveDriver = (query) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/manageDriver/active',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setActiveDriver(res.data.data));
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

const clearActiveDriver = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    dispatch(setActiveDriver([]));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

// Call จ่ายงานให้คนขับ
const assignDriver = (payload) => (dispatch) => {
  const { driverId, transportationOrderIds } = payload;
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/transportation-order/driver',
      data: { driverId, transportationOrderIds },
    })
      .then((res) => {
        if (res.data.success) {
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

// Call เปลี่ยนคนขับ
const changeDriver = (payload) => (dispatch) => {
  const { driverId, transportationOrderId } = payload;
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: '/transportation-order/driver',
      data: { driverId, transportationOrderId },
    })
      .then((res) => {
        if (res.data.success) {
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
      url: `/transportation-order/${transportationOrderId}/status/HCH`,
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
      url: `/v2/transportation-order/${transportationOrderId}/hub/re-scan`,
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
const setTransportationOrder = (data) => ({
  type: 'SET_TRANSPORTATION_ORDER_DATA',
  transportationOrderData: data,
});

const setTransportationOrderDetail = (data) => ({
  type: 'SET_TRANSPORTATION_ORDER_DETAIL',
  transportationOrderDetail: data,
});
// const setSumOrderItem = (data) => ({
//   type: 'SET_SUM_ORDER_ITEM',
//   sumOrderItem: data,
// });

const setActiveDriver = (data) => ({
  type: 'SET_ACTIVE_DRIVER',
  activeDriverList: data,
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

export default {
  getTransportationOrderByHub,
  getTransportationOrderDetail,
  // getSumOrderItemByAgencyId,
  getHubList,
  getAgencyList,
  clearData,
  createTransportationOrder,
  updateTransportationOrderToTOC,
  clearTransportationOrderDetail,
  getActiveDriver,
  clearActiveDriver,
  assignDriver,
  changeDriver,
  verifyTransportationOrder,
  exportDOFile,
  reScanTransportationOrder,
};
