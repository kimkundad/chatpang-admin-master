import { fetch } from '../../utils/fetch';

const getAgencyTypeData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/agency-type',
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
              key: resData[i].agencyTypeId,
              agencyTypeName: resData[i].agencyTypeName,
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
          dispatch(setAgencyTypeData(settingAgencyData, resData));
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

const getAgencyTypeDetail = (agencyTypeId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/agency-type/${agencyTypeId}`,
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

const getCompanyDetailData = (settingAgencyDetailData) => (dispatch) => {
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
          dispatch(setAgencyTypeDetail(settingAgencyDetailData, resData));
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

const getAgencyTypeDataSerachFilter = (filter, search) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/agency-type?search=' + search + '&companyId=' + filter,
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
              key: resData[i].agencyTypeId,
              agencyTypeName: resData[i].agencyTypeName,
              companyName:
                resData[i].companyData == null
                  ? ''
                  : resData[i].companyData.companyName,
            };
            list.push(obj);
          }

          dispatch(setAgencyTypeFilterSearchData(list));
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

const createAgencyTypeDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/agency-type',
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

const updateAgencyTypeDetail = (agencyTypeId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/agency-type/${agencyTypeId}`,
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

const deleteAgencyTypeDetail = (agencyTypeId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/agency-type/${agencyTypeId}`,
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

const setAgencyTypeFilterSearchData = (data) => ({
  type: 'GETSEARCHDATA',
  agencyTypeData: data,
});

const setAgencyTypeData = (data, dataCompany) => ({
  type: 'GETDATA',
  agencyTypeData: data,
  companyData: dataCompany,
});

const setAgencyTypeDetail = (detail, dataCompany) => ({
  type: 'GETDETAIL',
  agencyTypeDetail: detail,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getAgencyTypeData,
  getAgencyTypeDetail,
  setActionPage,
  getAgencyTypeDataSerachFilter,
  createAgencyTypeDetail,
  updateAgencyTypeDetail,
  deleteAgencyTypeDetail,
};
