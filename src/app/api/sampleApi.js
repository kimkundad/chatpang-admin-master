// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import URL from 'url';

const ENV = process.env.REACT_APP_ENV;
const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: `${endpoint}` }),
  //ต้องกำหนด tagTypes สำหรับการทำ auto refresh
  tagTypes: ['OrderItems'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getOrderItems: builder.query({
      // The URL for the request is '/fakeApi/posts'
      // ${URL.format({ query })}
      query(query) {
        return {
          url: `/v2/orderItem${URL.format({ query })}`,
          headers: { Authorization: `Bearer ${window.localStorage.getItem(`user-token-${ENV}`,)}` }
        }
      },
      extraOptions: { maxRetries: 8 },
      transformResponse(response) {
        return response.data
      },
      providesTags: [ 'OrderItems' ], // ถ้าเจอ invalidatesTags จำ reload ให้ใหม่
      //Advanced Invalidation with abstract tag IDs
    })
  })
})

// Export the auto-generated hook for the `getOrderItems` query endpoint
export const { useGetOrderItemsQuery } = apiSlice