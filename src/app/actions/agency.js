import { fetch } from '../../utils/fetch';

const getAgencyData = (query) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/agency',
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
          var name = '';
          for (i = 0; i < resData.length; i++) {
            if (resData[i].type == 1) {
              name = resData[i].firstName;
            } else {
              name = resData[i].firstName;
            }
            var obj = {
              key: resData[i].agencyId,
              hubData:
                resData[i].hubData == null ? '' : resData[i].hubData.hubName,
              hubId: resData[i].hubId,
              isActive: resData[i].isActive,
              agencyName: resData[i].agencyName,
              agencyCode: resData[i].agencyCode,
              agencyId: resData[i].agencyId,
              firstName: name,
              lastName: resData[i].lastName,
              phoneNo: resData[i].phoneNo,
              provinceName: resData[i].provinceData.provinceName,
              companyName:
                resData[i].companyData == null
                  ? ''
                  : resData[i].companyData.companyName,
              taxNumber: resData[i].taxNumber,
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

const getCompanyData = (agencyData) => (dispatch) => {
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

          dispatch(getHubList(agencyData, resData));
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

const getHubList = (agencyData, companyData) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/hub/dropdown',
    })
      .then((res) => {
        if (res.data.success) {
          //  dispatch(setHubList(res.data.data));
          dispatch(setHubData(agencyData, companyData, res.data.data));
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

const getAgencyDetail = (agencyId) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: `/agency/${agencyId}`,
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

const getCompanyDetailData = (agencyData) => (dispatch) => {
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
          dispatch(setAgencyDetail(agencyData, resData));
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

const getHubMasterList = (value) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/hub/dropdown?companyId=' + value,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(setHubListData(res.data.data));
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
};

const getAgencyDataSerachFilter =
  (filterCompany, filterHub, search, isNoHub, type) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
      fetch({
        method: 'get',
        url:
          '/agency?search=' +
          search +
          '&companyId=' +
          filterCompany +
          '&hubId=' +
          filterHub +
          '&nonHub=' +
          isNoHub,
      })
        .then((res) => {
          if (res.data.success) {
            const { data } = res.data;
            const resData = data.map((val, i) => {
              val.key = i + 1;
              return val;
            });

            if (type == 'company') {
              var i = 0;
              var list = [];
              var name = '';
              for (i = 0; i < resData.length; i++) {
                if (resData[i].type == 1) {
                  name = resData[i].firstName;
                } else {
                  name = resData[i].firstName;
                }
                var obj = {
                  key: resData[i].agencyId,
                  hubData:
                    resData[i].hubData == null
                      ? ''
                      : resData[i].hubData.hubName,
                  hubId: resData[i].hubId,
                  isActive: resData[i].isActive,
                  agencyName: resData[i].agencyName,
                  agencyCode: resData[i].agencyCode,
                  agencyId: resData[i].agencyId,
                  firstName: name,
                  lastName: resData[i].lastName,
                  phoneNo: resData[i].phoneNo,
                  provinceName: resData[i].provinceData.provinceName,
                  companyName:
                    resData[i].companyData == null
                      ? ''
                      : resData[i].companyData.companyName,
                  taxNumber: resData[i].taxNumber,
                };
                list.push(obj);
              }

              dispatch(getHubListFilter(list, filterCompany));
            } else {
              var i = 0;
              var list = [];
              var name = '';
              for (i = 0; i < resData.length; i++) {
                if (resData[i].type == 1) {
                  name = resData[i].firstName;
                } else {
                  name = resData[i].firstName;
                }
                var obj = {
                  key: resData[i].agencyId,
                  hubData:
                    resData[i].hubData == null
                      ? ''
                      : resData[i].hubData.hubName,
                  hubId: resData[i].hubId,
                  isActive: resData[i].isActive,
                  agencyName: resData[i].agencyName,
                  agencyCode: resData[i].agencyCode,
                  firstName: name,
                  lastName: resData[i].lastName,
                  phoneNo: resData[i].phoneNo,
                  provinceName: resData[i].provinceData.provinceName,
                  companyName:
                    resData[i].companyData == null
                      ? ''
                      : resData[i].companyData.companyName,
                  taxNumber: resData[i].taxNumber,
                };
                list.push(obj);
              }

              dispatch(setAgencyFilterSearchData(list));
              dispatch(onLoading(false));
              resolve(true);
            }
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

const getHubListFilter = (agencyData, value) => (dispatch) =>
  // dispatch(onLoading(true));
  new Promise((resolve, reject) => {
    fetch({
      method: 'get',
      url: '/hub/dropdown?companyId=' + value + '&search=',
    })
      .then((res) => {
        if (res.data.success) {
          //  dispatch(setHubList(res.data.data));
          dispatch(setAgencyCompFilterSearchData(agencyData, res.data.data));
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

const updateHubAgency = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/agency/update_hub',
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

const createAgencyDetail = (data) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'POST',
      url: '/agency',
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

const updateAgencyDetail = (agencyId, data) => (dispatch) => {
  dispatch(onLoading(true));
  return new Promise((resolve, reject) => {
    fetch({
      method: 'put',
      url: `/agency/${agencyId}`,
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

const deleteAgencyDetail = (agencyId) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'delete',
      url: `/agency/${agencyId}`,
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

const setHubSelect = (value) => ({
  type: 'SELECTHUB',
  hubSelected: value,
});

const setHubData = (data, dataCompany, hubData) => ({
  type: 'GETDATA',
  agencyData: data,
  companyData: dataCompany,
  hubData: hubData,
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

const setAgencyFilterSearchData = (data) => ({
  type: 'GETSEARCHDATA',
  agencyData: data,
});

const setAgencyCompFilterSearchData = (data, hubData) => ({
  type: 'GETSEARCHCOMPDATA',
  agencyData: data,
  hubData: hubData,
});

const setAgencyDetail = (detail, dataCompany) => ({
  type: 'GETDETAIL',
  agencyDetail: detail,
  companyData: dataCompany,
});

const setHubListData = (data) => ({
  type: 'GETHUBLISTDATA',
  hubData: data,
});

export default {
  getAgencyData,
  setActionPage,
  getAgencyDataSerachFilter,
  getHubMasterList,
  updateHubAgency,
  setHubSelect,
  createAgencyDetail,
  getAgencyDetail,
  updateAgencyDetail,
  deleteAgencyDetail,
};
