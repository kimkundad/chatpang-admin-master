/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { fetch } from '../../utils/fetch';

const getCompanyData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/company',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          dispatch(setCompanyData(resData));
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

const getStoreCustomer = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: '/customer',
      query,
    })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const { data } = res;
          const resData = data.data.map((val, i) => {
            val.key = i + 1;
            return val;
          });

          dispatch(setStoreCustome(resData));
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
const getStoreCustomerDetail = (customerId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: `/customer/${customerId}`,

    })
      .then((res) => {
        // console.log(res);
        if (res.data.success) {
          dispatch(setStoreCustomerDetail(res.data.data));
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

const getCustomerType = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'GET',
      url: '/customer-type',
      query,
    })
      .then((res) => {
        // console.log(res);
        if (res.data.success) {
          dispatch(setCustomerType(res.data.data));
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

// const filterStoreCustome = (query) => (dispatch) => {
//   console.log(query);
//   dispatch(onLoading(true));
//   const listdata = [];
//   return new Promise((resolve, reject) => {
//     fetch({
//       method: 'get',
//       url: '/incrementalPrice',
//       query,
//     })
//       .then((res) => {
//         if (res.data.success) {
//           const { data } = res;
//           const resData = data.data.map((val, i) => {
//             val.key = i + 1;
//             return val;
//           });
//           let x = 0;
//           for (x = 0; x < resData.length; x++) {
//             const obj = {
//               id: x + 1,
//               incrementalPriceId: resData[x].incrementalPriceId,
//               companyName: resData[x].companyData.companyName,
//               description: resData[x].description,
//               price: resData[x].price,
//             };
//             listdata.push(obj);
//           }
//           dispatch(getCompanyData(listdata));
//           resolve(true);
//           dispatch(onLoading(false));
//         } else {
//           dispatch(getCompanyData(listdata));
//           dispatch(onLoading(false));
//           reject(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   });
// };
const createStoreCustome = (data) => (dispatch) => {
  const listdata = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/customer',
      data,
    })
      .then((res) => {
        if (res.data.success) {
          // dispatch(getCompanyData(listdata));
          resolve(res.data.data);
        } else {
          // dispatch(getCompanyData(listdata));
          dispatch(onLoading(false));
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

// const getOneById = (incrementalPriceId) => (dispatch) => {
//   let listdata;
//   return new Promise((resolve, reject) => {
//     fetch({
//       method: 'get',
//       url: `/incrementalPrice/getOneList/${incrementalPriceId}`,
//     })
//       .then((res) => {
//         if (res.data.success) {
//           listdata = res.data.data;
//           dispatch(getCompanyData(listdata));
//           resolve(true);
//         } else {
//           dispatch(getCompanyData(listdata));
//           reject(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   });
// };

const updateStoreCustomeDetail = (customerId, data) => (dispatch) => new Promise((resolve, reject) => {
  fetch({
    method: 'put',
    url: `/customer/${customerId}`,
    data,
  })
    .then((res) => {
      if (res.data.success) {
        // dispatch(getCompanyData(listdata));
        resolve(true);
      } else {
        // dispatch(getCompanyData(listdata));
        reject(res.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

const deleteStoreCustomeAddress = (customerId, addressId) => (dispatch) => new Promise((resolve, reject) => {
  fetch({
    method: 'delete',
    url: `/customer/${customerId}/customer-address/${addressId}`,

  })
    .then((res) => {
      if (res.data.success) {
        // dispatch(getCompanyData(listdata));
        resolve(true);
      } else {
        // dispatch(getCompanyData(listdata));
        reject(res.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

const deleteStoreCustomeBank = (customerId, bankId) => (dispatch) => new Promise((resolve, reject) => {
  fetch({
    method: 'delete',
    url: `/customer/${customerId}/customer-bank/${bankId}`,

  })
    .then((res) => {
      if (res.data.success) {
        // dispatch(getCompanyData(listdata));
        resolve(true);
      } else {
        // dispatch(getCompanyData(listdata));
        reject(res.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
const deleteStoreCustomeDetail = (storeCustomerId) => (dispatch) => {
  dispatch(onLoading(true));
  const resData = [];
  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/customer/${storeCustomerId}`,
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

// const getCompanyData = (storeCustomeData) => (dispatch) => {
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
//           // dispatch(setStoreCustome(storeCustomeData, resData));
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

const setActionPage = (value) => ({
  type: 'SETACTION',
  actionPage: value,
});

const setStoreCustome = (data) => ({
  type: 'GETDATA',
  storeCustomeData: data,
});
const setStoreCustomerDetail = (data) => ({
  type: 'GETDETAIL',
  storeCustomerDetail: data,
});

const setCustomerType = (data) => ({
  type: 'GETCSTYPE',
  customerType: data,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

const setCompanyData = (data) => ({
  type: 'GETCOM',
  companyData: data,
});

export default {
  getStoreCustomer,
  // filterStoreCustome,
  createStoreCustome,
  // getOneById,
  deleteStoreCustomeDetail,
  setActionPage,
  updateStoreCustomeDetail,
  getStoreCustomerDetail,
  getCustomerType,
  deleteStoreCustomeAddress,
  deleteStoreCustomeBank,
  getCompanyData,
  setStoreCustomerDetail,
};
