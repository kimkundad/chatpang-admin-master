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

const getReviewData = (search) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'get',
            url: search === null ? '/reviews' : '/reviews?search=' + search,
        })
            .then((res) => {
                if (res.data.message === 'done') {
                    dispatch(onLoading(false));
                    dispatch(setReviewData([]));
                    dispatch(setReviewData(res.data.data.results));
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

const updateReviewDetail = (reviewId, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'put',
            url: `/reviews/${reviewId}`,
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

const deleteReview = (reviewId, data) => (dispatch) => {
    dispatch(onLoading(true));
    return new Promise((resolve, reject) => {
        fetch({
            method: 'delete',
            url: `/reviews/${reviewId}`,
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

const setReviewData = (data) => ({
    type: 'GETDATA',
    reviewData: data,
});

const setActionPage = (value) => ({
    type: 'SETACTION',
    actionPage: value,
});

export default {
    getReviewData,
    updateReviewDetail,
    setActionPage,
    deleteReview,
};
