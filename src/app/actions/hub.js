import { fetch } from '../../utils/fetch';

const getHubData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/hub',
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
          var objAdmin = {};
          for (i = 0; i < resData.length; i++) {
            var obj = {
              no: i + 1,
              key: resData[i].hubId,
              hubName: resData[i].hubName,
              hubCode: resData[i].hubCode,
              phoneNo: resData[i].phoneNo,
              isActive: resData[i].isActive,
              provinceName: resData[i].provinceData.provinceName,
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

const getCompanyData = (hubData) => (dispatch) => {
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
          dispatch(setHubData(hubData, resData));
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

const getHubDetail = (hubId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/hub/${hubId}`,
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

const getCompanyDetailData = (hubDetailData) => (dispatch) => {
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
          dispatch(setHubDetail(hubDetailData, resData));
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

const getHubDataSerachFilter = (filter, search) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/hub?search=' + search + '&companyId=' + filter,
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
              key: resData[i].hubId,
              hubName: resData[i].hubName,
              hubCode: resData[i].hubCode,
              phoneNo: resData[i].phoneNo,
              isActive: resData[i].isActive,
              provinceName: resData[i].provinceData.provinceName,
              companyName:
                resData[i].companyData == null
                  ? ''
                  : resData[i].companyData.companyName,
            };
            list.push(obj);
          }

          dispatch(setHubFilterSearchData(list));
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

const createHubDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/hub',
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

const updateHubDetail = (hubId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/hub/${hubId}`,
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

const deleteHubDetail = (hubId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/hub/${hubId}`,
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

const setHubFilterSearchData = (data) => ({
  type: 'GETSEARCHDATA',
  hubData: data,
});

const setHubData = (data, dataCompany) => ({
  type: 'GETDATA',
  hubData: data,
  companyData: dataCompany,
});

const setHubDetail = (detail, dataCompany) => ({
  type: 'GETDETAIL',
  hubDetail: detail,
  companyData: dataCompany,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  getHubData,
  getHubDetail,
  setActionPage,
  getHubDataSerachFilter,
  createHubDetail,
  updateHubDetail,
  deleteHubDetail,
};
