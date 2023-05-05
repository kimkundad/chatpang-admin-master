// import { createSlice, current } from "@reduxjs/toolkit";

import {
    createSlice,
    current,
    createAsyncThunk,
    isPending,
    isFulfilled,
    isRejectedWithValue,
} from '@reduxjs/toolkit'

import moment from 'moment';
import { message } from 'antd';

const initialState = {
    createdChartTime: null,

    companyId : "",
    hubId : "",
    allAgency : false,

    // createdAt : [moment(new Date(), 'DD-MM-YYYY').subtract(2, 'days'), moment(new Date(), 'DD-MM-YYYY')],
    // createdAt : [moment(new Date()).subtract(3, 'days'), moment(new Date())],
    startDate : moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'),
    endDate :  moment(new Date()).format('YYYY-MM-DD'),
};

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        reset: (state, action) => initialState,
        setCreatedChartTime: (state, action) => {
            console.log("state.createdAt",action.payload)
            state.companyId =  action.payload?.companyId || ""
            state.hubId =  action.payload?.hubId || ""
            state.allAgency =  action.payload?.allAgency || false

            state.startDate =  action.payload?.createdAt ? moment(action.payload?.createdAt[0]).format('YYYY-MM-DD') : null
            state.endDate =  action.payload?.createdAt ? moment(action.payload?.createdAt[1]).format('YYYY-MM-DD') : null
            state.createdChartTime = new Date();
        },

        // increment: (state) => {
        //   console.log(current(state)); //จะดูค่าใน state ต้องใช้ current(state)
        //   state.value += 1;
        // },
    },
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = dashboardSlice.actions;
export const dashboardAction = dashboardSlice.actions;

export default dashboardSlice.reducer;


  // const onLogout = () => ({
  //   type: 'LOGOUT',
  //   name: '',
  // });