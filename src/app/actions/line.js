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

const getLineData = (status, search) => (dispatch) => {
    dispatch(onLoading(true));
    var url_call = '';
    if (status === undefined && search === undefined){
        url_call = '/line-notifications';
    } else {
        if (status !== undefined && search === undefined){
            url_call = '/line-notifications?status=' + status;
        } else if (status === undefined && search !== undefined){
            url_call = '/line-notifications?search=' + search;
        } else {
            url_call = '/line-notifications?status=' + status + '&search=' + search;
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
                        // eslint-disable-next-line no-var
                        var data = {
                            key: i,
                            id: element.id,
                            status: element.status,
                            name: element.name,
                            token: element.token,
                        };
                        i += 1;
                        list.push(data);
                    }
                    dispatch(setLineData([]));
                    dispatch(setLineData(list));
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

const updateLineDetail = (lineId, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'put',
            url: `/line-notifications/${lineId}`,
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

const deleteLine = (lineId) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'delete',
            url: `/line-notifications/${lineId}`,
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

const setLineData = (data) => ({
    type: 'GETDATA',
    lineData: data,
});

const setActionPage = (value) => ({
    type: 'SETACTION',
    actionPage: value,
});

export default {
    getLineData,
    setActionPage,
    updateLineDetail,
    deleteLine,
};
