/* eslint-disable */

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
  Modal,
  message,
  Image,
  Card,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import {
  SaveOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';


const StoreSell2 = (props) => {
  // const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  // const { isCustomer, userId, agencyId } = useSelector((state) => state.authenReducer);
  // const { draftData } = useSelector((state) => state.storeSellReducer);

  // const dispatch = useDispatch();

  const {
    pageCode,
  } = props;

  // const history = useHistory();

  const { t } = useTranslation();
  useEffect(() => {
    // history.push('/store-sell/create');
  }, []);
  return (
    <>Hello StoreSell2
    </>
  );
};

export default StoreSell2;
