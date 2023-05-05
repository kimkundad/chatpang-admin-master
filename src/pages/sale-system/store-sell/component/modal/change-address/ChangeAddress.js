import React, { useState, useEffect } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Space,
  Badge,
  message,
  Card,
  Modal,
  Select,
  Divider,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import allAction from '../../../../../../app/actions';

const ChangeAddress = (props) => {
  const { t } = useTranslation();
  const { companyId, userLevel } = useSelector((state) => state.authenReducer);

  const dispatch = useDispatch();
  const {
    formBig, showCode, onCancel, isLoading, listAddress,
    customerId,
  } = props;

  const selectNewAddress = (value) => {
    const keys = formBig.getFieldsValue();
    if (showCode.value === 'change-address') {
      const itemSs = keys.itemStoreSell[showCode.key];
      itemSs.recipientNo = value.no;
      itemSs.recipientMoo = value.moo;
      itemSs.recipientAlley = value.alley;
      itemSs.recipientRoad = value.road;
      itemSs.recipientDistrictId = value.districtData?.districtId;
      itemSs.recipientDistrictName = value.districtData?.districtName;
      itemSs.recipientSubdistrictId = value.subdistrictData?.subdistrictId;
      itemSs.recipientSubdistrictName = value.subdistrictData?.subdistrictName;
      itemSs.recipientProvinceId = value.provinceData?.provinceId;
      itemSs.recipientProvinceName = value.provinceData?.provinceName;
      itemSs.recipientPostcode = value.postcode;
      itemSs.recipientOther= value.other;

      formBig.setFieldsValue({
        ...keys,
        [keys.itemStoreSell[showCode.key]]: itemSs,
      });
    }
    if (showCode === 'change-address-customer') {
      formBig.setFieldsValue({
        ...keys,
        customerNo: value.no,
        customerMoo: value.moo || null,
        customerAlley: value.alley || null,
        customerRoad: value.road || null,
        customerDistrictId: value.districtData?.districtId || null,
        customerSubdistrictId: value.subdistrictData?.subdistrictId || null,
        customerProvinceId: value.provinceData?.provinceId || null,
        customerPostcode: value.postcode || null,
        customerAddressOther: value.other || null,
        customerTaxpayerNumber: value.taxpayerNumber || null,
        addressCustomer: value.all,
        customerAddressId: value.customerAddressId,
        
      });
    }
    if (showCode === 'change-address-sender') {
      formBig.setFieldsValue({
        ...keys,
        senderNo: value.no,
        senderMoo: value.moo || null,
        senderAlley: value.alley || null,
        senderRoad: value.road || null,
        senderDistrictId: value.districtData?.districtId || null,
        senderSubdistrictId: value.subdistrictData?.subdistrictId || null,
        senderProvinceId: value.provinceData?.provinceId || null,
        senderPostcode: value.postcode || null,
        senderAddressOther: value.other || null,
        senderTaxpayerNumber: value.taxpayerNumber || null,
        addressSender: value.all,
        senderAddressId: value.customerAddressId,
        

      });
    }
    onCancel();
  };
  if (isLoading) {
    return (
      <div
        style={{
          textAlign: 'center', height: '100px',
        }}
      >
        <Spin
          spinning={isLoading}
          tip="Loading ..."
        />
      </div>

    );
  }
  return (
    <div>
      {listAddress && listAddress.length > 0
        ? listAddress.map((val) => <Card style={{ cursor: 'pointer' }} onClick={() => selectNewAddress(val)}>{val.all}</Card>)
        : (
          <Card>
            <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '20px' }}>ไม่พบข้อมูล</div>
          </Card>
        )}
      <Form>
        <Form.Item
          style={{ margin: '20px 0 8px 0' }}
        >
          <Button
            type="default"
            icon={<CloseCircleOutlined />}
            onClick={onCancel}
            style={{ width: '100px', float: 'right', marginLeft: 15 }}
          >
            {t('cancel-modal')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: '100px', float: 'right' }}
            onClick={() => dispatch(allAction.storeSellAction.setActionModal('create'))}
          >
            {t('setting-agency-degree-add')}
          </Button>
        </Form.Item>
      </Form>

    </div>
  );
};

export default ChangeAddress;
