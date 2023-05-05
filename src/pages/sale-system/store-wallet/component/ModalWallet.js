/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  message,
  Form,
  Input,
  Card,
  Select,
  InputNumber,
  Modal,
} from 'antd';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
// import io from 'socket.io-client';
import uuid from 'uuid';
import allAction from '../../../../app/actions';
import { setQuarter } from 'date-fns';

const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];
const getUrl = window.location;
const baseUrl =
  getUrl.protocol + '//' + getUrl.host + '/' + getUrl.pathname.split('/')[1];

const { Option } = Select;
const ModalWallet = (props) => {
  const { showModal, onOk, onCancel, setUrlQR, setEnqOrderID,setSelectedBank } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { agencyId, companyId, hubId, isCustomer } = useSelector(
    (state) => state.authenReducer
  );
  const { socket } = useSelector((state) => state.mainReducer);

  const [loading, setLoading] = useState(false)

  const paymentData = useRef(null);

  //TODO: Modal socket
  useEffect(() => {
    console.log('Modal socket', socket);
    const messageListener = (msg) => {
      console.log('messageListener', msg, paymentData.current);
      if (msg === 'payment fail') {
        paymentData.current = null;
      } else if (msg) addWalletAfterSuccess(msg);
    };

    if (agencyId) {
      const channel = `wallet_update_${agencyId}`;
      socket?.on(channel, messageListener);
    }

    return () => {
      if (agencyId) {
        const channel = `wallet_update_${agencyId}`;
        socket?.off(channel, messageListener);
      }
    };
  }, [socket]);

  const addWalletAfterSuccess = (token) => {
    console.log('addWalletAfterSuccess', paymentData.current);
    // if (paymentData.current?.token === token) {
    //   console.log('add', paymentData.current);
    //   dispatch(allAction.storeWallet.createWallet(paymentData.current))
    //     .then(() => {
    //       const query = {};
    //       if (companyId) query.companyId = companyId;
    //       if (hubId) query.hubId = hubId;
    //       if (agencyId) query.agencyId = agencyId;
    //       dispatch(allAction.storeWallet.getWalletList(query))
    //         .then()
    //         .catch((e) => message.error(e.message));
    //       dispatch(allAction.storeWallet.getAgencyWallet(agencyId))
    //         .then()
    //         .catch((e) => message.error(e.message));
    //       // onOk();
    //       message.success('Top-up Success!');
    //       paymentData.current = null;
    //     })
    //     .catch((e) => {
    //       message.error(e.message);
    //       paymentData.current = null;
    //     });
    // } else {
    // setTimeout(() => {
    const query = {};
    if (companyId) query.companyId = companyId;
    if (hubId) query.hubId = hubId;
    if (agencyId) query.agencyId = agencyId;
    dispatch(allAction.storeWallet.getWalletList(query))
      .then()
      .catch((e) => message.error(e.message));
    if (!isCustomer) {
      dispatch(allAction.storeWallet.getAgencyWallet(agencyId))
        .then()
        .catch((e) => message.error(e.message));
    }
    // onOk();
    // message.success('Top-up Success!');
    paymentData.current = null;
    // }, 2000);
    // }
  };

  useEffect(() => {
    if (allAction) {
      form.setFieldsValue({ payment: '' });
      setCheckPaymentChanel(false);
      dispatch(allAction.storeWallet.getMasterPaymentType())
        .then()
        .catch((e) => message.error(e.message));
    }
    return () => {
      form.resetFields();
    };
  }, [showModal]);

  const { masterPaymentType } = useSelector(
    (state) => state.storeWalletReducer
  );
  const [checkPaymentChanel, setCheckPaymentChanel] = useState(false);

  //  ModalWallet onFinish
  const onFinish = (value) => {
    setLoading(true)
    const newValue = value;
    newValue.agencyId = agencyId;
    newValue.token = uuid.v4();
    newValue.baseUrl = baseUrl;

    paymentData.current = _.cloneDeep(newValue);

    dispatch(allAction.storeWallet.callPayment(newValue))
      .then((ret) => {
        console.log("checkSCB", ret)
        if (ret?.data?.message?.data?.web_redirect) {
          window.open(ret?.data?.message?.data?.web_redirect, '_blank');
        } else if (ret?.data?.message?.authorize_url) {
          setUrlQR(ret?.data?.message?.authorize_url)
          setEnqOrderID(ret?.data?.message?.order_id)
        } else {
          message.error("Payment service failed.")
        }
        setLoading(false)
        onOk();
      })
      .catch((e) => {
        setLoading(false)
        message.error(e.message)
      });
  };

  const checkPayment = (value) => {
    if (value === 'BAN') {
      setCheckPaymentChanel(true);
    } else {
      setCheckPaymentChanel(false);
    }
  };

  return (
    <Modal
      title={
        <Typography.Title
          level={4}
          style={{
            color: '#264B9B',
            alignItems: 'center',
            margin: 'auto',
          }}
        >
          {t('SWA')}
        </Typography.Title>
      }
      centered
      visible={showModal}
      onOk={form.submit}
      confirmLoading={loading}
      okText={t('top-up')}
      cancelText={t('cancel-modal')}
      onCancel={() => onCancel()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('payment-price')}
          labelCol={{ xs: 4 }}
          name="amount"
          rules={[
            {
              required: true,
              message: 'Please input Top Up!',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('payment-price')}
          />
        </Form.Item>
        <Form.Item
          label={t('add-payment-type')}
          labelCol={{ xs: 4 }}
          name="paymentChannelCode"
          rules={[
            {
              required: true,
              message: 'Please input Payment Channel!',
            },
          ]}
        >
          <Select
            // allowClear
            defaultValue=""
            onSelect={checkPayment}
          >
            <Option value="">{t('all-select')}</Option>
            {masterPaymentType &&
              masterPaymentType.map((val) => (
                <Option value={val.paymentChannelCode}>
                  {val.paymentChannelName}
                </Option>
              ))}
          </Select>
        </Form.Item>
        {checkPaymentChanel && (
          <Form.Item
            label={t('bank')}
            name="bankCode"
            labelCol={{ xs: 4 }}
            rules={[
              {
                required: true,
                message: 'Please input Payment Channel!',
              },
            ]}
          >
            <Select
              // allowClear
              onChange={(val) => { console.log("val", val),setSelectedBank(val) }}
              defaultValue=""
            >
              <Option value="">{t('all-select')}</Option>
              <Option value="SCB">ธนาคารไทยพาณิชย์</Option>
              <Option value="KBANK">ธนาคารกสิกรไทย</Option>
              <Option value="BBL">ธนาคารกรุงเทพ</Option>
              <Option value="KTB">ธนาคารกรุงไทย</Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ModalWallet;
