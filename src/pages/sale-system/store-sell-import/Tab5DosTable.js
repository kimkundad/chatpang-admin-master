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
    Drawer
} from 'antd';
import './drawer.css';

const { Search } = Input;

import {
    CheckCircleOutlined,
    FileExcelOutlined,
    FileAddOutlined,
    FileDoneOutlined,
} from '@ant-design/icons';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import readXlsxFile from 'read-excel-file';

const Tab5DosTable = (props) => {
    const {
        rowData,
        headerColumns,
        gridApi,
        setGridApi,
        // gridColumnApi,
        // setGridColumnApi,
        setColumnDefs,
        cName,
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

    const DoContent = (params) => {
        console.log("params", params)
        return <div>
            <Button
                danger
                type="primary"
                size="small"
                style={{ marginRight: 10 }}
                icon={<FileDoneOutlined />}
                onClick={() => {
                    console.log("receiptNo",params.data.receiptNo)
                }}
            >
                ทดสอบ
            </Button>
            {params.data.createdAt}
        </div>;
    }

    return (
        <div className="ag-theme-balham site-drawer-render-in-current-wrapper" style={{ flex: 1 }}>
            <AgGridReact
                rowData={rowData}
                reactUi="true"
                alwaysShowHorizontalScroll={true}
                alwaysShowVerticalScroll={true}

                defaultColDef={{ resizable: true }}

                scrollbarWidth={8}
                onModelUpdated={onModelUpdated}
                
                suppressCellSelection={true}
                suppressRowClickSelection={true}

                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
                onGridReady={onGridReady}
                rowSelection={'multiple'}
                onSelectionChanged={onSelectionChanged}
                // onColumnResized={onColumnResized}
                frameworkComponents={{
                    doContent: DoContent,
                }}
                rowHeight={100}
            >
                <AgGridColumn width={50} field="Action" 
                checkboxSelection={true} headerCheckboxSelection={true}
                headerCheckboxSelectionFilteredOnly={true} ></AgGridColumn>
                <AgGridColumn width={800} field="Content" cellRenderer={"doContent"}></AgGridColumn>
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

export default Tab5DosTable;

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
