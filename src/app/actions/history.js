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

const getUserPaymentData = (status, search, start_date, expire_date) => (dispatch) => {
    dispatch(onLoading(true));
    var url_call = '';
    if (status === undefined && search === undefined && start_date === undefined && expire_date === undefined){
        url_call = '/facebook-users/purchases';
    } else if (status !== undefined && search === undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status;
    } else if (status !== undefined && search !== undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search;
    } else if (status !== undefined && search === undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&startDate=' + start_date;
    } else if (status !== undefined && search === undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&expireDate=' + expire_date;
    } else if (status !== undefined && search !== undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&startDate=' + start_date;
    } else if (status !== undefined && search !== undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?status=' + status + '&search=' + search + '&expireDate=' + expire_date;
    } else if (status === undefined && search !== undefined && start_date === undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?search=' + search;
    } else if (status === undefined && search !== undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&startDate=' + start_date;
    } else if (status === undefined && search !== undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?search=' + search + '&expireDate=' + expire_date;
    } else if (status === undefined && search === undefined && start_date !== undefined && expire_date === undefined) {
        url_call = '/facebook-users/purchases?startDate=' + start_date;
    } else if (status === undefined && search === undefined && start_date !== undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?startDate=' + start_date + '&expireDate=' + expire_date;
    } else if (status === undefined && search === undefined && start_date === undefined && expire_date !== undefined) {
        url_call = '/facebook-users/purchases?expireDate=' + expire_date;
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
                        for (const elementOrder of element.orders){
                            var data = {
                                key: i,
                                userId: element.id,
                                id: elementOrder.id,
                                facebook_id: element.facebook_id,
                                status: elementOrder.state,
                                name: element.name,
                                package: elementOrder.package.name,
                                picture: element.picture,
                                purchases: element.purchases + " ครั้ง",
                                dateStart: element.start_date == null ? '' : element.start_date.substring(8, 10) + "/" + element.start_date.substring(5, 7) + "/" + element.start_date.substring(0, 4),
                                dateEnd: element.expire_date == null ? '' : element.expire_date.substring(8, 10) + "/" + element.expire_date.substring(5, 7) + "/" + element.expire_date.substring(0, 4),
                            }
                            list.push(data);
                            i += 1;
                        }
                    }
                    dispatch(setHistoryData([]));
                    dispatch(setHistoryData(list));
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

const updateIncreaseOrder = (facebookID, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'patch',
            url: '/orders/' + facebookID + '/increase',
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

const updateDecreaseOrder = (facebookID, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'patch',
            url: '/orders/' + facebookID + '/decrease',
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

const setHistoryData = (data) => ({
    type: 'GETDATA',
    historyData: data,
});

const setActionPage = (value) => ({
    type: 'SETACTION',
    actionPage: value,
});

export default {
    getUserPaymentData,
    updateIncreaseOrder,
    updateDecreaseOrder,
    setActionPage,
};
