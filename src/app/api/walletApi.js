// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import URL from 'url';
import { message } from 'antd';
import moment from 'moment';

import apiConfig from './apiConfig';

export const walletApi = createApi({
    reducerPath: 'Wallet',
    baseQuery: fetchBaseQuery({ baseUrl: `${apiConfig.endpoint}` }),
    tagTypes: [
        'Wallet'
    ], //https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
    endpoints: (builder) => ({
        getAgencyWallet: builder.query({
            query(agencyId) {
                // console.log("messageListener - query")
                return {
                    url: `/agency/${agencyId}/wallet`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Wallet'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getEnquiry: builder.query({
            query(agencyWalletTransactionId) {
                // console.log("messageListener - query")
                return {
                    url: `/wallet/enquiry/${agencyWalletTransactionId}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Wallet'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),
    }),
});

export const {
    useGetAgencyWalletQuery,
    useGetEnquiryQuery,
    useLazyGetEnquiryQuery
} = walletApi;
