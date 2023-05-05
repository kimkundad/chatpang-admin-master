/* eslint-disable import/prefer-default-export */
import { fetch } from './fetch';

export const pCallSubDistrict = async (districtId, form, setListSubDistrict) => {
  // setLoadIng(true);
  fetch({
    method: 'get',
    url: `/master/subdistrict/?districtId=${districtId}`,
  })
    .then((res) => {
      // setLoadIng(false);
      if (res.data.success) {
        let i = 0;
        const list = [];
        let chkHasPostcode = false;
        const pc = form.getFieldValue('postcode');
        for (i = 0; i < res.data.data.length; i++) {
          if (pc && res.data.data[i].postcode === pc) chkHasPostcode = true;
          console.log('res.data.data[i]', res.data.data[i]);
          list.push(res.data.data[i]);
        }
        if (!chkHasPostcode) {
          form.setFieldsValue({
            postcode: '',
          });
        }
        setListSubDistrict(list);
      } else {
      }
    })
    .catch((error) => {
      // setLoadIng(false);
      console.log(error);
    });
};

export const pHandleFilterProvice = (value,
  form, callDistrict, setIsSelectProvince,
  setIsFirst, setListDistrict, setListSubDistrict) => {
  callDistrict(value);
  setIsSelectProvince(true);
  setIsFirst(true);
  setListDistrict([]);
  setListSubDistrict([]);
  form.setFieldsValue({
    districtId: '',
    subdistrictId: '',
    postcode: '',
  });
};

export const pHandleFilterDistrict = (value, form, callDistrict, province, callSubDistrict, setIsSelectDistrict) => {
  if (value === '') {
    callDistrict(province);
    form.setFieldsValue({
      postcode: '',
      districtId: '',
    });
    // return null;
  }

  callSubDistrict(value);
  setIsSelectDistrict(true);

  form.setFieldsValue({
    subdistrictId: '',
  });
};
