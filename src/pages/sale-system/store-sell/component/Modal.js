import React, { useEffect } from 'react';
import { Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import AddCustomer from './modal/AddCustomer';
import AddSender from './modal/AddSender';
import ChangeAddress from './modal/change-address/index';
import ChangeBank from './modal/change-bank/index';
import allAction from '../../../../app/actions';

const ModalComponent = (props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // console.log(props);
  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };
  const {
    showModal, showCode, onCancel, formBig,
  } = props;
  const itemCust = showCode && showCode.value;
  const comId = formBig.getFieldValue('companyId');

  const FilterContent = () => {
    if (showCode === 'add-customer') {
      return <AddCustomer {...props} comId={comId} />;
    }
    if (showCode === 'add-sender') {
      return <AddSender {...props} comId={comId} />;
    }
    if (showCode === 'change-bank') {
      return <ChangeBank {...props} comId={comId} />;
    }
    if (showCode === 'change-address-customer') {
      return <ChangeAddress {...props} comId={comId} />;
    }
    if (showCode && itemCust === 'change-address') {
      return <ChangeAddress {...props} comId={comId} />;
    }
    if (showCode === 'change-address-sender') {
      return <ChangeAddress {...props} comId={comId} />;
    }
  };

  return (
    <>
      <Modal
        title={<Typography.Title level={3} style={{ color: '#264B9B' }}>{t(itemCust || showCode) || '-'}</Typography.Title>}
        visible={showModal}
        footer={null}
        onCancel={onCancel}
        maskClosable={false}
        width={1000}
      >
        {FilterContent()}
      </Modal>
    </>
  );
};

export default ModalComponent;
