import { fetch } from '../../utils/fetch';

const getAgencyBankData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/bank',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });

          var i = 0;
          var list = [];
          for (i = 0; i < resData.length; i++) {
            var obj = {
              no: i + 1,
              key: resData[i].bankId,
              bankName: resData[i].bankName,
              bankCode: resData[i].bankCode,
              companyName:
                resData[i].companyData == null
                  ? ''
                  : resData[i].companyData.companyName,
            };
            list.push(obj);
          }
          dispatch(getCompanyData(list));
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

const getCompanyData = (settingAgencyData) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/company',
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          dispatch(setAgencyBankData(settingAgencyData, resData));
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

const getAgencyBankDetail = (bankId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/bank/${bankId}`,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(getCompanyDetailData(res.data.data));
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

const getCompanyDetailData = (settingAgencyBankData) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/company',
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          dispatch(setAgencyBankDetail(settingAgencyBankData, resData));
          //  dispatch(setActionPage('detail'))
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

const getAgencyBankDataSerachFilter = (filter, search) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/bank?search=' + search + '&companyId=' + filter,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });

          var i = 0;
          var list = [];
          for (i = 0; i < resData.length; i++) {
            var obj = {
              no: i + 1,
              key: resData[i].bankId,
              bankName: resData[i].bankName,
              bankCode: resData[i].bankCode,
              companyName:
                resData[i].companyData == null
                  ? ''
                  : resData[i].companyData.companyName,
            };
            list.push(obj);
          }

          dispatch(setAgencyBankFilterSearchData(list));
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

const createAgencyBankDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/bank',
      data,
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

const updateAgencyBankDetail = (bankId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/bank/${bankId}`,
      data,
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

const deleteAgencyBankDetail = (bankId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/bank/${bankId}`,
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

const setActionPage = (value) => ({
  type: 'SETACTION',
  actionPage: value,
});

const setAgencyBankFilterSearchData = (data) => ({
  type: 'GETSEARCHDATA',
  agencyBankData: data,
});

const setAgencyBankData = (data, dataCompany) => ({
  type: 'GETDATA',
  agencyBankData: data,
  companyData: dataCompany,
});

const setAgencyBankDetail = (detail, dataCompany) => ({
  type: 'GETDETAIL',
  agencyBankDetail: detail,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getAgencyBankData,
  getAgencyBankDetail,
  setActionPage,
  getAgencyBankDataSerachFilter,
  createAgencyBankDetail,
  updateAgencyBankDetail,
  deleteAgencyBankDetail,
};
