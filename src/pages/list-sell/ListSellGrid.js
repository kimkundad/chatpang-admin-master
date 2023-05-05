/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
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
    Tooltip,
    Tag,
} from 'antd';
import './drawer.css';
import moment from 'moment';

const { Search } = Input;

import {
    EditOutlined
} from '@ant-design/icons';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import readXlsxFile from 'read-excel-file';


const ListSellGrid = (props) => {
    const {
        rowData,
        gridApi,
        setGridApi,
        // gridColumnApi,
        // setGridColumnApi,
        ActionComponent,
        checkedErrorList,
        showErrorList,
        setShowErrorList,
        // gridLoading,
        isExternalFilterPresent,
        doesExternalFilterPass,
        onSelectionChanged,
        onModelUpdated
    } = props;

    const { isLoading } = useSelector((state) => state.orderItemImportReducer);

    const columnDefs = useRef([]);
    //   const [rowData, setRowData] = useState([]);

    const { t } = useTranslation();

    const onGridReady = (params) => {
        console.log("onGridReady2")
        setGridApi(params.api);
        // setGridColumnApi(params.columnApi);
    };

    useEffect(() => {
        console.log("gridLoading")
        if (gridApi)
            isLoading ? gridApi.showLoadingOverlay() : gridApi.hideOverlay()
    }, [isLoading, gridApi])

    //   useEffect(() => {
    //     if (gridApi) {
    //       columnDefs.current = setColumnDefs(
    //         cName,
    //         columnDefs.current,
    //         headerColumns
    //       );
    //       console.log("columnDefs.current", columnDefs.current)
    //       gridApi.setColumnDefs(columnDefs.current);
    //     }
    //   }, [headerColumns, gridApi]);

    useEffect(() => {
        // console.log("rowData",rowData)
        if (gridApi && rowData?.length > 0) {
            // console.log("rowData gridApi",rowData)

            gridApi.setRowData(rowData);

            gridApi.setEnableCellTextSelection(true);

            gridApi.setAlwaysShowHorizontalScroll(false);
            gridApi.setAlwaysShowVerticalScroll(false);

            // gridApi.redrawRows();
            // gridApi.refreshCells();

            // gridApi.autoSizeAllColumns();

            // const allColumnIds = [];
            // gridColumnApi && gridColumnApi.getAllColumns().forEach((column) => {
            //   allColumnIds.push(column.colId);
            // });
            // gridColumnApi && gridColumnApi.autoSizeColumns(allColumnIds);

            gridApi.hideOverlay();
            gridApi.setAlwaysShowHorizontalScroll(true);
            gridApi.setAlwaysShowVerticalScroll(true);
            //gridApi.sizeColumnsToFit();
            // gridApi.ensureIndexVisible(400);
        }
    }, [rowData, gridApi]);

    const onColumnResized = (val) => {
        console.log("onColumnResized", val)
    }

    return (
        <div className="ag-theme-balham site-drawer-render-in-current-wrapper" style={{ flex: 1 }}>
            <AgGridReact
                rowData={rowData}
                // reactUi="true"
                alwaysShowHorizontalScroll={true}
                alwaysShowVerticalScroll={true}

                defaultColDef={{
                    resizable: true, width: 200,
                    filter: 'agTextColumnFilter',
                    sortable: true
                }}

                scrollbarWidth={10}
                onModelUpdated={onModelUpdated}

                // suppressCellSelection={true}
                suppressRowClickSelection={true}

                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
                onGridReady={onGridReady}
                rowSelection={'multiple'}
                onSelectionChanged={onSelectionChanged}
                onColumnResized={onColumnResized}
                frameworkComponents={{
                    statusComponent: StatusComponent,
                    actionComponent: ActionComponent,
                }}

            >
                <AgGridColumn
                    width="180"
                    headerName=""
                    field="Action"
                    cellRenderer={"actionComponent"}
                    checkboxSelection={true}
                    headerCheckboxSelection={true}
                    headerCheckboxSelectionFilteredOnly={true}
                ></AgGridColumn>
                <AgGridColumn headerName="เลขพัสดุ" field="doNo" width="150"></AgGridColumn>
                <AgGridColumn headerName={t('status')} field="orderItemStatusCode" width="190"
                    cellRenderer={"statusComponent"}
                ></AgGridColumn>

                {/* <AgGridColumn field="orderId" width="60"></AgGridColumn> */}
                <AgGridColumn headerName="เลขใบเสร็จ" field="receiptNo" width="150"
                    valueGetter={params => {
                        return params.data?.orderData?.receiptNo || params.data?.orderData?.soNo
                    }}
                ></AgGridColumn>
                <AgGridColumn headerName={t('transportation-order-no')} field="transportationOrderData" width="200"
                    valueGetter={({ data }) => {
                        //  console.log("transportationOrderData",data)
                        return data?.transportationOrderData ? data?.transportationOrderData?.transportationOrderNo : ''
                    }}
                ></AgGridColumn>
                <AgGridColumn headerName="วันเวลาสร้าง" field="createdAt" width="150"
                    valueGetter={({ data }) =>
                        data?.createdAt ? moment(data?.createdAt).format('YYYY-MM-DD HH:mm') : '-'
                    }
                ></AgGridColumn>
                <AgGridColumn headerName={t('menu-setting-supplies')} field="parcelTypeData" width="150"
                    valueGetter={({ data }) =>
                        data?.parcelTypeData?.category || ''
                    }
                ></AgGridColumn>
                <AgGridColumn headerName={t('hubs_code')} field="orderData" width="100"
                    valueGetter={({ data }) => {
                        // console.log("data", data)
                        if (data?.orderData?.agencyData?.isCustomer) {
                            return data?.orderData?.agencyData?.hubData?.hubName;
                        }
                        return data?.orderData?.agencyData?.hubData?.hubCode;
                    }}
                ></AgGridColumn>
                <AgGridColumn headerName={t('agency-code')} field="orderData" width="100"
                    valueGetter={({ data }) => {
                        return data?.orderData?.agencyData?.agencyCode;
                    }}
                ></AgGridColumn>
                <AgGridColumn headerName={t('sender-name')} field="orderData" width="100"
                    valueGetter={({ data }) => `${data?.orderData?.senderName || ''} ${data?.orderData?.senderLastName || ''}`}
                ></AgGridColumn>
                <AgGridColumn headerName={t('transportation-net-price')} field="transportationNetPrice" width="100"></AgGridColumn>
                <AgGridColumn headerName={t('cod')} field="cod" width="100"></AgGridColumn>
                <AgGridColumn headerName={t('weight')} field="weight" width="100"></AgGridColumn>
                <AgGridColumn headerName={t('volume')} field="volume" width="100"></AgGridColumn>
                <AgGridColumn headerName={t('recipient')} field="recipientName" width="150"
                    valueGetter={({ data }) => {
                        if (data?.recipientLastName) {
                            return `${data?.recipientName} ${data?.recipientLastName}`;
                        }
                        return data?.recipientName;
                    }}
                ></AgGridColumn>
                <AgGridColumn headerName={t('subdistrict')} field="recipientSubdistrictData" width="150"
                    valueGetter={({ data }) => {
                        return data?.recipientSubdistrictData?.subdistrictName;
                    }}
                ></AgGridColumn>
                <AgGridColumn headerName={t('district')} field="recipientDistrictData" width="150"
                    valueGetter={({ data }) => {
                        return data?.recipientDistrictData?.districtName;
                    }}
                ></AgGridColumn>
                <AgGridColumn headerName={t('province')} field="recipientProvinceData" width="200"
                    valueGetter={({ data }) => {
                        return data?.recipientDistrictData?.districtName;
                    }}
                ></AgGridColumn>


            </AgGridReact>
            <Drawer
                title="รายการข้อผิดพลาด"
                placement="right"
                closable={true}
                onClose={() => setShowErrorList(false)}
                visible={showErrorList}
                getContainer={false}
                style={{ position: 'absolute' }}
            >
                {checkedErrorList && checkedErrorList.map((err, idx) => {
                    return <div>{err.row} : {err.error_msg}</div>
                })}
            </Drawer>
        </div>
    );
};

export default ListSellGrid;

const DivButtonBar = styled.div`
  margin: 10px;
  //   background-color: white;
  //   height: calc(100vh - 130px);
  //   display: flex;
  //   flex-direction: column;

  //   color: blue;
  //   flex: 1;
  //   border: 2px solid blue;
  //   margin-top: -16px;
`;


const StatusComponent = params => {
    // console.log('row', row);
    const code = params.data?.orderItemStatus?.orderItemStatusCode;
    const priority = params.data?.orderItemStatus?.priority;
    let txt = params.data?.orderItemStatus?.orderItemStatusDesc
        ? params.data?.orderItemStatus?.orderItemStatusDesc
        : '-';
    let color = '';

    if (priority >= 4) color = 'green';
    if (priority == 5) txt = 'ตรวจสอบแล้ว';

    if (priority >= 6) {
        txt = 'พัสดุถึงฮับ';
        color = 'blue';
    }
    if (priority == 7) color = 'blue';
    if (code === 'ITM') {
        color = 'red';
        txt = 'ของหาย';
    }

    return <Tag color={color}>{txt}</Tag>;
}