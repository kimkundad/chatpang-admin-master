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
} from 'antd';

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

import {} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import readXlsxFile from 'read-excel-file';

const TabTableTest3 = (props) => {
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
  } = props;

  //   const [gridApi, setGridApi] = useState(null);
  //   const [searchText, setSearchText] = useState('');

    // const [headerColumns, setHeaderColumns] = useState(testHeaderCol);
  const columnDefs = useRef([]);
  //   const [rowData, setRowData] = useState([]);

  const { t } = useTranslation();

  const onGridReady = (params) => {
    console.log("onGridReady2")
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    if (gridApi) {
    //   columnDefs.current = setColumnDefs(
    //     cName,
    //     columnDefs.current,
    //     headerColumns
    //   );
    //   console.log("headerColumns",headerColumns)
      gridApi.setColumnDefs(testColDefs);
      gridApi.setRowData(testRow);
      
    }
  }, [gridApi]);

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

//   useEffect(() => {
//     console.log('search2', searchText);
//     gridApi && gridApi.onFilterChanged();
//   }, [searchText]);

  //=====onSearch

  return (
    <div className="ag-theme-balham" style={{ flex: 1 }}>
      <AgGridReact
        rowData={[]}
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
        isExternalFilterPresent={()=> false}
        doesExternalFilterPass={doesExternalFilterPass}
        onGridReady={onGridReady}

        suppressRowClickSelection={true}
        rowSelection={'multiple'}
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
    </div>
  );
};

export default TabTableTest3;

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


const testRow = [
  {
      "A": 1,
      "B": "RTT",
      "C": "TEST",
      "D": "0953716123",
      "E": null,
      "F": "60",
      "G": "AAAA000001",
      "H": null,
      "I": null,
      "J": null,
      "K": null,
      "L": null,
      "M": 1,
      "N": null,
      "O": null,
      "P": null,
      "Q": null,
      "R": "0818246091",
      "S": null,
      "T": null,
      "U": null,
      "V": null,
      "W": null,
      "X": null,
      "Y": null,
      "Z": null,
      "AA": null,
      "AB": null,
      "AC": null,
      "AD": null,
      "AE": null,
      "AF": null,
      "AG": null,
      "AH": null,
      "AI": null,
      "AJ": 2,
      "AK": 60,
      "AL": 10,
      "AM": 500,
      "AN": "ทดสอบ1",
      "AO": null,
      "AP": null,
      "AQ": null,
      "AR": null,
      "AS": null,
      "AT": null,
      "AU": null,
      "AV": null,
      "AW": null,
      "AX": null,
      "AY": null,
      "AZ": null
  },
  {
      "A": 2,
      "B": "RTT",
      "C": "TEST",
      "D": "0953716123",
      "E": null,
      "F": "50",
      "G": "AAAA000002",
      "H": null,
      "I": null,
      "J": null,
      "K": null,
      "L": null,
      "M": 1,
      "N": null,
      "O": null,
      "P": null,
      "Q": null,
      "R": "0818246091",
      "S": null,
      "T": null,
      "U": null,
      "V": null,
      "W": null,
      "X": null,
      "Y": null,
      "Z": null,
      "AA": null,
      "AB": null,
      "AC": null,
      "AD": null,
      "AE": null,
      "AF": null,
      "AG": null,
      "AH": null,
      "AI": null,
      "AJ": 5,
      "AK": 221,
      "AL": null,
      "AM": null,
      "AN": "ทดสอบ2",
      "AO": null,
      "AP": null,
      "AQ": null,
      "AR": null,
      "AS": null,
      "AT": null,
      "AU": null,
      "AV": null,
      "AW": null,
      "AX": null,
      "AY": null,
      "AZ": null
  },
  {
      "A": 3,
      "B": "RTT",
      "C": "TEST",
      "D": "0953716123",
      "E": null,
      "F": "60",
      "G": "AAAA000003",
      "H": null,
      "I": null,
      "J": null,
      "K": null,
      "L": null,
      "M": 1,
      "N": null,
      "O": null,
      "P": null,
      "Q": null,
      "R": "0818246091",
      "S": null,
      "T": null,
      "U": null,
      "V": null,
      "W": null,
      "X": null,
      "Y": null,
      "Z": null,
      "AA": null,
      "AB": null,
      "AC": null,
      "AD": null,
      "AE": null,
      "AF": null,
      "AG": null,
      "AH": null,
      "AI": null,
      "AJ": 2.25,
      "AK": 10,
      "AL": 10,
      "AM": 500,
      "AN": "ทดสอบ3",
      "AO": null,
      "AP": null,
      "AQ": null,
      "AR": null,
      "AS": null,
      "AT": null,
      "AU": null,
      "AV": null,
      "AW": null,
      "AX": null,
      "AY": null,
      "AZ": null
  },
  {
      "A": 4,
      "B": "RTT",
      "C": "TEST",
      "D": "0953716123",
      "E": null,
      "F": "50",
      "G": "AAAA000004",
      "H": null,
      "I": null,
      "J": null,
      "K": null,
      "L": null,
      "M": 1,
      "N": null,
      "O": null,
      "P": null,
      "Q": null,
      "R": "0818246091",
      "S": null,
      "T": null,
      "U": null,
      "V": null,
      "W": null,
      "X": null,
      "Y": null,
      "Z": null,
      "AA": null,
      "AB": null,
      "AC": null,
      "AD": null,
      "AE": null,
      "AF": null,
      "AG": null,
      "AH": null,
      "AI": null,
      "AJ": 1,
      "AK": 10,
      "AL": null,
      "AM": null,
      "AN": "ทดสอบ4",
      "AO": null,
      "AP": null,
      "AQ": null,
      "AR": null,
      "AS": null,
      "AT": null,
      "AU": null,
      "AV": null,
      "AW": null,
      "AX": null,
      "AY": null,
      "AZ": null
  }
]

const testColDefs = [
    {
        "field": "A",
        "headerName": "A)No",
        "filter": "agTextColumnFilter",
        "width": 65,
        "headerCheckboxSelection" : true,
        "checkboxSelection" : true
        // "headerCheckboxSelectionFilteredOnly" : true
    },
    {
        "field": "B",
        "headerName": "B)invcocode",
        "filter": "agTextColumnFilter",
        "width": 150
    },
    {
        "field": "C",
        "headerName": "C)invbucode",
        "filter": "agTextColumnFilter",
        "width": 150
    },
    {
        "field": "D",
        "headerName": "D)cucode",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "E",
        "headerName": "E)cudesc",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "F",
        "headerName": "F)dtcode",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "G",
        "headerName": "G)invno",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "H",
        "headerName": "H)invcal",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "I",
        "headerName": "I)trcode",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "J",
        "headerName": "J)invsono",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "K",
        "headerName": "K)invpono",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "L",
        "headerName": "L)invotno",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "M",
        "headerName": "M)invpno",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "N",
        "headerName": "N)invdate",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "O",
        "headerName": "O)invdoc",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "P",
        "headerName": "P)invrcv",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "Q",
        "headerName": "Q)invdue",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "R",
        "headerName": "R)shcode",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "S",
        "headerName": "S)shdesc",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "T",
        "headerName": "T)arcode",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "U",
        "headerName": "U)ardesc",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "V",
        "headerName": "V)shapro",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "W",
        "headerName": "W)shaamp",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "X",
        "headerName": "X)shatum",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "Y",
        "headerName": "Y)invq1",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "Z",
        "headerName": "Z)invq2",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AA",
        "headerName": "AA)invq3",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AB",
        "headerName": "AB)invq4",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AC",
        "headerName": "AC)invq5",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AD",
        "headerName": "AD)invq6",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AE",
        "headerName": "AE)invq7",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AF",
        "headerName": "AF)invq8",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AG",
        "headerName": "AG)invq9",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AH",
        "headerName": "AH)invqty",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AI",
        "headerName": "AI)invq10",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AJ",
        "headerName": "AJ)invqw",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AK",
        "headerName": "AK)invqc",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AL",
        "headerName": "AL)invql",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AM",
        "headerName": "AM)invqo",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AN",
        "headerName": "AN)invrmk",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AO",
        "headerName": "AO)shaddr1",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AP",
        "headerName": "AP)shaddr2",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AQ",
        "headerName": "AQ)shaddr3",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AR",
        "headerName": "AR)shmob",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AS",
        "headerName": "AS)shtel",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AT",
        "headerName": "AT)shfax",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AU",
        "headerName": "AU)shnote1",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AV",
        "headerName": "AV)shnote2",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AW",
        "headerName": "AW)shalat",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AX",
        "headerName": "AX)shalng",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AY",
        "headerName": "AY)invrefno",
        "filter": "agTextColumnFilter",
        "width": 200
    },
    {
        "field": "AZ",
        "headerName": "AZ)invref",
        "filter": "agTextColumnFilter",
        "width": 200
    }
]