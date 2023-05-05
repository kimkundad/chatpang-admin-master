// import { createSlice, current } from "@reduxjs/toolkit";

import {
  createSlice,
  current,
  createAsyncThunk,
  isPending,
  isFulfilled,
  isRejectedWithValue,
} from '@reduxjs/toolkit'

import authenAction from './../actions/authen'

import { message } from 'antd';

const initialState = {
  value: 0,
  importRecipientSuccess: false,
  importDOSuccess: false,
  
  senderInput: null,
  orderId: null,
  receiptNo: null,
  soNo: null,

  editingDo: null,
  isLoading: false,

  //form footer
  discountPercent: 0.0,
  discountAmount: 0.0,
  transportationPriceAfterDiscount: 0.0,
  morePriceAmount: 0.0,
  etcAmount: 0.0,
  totalItem: 0,

  showDoForm: false,

  postcodeRefresh: null,

  viewOnly: false
};

export const orderItemImportSlice = createSlice({
  name: "orderItemImport",
  initialState,
  reducers: {
    setImportRecipientSuccess: (state, action) => {
      state.importRecipientSuccess = action.payload;
    },
    setImportDOSuccess: (state, action) => {
      state.importDOSuccess = action.payload;
    },
    setEditingOrder: (state, action) => {
      state.orderId = action.payload.orderId;
      state.receiptNo = action.payload.receiptNo;
      state.soNo = action.payload.soNo;
      state.senderInput = action.payload.senderInput;
    },
    setEditingDo: (state, action) => {
      state.editingDo = action.payload;
    },

    setFormUpdate: (state, action) => {
      state.discountPercent = action.payload?.discountPercent
      state.discountAmount = action.payload?.discountAmount
      state.transportationPriceAfterDiscount = action.payload?.transportationPriceAfterDiscount
      state.morePriceAmount = action.payload?.morePriceAmount
      state.etcAmount = action.payload?.etcAmount
      state.totalItem = action.payload?.totalItem
    },

    setShowDoForm: (state, action) => {
      state.showDoForm = action.payload
    },

    setPostcodeRefresh: (state, action) => {
      state.postcodeRefresh = action.payload
    },

    setViewOnly: (state, action) => {
      state.viewOnly = action.payload
    },
    // increment: (state) => {
    //   console.log(current(state)); //จะดูค่าใน state ต้องใช้ current(state)
    //   state.value += 1;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(authenAction.onLogout,(state, action) => {
      return state + action.payload
    })
    builder
      .addMatcher(isPending(), (state, action) => {
        console.log("isPending", action)
        state.isLoading = true;
      })
    builder
      .addMatcher(isFulfilled(), (state, action) => {
        console.log("isFulfilled", action)
        state.isLoading = false;

      })
    builder
      .addMatcher(isRejectedWithValue(), (state, action) => {
        console.log("isRejectedWithValue", action)
        if (action?.meta?.arg?.endpointName == "importRecipient" ||
          action?.meta?.arg?.endpointName == "importOrderItems" ||
          action?.payload?.data == "Unauthorized" 
        ) {

          if(action?.payload?.data == "Unauthorized") {
            // orderItemImportSlice.caseReducers.onLogout();
          }
          //
        } else {
          if (action?.payload?.data?.message) message.error(action?.payload?.data?.message)
          else message.error(action?.error?.message)
          // action.payload = action.error.meta.error
          // console.log("isRejectedWithValue", action)
        }
        state.isLoading = false;
      })
  },
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = orderItemImportSlice.actions;
export const orderItemImportAction = orderItemImportSlice.actions;

export default orderItemImportSlice.reducer;


// const onLogout = () => ({
//   type: 'LOGOUT',
//   name: '',
// });