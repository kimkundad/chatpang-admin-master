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

const getUserData = (status_paid, status, start_date, expire_date, search) => (dispatch) => {
    dispatch(onLoading(true));
    var url_call = '';
    if (status === undefined && search === undefined && status_paid === undefined && start_date === undefined && expire_date === undefined){
        url_call = '/facebook-users/purchases';
    } else if (status !== undefined && search === undefined && status_paid === undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status;
    } else if (status !== undefined && search !== undefined && status_paid === undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search;
    } else if (status !== undefined && search === undefined && status_paid !== undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&orderState=' + status_paid;
    } else if (status !== undefined && search === undefined && status_paid === undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&startDate=' + start_date;
    } else if (status !== undefined && search === undefined && status_paid === undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&expireDate=' + expire_date;
    } else if (status !== undefined && search !== undefined && status_paid !== undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&orderState=' + status_paid;
    } else if (status !== undefined && search !== undefined && status_paid === undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&startDate=' + start_date;
    } else if (status !== undefined && search !== undefined && status_paid === undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&expireDate=' + expire_date;
    } else if (status !== undefined && search !== undefined && status_paid !== undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&orderState=' + status_paid + '&startDate=' + start_date;
    } else if (status !== undefined && search !== undefined && status_paid !== undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&orderState=' + status_paid + '&expireDate=' + expire_date;
    } else if (status !== undefined && search !== undefined && status_paid !== undefined && start_date !== undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&orderState=' + status_paid + '&startDate=' + start_date + '&expireDate=' + expire_date;
    } else if (status === undefined && search !== undefined && status_paid === undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?search=' + search;
    } else if (status === undefined && search !== undefined && status_paid !== undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&orderState=' + status_paid;
    } else if (status === undefined && search !== undefined && status_paid === undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&startDate=' + start_date;
    } else if (status === undefined && search !== undefined && status_paid === undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&expireDate=' + expire_date;
    } else if (status === undefined && search !== undefined && status_paid !== undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&orderState=' + status_paid + '&startDate=' + start_date;
    } else if (status === undefined && search !== undefined && status_paid !== undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&orderState=' + status_paid + '&expireDate=' + expire_date;
    } else if (status === undefined && search !== undefined && status_paid !== undefined && start_date !== undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&orderState=' + status_paid + '&startDate=' + start_date + '&expireDate=' + expire_date;
    } else if (status === undefined && search === undefined && status_paid !== undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?orderState=' + status_paid;
    } else if (status === undefined && search === undefined && status_paid !== undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?orderState=' + status_paid + status_paid + '&startDate=' + start_date;
    } else if (status === undefined && search === undefined && status_paid !== undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?orderState=' + status_paid + status_paid + '&expireDate=' + expire_date;
    } else if (status === undefined && search === undefined && status_paid !== undefined && start_date !== undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?orderState=' + status_paid + status_paid + '&startDate=' + start_date + '&expireDate=' + expire_date;
    } else if (status === undefined && search === undefined && status_paid === undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?startDate=' + start_date;
    } else if (status === undefined && search === undefined && status_paid === undefined && start_date !== undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?startDate=' + start_date + '&expireDate=' + expire_date;
    } else if (status === undefined && search === undefined && status_paid === undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?expireDate=' + expire_date;
    } 

    // console.log('url_call : ', url_call)
    // console.log('ggg 1234 : ', window.localStorage.getItem(
    //     'authen-token',
    // ))
    return new Promise((resolve, reject) => {
        fetch({
            method: 'get',
            url: url_call,
        })
            .then((res) => {
                if (res.data.message === 'done') {
                    const list = [];
                    var i = 0;
                    dispatch(onLoading(false));
                    for (const element of res.data.data.results){
                        var data = {
                            key: i,
                            id: element.id.substring(element.id.length - 5, element.id.length),
                            id_send: element.id,
                            status_payment: element.current_order.state,
                            pages: element.pages + ' เพจ',
                            line_notification: element.line_notification,
                            status: element.status,
                            picture: element.picture,
                            purchases: element.purchases + ' ครั้ง',
                            name: element.name,
                            email: element.email,
                            tel: element.tel,
                            package: element.current_order.package.name,
                            start_date: element.start_date == null ? '' : element.start_date.substring(8, 10) + "/" + element.start_date.substring(5, 7) + "/" + element.start_date.substring(0, 4),
                            expire_date: element.expire_date == null ? '' : element.expire_date.substring(8, 10) + "/" + element.expire_date.substring(5, 7) + "/" + element.expire_date.substring(0, 4),
                        }
                        i += 1;
                        list.push(data)
                    }
                    dispatch(setUserData([]));
                    dispatch(setUserData(list));
                  } else {
                    dispatch(onLoading(false));
                    reject(res.data);
                  }
            })
            .catch((error) => {
                resolve(true);
                console.log(error);
            });
    });
};

const deletePageUser = (pageId) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'delete',
            url: `/facebook-pages/${pageId}`,
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

const updatePackageUser = (userId, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'patch',
            url: '/orders/' + userId + '/upgrade',
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

const onLoading = (action) => ({
    type: 'LOADING',
    isLoading: action,
});

const setUserData = (data) => ({
    type: 'GETDATA',
    userData: data,
});

const setActionPage = (value) => ({
    type: 'SETACTION',
    actionPage: value,
});

export default {
    getUserData,
    deletePageUser,
    updatePackageUser,
    setActionPage,
};
