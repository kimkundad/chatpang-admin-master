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


const TabTable = (props) => {
  const {
    rowData,
    headerColumns,
    searchText,
    gridApi,
    setGridApi,
    gridColumnApi,
    setGridColumnApi,
    setColumnDefs,
    cName,
    checkedErrorList,
    showErrorList,
    setShowErrorList,
    onModelUpdated
  } = props;

  const columnDefs = useRef([]);

  const { isLoading } = useSelector((state) => state.orderItemImportReducer);

  const { t } = useTranslation();

  const onGridReady = (params) => {
    console.log("onGridReady2")
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
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
      // console.log("columnDefs.current", columnDefs.current)
      gridApi.setColumnDefs(columnDefs.current);
    }
  }, [headerColumns, gridApi]);

  useEffect(() => {
    // console.log("rowData", rowData)
    if (gridApi && rowData?.length > 0) {
      console.log("rowData gridApi", rowData)
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

  //=====onSearch

  const isExternalFilterPresent = () => {
    // return ageType !== 'everyone';
    return searchText !== '';
  };

  // var found = columnDefs.current.find((item) => {
  //   // reg.test(value))
  //   var myRe = new RegExp(`/${searchText}/`, 'g');
  //   // reg = /`${searchText}`/i.test();
  //   myRe.test(`${node.data[item.field]}`)
  //   console.k = `${node.data[item.field]}`
  //   if(myRe) {
  //     console.log("node.data",`${node.data[item.field]}`,searchText)
  //   } else {
  //     console.log("node.data",`${node.data[item.field]}`,searchText)
  //   }
  //   return myRe
  // });

  // var found = columnDefs.current.find((item) => {
  //   return `${node.data[item.field]}`.includes(searchText);
  // });


  const doesExternalFilterPass = (node) => {
    // console.log('search3', node.data);
    var found = columnDefs.current.find((item) => {
      // reg.test(value))
      var myRe = new RegExp(`${searchText}`, 'i');

      return myRe.exec(`${node.data[item.field]}`);
    });

    // if (node.data.C.includes(searchText)) return true;
    if (found) return true;
    else return false;
  };

  useEffect(() => {
    // console.log('search2', searchText);
    gridApi && gridApi.onFilterChanged();
  }, [searchText]);

  //=====onSearch

  return (
    <div className="ag-theme-balham site-drawer-render-in-current-wrapper" style={{ flex: 1 }}>
      <AgGridReact
        rowData={rowData}
        reactUi={true}
        alwaysShowHorizontalScroll={true}
        alwaysShowVerticalScroll={true}
        //suppressHorizontalScroll={true}
        //suppressVerticalScroll={true}
        // debounceVerticalScrollbar={true}
        defaultColDef={{ resizable: true }}
        // scrollbarWidth={100}
        // paginationAutoPageSize={true}
        // pagination={true}
        //   lockPinned={true}
        scrollbarWidth={8}
        suppressCellSelection={true}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        onGridReady={onGridReady}
        onModelUpdated={onModelUpdated}
      // debug={true}
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

export default TabTable;

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
