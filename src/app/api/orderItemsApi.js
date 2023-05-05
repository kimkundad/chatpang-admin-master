// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import URL from 'url';
import { message } from 'antd';
import moment from 'moment';

import apiConfig from './apiConfig';

export const orderItemsApi = createApi({
  reducerPath: 'orderItems',
  baseQuery: fetchBaseQuery({ baseUrl: `${apiConfig.endpoint}` }),
  tagTypes: [
    'Recipient', 'OrderItems', 'Orders', "Province",
    "SubDistrict", "District"
  ], //https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
  endpoints: (builder) => ({
    // List รายการพัสดุ
    getOrderItems: builder.query({
      query(query) {
        return {
          url: `/v2/orderItem${URL.format({ query })}`,
          headers: apiConfig.headers(),
        };
      },
      // keepUnusedDataFor: 10,
      // extraOptions: apiConfig.extraOptions,
      transformResponse(response) {
        return response.data;
      },
      providesTags: [{ type: 'OrderItems', id: 'LIST' }], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
      //Advanced Invalidation with abstract tag IDs
    }),

    // Import ผู้รับ - ตรวจสอบและนำเข้าข้อมูล
    importRecipient: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/storeSell/upload/recipient`,
        headers: apiConfig.headers(),
        method: 'POST',
        body: patch,
      }),
      invalidatesTags: [{ type: 'Recipient', id: 'LIST' }],
    }),

    // Import Customer - Migration
    importCustomer: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/storeSell/upload/customer`,
        headers: apiConfig.headers(),
        method: 'POST',
        body: patch,
      }),
      invalidatesTags: [{ type: 'Recipient', id: 'LIST' }],
    }),

    // Import รายการพัสดุ - ตรวจสอบและนำเข้าข้อมูล
    importOrderItems: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/storeSell/upload/order_item`,
        headers: apiConfig.headers(),
        method: 'POST',
        body: patch,
      }),
      invalidatesTags: ['OrderItems'],
    }),

    // List รายการพัสดุ Import / Draft
    getOrderItemsImport: builder.query({
      query(state) {
        return {
          url: `/storeSell/order_item/list/${state}`,
          headers: apiConfig.headers(),
        };
      },
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // `onStart` side-effect
        // dispatch(messageCreated('Fetching post...'))
        try {
          // `onSuccess` side-effect
          const { data } = await queryFulfilled
          // dispatch(messageCreated('Post received!'))
        } catch (err) {
          // `onError` side-effect
          // dispatch(messageCreated('Error fetching post!'))
          message.error(err?.error?.error)
        }
      },
      // providesTags: ["OrderItems"],
      providesTags: (result, error, arg) => {
        console.log("arg", arg)
        return [{ type: 'OrderItems', id: arg }]
      },
      transformResponse(response) {
        const retData = response.data.map((row) => {
          row["receiptNo"] = row?.orderData?.soNo ? row?.orderData?.soNo : row?.orderData?.receiptNo;
          return row;
        })
        return retData;
      },
    }),

    // Delete รายการพัสดุ
    deleteOrderItems: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/storeSell/orderItem/draft`,
        headers: apiConfig.headers(),
        method: 'DELETE',
        body: patch,
      }),
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // try {
        //   const { data } = await queryFulfilled
        // } catch (err) {
        //   message.error(err?.error?.error)
        // }
      },
      invalidatesTags: ['OrderItems', "Orders"],
    }),

    // CreateOrder 
    createOrder: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/storeSell/order/draft`,
        headers: apiConfig.headers(),
        method: 'POST',
        body: patch,
      }),
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // try {
        //   const { data } = await queryFulfilled
        // } catch (err) {
        //   message.error(err?.error?.error)
        // }
      },
      invalidatesTags: ['OrderItems', 'Orders'],
    }),

    // นำออก 
    removeDOfromOrder: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/storeSell/order/draft2import`,
        headers: apiConfig.headers(),
        method: 'POST',
        body: patch,
      }),
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // try {
        //   const { data } = await queryFulfilled
        // } catch (err) {
        //   message.error(err?.error?.error)
        // }
      },
      invalidatesTags: ['Orders', 'OrderItems'],
    }),

    // Add เพิ่ม รายการพัสดุ - ตรวจสอบและนำเข้าข้อมูล
    addOrderItems: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/storeSell/order/insert/orderitem`,
        headers: apiConfig.headers(),
        method: 'POST',
        body: patch,
      }),
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // try {
        //   const { data } = await queryFulfilled
        // } catch (err) {
        //   message.error(err?.error?.error)
        // }
      },
      invalidatesTags: ['OrderItems'],
    }),

    // List order DRF
    getDRFOrder: builder.query({
      query(state) {
        return {
          url: `/storeSell/order/list/DRF`,
          headers: apiConfig.headers(),
        };
      },
      transformResponse(response) {
        // moment(text).format('DD-MM-YYYY HH:mm') 
        // var ret = []
        // if(response?.data?.length > 0){
        //   ret = response.data.map((row)=>{
        //     return {
        //       createdAt : moment(row.createdAt).format('DD-MM-YYYY HH:mm') ,

        //     }
        //   })
        // } 

        return response.data;
      },
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // try {
        //   const { data } = await queryFulfilled
        // } catch (err) {
        //   message.error(err?.error?.error)
        // }
      },
      providesTags: ['Orders'],
    }),

    // Delete ใบเสร็จ
    deleteOrders: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/orders/delete/multiOrder`,
        headers: apiConfig.headers(),
        method: 'DELETE',
        body: patch,
      }),
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // try {
        //   const { data } = await queryFulfilled
        // } catch (err) {
        //   message.error(err?.error?.error)
        // }
      },
      invalidatesTags: ['OrderItems', 'Orders'],
    }),


    // Get Order+Dos (หน้าเปิดการขายเดิม)
    getOrderWithDos: builder.query({
      query(query) {
        console.log("getOrderDetail-getOrderWithDos",query)
        return {
          url: `/orders/${query}`,
          headers: apiConfig.headers(),
        };
      },
      // keepUnusedDataFor: 10,
      // extraOptions: apiConfig.extraOptions,
      transformResponse(response) {
        console.log("getOrderDetail-response",response)
        return response.data;
      },
      providesTags: [{ type: 'OrderItems', id: 'LIST' }], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
      //Advanced Invalidation with abstract tag IDs
    }),

    // bypass 
    bypassOrderItems: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/v2/orderItem/multi-by-pass`,
        headers: apiConfig.headers(),
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        // try {
        //   const { data } = await queryFulfilled
        // } catch (err) {
        //   message.error(err?.error?.error)
        // }
      },
      invalidatesTags: ['OrderItems'],
    }),

    // callProvince จังหวัด 
    getProvince: builder.query({
      query() {
        return {
          url: `/master/province`,
          headers: apiConfig.headers(),
        };
      },
      // keepUnusedDataFor: 10,
      // extraOptions: apiConfig.extraOptions,
      transformResponse(response) {
        return response.data;
      },
      providesTags: [{ type: 'Province' }], // ถ้าเจอ invalidatesTags จะ reload ให้ใหม่
      //Advanced Invalidation with abstract tag IDs
    }),

    // callDistrict ตำบล 
    getDistrict: builder.query({
      query(provinceId) {
        return {
          url: `/master/district/?provinceId=${provinceId}`,
          headers: apiConfig.headers(),
        };
      },
      // keepUnusedDataFor: 10,
      // extraOptions: apiConfig.extraOptions,
      transformResponse(response) {
        return response.data;
      },
      providesTags: [{ type: 'District' }],
    }),

    // callSubDistrict ตำบล 
    getSubDistrict: builder.query({
      query(districtId) {
        return {
          url: `/master/subdistrict/?districtId=${districtId}`,
          headers: apiConfig.headers(),
        };
      },
      // keepUnusedDataFor: 10,
      // extraOptions: apiConfig.extraOptions,
      transformResponse(response) {
        return response.data;
      },
      providesTags: [{ type: 'SubDistrict' }],
    }),

    // เพิ่ม / อัพเดต DO
    upsertOrderItem: builder.mutation({
      query: (params) => {
        console.log("upsertOrderItem", params)
        return {
          url: `/v2/orders/${params.orderId}/orderItem`,
          headers: apiConfig.headers(),
          method: 'PUT',
          body: params.patch,
        }
      },
      async onQueryStarted(query, { dispatch, queryFulfilled }) {
        console.log()
      },
      invalidatesTags: ['Orders', 'OrderItems'],
    }),

  }),
});

export const {
  useGetOrderItemsQuery,
  useImportRecipientMutation,
  useImportCustomerMutation,
  useImportOrderItemsMutation,
  useGetOrderItemsImportQuery,
  useDeleteOrderItemsMutation,
  useCreateOrderMutation,
  useRemoveDOfromOrderMutation,
  useAddOrderItemsMutation,
  useGetDRFOrderQuery,
  useDeleteOrdersMutation,
  useGetOrderWithDosQuery,
  useBypassOrderItemsMutation,
  useGetProvinceQuery,
  useGetDistrictQuery,
  useGetSubDistrictQuery,
  useUpsertOrderItemMutation,
} = orderItemsApi;
