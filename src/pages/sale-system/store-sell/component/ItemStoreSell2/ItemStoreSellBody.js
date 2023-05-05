/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Input, Form, Button, Radio, Checkbox, Select, message, Tooltip, Tag } from 'antd';
import { useReactToPrint } from 'react-to-print';

const { Search } = Input;
const { Option } = Select;

// import TabTableTest3 from './TabTableTest3';
// import ItemStoreSellTable from './ItemStoreSellTable';
import ItemStoreSellGridView from '../../../store-sell-import/Tab3Table';
import PrintSticker from "../Printing/PrintSticker"
import ButtonPrinting from '../Printing/ButtonPrinting';


import {
    CloseCircleOutlined,
    CheckCircleOutlined,
    FileExcelOutlined,
    FileAddOutlined,
    FileDoneOutlined,
    PlusCircleOutlined,
    PrinterOutlined,
    DeleteOutlined,
    EditFilled,
    QrcodeOutlined,
    CodeSandboxOutlined,
    CheckSquareOutlined,
    FilterOutlined
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
    // orderItemsApi,
    // useGetOrderItemsImportQuery,
    useDeleteOrderItemsMutation,
    // useCreateOrderMutation,
    // useRemoveDOfromOrderMutation,
    // useAddOrderItemsMutation,
    useGetOrderWithDosQuery
} from '../../../../../app/api/orderItemsApi';

import allAction from '../../../../../app/actions/index';
import ItemCardEdit from './ItemCardEdit';

function Knumber(val, name) {

    if (!val) return 0

    var ret = Number(val)
    // console.log("Knumber1",val,ret,name)
    if (isNaN(ret)) {
        ret = Number(val.replace(/[^0-9.-]+/g, ""));
        // if(isNaN(ret)) return 0;
    }
    // console.log("Knumber2",val,ret,name)
    return ret
}

const setColumnDefsEdit = (cName, columnDefs, headerColumns) => {
    columnDefs = headerColumns.map((headerName, idx) => {
        var colDef = {
            field: `${headerName}`,
            headerName: `${headerName}`,
            filter: 'agTextColumnFilter',
            width: 100,
            sortable: true
        }

        switch (headerName) {

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
                colDef["width"] = 80;
                colDef["headerName"] = "COD";
                colDef["cellStyle"] = (params) => {
                    if (params?.data?.transportationTypeCode != "COD") {
                        //mark police cells as red
                        return { color: '#E8E8E8', backgroundColor: '#E8E8E8' };
                    }
                    return null;
                }
                colDef["valueGetter"] = ({ data }) => {
                    return dec2(data?.cod)
                }
                break;

            case "transportationNetPrice":
                colDef["headerName"] = "รวม";
                colDef["cellRenderer"] = "totalPriceComponent"
                colDef["type"] = 'rightAligned';
                colDef["comparator"] = (valueA, valueB, nodeA, nodeB, isInverted) => Knumber(valueA) - Knumber(valueB);
                colDef["cellStyle"] = (params) => {
                    if (true) {
                        //mark police cells as red
                        return { color: 'white', backgroundColor: '#7596de' };
                    }
                    return null;
                }
                // colDef["valueGetter"] = ({ data }) => {
                //     if (parseFloat(data?.ratePercent) == 0.0)
                //         return ""
                //     else
                //         return `${data?.ratePercent} %`
                // }
                break;

            case "chargeCodPrice":
                colDef["headerName"] = "Charge COD";
                colDef["cellStyle"] = (params) => {
                    if (params?.data?.transportationTypeCode != "COD") {
                        //mark police cells as red
                        return { color: '#E8E8E8', backgroundColor: '#E8E8E8' };
                    }
                    return null;
                }
                colDef["valueGetter"] = ({ data }) => {
                    return dec2(data?.chargeCodPrice)
                }
                break;

            case "ratePercent":
                colDef["headerName"] = "อัตรา";
                colDef["width"] = 80;
                colDef["valueGetter"] = ({ data }) => {
                    if (parseFloat(data?.ratePercent) == 0.0)
                        return ""
                    else
                        return `${data?.ratePercent} %`
                }
                colDef["cellStyle"] = (params) => {
                    if (params?.data?.transportationTypeCode != "COD") {
                        //mark police cells as red
                        return { color: '#E8E8E8', backgroundColor: '#E8E8E8' };
                    }
                    return null;
                }
                break;

            case "transportationPrice":
                colDef["headerName"] = "ค่าขนส่ง";
                colDef["valueGetter"] = ({ data }) => {
                    return dec2(data?.transportationPrice)
                }
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
                colDef["valueGetter"] = ({ data }) => {
                    return dec2(data?.volume)
                }
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
                colDef["width"] = 200
                colDef["pinned"] = true
                colDef["cellRenderer"] = "doNoWithPrintButton"
                // colDef["sortingOrder"] = ['desc', 'asc'];
                // colDef["defaultSortOrder"] = "descend"
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

const setColumnDefsViewOnly = (cName, columnDefs, headerColumns) => {
    columnDefs = headerColumns.map((headerName, idx) => {
        var colDef = {
            field: `${headerName}`,
            headerName: `${headerName}`,
            filter: 'agTextColumnFilter',
            width: 100,
            sortable: true
        }

        switch (headerName) {

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
                colDef["width"] = 80;
                colDef["headerName"] = "COD";
                colDef["cellStyle"] = (params) => {
                    if (params?.data?.transportationTypeCode != "COD") {
                        //mark police cells as red
                        return { color: '#E8E8E8', backgroundColor: '#E8E8E8' };
                    }
                    return null;
                }
                break;

            case "transportationNetPrice":
                colDef["headerName"] = "รวม";
                // colDef["cellRenderer"] = "totalPriceComponent"
                colDef["type"] = 'rightAligned';
                colDef["comparator"] = (valueA, valueB, nodeA, nodeB, isInverted) => Knumber(valueA) - Knumber(valueB);
                colDef["cellStyle"] = (params) => {
                    if (true) {
                        //mark police cells as red
                        return { color: 'white', backgroundColor: '#7596de' };
                    }
                    return null;
                }
                // colDef["valueGetter"] = ({ data }) => {
                //     if (parseFloat(data?.ratePercent) == 0.0)
                //         return ""
                //     else
                //         return `${data?.ratePercent} %`
                // }
                break;

            case "chargeCodPrice":
                colDef["headerName"] = "Charge COD";
                colDef["cellStyle"] = (params) => {
                    if (params?.data?.transportationTypeCode != "COD") {
                        //mark police cells as red
                        return { color: '#E8E8E8', backgroundColor: '#E8E8E8' };
                    }
                    return null;
                }
                break;

            case "ratePercent":
                colDef["headerName"] = "อัตรา";
                colDef["width"] = 80;
                colDef["valueGetter"] = ({ data }) => {
                    if (parseFloat(data?.ratePercent) == 0.0)
                        return ""
                    else
                        return `${data?.ratePercent} %`
                }
                colDef["cellStyle"] = (params) => {
                    if (params?.data?.transportationTypeCode != "COD") {
                        //mark police cells as red
                        return { color: '#E8E8E8', backgroundColor: '#E8E8E8' };
                    }
                    return null;
                }
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
                colDef["width"] = 200
                colDef["pinned"] = true
                colDef["cellRenderer"] = "doNoWithPrintButton"
                // colDef["sortingOrder"] = ['desc', 'asc'];
                // colDef["defaultSortOrder"] = "descend"
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

const ItemStoreSellBody = (props) => {
    const {
        form,
        orderId,
        showDoForm,
        setShowDoForm,
        setEditingDoNo,
        editingDoNo,
        hasBanArea,
        viewOnly
        // DIVFLEX,
        // setImportReceiverSuccess,
        // cName,
        // // createOrder,
        // isCreateOrder,
        // itemListData
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
        // "transportationTypeCode",
        "cod",
        "ratePercent",
        "chargeCodPrice",
        'transportationNetPrice',
        "transportationTypeCode",
        "weight",
        "volume",
        "recipientPostcode",
        "ตำบล",
        "อำเภอ",
        "จังหวัด"
    ]);


    const columnDefs = useRef([]);
    const [rowData, setRowData] = useState([]);

    // const [filterEXCOD, selectEXCOD] = useState("ALL")
    const filterEXCOD = useRef("ALL");

    // const [filterSenderID_doNo, searchSenderID_doNo] = useState("")
    const filterSenderID_doNo = useRef("");

    const [isFiltering, setIsFiltering] = useState(false);
    const [selectedRowCount, setSelectedRowCount] = useState(0)
    const [filteredCount, setFilteredCount] = useState(0)
    const [rowDataCount, setRowDataCount] = useState(0)

    const editingDo = useSelector((state) => state.orderItemImportReducer.editingDo);

    const { senderInput, orderId: orderId_Editing, receiptNo } = useSelector(
        (state) => state.orderItemImportReducer
    );



    const dispatch = useDispatch();

    const history = useHistory();

    //----------- RTK QUERY ---------------
    const [filterState, setFilterState] = useState("DRF")

    // const {
    //     data: OrderItems,
    //     isFetching,
    //     isLoading,
    //     isSuccess, /* */
    //     isError,
    //     error,
    //     refetch,
    // } = useGetOrderItemsImportQuery("DRF");

    const {
        data: itemListData,
        // isFetching,
        // isLoading,
        // isSuccess, /* */
        // isError,
        // error,
        // refetch,
    } = useGetOrderWithDosQuery(orderId,{
        // pollingInterval: 3000,
        refetchOnMountOrArgChange: true,
        skip: !orderId || !Number(orderId),
      });

    // useGetOrderWithDosQuery

    const [deleteOrderItems] = useDeleteOrderItemsMutation();

    // ถ้า fetch ไม่ได้ให้เคลีย table ไปเลย
    // useEffect(() => {
    //   if (!isFetching && !isLoading) {
    //     if (isError) setRowData([])
    //   }
    // }, [isFetching, isLoading])

    // const [removeDOfromOrder] = useRemoveDOfromOrderMutation();

    //-------------------------------------

    const { t } = useTranslation();

    useEffect(() => {
        console.log("itemListData", itemListData)
        // setRowData(itemListData);

        if (itemListData?.items?.some((val) => val.transportationTypeCode !== 'EX')) {
            dispatch(allAction.storeSellAction.checkTypeTrans(true));
        } else {
            dispatch(allAction.storeSellAction.checkTypeTrans(false));
        }

        if (itemListData?.items) {
            const itemListDataTmp = itemListData?.items.slice(0).reverse().map((d, idx) => {
                return { rowNo: idx + 1, ...d }
            })
            setRowData(itemListDataTmp);
        }
    }, [itemListData])

    const onModelUpdated = () => {

        var filteredCount = 0
        var rowDataCount = 0;
        if (gridApi) {
            filteredCount = gridApi.getDisplayedRowCount()
            rowDataCount = rowData ? rowData.length : "0"
        }

        console.log("onModelUpdated",filteredCount)
        // setFilteredCount(filteredCount)
        setRowDataCount(rowDataCount)


        if (gridApi) {
            if (filterEXCOD.current != "ALL"
                || filterSenderID_doNo.current
                || gridApi.isColumnFilterPresent()) {

                setIsFiltering(true)
                setFilteredCount(filteredCount)
            }
            else {
                setFilteredCount(0)
                setIsFiltering(false)
            }


        } else {
            setIsFiltering(false)
        }

        gridApi && gridApi.deselectAll()
    }

    const delSelectedDO = () => {
        dispatch(allAction.orderItemImportAction.setEditingDo(null))

        var deleteDOs = gridApi.getSelectedNodes().map((row) => {
            return row?.data?.doNo
        })

        deleteOrderItems({ doNoList: deleteDOs })
        // console.log("grid", deleteDOs)
    }

    // นำออก
    // const removeDOs = () => {
    //     var deleteDOs = gridApi.getSelectedNodes().map((row) => {
    //         return row?.data?.doNo
    //     })

    //     removeDOfromOrder({ doNoList: deleteDOs })
    // }


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
        const { transportationTypeCode } = node.data

        const chkEXCOD = filterEXCOD.current == "ALL" ? true : filterEXCOD.current == transportationTypeCode ? true : false;
        const chkRecipientInput = (new RegExp(`${filterSenderID_doNo.current}`, 'ig')).test(node.data.recipientInput)
        const chkDoNo = (new RegExp(`${filterSenderID_doNo.current}`, 'ig')).test(node.data.doNo)

        gridApi && gridApi.deselectAll()

        if (chkEXCOD && (chkRecipientInput || chkDoNo)) return true;
        else return false;
    };
    //-------- Filter -------

    const onSelectionChanged = (select) => {
        const rows = gridApi.getSelectedNodes();
        setSelectedRowCount(rows.length)
    }

    const DoNoWithPrintButton = (params) => {

        const editingDo = useSelector((state) => state.orderItemImportReducer.editingDo);
        const viewOnly = useSelector((state) => state.orderItemImportReducer.viewOnly);

        // useEffect(() => {

        //     console.log("DoNoWithPrintButton", params)
        //     if (editingDo?.doNo == params?.data?.doNo) {
        //         params?.node?.setData({ ...params?.data, isEditing: true })
        //         // params?.node?.setDataValue("isEditing",true)
        //     }
        //     else {
        //         // console.log("else params",params)
        //         // params?.node?.setDataValue("isEditing",false)
        //     }
        // }, [editingDo]);


        return <div style={{ color: editingDo?.doNo === params?.data?.doNo ? "#7596de" : null }}>
            {!viewOnly && <Button
                // danger
                size="small" shape="circle" icon={<EditFilled />}
                onClick={() => {
                    console.log("params.data", params.data)
                    dispatch(allAction.orderItemImportAction.setEditingDo(
                        {
                            ...params.data,
                            recipientSubdistrictName: params?.data?.recipientSubdistrictData?.subdistrictName,
                            recipientDistrictName: params?.data?.recipientDistrictData?.districtName,
                            recipientProvinceName: params?.data?.recipientProvinceData?.provinceName,
                            doNo: params?.data?.doNo
                        }
                    ))
                    setShowDoForm(true)
                }}
            />}{" "}
            {(params?.data?.orderItemStatusCode === "CBA" || params?.data?.orderItemStatusCode === "CBH") ?
                <Tooltip placement="left" title={params?.data?.orderItemStatusCode === "CBA" ? "ยกเลิกโดย Agency" : "ยกเลิกโดย Hub"}>
                    <Button
                        // danger
                        size="small" shape="circle" icon={<CloseCircleOutlined />}
                        onClick={() => {
                        }}
                    />
                </Tooltip>
                :
                <PrintComponent params={params} form={form} />
            }
            {" "}{params?.data?.doNo}

        </div>
    }

    const onFilterChanged = () => {
 
    }


    return (
        <DIVFLEX>
            {showDoForm && !viewOnly &&
                <div style={{ border: "1px solid #B2B2B2" }}>
                    <ItemCardEdit hasBanArea={hasBanArea} orderId={orderId} form={form} editingDoNo={editingDoNo}></ItemCardEdit>
                </div>
            }
            <DivButtonBar>
                <Select defaultValue="ALL" style={{ width: 120 }}
                    onChange={((val) => {
                        filterEXCOD.current = val
                        gridApi && gridApi.onFilterChanged();
                        // if (filterEXCOD.current != "ALL" || filterSenderID_doNo.current) setIsFiltering(true)
                        // else setIsFiltering(false)
                    })}>
                    <Option value="ALL">EX , COD</Option>
                    <Option value="EX">EX</Option>
                    <Option value="COD">COD</Option>
                </Select>
                <div>
                    <Search
                        placeholder="ค้นหาด้วยรหัสผู้รับ/เลขพัสดุ"
                        allowClear
                        onSearch={(val) => {
                            filterSenderID_doNo.current = val
                            gridApi && gridApi.onFilterChanged();
                            // if (filterEXCOD.current != "ALL" || filterSenderID_doNo.current) setIsFiltering(true)
                            // else setIsFiltering(false)
                        }}
                        onChange={(v) => {
                            if (v.target.value == '') {
                                filterSenderID_doNo.current = ''
                                gridApi && gridApi.onFilterChanged();
                                // if (filterEXCOD.current != "ALL" || filterSenderID_doNo.current) setIsFiltering(true)
                                // else setIsFiltering(false)
                            }
                        }}
                        style={{ width: 250, marginLeft: 20 }}
                    />
                </div>
                <div>
                    {/* <Button
                        type="primary"
                        size="middle"
                        style={{ marginLeft: 20, marginRight: 10 }}
                        icon={<FileDoneOutlined />}
                        disabled={selectedRowCount < 1}
                        onClick={() => {
                            removeDOs()
                        }}
                    >
                        นำออก
                    </Button> */}
                    {!viewOnly && <Button
                        danger
                        type="primary"
                        size="middle"
                        style={{ marginLeft: 10 }}
                        icon={<FileDoneOutlined />}
                        disabled={selectedRowCount < 1 || rowDataCount == selectedRowCount}
                        onClick={() => {
                            delSelectedDO()
                        }}
                    >
                        ลบ
                    </Button>}
                </div>
                <div style={{
                    flex: 1,
                    flexDirection: "row",
                    alignSelf: "end",
                    justifyContent: "flex-end",
                    display: "flex"
                }}>
                    <span style={{
                    }}>
                        <span style={{ fontFamily: "sans-serif", }}>
                            {/* {selectedRowCount > 0 && <Tag color="blue"><CheckSquareOutlined />&nbsp;เลือก {selectedRowCount}</Tag>}
                            {filteredCount > 0 && <Tag color="red"><FilterOutlined />&nbsp;กรอง {filteredCount}</Tag>} */}
                            <Tag color={selectedRowCount > 0 ? "blue" : null}>
                                <div style={{ color: selectedRowCount > 0 ? null : "gray" }}>
                                    <CheckSquareOutlined />
                                    &nbsp;เลือก {selectedRowCount}
                                </div>
                            </Tag>
                            <Tag color={isFiltering ? "red" : null}>
                                <div style={{ color: isFiltering ? null : "gray" }}>
                                    <FilterOutlined />&nbsp;ตัวกรอง {filteredCount}
                                </div>
                            </Tag>
                            &nbsp;<CodeSandboxOutlined style={{}} />
                            &nbsp;พัสดุ {rowDataCount} รายการ</span> &nbsp;
                    </span>
                </div>
            </DivButtonBar>
            {/* <ItemStoreSellTable
                setEditingDoNo={setEditingDoNo}
                setShowDoForm={setShowDoForm}
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
            <ItemStoreSellGridView
                // setEditingDoNo={setEditingDoNo}
                // setShowDoForm={setShowDoForm}
                rowData={rowData}
                headerColumns={headerColumns}
                // searchText={searchText}
                gridApi={gridApi}
                setGridApi={setGridApi}
                // gridColumnApi={gridColumnApi}
                setGridColumnApi={setGridColumnApi}
                setColumnDefs={viewOnly ? setColumnDefsViewOnly : setColumnDefsEdit}
                cName={cName}
                doesExternalFilterPass={doesExternalFilterPass}
                isExternalFilterPresent={isExternalFilterPresent}
                onSelectionChanged={onSelectionChanged}
                onModelUpdated={onModelUpdated}
                DoNoWithPrintButton={DoNoWithPrintButton}
                TotalPriceComponent={TotalPriceComponent}
                onFilterChanged={onFilterChanged}
            />
        </DIVFLEX>
    );
};

export default ItemStoreSellBody;

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

const PrintComponent = (props) => {
    const { form, params } = props;
    const [startPrint, setStartPrint] = useState(false)
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (startPrint) {
            handlePrint();
        }
    }, [startPrint])

    return <>
        <Button
            size="small"
            shape="circle"
            onClick={() => {
                if (!startPrint) {
                    setStartPrint(true);
                } else {
                    handlePrint();
                }
            }}
            icon={<QrcodeOutlined />}
        />
        {startPrint && <PrintSticker
            componentRef={componentRef}
            form={form}
            orderItemData={params?.data}
        />}
    </>
}

const TotalPriceComponent = (params) => {
    const editingDo = useSelector((state) => state.orderItemImportReducer.editingDo);
    const discountPercent = useSelector((state) => state.orderItemImportReducer.discountPercent);
    const morePriceAmount = useSelector((state) => state.orderItemImportReducer.morePriceAmount);
    const etcAmount = useSelector((state) => state.orderItemImportReducer.etcAmount);
    const totalItem = useSelector((state) => state.orderItemImportReducer.totalItem);
    const showDoForm = useSelector((state) => state.orderItemImportReducer.showDoForm);
    const { dec2, Knumber } = useSelector((state) => state.kaiUtilsReducer);

    const [transportationNetPrice, setTransportationNetPrice] = useState(0.0)

    useEffect(() => {
        // const totalItem_ = (showDoForm && !editingDo) ? Number(totalItem)+1 : Number(totalItem) ;

        const totalItem_ = Knumber(totalItem) ? Knumber(totalItem) : 1;

        const adding =
            (Knumber(etcAmount || 0) + Knumber(morePriceAmount || 0)) / totalItem_

        const dis =
            Knumber(discountPercent ? discountPercent / 100 : 0) *
            Knumber(params.data.transportationPrice || 0);

        const tnp =
            (Knumber(params.data.transportationPrice || 0) + Knumber(params.data.chargeCodPrice) + adding - dis).toFixed(2);

        setTransportationNetPrice(tnp)
        // formDo.setFieldsValue(itemSs)

    }, [showDoForm, editingDo, discountPercent, morePriceAmount, etcAmount])

    return <div>
        {dec2(transportationNetPrice)}
    </div>
}

function fnumber_format(number, decimals, dec_point, thousands_sep) {
    // http://kevin.vanzonneveld.net
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        toFixedFix = function (n, prec) {
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            var k = Math.pow(10, prec);
            return Math.round(n * k) / k;
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

const dec2 = (num) => {
    return fnumber_format(num, 2, ".", ",")
}