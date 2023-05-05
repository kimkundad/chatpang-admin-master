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
  Tooltip
} from 'antd';
import './drawer.css';

const { Search } = Input;

import {
  EditOutlined
} from '@ant-design/icons';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';

import allAction from '../../../app/actions/index';

import {
  orderItemsApi,
} from '../../../app/api/orderItemsApi';

const Tab3Table = (props) => {
  const {
    rowData,
    headerColumns,
    gridApi,
    setGridApi,
    setGridColumnApi,
    setColumnDefs,
    cName,
    checkedErrorList,
    showErrorList,
    setShowErrorList,
    // gridLoading,
    isExternalFilterPresent,
    doesExternalFilterPass,
    onSelectionChanged,
    onModelUpdated,
    DoNoWithPrintButton,
    TotalPriceComponent,
    onFilterChanged
  } = props;

  const { isLoading } = useSelector((state) => state.orderItemImportReducer);

  const columnDefs = useRef([]);
  //   const [rowData, setRowData] = useState([]);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onGridReady = (params) => {
    console.log("onGridReady2")
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    // setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    console.log("gridLoading")
    if (gridApi)
      isLoading ? gridApi.showLoadingOverlay() : gridApi.hideOverlay()
  }, [isLoading, gridApi])

  useEffect(() => {
    if (gridApi) {
      columnDefs.current = setColumnDefs(
        cName,
        columnDefs.current,
        headerColumns
      );
      console.log("columnDefs.current", columnDefs.current)
      gridApi.setColumnDefs(columnDefs.current);
    }
  }, [headerColumns, gridApi]);

  useEffect(() => {
    // console.log("rowData",rowData)
    if (gridApi && rowData?.length > 0) {
      // console.log("rowData gridApi",rowData)

      gridApi.setRowData(rowData);

      gridApi.setEnableCellTextSelection(true);

      gridApi.setAlwaysShowHorizontalScroll(false);
      gridApi.setAlwaysShowVerticalScroll(false);

      // gridApi.redrawRows();
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

  return (
    <div className="ag-theme-balham site-drawer-render-in-current-wrapper" style={{ flex: 1 }}>
      <AgGridReact
        rowData={rowData}
        // reactUi="true"
        alwaysShowHorizontalScroll={true}
        alwaysShowVerticalScroll={true}

        defaultColDef={{ resizable: true }}

        scrollbarWidth={8}
        onModelUpdated={onModelUpdated}

        // suppressCellSelection={true}
        suppressRowClickSelection={true}

        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        onGridReady={onGridReady}
        rowSelection={'multiple'}
        onSelectionChanged={onSelectionChanged}
        // firstDataRendered={firstDataRendered}
        // onColumnResized={onColumnResized}
        frameworkComponents={{
          actionComponent: ActionComponent,
          doNoWithPrintButton: DoNoWithPrintButton,
          totalPriceComponent : TotalPriceComponent,
        }}

        onFilterChanged={onFilterChanged}

      >
        <AgGridColumn field=""></AgGridColumn>
        {/* {headerColumns.forEach((col) => (
            <></>
            <AgGridColumn filed={col.field} />
          ))} */}
        {/* <AgGridColumn field="make" pinned="left"></AgGridColumn>
          <AgGridColumn field="model"></AgGridColumn>
          <AgGridColumn
            field="price"
            filter="agNumberColumnFilter"
          ></AgGridColumn> */}
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

export default Tab3Table;

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


const ActionComponent = (params) => {
  // console.log("params", params)
  const dispatch = useDispatch();

  return <div>
    {(params.data.receiptNo || params.data.soNo) &&
      <>
        <Button type="primary" size="small" shape="circle" icon={<EditOutlined />}
          onClick={() => {
            dispatch(
              orderItemsApi.util.invalidateTags(['OrderItems', 'Orders'])
            )

            const showReceiptNo = params?.data?.receiptNo ? params?.data?.receiptNo : params?.data?.soNo
            dispatch(allAction.orderItemImportAction.setEditingOrder({
              senderInput: params?.data?.senderInput,
              orderId: params?.data?.orderId,
              receiptNo: params?.data?.receiptNo,
              soNo: params?.data?.soNo,
            }))
          }}
        />
      </>
    }
    {" "} {params?.data?.receiptNo ? params?.data?.receiptNo : params?.data?.soNo}
    {/* {params.data.createdAt} */}
  </div>;
}