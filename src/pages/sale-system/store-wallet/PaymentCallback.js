import React, { useState, useEffect } from 'react';
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
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';

import allAction from '../../../app/actions';

const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const PaymentCallback = (props) => {
  const { showModal, onOk, onCancel } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { agencyId, companyId, hubId } = useSelector(
    (state) => state.authenReducer
  );

  const token = new URLSearchParams(useLocation().search).get('token');

  useEffect(() => {
    if (token) {
      dispatch(allAction.storeWallet.paymentCallback({ token }));
    }
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return <></>;
};

export default PaymentCallback;
