import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  Select,
  message,
  Radio,
  Card,
} from 'antd';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  SaveOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import allAction from '../../../../../../app/actions';

const { Option } = Select;
const { Text } = Typography;

const ChangeBank = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    onCancel, listBank, loading, formBig,
  } = props;

  const history = useHistory();
  const formItemLayout = {
    labelCol: {
      // xs: { span: 24 },
      xs: { span: 4 },
      sm: { span: 6 },
      lg: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },

    },
  };

  const selectNewBank = (value) => {
    const keys = formBig.getFieldsValue();
    formBig.setFieldsValue({
      ...keys,
      customerBankAccountNo: value.bankAccountNo,
      customerBankAccountName: value.bankAccountName,
      customerBankName: value.bankData.bankName,
      customerBankId: value.customerBankId,
    });
    onCancel();
  };
  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center', height: '100px',
        }}
      >
        <Spin
          spinning={loading}
          tip="Loading ..."
        />
      </div>

    );
  }
  return (
    <div>
      {listBank.length > 0
        ? listBank.map((val) => <Card style={{ cursor: 'pointer' }} onClick={() => selectNewBank(val)}>{val.all}</Card>)
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

export default ChangeBank;
