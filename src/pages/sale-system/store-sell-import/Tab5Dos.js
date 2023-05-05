/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Input, Form, Button, Radio, Checkbox, Select, message } from 'antd';

const { Search } = Input;
const { Option } = Select;

// import TabTableTest3 from './TabTableTest3';
// import Tab5Table from './Tab5Table';
import Tab3Table from './Tab3Table';

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
    orderItemsApi,
    useGetOrderItemsImportQuery,
    useDeleteOrderItemsMutation,
    useCreateOrderMutation,
    useRemoveDOfromOrderMutation,
    useAddOrderItemsMutation
} from '../../../app/api/orderItemsApi';

import allAction from '../../../app/actions/index';

const setColumnDefs = (cName, columnDefs, headerColumns) => {
    columnDefs = headerColumns.map((headerName, idx) => {
        var colDef = {
            field: `${headerName}`,
            headerName: `${headerName}`,
            filter: 'agTextColumnFilter',
            width: 100,
            sortable: true
        }

        switch (headerName) {

            // "รหัสไปรษนีย์",
            // "ตำบล",
            // "อำเภอ",
            // "จังหวัด"

            case "recipientPostcode":
                colDef["headerName"] = "รหัสไปรษนีย์";
                break;

            case "ตำบล":
                colDef["valueGetter"] = ({ data }) =>
                    data?.recipientSubdistrictData?.subdistrictName
                break;

            case "อำเภอ":
                colDef["valueGetter"] = ({ data }) =>
                    data?.recipientDistrictData?.districtName
                break;

            case "จังหวัด":
                colDef["valueGetter"] = ({ data }) =>
                    data?.recipientProvinceData?.provinceName
                break;

            case "cod":
                colDef["headerName"] = "COD";
                break;

            case "transportationNetPrice":
                colDef["headerName"] = "รวม";
                break;

            case "chargeCodPrice":
                colDef["headerName"] = "Charge COD";
                break;

            case "ratePercent":
                colDef["headerName"] = "อัตรา";
                colDef["valueGetter"] = ({ data }) =>
                    data?.ratePercent ? `${data?.ratePercent} %` : ''
                break;

            case "transportationPrice":
                colDef["headerName"] = "ค่าขนส่ง";
                break;

            case "chargeCodPrice":
                colDef["headerName"] = "COD";
                colDef["width"] = 90;
                break;

            case "transportationTypeCode":
                colDef["headerName"] = "EX/COD";
                colDef["width"] = 90;
                break;

            case "weight":
                colDef["headerName"] = "น้ำหนัก";
                break;

            case "volume":
                colDef["headerName"] = "ขนาด";
                break;

            case "ชื่อผู้รับ":
                colDef["width"] = 150;
                colDef["valueGetter"] = ({ data }) =>
                    `${data?.recipientName || ''} 
             ${data?.recipientLastName || ''}`
                break;

            case "recipientInput":
                colDef["width"] = 100;
                colDef["headerName"] = "รหัสผู้รับ";
                break;

            case "ชื่อลูกค้า":
                // colDef["width"] = 150;
                colDef["valueGetter"] = ({ data }) =>
                    `${data?.senderData?.customerName || ''} 
                    ${data?.senderData?.customerLastName || ''}`
                break;

            // case "orderId":
            //   colDef["width"] = 50;
            //   break;

            case "orderItemStatusCode":
                colDef["headerName"] = Status;
                colDef["width"] = 120;
                break;

            case "receiptNo":
                colDef["headerName"] = "เลขใบเสร็จ";
                // colDef["width"] = 180
                colDef["cellRenderer"] = "actionComponent"
                break;

            case "doNo":
                colDef["headerName"] = "เลขพัสดุ";
                colDef["width"] = 150
                colDef["pinned"] = true
                colDef["sort"] = "desc"
                break;

            case "senderInput":
                colDef["headerName"] = "รหัสลูกค้า";
                colDef["width"] = 120
                break;
            default:
            // code block
        }

        return colDef
    });

    // if (columnDefs.length > 5) {
    //   columnDefs[0].width = 80;
    //   columnDefs[1].width = 120;
    //   columnDefs[3].width = 80;
    //   columnDefs[4].width = 120;
    // }
    columnDefs[0].checkboxSelection = true;
    columnDefs[0].headerCheckboxSelection = true;
    columnDefs[0].headerCheckboxSelectionFilteredOnly = true;
    return columnDefs;
};

const Tab5Dos = (props) => {
    const {
        // DIVFLEX,
        // setImportReceiverSuccess,
        // cName,
        // // createOrder,
        // isCreateOrder,
        rowData,
        headerData
    } = props;

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const [isUploadDone, setIsUploadDone] = useState(false);
    // const [searchText, setSearchText] = useState('');

    const [headerColumns, setHeaderColumns] = useState([
        "doNo",
        "recipientInput",
        "ชื่อผู้รับ",
        "transportationPrice",
        "transportationTypeCode",
        "cod",
        "ratePercent",
        "chargeCodPrice",
        'transportationNetPrice',
        "weight",
        "volume",
        "recipientPostcode",
        "ตำบล",
        "อำเภอ",
        "จังหวัด"
    ]);

    const columnDefs = useRef([]);
    // const [rowData, setRowData] = useState([]);

    // const [filterEXCOD, selectEXCOD] = useState("ALL")
    const filterEXCOD = useRef("ALL");

    // const [filterSenderID_doNo, searchSenderID_doNo] = useState("")
    const filterSenderID_doNo = useRef("");

    const [selectedRowCount, setSelectedRowCount] = useState(0)

    const { senderInput, orderId: orderId_Editing, receiptNo } = useSelector(
        (state) => state.orderItemImportReducer
    );

    const [showCount, setShowCount] = useState("0/0")

    const dispatch = useDispatch();

    const history = useHistory();


    useEffect(() => {
        console.log("headerData", headerData)
    }, [headerData])

    //----------- RTK QUERY ---------------
    // const [filterState, setFilterState] = useState("DRF")

    // const {
    //     data: OrderItems,
    //     isFetching,
    //     isLoading,
    //     isSuccess, /* */
    //     isError,
    //     error,
    //     refetch,
    // } = useGetOrderItemsImportQuery("DRF");

    const [deleteOrderItems] = useDeleteOrderItemsMutation();

    // ถ้า fetch ไม่ได้ให้เคลีย table ไปเลย
    // useEffect(() => {
    //   if (!isFetching && !isLoading) {
    //     if (isError) setRowData([])
    //   }
    // }, [isFetching, isLoading])

    const [createOrder] = useCreateOrderMutation();
    const [removeDOfromOrder] = useRemoveDOfromOrderMutation();
    const [addOrderItems] = useAddOrderItemsMutation();

    //-------------------------------------

    const { t } = useTranslation();

    function autoSizeAll() {
        const allColumnIds = [];
        gridColumnApi.getAllColumns().forEach((column) => {
            allColumnIds.push(column.colId);
        });

        gridColumnApi.autoSizeColumns(allColumnIds, false);
    }

    const onModelUpdated = () => {
        var filteredCount = 0
        var rowDataCount = 0;
        if (gridApi) {
            filteredCount = gridApi.getDisplayedRowCount()
            rowDataCount = rowData ? rowData.length : "0"
        }
        setShowCount(`${filteredCount}/${rowDataCount}`)
        // gridApi && gridColumnApi &&  autoSizeAll()
    }

    const delSelectedDO = () => {
        // var deleteDOs = []
        // console.log("grid", gridApi.getSelectedNodes())

        var deleteDOs = gridApi.getSelectedNodes().map((row) => {
            return row?.data?.doNo
        })

        deleteOrderItems({ doNoList: deleteDOs })
        // console.log("grid", deleteDOs)
    }

    const createOrderFromDOs = () => {
        const selected = gridApi.getSelectedNodes();
        var createDOs = selected.map((row) => {
            return row?.data?.doNo
        })

        createOrder({ doNoList: createDOs }).then((res) => {
            if (res?.data?.success == true) {
                // setResultRows(res.data.data)
                const orderId = res.data.data.orderId
                const receiptNo = res.data.data.receiptNo
                // console.log("createOrder", { orderId, receiptNo })
                dispatch(allAction.orderItemImportAction.setEditingOrder({
                    senderInput: selected[0].data.senderInput,
                    orderId,
                    receiptNo
                }))
            }
            console.log("res", res)
        });
    }

    // นำออก
    const removeDOs = () => {
        var deleteDOs = gridApi.getSelectedNodes().map((row) => {
            return row?.data?.doNo
        })

        removeDOfromOrder({ doNoList: deleteDOs })
    }

    // เพิ่มพัสดุเข้าใบเสร็จ 
    const insertDO = () => {
        var addDOs = gridApi.getSelectedNodes().map((row) => {
            return row?.data?.doNo
        })
        addOrderItems({ orderId: orderId_Editing, doNoList: addDOs })
    }


    //-------- Filter -------
    // useEffect(() => {
    //     // console.log('search2', searchText);
    //     gridApi && gridApi.onFilterChanged();
    // }, [filterEXCOD, filterSenderID_doNo]);

    const isExternalFilterPresent = () => {
        // return searchText !== '';
        return true;
    };

    const doesExternalFilterPass = (node) => {
        console.log("node.data", node.data)
        const { transportationTypeCode } = node.data

        const chkEXCOD = filterEXCOD.current == "ALL" ? true : filterEXCOD.current == transportationTypeCode ? true : false;
        const chkRecipientInput = (new RegExp(`${filterSenderID_doNo.current}`, 'ig')).test(node.data.recipientInput)
        const chkDoNo = (new RegExp(`${filterSenderID_doNo.current}`, 'ig')).test(node.data.doNo)

        if (chkEXCOD && (chkRecipientInput || chkDoNo)) return true;
        else return false;
    };
    //-------- Filter -------

    const onSelectionChanged = (select) => {
        const rows = gridApi.getSelectedNodes();
        setSelectedRowCount(rows.length)
    }

    return (
        <DIVFLEX>
            <DivButtonBar>
                <Select defaultValue="ALL" style={{ width: 120 }}
                    onChange={((val) => {
                        filterEXCOD.current = val
                        gridApi && gridApi.onFilterChanged();
                    })}>
                    <Option value="ALL">EX , COD</Option>
                    <Option value="EX">EX</Option>
                    <Option value="COD">COD</Option>
                </Select>
                <div>
                    <Search
                        placeholder="ค้นหาด้วยรหัสลูกค้า/เลขพัสดุ"
                        allowClear
                        onSearch={(val) => {
                            filterSenderID_doNo.current = val
                            gridApi && gridApi.onFilterChanged();
                        }}
                        onChange={(v) => {
                            if (v.target.value == '') {
                                filterSenderID_doNo.current = ''
                                gridApi && gridApi.onFilterChanged();
                            }
                        }}
                        style={{ width: 250, marginLeft: 20 }}
                    />
                </div>
                <div>
                    <Button
                        type="primary"
                        size="middle"
                        style={{ marginLeft: 20, marginRight: 10 }}
                        icon={<FileDoneOutlined />}
                        disabled={selectedRowCount < 1 || headerData?.orderStatusCode != "DRF"}
                        onClick={() => {
                            removeDOs()
                        }}
                    >
                        นำออก
                    </Button>
                    <Button
                        danger
                        type="primary"
                        size="middle"
                        style={{ marginRight: 10 }}
                        icon={<FileDoneOutlined />}
                        disabled={selectedRowCount < 1 || headerData?.orderStatusCode != "DRF"}
                        onClick={() => {
                            delSelectedDO()
                        }}
                    >
                        ลบ
                    </Button>

                </div>
                <div style={{
                    flex: 1,
                    flexDirection: "row",
                    alignSelf: "end",
                    justifyContent: "flex-end",
                    display: "flex"
                }}>
                    <span style={{
                    }}> {showCount} รายการ</span>
                </div>
            </DivButtonBar>
            {/* <Tab5Table
                rowData={rowData}
                headerColumns={headerColumns}
                // searchText={searchText}
                gridApi={gridApi}
                setGridApi={setGridApi}
                // gridColumnApi={gridColumnApi}
                // setGridColumnApi={setGridColumnApi}
                setColumnDefs={setColumnDefs}
                cName={cName}
                doesExternalFilterPass={doesExternalFilterPass}
                isExternalFilterPresent={isExternalFilterPresent}
                onSelectionChanged={onSelectionChanged}
                onModelUpdated={onModelUpdated}
            /> */}

            <Tab3Table
                rowData={rowData}
                headerColumns={headerColumns}
                // searchText={searchText}
                gridApi={gridApi}
                setGridApi={setGridApi}
                // gridColumnApi={gridColumnApi}
                // setGridColumnApi={setGridColumnApi}
                setColumnDefs={setColumnDefs}
                cName={cName}
                doesExternalFilterPass={doesExternalFilterPass}
                isExternalFilterPresent={isExternalFilterPresent}
                onSelectionChanged={onSelectionChanged}
                onModelUpdated={onModelUpdated}
                setGridColumnApi={setGridColumnApi}
            />
        </DIVFLEX>
    );
};

export default Tab5Dos;

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

const DIVFLEX = styled.div`
    background-color: white;
    //   height: calc(100vh - 130px);
    height: 100%;
    display: flex;
    flex-direction: column;

    //   color: blue;
    //   flex: 1;
    //   border: 2px solid blue;
    // margin-top: -16px;
`;


function cName(num) {
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
        ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
}