import { format } from 'date-fns';
import { fetch, fetchDownload } from '../../utils/fetch';

import {
  walletApi
} from '../../app/api/walletApi';

const getWalletList = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/wallet/transaction',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setWalletData(res.data.data));
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

const getMasterPaymentType = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/master/payment-channel',
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.data);
          dispatch(setMasterPaymentType(res.data.data));
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

const getAgencyWallet = (agencyId) => (dispatch) => {
  // console.log("messageListener - getAgencyWallet")
  dispatch(walletApi.util.invalidateTags(['Wallet']))
  return new Promise((resolve, reject) => {
   
    // fetch({
    //   method: 'get',
    //   url: `/agency/${agencyId}/wallet`,
    // })
    //   .then((res) => {
    //     if (res.data.success) {
    //       // console.log(res.data.data);
    //       dispatch(setAgencyWallet(res.data.data));
          // dispatch(onLoading(false));
          resolve(true);
      //   } else {
      //     // dispatch(onLoading(false));
      //     reject(res.data);
      //   }
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
  });
};

const clearAgencyWallet = () => (dispatch) => {
  dispatch(setAgencyWallet({}));
};

//  createWallet
const createWallet = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/wallet/transaction',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log('createWallet-ret : ', res.data.data);
          dispatch(onLoading(false));
          resolve(res.data);
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

const paymentCallback = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/wallet/transaction/payment-callback',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          console.log('paymentCallback : ', res.data.data);
          // dispatch(onLoading(false));
          resolve(res.data);
        } else {
          // dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const paymentCancel = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/wallet/transaction/payment-cancel',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          console.log('paymentCancel : ', res.data.data);
          // dispatch(onLoading(false));
          resolve(res.data);
        } else {
          // dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const callPayment = (data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/wallet/transaction/payment',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // console.log('createWallet-ret : ', res.data.data);
          dispatch(onLoading(false));
          resolve(res.data);
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

const downloadFileWallet = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetchDownload({
      method: 'post',
      url: '/wallet/transaction/download',
      fileName: `Wallet-Topup-${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}.xlsx`,
      query,
    })
      .then((res) => {
        if (res.success) {
          resolve(res.data);
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        dispatch(onLoading(false));
      })
      .catch((error) => {
        dispatch(onLoading(false));
        console.log(error);
      });
  });
};

const clearData = () => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, _reject) => {
    dispatch(setWalletData([]));
    dispatch(onLoading(false));
    return resolve(true);
  });
};

const setAgencyWallet = (data) => ({
  type: 'SET_AGENCY_WALLET',
  agencyWallet: data,
});

const setWalletData = (data) => ({
  type: 'SET_WALLET_DATA',
  storeWalletData: data,
});

const setMasterPaymentType = (data) => ({
  type: 'SET_MASTER_PAYMENT_TYPE',
  masterPaymentType: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getWalletList,
  getMasterPaymentType,
  createWallet,
  getAgencyWallet,
  clearData,
  downloadFileWallet,
  callPayment,
  paymentCallback,
  paymentCancel,
  clearAgencyWallet,
};
