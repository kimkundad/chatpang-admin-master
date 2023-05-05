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
  Tabs,
  Divider,
  Checkbox,
  Drawer,
  Space,
} from 'antd';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import allAction from '../../../app/actions';

import {
  orderItemsApi,
} from '../../../app/api/orderItemsApi';

import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';
import Tab5Receipt from './Tab5Receipt';

import {
  UpCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  UserAddOutlined,
  CodeSandboxOutlined
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';

const { TabPane } = Tabs;

function cName(num) {
  for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
  }
  return ret;
}

const OperationsSlot = {
  // left: <div className="tabs-extra-demo-button" style={{marginRight:10}}>Import > </div>,
  // right: <Button>Right Extra Action</Button>,
};

const StoreSellImport = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { isCustomer, userId, agencyId } = useSelector(
    (state) => state.authenReducer
  );
  // const { draftData } = useSelector((state) => state.storeSellReducer);
  
  const { value, importRecipientSuccess, importDOSuccess,receiptNo,soNo } = useSelector(
    (state) => state.orderItemImportReducer
  );

  const dispatch = useDispatch();

  const { pageCode } = props;

  const history = useHistory();

  const { t } = useTranslation();

  const [isCreateOrder, createOrder] = useState(false);

  // const [importRecipientSuccess, setimportRecipientSuccess] = useState(null);
  // const [importDOSuccess, setImportDOSuccess] = useState(null);
  console.log('render StoreSellImport')
  useEffect(() => {
    console.log("StoreSellImport didmount")
    dispatch(
      orderItemsApi.util.invalidateTags(['OrderItems','Recipient','Orders'])
    )

    return () => {
      dispatch(allAction.orderItemImportAction.setEditingOrder({
        senderInput: null,
        orderId: null,
        receiptNo: null,
        soNo: null,
      }))
    }
  }, [])

  return (
    <>
      <Tabs type="card">
        <TabPane
          tab={
            <span style={{ color: importRecipientSuccess ? 'green' : null }}>
              {/* {importRecipientSuccess ? (
                <CheckCircleOutlined />
              ) : (
                <UpCircleOutlined />
              )} */}
              <UserAddOutlined />
              Import ผู้รับ {console.log('value', value)}
            </span>
          }
          key="1"
        >
          <Tab1
            DIVFLEX={DIVFLEX}
            cName={cName}
            // setimportRecipientSuccess={setimportRecipientSuccess}
          />
        </TabPane>
        <TabPane
          tab={
            <span style={{ color: importDOSuccess ? 'green' : null }}>
              {/* {importDOSuccess ? <CheckCircleOutlined /> : <UpCircleOutlined />} */}
              <CodeSandboxOutlined />
              Import รายการพัสดุ
            </span>
          }
          // disabled={!importRecipientSuccess}
          key="2"
        >
          <Tab2 DIVFLEX={DIVFLEX} cName={cName} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <OrderedListOutlined />
              รายการพัสดุ
            </span>
          }
          key="3"
          // disabled={!(importRecipientSuccess && importDOSuccess)}
        >
          <Tab3
            DIVFLEX={DIVFLEX}
            cName={cName}
            // setimportRecipientSuccess={setimportRecipientSuccess}
            createOrder={createOrder}
            isCreateOrder={isCreateOrder}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <OrderedListOutlined />
              รายการใบเสร็จ(ฉบับร่าง)
            </span>
          }
          key="4"
          // disabled={!(importRecipientSuccess && importDOSuccess)}
        >
          <Tab4 DIVFLEX={DIVFLEX} cName={cName} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              ใบเสร็จ : {receiptNo ? receiptNo : soNo}
            </span>
          }
          key="5"
          closable={true}
          disabled={!receiptNo && !soNo}
        >
          <Tab5Receipt DIVFLEX={DIVFLEX}/>
        </TabPane>
      </Tabs>
      {/* <Drawer
          title={`large Drawer`}
          placement="right"
          size="large"
          onClose={() => {}}
          visible={true}
          extra={
            <Space>
              <Button onClick={() => {}}>Cancel</Button>
              <Button type="primary" onClick={() => {}}>
                OK
              </Button>
            </Space>
          }
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer> */}
    </>
  );
};

export default StoreSellImport;

const DIVFLEX = styled.div`
  background-color: white;
  height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;

  //   color: blue;
  //   flex: 1;
  //   border: 2px solid blue;
  margin-top: -16px;
`;
