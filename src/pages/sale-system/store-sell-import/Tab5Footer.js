/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Input, Form, Button, Radio, Checkbox, Select } from 'antd';

const { Search } = Input;
const { Option } = Select;

import allAction from '../../../app/actions/index';

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
// import { useGetOrderItemsImportQuery } from '../../../app/api/orderItemsApi';

const Tab5Footer = (props) => {
    const {
        footerData,
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
    const [toQuery, setToQuery] = useState("IMP");
    //-------------------------------------

    const { t } = useTranslation();

    useEffect(() => {
        console.log("footerData", footerData)
    }, [footerData])


    const df = (label, txt, type, postfix) => {
        const typeEnum = {
            green: "#d5f3db",
            blue: "#7596de",
            gray: "#f5f5f5",
        }

        // var bgcolor = "#F5F5F5"
        // if(type) {
        //   bgcolor = typeEnum[type]
        // }

        return <span style={{ display: "flex", fontFamily: "sans-serif", }}>{label && `${label} : `} 
            <span
                style={{
                    fontFamily: "sans-serif",
                    // flex: 1,
                    border: "1px solid #eaeaea",
                    backgroundColor: !type ? "#F5F5F5" : typeEnum[type],
                    color: type === "blue" ? "white" : null,
                    paddingLeft: 10,
                    paddingRight: 10,
                    // marginLeft: 5,
                    marginRight: postfix === "" ? 0 : postfix === "%" ? 5 : 10
                }}>{txt || "-"}
            </span>
            {postfix && <span style={{ fontFamily: "sans-serif", }} >{postfix}</span>}&nbsp;&nbsp;
        </span>
    }

    return (
        <>
            <div style={{
                display: "grid", gridTemplateColumns: "1fr auto",

            }}>
                <div >
                    <div style={{
                        padding: 5, display: "flex", flexDirection: "row",
                        justifyContent: "center",
                        // border: "1px blue solid"
                    }}>
                        {df("จำนวน", footerData?.totalItem, "green")}
                        {df("น้ำหนัก", nc(footerData?.totalWeight), "green")}
                        {df("ปริมาตร", nc(footerData?.totalVolume), "green")}
                        {df("COD", nc(footerData?.totalCod), "green")}
                        {df("ค่าขนส่ง", nc(footerData?.totalTransportationPrice), "green")}
                    </div>
                    <div style={{
                        padding: 5, display: "flex", flexDirection: "row",
                        justifyContent: "center",
                        // border: "1px blue solid"
                    }}>
                        {df("ส่วนลด", nc(footerData?.discountPercent), "gray", "%")} {`>= `}&nbsp;
                        {df("", nc(footerData?.discountAmount), "gray")}
                        {df("ค่าขนส่งหลังหักส่วนลด", nc(footerData?.transportationPriceAfterDiscount), "gray")}
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    border: "1px #264b9b solid",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: "#264b9b",
                    color : "white",
                    fontFamily: "sans-serif",
                    fontSize: "2em"
                }} >
                    <span >{nc(footerData?.totalPrice)}</span>
                </div>
                {/* <div >
                    <Button
                        type="primary"
                        size="middle"
                        style={{ marginLeft: 20, marginRight: 10, float: "right" }}
                        icon={<FileDoneOutlined />}
                        onClick={() => {
                            dispatch(allAction.orderItemImportAction.setEditingOrder({
                                orderId: null
                                , receiptNo: null
                            }))
                        }}
                    >

                        บันทึก
                    </Button>
                </div> */}
            </div>
            {/* <HeaderStoreSell setShortSender={()=>{}} /> */}</>
    );
};

export default Tab5Footer;

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

function nc(x) {
    if(!x) x = "0"
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }