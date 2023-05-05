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

import TabTable from './TabTable';

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

import { 
  useImportRecipientMutation, 
  // useImportCustomerMutation
 } from '../../../app/api/orderItemsApi';
import allAction from '../../../app/actions/index';

const upload_dom_id = 'upload-received-file1';

const start_header_row = 0;

const setColumnDefs = (cName, columnDefs, headerColumns) => {
  columnDefs = headerColumns.map((headerName, idx) => {
    return {
      field: `${cName(idx + 1)}`,
      headerName: `${cName(idx + 1)})${headerName}`,
      filter: 'agTextColumnFilter',
      width: 180,
      sortable: true,
      cellStyle: dynamicCellStyle,
      pinned: false
    };
  });

  if (columnDefs.length > 5) {
    columnDefs[0].width = 50;
    columnDefs[1].width = 170;
    columnDefs[2].width = 150;
    columnDefs[3].width = 150;
    columnDefs[4].width = 120;
    columnDefs[0].pinned = true;
  }
  return columnDefs;
};

const Tab1 = (props) => {
  const { DIVFLEX, cName } = props;

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);


  const [isUploadDone, setIsUploadDone] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [headerColumns, setHeaderColumns] = useState([]);
  const columnDefs = useRef([]);
  const [rowData, setRowData] = useState([]);
  const [rowDataArray, setRowDataArray] = useState([]);


  const { value, importRecipientSuccess, importDOSuccess } = useSelector(
    (state) => state.orderItemImportReducer
  );
  const [checkedErrorList, setCheckedErrorList] = useState([]);
  const [checkedErrorRows, setCheckedErrorRows] = useState([]);
  const [showErrorList, setShowErrorList] = useState(false)
  const [hardError, setHardError] = useState(false)

  const dispatch = useDispatch();

  const [importRecipient, {
    isLoading,
    isSuccess,
    isError,
    error,
  }] = useImportRecipientMutation()

  // *** For migration Only ***
  // const [importCustomer, {
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // }] = useImportCustomerMutation()

  const [showCount, setShowCount] = useState("0/0")

  const history = useHistory();

  const { t } = useTranslation();
  useEffect(() => {
    console.log('Render Tab1');
  }, []);

  const onModelUpdated = () => {
    var filteredCount = 0
    var rowDataCount = 0;
    if (gridApi) {
      filteredCount = gridApi.getDisplayedRowCount()
      rowDataCount = rowData ? rowData.length : "0"
    }
    setShowCount(`${filteredCount}/${rowDataCount}`)
  }

  /** Clear upload form */
  useEffect(() => {
    if (isUploadDone) setIsUploadDone(false);
  }, [isUploadDone]);

  const clearUpload = () => {
    setIsUploadDone(true);
    setCheckedErrorList([])
    setCheckedErrorRows([])
    setShowErrorList(false)
    setHardError(false)
    dispatch(allAction.orderItemImportAction.setImportRecipientSuccess(false))

  };
  /** Clear upload form */

  useEffect(() => {
    //ถ้า Load ใหม่เสร็จแล้ว
    if (!isLoading && rowData.length > 0) {
      if (isError) {
        try {
          var errList_res = JSON.parse(error.data.message)

          if (errList_res.length > 0) {

            // แปลง obj to array
            var checkedErrorList_arr = []
            var checkedErrorRows_arr = []
            errList_res.map((errListItem) => {
              Object.keys(errListItem).map(function (key, index) {
                checkedErrorList_arr.push({
                  row: key,
                  error_msg: errListItem[key]
                })

                // เก็บเฉพาะ row id
                checkedErrorRows_arr.push(parseInt(key))
              });
            })

            setCheckedErrorList(checkedErrorList_arr)
            setCheckedErrorRows(checkedErrorRows_arr)
            setShowErrorList(true)
          }
        } catch (e) {
          message.error("พบความผิดพลาดที่ระบุไม่ได้")
          console.log("error", error?.data?.message)
          setHardError(true)
          // alert(error.data.message)
        }
      } else {
        setCheckedErrorList([])
        setCheckedErrorRows([])
        setShowErrorList(false)
        dispatch(allAction.orderItemImportAction.setImportRecipientSuccess(true))
        message.success("Import ข้อมูลผู้รับสำเร็จ")
      }
    }
  }, [isLoading])

  useEffect(() => {
    if (checkedErrorRows.length > 0) {
      console.log("checkedErrorRows1", checkedErrorRows)

      const newRowData = rowData.map((row) => {
        console.log("checkedErrorRows2", row)
        if (checkedErrorRows.indexOf(row.A) > -1) {
          console.log("isError")
          row["isError"] = true;
        }
        return row
      })

      // console.log("newRowData",newRowData)
      gridApi.setRowData(newRowData);
    }
  }, [checkedErrorRows])



  /** Selected file */
  const handleFileChoosen = (file) => {
    console.log('#handleFileChoosen files', file);
    onSubmitUpload(file);
  };

  /** Submit selected excel for upload */
  const onSubmitUpload = async (fileUpload) => {
    dispatch(allAction.orderItemImportAction.setImportRecipientSuccess(false))
    gridApi && gridApi.showLoadingOverlay();
    var rowDataTmp = [];
    var rowDataArrayTmp = []; // for Post
    if (fileUpload) {
      readXlsxFile(fileUpload, { getSheets: true }).then((sheets) => {
        var sheetNo = 0;
        for (const sheet of sheets) {
          sheetNo++;
          if (sheetNo > 1) continue;
          // console.log('#onSubmitUpload sheets', sheets);
          // if(sheet.name=='Customer'){
          readXlsxFile(fileUpload, { sheet: sheet.name }).then((rows) => {
            // console.log('#onSubmitUpload rows', rows);
            let i = 0;
            for (const row of rows) {
              if (i == start_header_row) setHeaderColumns(row);
              if (i > start_header_row) {
                let rowObj = {};
                let rowArray = []; // for Post
                rows[0].forEach((col, idx) => {
                  rowObj[`${cName(idx + 1)}`] = row[idx];
                  console.log("row[idx]", row[idx]);
                  rowArray.push(row[idx]) // for Post
                });
                rowDataTmp.push(rowObj);
                console.log("rowArray", rowArray);
                rowDataArrayTmp.push(rowArray); // for Post
              }
              i++;
            }
            setRowData(rowDataTmp);
            console.log("rowDataArrayTmp", rowDataArrayTmp);
            setRowDataArray(rowDataArrayTmp); // for Post
          });

          // }
        }
        //dispatch(['parameter_tuning_uploaded', _.cloneDeep(true)]);
        clearUpload();
      });
    }
  };

  //=====onSearch

  const onSearch = (value) => {
    console.log('search1', value);
    setSearchText(value);
  };
  //=====onSearch

  const normalSenderMigrate = (rowDataArray) => {

    console.log("normalSenderMigrate", rowDataArray)

    var preparedColumn = []

    rowDataArray.map((row, idx) => {
      var subdistrict = row[22] ? row[22].trim() : ''
      var district = row[23] ? row[23].trim() : ''
      var province = row[24] ? row[24].trim() : ''

      var input = row[10] ? row[10].trim() : ''
      var discount_rate = row[8] ? row[8] : 0

      var taxpayer_number = row[9] ? row[9].trim() : ''

      var bank_name = row[11] ? row[11].trim() : ''
      var bank_account_name = row[13] ? row[13].trim() : ''
      var bank_account_number = row[14] ? row[14].trim() : ''


      input = input.replace(/-/, '')
      input = input.replace(/\s/, '')
      input = input.replace(/\+66/, '0')

      bank_name = bank_name.replace(/ จำกัด (มหาชน)/, '')
      bank_name = bank_name.replace(/\s/, '')
      bank_name = bank_name.replace(/ธนาคาร/, '')
      bank_name = bank_name.replace(/ธ./, '')
      bank_name = bank_name.replace(/กสิกรไทย/, 'กสิกร')

      if (!bank_name || !bank_account_name || !bank_account_number) {
        bank_name = null
        bank_account_name = null
        bank_account_number = null
      }

      if (isNaN(input) || input.length < 9 || input.length > 10) {
        console.log("Invalid", idx + 1, " : เบอร์โทรผิด ", input)
        return false
      } else {
        // document.write(str1 + " is a number <br/>");
      }

      if (isNaN(discount_rate)) {
        discount_rate = 0;
      }

      if (subdistrict == "(ไม่ระบุ)") {
        console.log("Invalid", idx + 1, " : ไม่ระบุ ตำบล")
        return false
      }

      if (district == "เมือง") district = `${district}${province}`

      preparedColumn.push([idx + 1, input, row[2], '', row[17], row[18], row[19], row[21],
      row[20], row[22], district, row[24], row[25], taxpayer_number, discount_rate, bank_name, bank_account_name, bank_account_number])
    })

    console.log("normalSenderMigrate-preparedColumn", preparedColumn)

    importCustomer({ "customer": preparedColumn })

  }

  const normalReceipientMigrate = (rowDataArray) => {

    console.log("normalReceipientMigrate", rowDataArray)

    var preparedColumn = []

    rowDataArray.map((row, idx) => {
      var subdistrict = row[14] ? row[14].trim() : ''
      var district = row[15] ? row[15].trim() : ''
      var province = row[16] ? row[16].trim() : ''

      var firstname = row[2] ? row[2].trim() : ''

      var input = row[1] ? row[1].trim() : ''
      var discount_rate = 0

      var taxpayer_number = null

      var bank_name = null
      var bank_account_name = null
      var bank_account_number = null


      input = input.replace(/-/, '')
      input = input.replace(/\s/, '')
      input = input.replace(/\+66/, '0')



      if (isNaN(input) || input.length < 9 || input.length > 10) {
        console.log("Invalid", idx + 1, " : เบอร์โทรผิด ", input)
        return false
      } else {
        // document.write(str1 + " is a number <br/>");
      }

      if (isNaN(discount_rate)) {
        discount_rate = 0;
      }

      if (subdistrict == "(ไม่ระบุ)") {
        console.log("Invalid", idx + 1, " : ไม่ระบุ ตำบล")
        return false
      }

      subdistrict = subdistrict.replace(/^แขวง/, '')
      subdistrict = subdistrict.replace(/^ตำบล/, '')

      if (district == "เมือง") district = `${district}${province}`

      district = district.replace(/^เขต/, '')
      district = district.replace(/^อำเภอ/, '')


      preparedColumn.push([idx + 1, input, firstname, '', row[9], row[10], row[11], row[13], row[12],
        subdistrict, district, province, row[17], taxpayer_number, discount_rate, bank_name, bank_account_name, bank_account_number])
    })

    console.log("normalReceipientMigrate-preparedColumn", preparedColumn)

    importCustomer({ "customer": preparedColumn })

  }

  return (
    <DIVFLEX>
      <DivButtonBar>
        <Button
          type="primary"
          size="middle"
          style={{ marginRight: 10, }}
          icon={<FileAddOutlined />}
          onClick={() => {
            //setFilterPrice(50000);
            document.getElementById(upload_dom_id).click();
          }}
        >
          อัพโหลดไฟล์
        </Button>
        {checkedErrorList.length == 0 ?
          <Button
            type="primary"
            size="middle"
            style={{ marginRight: 10 }}
            icon={<FileDoneOutlined />}
            disabled={hardError || isLoading || rowData.length < 1 || importRecipientSuccess}
            onClick={() => {
              // setImportRecipientSuccess(true);
              console.log("ตรวจสอบและนำเข้าข้อมูล", rowDataArray)
              // prepareDataToImport(rowDataArray)
              importRecipient({ "recipient": rowDataArray })

            }}
          >
            ตรวจสอบและนำเข้าข้อมูล
          </Button> :
          <Button
            danger
            type="primary"
            size="middle"
            disabled={hardError || isLoading || rowData.length < 1 || importRecipientSuccess}
            style={{ marginRight: 10 }}
            icon={<FileDoneOutlined />}
            onClick={() => {
              setShowErrorList(true)
            }}
          >
            พบรายการผิดพลาด
          </Button>
        }
        <Search
          placeholder="ค้นหาทุกคอลัมน์"
          allowClear
          onSearch={onSearch}
          onChange={(v) => {
            if (v.target.value == "")
              onSearch("")
          }}
          style={{ width: 200, marginLeft: 20 }}
        />
        {/* &nbsp;
        <Button
          type="primary"
          size="middle"
          style={{ marginRight: 10 }}
          icon={<FileDoneOutlined />}
          // disabled={hardError || isLoading || rowData.length < 1 || importRecipientSuccess}
          onClick={() => {
            // setImportRecipientSuccess(true);
            // console.log("ตรวจสอบและนำเข้าข้อมูล", rowDataArray)
            // prepareDataToImport(rowDataArray)
            normalSenderMigrate(rowDataArray)
            // importRecipient({ "recipient": rowDataArray })

          }}
        >
          ผู้ส่งปกติ
        </Button>
        <Button
          type="primary"
          size="middle"
          style={{ marginRight: 10 }}
          icon={<FileDoneOutlined />}
          // disabled={hardError || isLoading || rowData.length < 1 || importRecipientSuccess}
          onClick={() => {
            // setImportRecipientSuccess(true);
            // console.log("ตรวจสอบและนำเข้าข้อมูล", rowDataArray)
            // prepareDataToImport(rowDataArray)
            normalReceipientMigrate(rowDataArray)
            // importRecipient({ "recipient": rowDataArray })

          }}
        >
          ผู้รับ
        </Button> */}
        {!isUploadDone && (
          <input
            type="file"
            id={upload_dom_id}
            className={upload_dom_id}
            multiple={false}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChoosen(e.target.files[0])}
          />
        )}
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
      <TabTable
        rowData={rowData}
        headerColumns={headerColumns}
        searchText={searchText}
        gridApi={gridApi}
        setGridApi={setGridApi}
        gridColumnApi={gridColumnApi}
        setGridColumnApi={setGridColumnApi}
        setColumnDefs={setColumnDefs}
        cName={cName}
        checkedErrorList={checkedErrorList}
        showErrorList={showErrorList}
        setShowErrorList={setShowErrorList}
        gridLoading={isLoading}
        onModelUpdated={onModelUpdated}
      />

    </DIVFLEX>
  );
};

export default Tab1;

const DivButtonBar = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: row;
  //   background-color: white;
  //   height: calc(100vh - 130px);
    display: flex;
  flex-direction: row;

  //   color: blue;
  //   flex: 1;
  //   border: 2px solid blue;
  //   margin-top: -16px;
`;


const dynamicCellStyle = (params) => {
  // console.log("params",params);
  // if (typeof params.data.id == 'string') return { color: 'blue' };
  // console.log("params.data",params.data.A)

  if (params.column.colId == 'A') {
    if (params.data?.isError == true) return { backgroundColor: 'yellow' };
    else return { backgroundColor: null };
  }

  return null;
  // return null;
};