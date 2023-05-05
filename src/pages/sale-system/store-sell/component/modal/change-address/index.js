import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ChangeAddress from './ChangeAddress';
import ChangeAddressInput from './ChangeAddressInput';
import allAction from '../../../../../../app/actions';

const index = (props) => {
  const [listAddress, setListAddress] = useState([]);
  const [customerId, setCustomerId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { isMobile } = useSelector((state) => state.mainReducer);
  const { companyId, userLevel } = useSelector((state) => state.authenReducer);
  const { actionModal } = useSelector((state) => state.storeSellReducer);
  const {
    formBig, showCode, onCancel, showModal,
  } = props;
  useEffect(() => {
    const keys = formBig.getFieldValue();
    setIsLoading(true);
    const objSearch = {};
    setListAddress([]);
    if (showCode.value === 'change-address') {
      const phone = formBig.getFieldsValue().itemStoreSell[showCode.key].recipientInput;
      objSearch.search = phone;
    }
    if (showCode === 'change-address-customer') {
      objSearch.search = formBig.getFieldsValue().customerInput;
    }
    if (showCode === 'change-address-sender') {
      objSearch.search = formBig.getFieldsValue().senderInput;
    }
    if (userLevel === 'SAD') objSearch.companyId = keys.companyId;
    dispatch(allAction.storeSellAction.getCustomerDetail(objSearch))
      .then(async (data) => {
        const listRes = [];
        if (data) {
          setCustomerId(data.customerId);
          data.customerAddressData.filter((val) => {
            let addressRes = '';
            const moo = val.moo ? `${t('address-village')}${val.moo}` : '';
            const alley = val.alley ? `${t('address-lane')}${val.alley}` : '';
            const road = val.road ? `${t('address-road')}${val.road}` : '';
            const subdistrict = val.subdistrictData?.subdistrictName ? `${t('address-sub-district2')}${val.subdistrictData.subdistrictName}` : '';
            const district = val.districtData?.districtName ? `${t('address-district2')}${val.districtData.districtName}` : '';
            const provice = val.provinceData?.provinceName ? `${t('address-provice2')}${val.provinceData.provinceName}` : '';
            const postcode = val.postcode ? `${val.postcode}` : '';
            addressRes = `${val.no} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;
            listRes.push({
              ...val,
              all: addressRes,
            });
          });
        }
        await setListAddress(listRes);
        setIsLoading(false);
        console.log(listRes);
      });
  },
    [showCode, actionModal]);

  if (actionModal === 'view') {
    return (
      <ChangeAddress
        {...props}
        listAddress={listAddress}
        isLoading={isLoading}
        customerId={customerId}
      />
    );
  }
  return (
    <ChangeAddressInput {...props} customerId={customerId} />
  );
};

export default index;
