/* eslint-disable  */
import { fetch, fetchDownload } from '../../utils/fetch';

import {
  orderItemsApi
} from '../../app/api/orderItemsApi';

// const getCompanyData = (settingAgencyData) => (dispatch) => {
//   dispatch(onLoading(true));
//   return new Promise((resolve, reject) => {
//     fetch({
//       method: 'get',
//       url: '/company',
//     })
//       .then((res) => {
//         if (res.data.success) {
//           const { data } = res.data;
//           const resData = data.map((val, i) => {
//             val.key = i + 1;
//             return val;
//           });
//           dispatch(setAgencyBankData(settingAgencyData, resData));
//           dispatch(onLoading(false));
//           resolve(true);
//         } else {
//           dispatch(onLoading(false));
//           reject(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   });
// };

const getDetailPrintOrder = (orderId) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/orders/print_detail/${orderId}`,
      query: {},
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setDetailPrintOrder(res.data.data));
          resolve(res.data.data);
        } else {
          // dispatch(onLoading(false));
          reject(res.data);
        }
        // dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });

const getMasterTransportationType = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/master/transportation-type',
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setMasterTransportationType(res.data.data));
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getMasterPaymentType = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/master/payment-type',
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setMasterPaymentType(res.data.data));
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getCustomerDetail = (query) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/customer/code',
      query,
    })
      .then((res) => {
        console.log("getCustomerDetail",res)
        if (res.data.success) {
          dispatch(setCustomerDetail(res.data.data));
          resolve(res.data.data);
        } else {
          // dispatch(onLoading(false));
          reject(res.data);
        }
        // dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });

const createDraftOrder = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/v2/orders/draft',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const updateDraftOrder = (orderId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/v2/orders/${orderId}/draft`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const addDraftOrder = (orderId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    const newData = JSON.parse(JSON.stringify(data));
    fetch({
      method: 'post',
      url: `/v2/orders/${orderId}/orderItem`,
      data: newData,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const createAddress = (data, customerId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: `/customer/${customerId}/address`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const createBank = (data, customerId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: `/customer/${customerId}/bank`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const deleteItem = (orderId, orderItemId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/v2/orders/${orderId}/orderItem/${orderItemId}`,
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const updateDraft = (orderId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/v2/orders/${orderId}/saved`,
      data,
    })
      .then((res) => {
        console.log(res, 'ss');
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const updateSave = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/v2/orders/${orderId}/created`,
    })
      .then((res) => {
        console.log(res, 'ss');
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
const updateBackDraft = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'patch',
      url: `/v2/orders/${orderId}/back/draft`,
    })
      .then((res) => {
        console.log(res, 'ss');
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const updateOrder = (orderId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/orders/${orderId}`,
      data,
    })
      .then((res) => {
        console.log(res, 'ss');
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const cancelDraft = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/v2/orders/${orderId}`,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(setDraftData(res.data.data));
          dispatch(orderItemsApi.util.invalidateTags(['OrderItems', 'Recipient', 'Orders']))
          console.log("orderItemsApi.util1")
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getPriceSpecialArea = (data,
  cacheSpecialPriceRef) => (dispatch) => {
    // const { companyId, province, district, subDistrict } = data
    // const key = `${companyId}_${province}_${district}_${subDistrict}`

    // if (cacheSpecialPriceRef?.current)
    //   if (cacheSpecialPriceRef.current.hasOwnProperty(key)) {
    //     return new Promise((resolve, reject) => {
    //       let ret = cacheSpecialPriceRef.current[key]
    //       dispatch(onLoading(false));
    //       resolve(ret)
    //     })
    //   }
    // dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
      fetch({
        method: 'post',
        url: '/specialArea/getPrice',
        data,
      })
        .then((res) => {
          if (res.data.success) {
            // dispatch(setDraftData(res.data.data));

            // if (cacheSpecialPriceRef?.current)
            //   cacheSpecialPriceRef.current[key] = res.data.data

            console.log("res.data.data,",res.data.data)

            resolve(res.data.data);
          } else {
            dispatch(onLoading(false));
            reject(res.data);
          }
          dispatch(onLoading(false));
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

const getAgencyCod = (agencyId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/agency/${agencyId}/cod`,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setAgencyCodList(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getAgencyDiscount = (agencyId, query) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/agency/${agencyId}/discount`,
      query,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setAgencyDiscountList(res.data.data));
          resolve(res.data.data);
        } else {
          // dispatch(onLoading(false));
          reject(res.data);
        }
        // dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });

const getStickerItem = (orderId, orderItemId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetchDownload({
      method: 'post',
      url: `/orders/${orderId}/orderItem/${orderItemId}/pdf/barcode`,
      data,
    })
      .then((res) => {
        if (res.success) {
          // dispatch(setAgencyDiscountList(res.data.data));
          resolve(res.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getDeliveryFile = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetchDownload({
      method: 'get',
      url: `/orders/${orderId}/pdf/delivery-note`,
    })
      .then((res) => {
        if (res.success) {
          // dispatch(setAgencyDiscountList(res.data.data));
          resolve(res.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getReceiptFile = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetchDownload({
      method: 'get',
      url: `/orders/${orderId}/pdf/receipt`,
    })
      .then((res) => {
        if (res.success) {
          // dispatch(setAgencyDiscountList(res.data.data));
          resolve(res.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getBarcodeFile = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetchDownload({
      method: 'get',
      url: `/orders/${orderId}/pdf/barcode`,
    })
      .then((res) => {
        if (res.success) {
          // dispatch(setAgencyDiscountList(res.data.data));
          resolve(res.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getOrderDetail = (orderId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {

    console.log("getOrderDetail",orderId)

    fetch({
      method: 'get',
      url: `/orders/${orderId}`,
    })
      .then((res) => {
        console.log("getOrderDetail res",res)
        if (res.data.success) {
          dispatch(setOrderDetail(res.data.data));
          resolve(res.data.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getStoreCustomerDetailByUser = (userId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: `/customer/user/${userId}`,

    })
      .then((res) => {
        // console.log(res);
        if (res.data.success) {
          dispatch(setCustomerDetail(res.data.data));
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

const getParcelTypeData = (companyId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/parcelType/${companyId}`,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res;
          console.log('get parcelTypeData', data.data);
          dispatch(setParcelTypeData(data.data));
          resolve(true);
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

const setParcelTypeData = (data) => ({
  type: 'SET_PARCEL_DATA',
  parcelTypeData: data,
});

const setCustomerDetail = (action) => ({
  type: 'GETCUSTOMERDETAIL',
  customerDetail: action,
});

const setMasterPaymentType = (action) => ({
  type: 'SETMASTERPAYMENTTYPE',
  masterPaymentType: action,
});

const setMasterTransportationType = (action) => ({
  type: 'SETMASTERTRANTYPE',
  masterTransportationType: action,
});

const setActionModal = (action) => ({
  type: 'ACTIONMODAL',
  actionModal: action,
});

const setItemCount = (action) => ({
  type: 'SETITEMCOUNT',
  itemCount: action,
});

const setDraftData = (action) => ({
  type: 'GETDRAFT',
  draftData: action,
});

const setFlagHeader = (action) => ({
  type: 'SETFLAGHEADER',
  flagHeader: action,
});

const setButtonFlagHeader = (action) => ({
  type: 'SETFLAGBUTTONHEADER',
  flagButtonHeader: action,
});

const setAgencyCodList = (action) => ({
  type: 'SETAGENCYCOD',
  agencyCodList: action,
});

const setAgencyDiscountList = (action) => ({
  type: 'SETAGENCYDIS',
  agencyDiscountList: action,
});

const setDetailPrintOrder = (action) => ({
  type: 'SETDETAILPRINTORDER',
  detailPrintOrder: action,
});

const setOrderDetail = (action) => ({
  type: 'SETORDERDETAIL',
  orderDetail: action,
});

const checkTypeTrans = (action) => ({
  type: 'CHECKEX',
  itemTypeTrans: action,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getDetailPrintOrder,
  setActionModal,
  getMasterTransportationType,
  getMasterPaymentType,
  getCustomerDetail,
  createDraftOrder,
  addDraftOrder,
  createAddress,
  createBank,
  setFlagHeader,
  setButtonFlagHeader,
  deleteItem,
  getPriceSpecialArea,
  getAgencyCod,
  getAgencyDiscount,
  updateDraft,
  cancelDraft,
  checkTypeTrans,
  getStickerItem,
  getOrderDetail,
  getDeliveryFile,
  getReceiptFile,
  getBarcodeFile,
  getStoreCustomerDetailByUser,
  updateOrder,
  setDraftData,
  updateDraftOrder,
  getParcelTypeData,
  setItemCount,
  updateSave,
  updateBackDraft
};
