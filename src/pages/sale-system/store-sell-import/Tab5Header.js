/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Input, Form, Button, Radio, Checkbox, Select,message, } from 'antd';

const { Search } = Input;
const { Option } = Select;

import allAction from '../../../app/actions/index';

import {
  CheckCircleOutlined,
  FileExcelOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  PlusCircleOutlined,
  EditOutlined
} from '@ant-design/icons';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
// import { useGetOrderItemsImportQuery } from '../../../app/api/orderItemsApi';

const orderThaiStatus = {
  DEL: "ลบ",
  CAN: "ยกเลิก",
  DRF: "ฉบับร่าง",
  SAV: "บันทึก",
  CRE: "สร้างสำเร็จ",
  PAI: "ชำระเรียบร้อย",
}

const Tab5Header = (props) => {
  const {
    DIVFLEX,
    setImportReceiverSuccess,
    cName,
    createOrder,
    isCreateOrder,
    headerData,
  } = props;

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [isUploadDone, setIsUploadDone] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [headerColumns, setHeaderColumns] = useState(["doNo", "recipientInput"]);
  const columnDefs = useRef([]);
  const [rowData, setRowData] = useState([]);

  const dispatch = useDispatch();

  const history = useHistory();

  //----------- RTK QUERY ---------------
  // const [toQuery, setToQuery] = useState("IMP");

  //-------------------------------------

  const { orderId: orderId_Editing, receiptNo } = useSelector(
    (state) => state.orderItemImportReducer
  );

  const { t } = useTranslation();

  const sumAddressCustomer = (val) => {
    let addressRes = '';
    const cusNo = val.customerNo
      ? ` ${t('address-number')} ${val.customerNo}`
      : '';
    const moo = val.customerMoo
      ? ` ${t('address-village')}${val.customerMoo}`
      : '';
    const alley = val.customerAlley
      ? ` ${t('address-lane')}${val.customerAlley}`
      : '';
    const road = val.customerRoad
      ? ` ${t('address-road')}${val.customerRoad}`
      : '';
    const subdistrict = val.customerSubdistrictData?.subdistrictName
      ? ` ${t('address-sub-district2')}${val.customerSubdistrictData?.subdistrictName
      }`
      : '';
    const district = val.customerDistrictData?.districtName
      ? ` ${t('address-district2')}${val.customerDistrictData?.districtName}`
      : '';
    const provice = val.customerProvinceData?.provinceName
      ? ` ${t('address-provice2')}${val.customerProvinceData?.provinceName}`
      : '';
    const postcode = val.customerPostcode ? ` ${val.customerPostcode}` : '';
    addressRes = `${cusNo}${moo}${alley}${road}${subdistrict}${district}${provice}${postcode}`;
    return addressRes;
  };

  const sumCustomerName = (val) => {
    return val.customerName ? `${val.customerName} ${val.customerLastName || ''}` : '-'
  }

  const df = (label, txt, type, postfix) => {
    const typeEnum = {
      green: "#d5f3db",
      blue: "#7596de",
    }

    // var bgcolor = "#F5F5F5"
    // if(type) {
    //   bgcolor = typeEnum[type]
    // }

    return <span style={{ display: "flex", fontFamily: "sans-serif", }}>{label} :
      <span
        style={{
          // flex: 1,
          fontFamily: "sans-serif",
          border: "1px solid #eaeaea",
          backgroundColor: !type ? "#F5F5F5" : typeEnum[type],
          color: type === "blue" ? "white" : null,
          paddingLeft: 10,
          paddingRight: 10,
          marginLeft: 5,
          marginRight: postfix === "" ? 0 : postfix === "%" ? 5 : 10,
          // paddingBottom: 1,
        }}>{txt || "-"}
      </span>
      {postfix && <span style={{ fontFamily: "sans-serif", }}>{postfix}</span>}
    </span>
  }

  const checkOrderStatus = () => {
    if (headerData?.orderStatusCode === 'DRF') {
      history.push(`./store-sell/${orderId_Editing}/edit`);
    } else {
      dispatch(allAction.storeSellAction.updateBackDraft(orderId_Editing))
        .then(() => history.push(`./store-sell/${orderId_Editing}/edit`))
        .catch((err) => message.error(err.message));
    }
    //
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
      <div>
        <div style={{ padding: 10, display: "flex", flexDirection: "row", marginTop: 2 }}>
          {df("รหัสลูกค้า", headerData && headerData.customerInput, "")}
          {df("ผู้ส่ง", headerData && sumCustomerName(headerData), "")}




        </div>
        <div style={{ paddingLeft: 10, display: "flex", flexDirection: "row" }}>{df("ที่อยู่", headerData && sumAddressCustomer(headerData), "")}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", }}>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 5, marginRight: 10, flex: 1,
          //  border: "1px solid red"
        }}>
          สถานะ : {orderThaiStatus[headerData?.orderStatusCode]}
        </div>
        <div >
          <Button
            // type="primary"
            size="middle"
            style={{ marginLeft: 20, marginTop: 0 }}
            icon={<EditOutlined />}
            onClick={checkOrderStatus}
          >
            แก้ไขใบเสร็จ
          </Button>
          <Button
            // type="primary"
            size="middle"
            style={{ marginLeft: 10, marginRight: 10, marginTop: 5 }}
            icon={<FileDoneOutlined />}
            onClick={() => {
              dispatch(allAction.orderItemImportAction.setEditingOrder({
                orderId: null
                , receiptNo: null
              }))
            }}
          >
            ปิด
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tab5Header;

const DivButtonBar = styled.div`
  margin: 10px;
  //   background-color: white;
  //   height: calc(100vh - 130px);
  display: flex;
  flex-direction: row;

  //   color: blue;
  // flex: 1;
  //   border: 2px solid blue;
  //   margin-top: -16px;
`;
