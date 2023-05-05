// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import URL from 'url';
import { message } from 'antd';
import moment from 'moment';

import apiConfig from './apiConfig';

export const dashboardApi = createApi({
    reducerPath: 'Dashboard',
    baseQuery: fetchBaseQuery({ baseUrl: `${apiConfig.endpoint}` }),
    tagTypes: [
        'Dashboard',
    ], //https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
    endpoints: (builder) => ({
        getTopParcel: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_parcel?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopTransporationPrice: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_transportation_price?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopTransporationNetPrice: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_transportation_net_price?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopCod: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_cod?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopChargeCodPrice: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_charge_cod_price?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopVolume: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_volume?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopWeight: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_weight?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopSender: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_sender?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopRate: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_rate?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopProvince: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_province?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("messageListener - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopWallet: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_wallet?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("getTopWallet - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),

        getTopTransportation: builder.query({
            query({ companyId,
                hubId,
                allAgency,
                startDate,
                endDate }) {
                return {
                    url: `/dashboard/top_transportation?companyId=${companyId}&allAgency=${allAgency}&hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`,
                    headers: apiConfig.headers(),
                };
            },
            // keepUnusedDataFor: 10,
            // extraOptions: apiConfig.extraOptions,
            transformResponse(response) {
                // console.log("getTopTransportation - response",response)
                return response.data;
            },
            providesTags: ['Dashboard'], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
            //Advanced Invalidation with abstract tag IDs
        }),
    }),
});

export const {
    useGetTopParcelQuery,
    useLazyGetTopParcelQuery,

    useLazyGetTopTransporationPriceQuery,
    useLazyGetTopTransporationNetPriceQuery,
    useLazyGetTopCodQuery,
    useLazyGetTopChargeCodPriceQuery,
    useLazyGetTopTransportationQuery,
    useLazyGetTopVolumeQuery,
    useLazyGetTopWeightQuery,
    useLazyGetTopSenderQuery,
    useLazyGetTopRateQuery,
    useLazyGetTopProvinceQuery,
    useLazyGetTopWalletQuery,

    useGetTopTransporationPriceQuery,
    useGetTopTransporationNetPriceQuery,
    useGetTopCodQuery,
    useGetTopChargeCodPriceQuery,
    useGetTopTransportationQuery,
    useGetTopVolumeQuery,
    useGetTopWeightQuery,
    useGetTopSenderQuery,
    useGetTopRateQuery,
    useGetTopProvinceQuery,
    useGetTopWalletQuery,
} = dashboardApi;
