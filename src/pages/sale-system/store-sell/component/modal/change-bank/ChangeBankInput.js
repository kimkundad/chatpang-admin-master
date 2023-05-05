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

const ChangeBankInput = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const { companyId } = useSelector((state) => state.authenReducer);

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
  const cardStyle = { padding: 12 };
  const cardBodyStyle = { padding: 0 };

  const { agencyBankData } = useSelector((state) => state.settingBankReducer);
  const { customerId, onCancel, formBig } = props;
  useEffect(() => {
    dispatch(
      allAction.settingBankAction.getAgencyBankData({
        companyId: formBig.getFieldsValue().companyId || companyId,
      })
    )
      .then()
      .catch((e) => message.error(e.message));
  }, []);

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }

  const onFinish = (value) => {
    const keys = formBig.getFieldsValue();

    console.log('vv', value);
    if (customerId) {
      const newVal = value;
      dispatch(allAction.storeSellAction.createBank(newVal, customerId))
        .then((data) => {
          console.log(data);
          formBig.setFieldsValue({
            ...keys,
            customerBankAccountNo: data.bankAccountNo,
            customerBankAccountName: data.bankAccountName,
            customerBankName: data.bankData.bankName,
            customerBankId: data.customerBankId,
          });
        })
        .catch((e) => message.error(e));
      onCancel();
    } else {
      message.error('customerId not found!');
      onCancel();
    }
  };
  return (
    <>
      <Form
        name="change-address"
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Card style={cardStyle} bodyStyle={cardBodyStyle}>
          <Row>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                style={{ marginBottom: 0 }}
                validateTrigger={['onChange', 'onBlur']}
                label={t('menu-setting-bank')}
                name="bankId"
                rules={[{ required: true, message: 'Please input Bank!' }]}
              >
                <Select defaultValue="">
                  <Option value="">เลือกธนาคาร</Option>)
                  {agencyBankData &&
                    agencyBankData.map((val) => (
                      <Option value={val.key}>
                        <Text
                          style={{ width: 90 }}
                          ellipsis={{ tooltip: val.bankName }}
                        >
                          {val.bankName}
                        </Text>
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                style={{ marginBottom: 10 }}
                validateTrigger={['onChange', 'onBlur']}
                label={t('bank-no')}
                name="bankAccountNo"
                rules={[{ required: true, message: 'Please input Bank No!' }]}
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('bank-no')}
                  onKeyPress={(event) => {
                    isInputNumber(event);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                style={{ marginBottom: 0 }}
                validateTrigger={['onChange', 'onBlur']}
                label={t('bank-name')}
                name="bankAccountName"
                rules={[{ required: true, message: 'Please input Bank Name!' }]}
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('bank-name')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Form.Item style={{ margin: '20px 0 8px 0' }}>
          <Button
            type="default"
            icon={<CloseCircleOutlined />}
            onClick={() =>
              dispatch(allAction.storeSellAction.setActionModal('view'))
            }
            style={{ width: '100px', float: 'right', marginLeft: 15 }}
          >
            {t('cancel-modal')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ width: '100px', float: 'right' }}
          >
            {t('save')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangeBankInput;
