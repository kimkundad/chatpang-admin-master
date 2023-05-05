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

const PaymentCancel = (props) => {
  const {
    showModal, onOk, onCancel,
  } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { agencyId, companyId, hubId } = useSelector((state) => state.authenReducer);

  // const [socket, setSocket] = useState(null);
  const token = new URLSearchParams(useLocation().search).get('token');

  // useEffect(() => {
  //   let newSocket = null;
  //   if (agencyId) {
  //     newSocket = io(endpoint.replace('/api', ''));
  //     console.log('Socket io start:', newSocket);
  //     setSocket(newSocket);
  //   }
  //   return () => newSocket?.close();
  // }, [setSocket]);

  // useEffect(() => {
  //   const messageListener = (message) => {
  //     console.log('message', message);
  //   };

  //   if (agencyId) {
  //     const channel = `wallet_update_${agencyId}`;
  //     socket?.on(channel, messageListener);

  //     if (transactionId) {
  //       socket?.emit(channel, new Date());
  //       // socket?.emit(channel, transactionId);
  //     }
  //   }

  //   return () => {
  //     if (agencyId) {
  //       const channel = `wallet_update_${agencyId}`;
  //       socket?.off(channel, messageListener);
  //     }
  //   };
  // }, [socket]);

  useEffect(() => {
    if (token) {
      console.log('token', token);
      dispatch(allAction.storeWallet.paymentCancel({ token }));
    }
    setTimeout(() => {
      window.close();
    }, 500);
  }, []);

  return (<></>
  );
};

export default PaymentCancel;
