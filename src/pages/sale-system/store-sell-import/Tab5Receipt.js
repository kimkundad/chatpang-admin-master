/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Input, Form, Button, Radio, Checkbox, Select } from 'antd';

const { Search } = Input;
const { Option } = Select;

import allAction from '../../../app/actions/index';
import Tab5Header from './Tab5Header'
import Tab5Dos from './Tab5Dos'
import Tab5Footer from './Tab5Footer'

import {
  CheckCircleOutlined,
  FileExcelOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import {
  // useGetOrderItemsImportQuery,
  useGetOrderWithDosQuery
} from '../../../app/api/orderItemsApi';

const Tab5Receipt = (props) => {
  const {
    DIVFLEX,
    setImportReceiverSuccess,
    cName,
    createOrder,
    isCreateOrder,
  } = props;

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [isUploadDone, setIsUploadDone] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [headerColumns, setHeaderColumns] = useState(["doNo", "recipientInput"]);
  const columnDefs = useRef([]);
  const [rowData, setRowData] = useState([]);

  const dispatch = useDispatch();

  const { orderId: orderId_Editing, receiptNo } = useSelector(
    (state) => state.orderItemImportReducer
  );

  //----------- RTK QUERY ---------------

  const {
    data: orderData,
    isFetching,
    isLoading,
    isSuccess, /* */
    // isError,
    // error,
    // refetch,
  } = useGetOrderWithDosQuery(orderId_Editing, {
    // pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: !orderId_Editing || !Number(orderId_Editing),
  });

  useEffect(() => {
    console.log("orderData", orderData)
    // setRowData(orderData);
    if (orderData && orderData?.items) {
      const orderDataTmp = orderData?.items.slice(0).reverse().map((d, idx) => {
        return { rowNo: idx + 1, ...d }
      })
      setRowData(orderDataTmp);
    } else {
      setRowData([]);
    }

    if (!orderData && !isFetching && !isLoading && isSuccess) {
      dispatch(allAction.orderItemImportAction.setEditingOrder({
        senderInput: null,
        orderId: null,
        receiptNo: null,
        soNo: null,
      }))
    }

  }, [orderData])
  //-------------------------------------


  // useEffect(() => {
  //   if (!rowData || rowData.length < 1) {
  //       dispatch(allAction.orderItemImportAction.setEditingOrder({
  //         senderInput: null,
  //         orderId: null,
  //         receiptNo: null,
  //         soNo: null,
  //       }))

  //   }
  // }, [rowData])

  const { t } = useTranslation();

  // useEffect(() => {
  //   console.log("OrderItems",OrderItems)
  //   setRowData(OrderItems);
  // }, [OrderItems])


  return (
    <DIVFLEX>
      <div style={{ height: 80, }}>
        <Tab5Header headerData={orderData?.header} />
      </div>
      <div style={{ flex: 1, border: '1px #C8C8C8 solid' }}>
        <Tab5Dos headerData={orderData?.header} rowData={rowData} />
      </div>
      <div style={{ padding: 10, height: 90, border: '1px #C8C8C8 solid' }}>
        <Tab5Footer headerData={orderData?.header} footerData={orderData?.footer} />
      </div>
    </DIVFLEX>
  );
};

export default Tab5Receipt;

const DivButtonBar = styled.div`
  margin: 10px;
  //   background-color: white;
  //   height: calc(100vh - 125px);
  display: flex;
  flex-direction: row;

  //   color: blue;
  // flex: 1;
  //   border: 2px solid blue;
  //   margin-top: -16px;
`;
