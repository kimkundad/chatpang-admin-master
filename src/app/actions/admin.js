/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-trailing-spaces */
/* eslint-disable semi */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-template */
/* eslint-disable quotes */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable one-var */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable space-before-blocks */
import { fetch } from '../../utils/fetch';

const createAdminData = (data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'post',
            url: '/admins',
            data,
        })
            .then((res) => {
                dispatch(onLoading(false));
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

const getAdminData = (status, search) => (dispatch) => {
    dispatch(onLoading(true));
    var url_call = '';
    if (status === undefined && search === undefined){
        url_call = '/admins';
    } else {
        if (status !== undefined && search === undefined){
            url_call = '/admins?status=' + status;
        } else if (status === undefined && search !== undefined){
            url_call = '/admins?search=' + search;
        } else {
            url_call = '/admins?status=' + status + '&search=' + search;
        }
    }
    return new Promise((resolve, reject) => {
        fetch({
            method: 'get',
            url: url_call,
        })
            .then((res) => {
                if (res.data.message === 'done') {
                    dispatch(onLoading(false));
                    const list = [];
                    var i = 0;
                    for (const element of res.data.data.results){
                     // eslint-disable-next-line vars-on-top
                    var data = {
                        key: i,
                        id: element.id.substring(element.id.length - 5, element.id.length),
                        id_send: element.id,
                        username: element.username,
                        email: element.email,
                        role: element.role,
                        picture: element.picture,
                        status: element.status,
                        tel: element.tel,
                        name: element.first_name + " " + element.last_name,
                        last_login: element.last_login === undefined ? "" : element.last_login.substring(8, 10) + "/" + element.last_login.substring(5, 7) + "/" + element.last_login.substring(0, 4),
                    }
                    i += 1;
                    list.push(data);
                }
                    dispatch(setAdminData(list));
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

const updateAdminDetail = (adminId, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'put',
            url: `/admins/${adminId}`,
            data,
        })
            .then((res) => {
                dispatch(onLoading(false));
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

const deleteAdmin = (adminId) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'delete',
            url: `/admins/${adminId}`,
        })
            .then((res) => {
                dispatch(onLoading(false));
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

// const getHistoryDetail = (lineId) => (dispatch) => {
//     dispatch(onLoading(true));
//     return new Promise((resolve, reject) => {
//         fetch({
//             method: 'get',
//             url: `/notifications/detail/${lineId}`,
//         })
//             .then((res) => {
//                 dispatch(setLineDetail(res.data));
//                 dispatch(onLoading(false));
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     });
// };

// const updateHistoryDetail = (lineId, data) => (dispatch) => {
//     dispatch(onLoading(true));
//     return new Promise((resolve, reject) => {
//         fetch({
//             method: 'patch',
//             url: `/notifications/${lineId}`,
//             data,
//         })
//             .then((res) => {
//                 dispatch(onLoading(false));
//                 resolve(true);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     });
// };

const onLoading = (action) => ({
    type: 'LOADING',
    isLoading: action,
});

const setAdminData = (data) => ({
    type: 'GETDATA',
    adminData: data,
});

// const setLineDetail = (detail) => ({
//     type: 'GETDETAIL',
//     historyDetail: detail,
// });

const setActionPage = (value) => ({
    type: 'SETACTION',
    actionPage: value,
});

export default {
    createAdminData,
    getAdminData,
    setActionPage,
    updateAdminDetail,
    deleteAdmin,
};
