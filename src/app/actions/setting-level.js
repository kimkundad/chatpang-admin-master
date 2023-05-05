import { fetch } from '../../utils/fetch';

const getAgencyLevelData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/agency-level',
      query,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          dispatch(getCompanyData(resData));
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
          dispatch(setAgencyLevelData(settingAgencyData, resData));
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

const getAgencyLevelDetail = (agencyTypeId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/agency-level/${agencyTypeId}`,
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

          dispatch(setAgencyLevelDetail(settingAgencyDetailData, resData));
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

const getAgencyLevelDataSerachFilter = (filter, search) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/agency-level?search=' + search + '&companyId=' + filter,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });

          dispatch(setAgencyLevelFilterSearchData(resData));
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

const createAgencyLevelDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/agency-level',
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

const updateAgencyLevelDetail = (agencyLevelId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/agency-level/${agencyLevelId}`,
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

const deleteAgencyLevelDetail = (agencyLevelId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/agency-level/${agencyLevelId}`,
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

const setAgencyLevelFilterSearchData = (data) => ({
  type: 'GETSEARCHDATA',
  agencyLevelData: data,
});

const setAgencyLevelData = (data, dataCompany) => ({
  type: 'GETDATA',
  agencyLevelData: data,
  companyData: dataCompany,
});

const setAgencyLevelDetail = (detail, dataCompany) => ({
  type: 'GETDETAIL',
  agencyLevelDetail: detail,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getAgencyLevelData,
  getAgencyLevelDetail,
  setActionPage,
  getAgencyLevelDataSerachFilter,
  createAgencyLevelDetail,
  updateAgencyLevelDetail,
  deleteAgencyLevelDetail,
};
