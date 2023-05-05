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

const getCompanyDetail = (companyId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/company/${companyId}`,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setCompanyDetail(res.data.data));
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

const createCompanyDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/company',
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

const updateCompanyDetail = (companyId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/company/${companyId}`,
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

const deleteCompanyDetail = (companyId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/company/${companyId}`,
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

const setNewCompany = (value) => ({
  type: 'SETNEWCOMPANY',
  companyDetail: value,
});
const setNewAdmin = (value) => ({
  type: 'SETNEWADMIN',
  adminDetail: value,
});

const setActionPage = (value) => ({
  type: 'SETACTION',
  actionPage: value,
});

const setCompanyData = (data) => ({
  type: 'GETDATA',
  companyData: data,
});

const setCompanyDetail = (detail) => ({
  type: 'GETDETAIL',
  companyDetail: detail,
  adminDetail: detail?.admin,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getCompanyData,
  getCompanyDetail,
  createCompanyDetail,
  updateCompanyDetail,
  deleteCompanyDetail,
  setActionPage,
  setNewCompany,
  setNewAdmin,
};
