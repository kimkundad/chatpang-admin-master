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

const createPackageData = (data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'post',
            url: '/packages',
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

const getPackageData = (status, search) => (dispatch) => {
    var url_call = ''
    if (status === undefined && search === undefined){
        url_call = '/packages';
    } else {
        if (status !== undefined && search === undefined){
            url_call = '/packages?status=' + status;
        } else if (status === undefined && search !== undefined){
            url_call = '/packages?search=' + search;
        } else {
            url_call = '/packages?status=' + status + '&search=' + search;
        }
    }
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'get',
            url: url_call,
        })
            .then((res) => {
                if (res.data.message === 'done') {
                    dispatch(onLoading(false));
                    const list = [];
                    for (const element of res.data.data.results){
                            // eslint-disable-next-line vars-on-top, no-var
                            console.log('element : ', element)
                            var data = {
                                id: element.id,
                                status: element.status,
                                name: element.name,
                                price: element.price,
                                page_limit: element.page_limit.toString() + " เพจ",
                                days: element.days.toString() + " วัน",
                                special_text: element.special_text, 
                            }
                            list.push(data);
                    }
                    dispatch(setPackageData([]));
                    dispatch(setPackageData(list));
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

const updatePackageDetail = (packageId, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'put',
            url: `/packages/${packageId}`,
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

const deletePackage = (packageId) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'delete',
            url: `/packages/${packageId}`,
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

const setPackageData = (data) => ({
    type: 'GETDATA',
    packageData: data,
});

const setActionPage = (value) => ({
    type: 'SETACTION',
    actionPage: value,
});

export default {
    getPackageData,
    updatePackageDetail,
    createPackageData,
    deletePackage,
    setActionPage,
};
