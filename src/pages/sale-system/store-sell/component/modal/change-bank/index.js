import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ChangeBank from './ChangeBank';
import ChangeBankInput from './ChangeBankInput';
import allAction from '../../../../../../app/actions';

const index = (props) => {
  const [customerId, setCustomerId] = useState();
  const [loading, setLoading] = useState(false);

  const { isMobile, isLoading } = useSelector((state) => state.mainReducer);
  const { companyId, userLevel } = useSelector((state) => state.authenReducer);
  const { actionModal, customerDetail } = useSelector((state) => state.storeSellReducer);
  const [listBank, setListBank] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    formBig, showCode, onCancel, showModal,
  } = props;

  useEffect(() => {
    if (actionModal) {
      setLoading(true);
      const objSearch = {};
      objSearch.search = formBig.getFieldsValue().customerInput;
      if (userLevel === 'SAD') objSearch.companyId = formBig.getFieldsValue().companyId;
      dispatch(allAction.storeSellAction.getCustomerDetail(objSearch))
        .then((data) => {
          const listRes = [];
          if (data) {
            setCustomerId(data.customerId);
            data.customerBankData.filter((val) => {
              let bankRes = '';
              const bankAccountNo = val.bankAccountNo ? `${t('bank-no')}${val.bankAccountNo}` : '';
              const bankAccountName = val.bankAccountName ? `${t('bank-name')}${val.bankAccountName}` : '';
              const bankName = val.bankData?.bankName ? `${t('menu-setting-bank')}${val.bankData?.bankName}` : '';
              bankRes = `${bankName} ${bankAccountNo} ${bankAccountName}`;
              listRes.push({
                ...val,
                all: bankRes,
              });
            });
          }
          setListBank(listRes);
          setLoading(false);
          console.log(listRes);
        });
    }
  },
    [actionModal]);

  if (actionModal === 'view') return <ChangeBank {...props} listBank={listBank} loading={loading} customerId={customerId} />;
  return (
    <ChangeBankInput {...props} customerId={customerId} />
  );
};

export default index;
