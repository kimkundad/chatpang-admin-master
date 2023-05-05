// import { createSlice, current } from "@reduxjs/toolkit";

import {
    createSlice,
    current,
    // createAsyncThunk,
    // isPending,
    // isFulfilled,
    // isRejectedWithValue,
} from '@reduxjs/toolkit'

//   import { message } from 'antd';

function fnumber_format(number, decimals, dec_point, thousands_sep) {
    // http://kevin.vanzonneveld.net
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        toFixedFix = function (n, prec) {
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            var k = Math.pow(10, prec);
            return Math.round(n * k) / k;
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

const dec2 = (num) => {
    return fnumber_format(num, 2, ".", ",")
}

const decAuto = (num) => {

}

function Knumber(val,name){

    if(!val) return 0

    var ret = Number(val)
    // console.log("Knumber1",val,ret,name)
    if (isNaN(ret)){
      ret = Number(val.replace(/[^0-9.-]+/g,""));
      // if(isNaN(ret)) return 0;
    }
    // console.log("Knumber2",val,ret,name)
    return ret
  }

const initialState = {
    fnumber_format,
    dec2,
    decAuto,
    Knumber
};

export const kaiUtilsSlice = createSlice({
    name: "kaiUtils",
    initialState,
    reducers: {
        // increment: (state) => {
        //   console.log(current(state)); //จะดูค่าใน state ต้องใช้ current(state)
        //   state.value += 1;
        // },
    },

});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = kaiUtilsSlice.actions;
export const kaiUtilsAction = kaiUtilsSlice.actions;

export default kaiUtilsSlice.reducer;
