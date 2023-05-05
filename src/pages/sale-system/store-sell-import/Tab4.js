/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Input, Form, Button, Radio, Checkbox, Select, message } from 'antd';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

// import TabTableTest3 from './TabTableTest3';
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
  useGetDRFOrderQuery,
  useDeleteOrdersMutation
} from '../../../app/api/orderItemsApi';

import allAction from '../../../app/actions/index';

const setColumnDefs = (cName, columnDefs, headerColumns) => {
  columnDefs = headerColumns.map((headerName, idx) => {
    var hn = headerName;
    var w = 200;
    var pinned = null

    switch (headerName) {

      case "senderInput":
        hn = "รหัสลูกค้า"
        w = 140;
        break;

      case "totalPrice":
        hn = "ยอดสุทธิ"
        w = 120;
        break;

      case "createdAt":
        // hn = "Status"
        w = 170;
        break;

      case "receiptNo":
        return {
          field: `${headerName}`,
          headerName: `เลขใบเสร็จ`,
          filter: 'agTextColumnFilter',
          width: 180,
          sortable: true,
          cellRenderer: "actionComponent"
          // pinned: pinned
        };
        break;

      case "Action":
        w = 100;
        hn = ""
        break;

      default:
      // code block
    }
    return {
      field: `${headerName}`,
      headerName: `${hn}`,
      filter: 'agTextColumnFilter',
      width: w,
      sortable: true,
      pinned: pinned
    };
  });

  // if (columnDefs.length > 5) {
  //   columnDefs[0].width = 80;
  //   columnDefs[1].width = 120;
  //   columnDefs[3].width = 80;
  //   columnDefs[4].width = 120;
  // }
  // columnDefs[0].cellRenderer = "actionComponent"
  columnDefs[0].checkboxSelection = true;
  columnDefs[0].headerCheckboxSelection = true;
  columnDefs[0].headerCheckboxSelectionFilteredOnly = true;
  columnDefs[0].valueGetter = params => {
    // const rowNumber = params.node.rowIndex + 1;
    return moment(params.data.createdAt).format('DD-MM-YYYY HH:mm');
  }
  columnDefs[0].comparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
    if (nodeA.data.createdAt == nodeB.data.nodeB) return 0;
    return (nodeA.data.createdAt > nodeB.data.nodeB) ? 1 : -1;
  }

  return columnDefs;
};

const Tab4 = (props) => {
  const {
    DIVFLEX,
    setImportReceiverSuccess,
    cName,
    // createOrder,
    isCreateOrder,
  } = props;

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [isUploadDone, setIsUploadDone] = useState(false);
  // const [searchText, setSearchText] = useState('');

  const [headerColumns, setHeaderColumns] = useState([
    // "Action",
    "createdAt",
    "receiptNo",
    "senderInput",
    "totalPrice",
  ]
  );

  const columnDefs = useRef([]);
  const [rowData, setRowData] = useState([]);

  const filterSenderID_orderID = useRef("");

  const [sameSender, setSameSender] = useState(false)

  const { senderInput, orderId: orderId_Editing, receiptNo } = useSelector(
    (state) => state.orderItemImportReducer
  );

  const [showCount, setShowCount] = useState("0/0")

  const dispatch = useDispatch();

  const history = useHistory();

  //----------- RTK QUERY ---------------
  const [filterState, setFilterState] = useState("IMP")

  const {
    data: OrderList,
    isFetching,
    isLoading,
    isSuccess, /* */
    isError,
    error,
    refetch,
  } = useGetDRFOrderQuery();

  const [deleteOrders] = useDeleteOrdersMutation();

  // ถ้า fetch ไม่ได้ให้เคลีย table ไปเลย
  // useEffect(() => {
  //   if (!isFetching && !isLoading) {
  //     if (isError) setRowData([])
  //   }
  // }, [isFetching, isLoading])

  //-------------------------------------

  const { t } = useTranslation();

  useEffect(() => {
    console.log("OrderList", OrderList)
    setRowData(OrderList);
  }, [OrderList])

  // useEffect(() => {
  //   var filteredCount = 0
  //   var rowDataCount = 0;
  //   if(gridApi){
  //     filteredCount = gridApi.getDisplayedRowCount()
  //     rowDataCount = rowData ? rowData.length : "0"
  //   }
  //   setShowCount(`${filteredCount}/${rowDataCount}`)
  // }, [rowData,filterSenderID_orderID])

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


  const delSelectedOrder = () => {
    // var deleteDOs = []
    // console.log("grid", gridApi.getSelectedNodes())

    var deleteOrdersList = gridApi.getSelectedNodes().map((row) => {
      // console.log("row",row.data.)
      return row?.data?.orderId
    })

    console.log("deleteOrdersList", deleteOrdersList)

    deleteOrders({ orderIds: deleteOrdersList })
    // console.log("grid", deleteDOs)
  }


  //-------- Filter -------
  const isExternalFilterPresent = () => {
    // return searchText !== '';
    return true;
  };

  const doesExternalFilterPass = (node) => {
    const { transportationTypeCode } = node.data

    // const chkEXCOD = filterEXCOD == "ALL" ? true : filterEXCOD == transportationTypeCode ? true : false;
    const chkSenderID = (new RegExp(`${filterSenderID_orderID.current}`, 'ig')).test(node.data.senderInput)
    const chkDoNo = (new RegExp(`${filterSenderID_orderID.current}`, 'ig')).test(node.data.receiptNo)

    if (chkSenderID || chkDoNo) return true
    else return false;
  };

  // useEffect(() => {
  //   console.log("filterSenderID_orderID", filterSenderID_orderID)
  //   // console.log('search2', searchText);
  //   gridApi && gridApi.onFilterChanged();
  //   // gridApi && console.log("getDisplayedRowCount", gridApi.getDisplayedRowCount())
  // }, [filterSenderID_orderID]);
  //-------- Filter -------

  return (
    <DIVFLEX>
      <DivButtonBar>
        <div>
          <Search
            placeholder="ค้นหาด้วยรหัสลูกค้า/เลขใบเสร็จ"
            allowClear
            onSearch={(val) => {
              filterSenderID_orderID.current = val
              gridApi && gridApi.onFilterChanged();
            }}
            onChange={(v) => {
              if (v.target.value == '') {
                filterSenderID_orderID.current = ''
                gridApi && gridApi.onFilterChanged();
              }
            }}
            style={{ width: 250, marginRight: 10 }}
          />
        </div>
        <div>
          <Button
            danger
            type="primary"
            size="middle"
            style={{ marginRight: 10 }}
            icon={<FileDoneOutlined />}
            // disabled={true}
            onClick={() => {
              delSelectedOrder()
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
      <Tab3Table
        rowData={rowData}
        headerColumns={headerColumns}
        // searchText={searchText}
        onModelUpdated={onModelUpdated}
        gridApi={gridApi}
        setGridApi={setGridApi}
        // gridColumnApi={gridColumnApi}
        // setGridColumnApi={setGridColumnApi}
        setColumnDefs={setColumnDefs}
        cName={cName}
        doesExternalFilterPass={doesExternalFilterPass}
        isExternalFilterPresent={isExternalFilterPresent}
        // onSelectionChanged={onSelectionChanged}
        setGridColumnApi={setGridColumnApi}
      />
    </DIVFLEX>
  );
};

export default Tab4;

const DivButtonBar = styled.div`
  margin: 10px;
  //   background-color: white;
  //   height: calc(100vh - 130px);
  display: flex;
  flex-direction: row;

  //   color: blue;
  // flex: 1;
    // border: 2px solid blue;
  //   margin-top: -16px;
`;
