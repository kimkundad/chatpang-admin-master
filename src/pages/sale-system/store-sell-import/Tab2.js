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

import TabTable from './TabTable';

import { } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useImportOrderItemsMutation } from '../../../app/api/orderItemsApi';
import allAction from '../../../app/actions/index';

import { useSelector, useDispatch } from 'react-redux';
import readXlsxFile from 'read-excel-file';
const upload_dom_id = 'upload-received-file2';

const start_header_row = 0;

const setColumnDefs = (cName, columnDefs, headerColumns) => {
  var columnDefs = headerColumns.map((headerName, idx) => {
    return {
      field: `${cName(idx + 1)}`,
      headerName: `${cName(idx + 1)})${headerName}`,
      filter: 'agTextColumnFilter',
      width: 200,
      sortable: true,
      cellStyle: dynamicCellStyle,
    };
  });

  if (columnDefs.length > 5) {
    columnDefs[0].pinned = true;
    columnDefs[0].width = 65;
    columnDefs[1].width = 150;
    columnDefs[2].width = 100;
    columnDefs[3].width = 180;
    
    // columnDefs[4].width = 70;
  }
  return columnDefs;
};

const Tab2 = (props) => {
  const { DIVFLEX, cName } = props;
  // const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { isCustomer, userId, agencyId } = useSelector(
    (state) => state.authenReducer
  );
  // const { draftData } = useSelector((state) => state.storeSellReducer);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [filterPrice, setFilterPrice] = useState(0);
  const [isUploadDone, setIsUploadDone] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [headerColumns, setHeaderColumns] = useState([]);
  // const columnDefs = useRef([]);
  const [rowData, setRowData] = useState([]);
  const [rowDataArray, setRowDataArray] = useState([]);

  const { value, importRecipientSuccess, importDOSuccess } = useSelector(
    (state) => state.orderItemImportReducer
  );
  const [checkedErrorList, setCheckedErrorList] = useState([]);
  const [checkedErrorRows, setCheckedErrorRows] = useState([]);
  const [showErrorList, setShowErrorList] = useState(false)
  const [hardError, setHardError] = useState(false)
  const [resultRows, setResultRows] = useState([])

  const [showCount, setShowCount] = useState("0/0")

  const dispatch = useDispatch();

  const history = useHistory();

  const { t } = useTranslation();

  const [
    importOrderItems,
    {
      // isFetching,
      isLoading,
      // isSuccess,
      isError,
      error,
    },
  ] = useImportOrderItemsMutation();

  useEffect(() => {
    console.log('Render Tab2');
  }, []);

  useEffect(() => {
    if (isError) {
      try {
        console.log("error", JSON.parse(error.data.message))
        console.log("error.status", error.status)
      } catch (error) {
      }
    }
  }, [error])

  useEffect(() => {
    if (gridApi) gridApi.onFilterChanged();
  }, [filterPrice]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    // const updateData = (data) => {
    //   document.querySelector('#everyone').checked = true;
    //   setRowData(data);
    // };

    // fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    //   .then((resp) => resp.json())
    //   .then((data) => updateData(data));
  };

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
    dispatch(allAction.orderItemImportAction.setImportDOSuccess(false))
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
        dispatch(allAction.orderItemImportAction.setImportDOSuccess(true))
        message.success("Import รายการพัสดุสำเร็จ")
      }
    }
  }, [isLoading])

  useEffect(() => {
    if (resultRows.length > 0) updateDoNo()
  }, [resultRows])

  const updateDoNo = () => {
    console.log("resultRows", resultRows)
    const newRowData = rowData.map((row, idx) => {
      // console.log("checkedErrorRows2",row)
      if (row.D == null) {
        row.D = resultRows[idx].doNo
        // console.log("isError")
        row["isGenDoNo"] = true;
      }
      return row
    })

    gridApi.setRowData(newRowData);
  }

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
    dispatch(allAction.orderItemImportAction.setImportDOSuccess(false));
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
                  rowArray.push(row[idx]) // for Post
                });
                rowDataTmp.push(rowObj);
                rowDataArrayTmp.push(rowArray); // for Post
              }
              i++;
            }
            // console.log('setRowData', rowDataTmp);
            setRowData(rowDataTmp);
            setRowDataArray(rowDataArrayTmp); // for Post
          });

          // }
        }
        //dispatch(['parameter_tuning_uploaded', _.cloneDeep(true)]);
        clearUpload();
      });
    }
  };

  // useEffect(() => {
  //   if (gridApi) {
  //     columnDefs.current = setColumnDefs(columnDefs.current, headerColumns);
  //     gridApi.setColumnDefs(columnDefs.current);
  //   }
  // }, [headerColumns, rowData]);

  useEffect(() => {
    if (gridApi && rowData?.length > 0) {
      gridApi.setRowData(rowData);
      gridApi.setEnableCellTextSelection(true);
      gridApi.setAlwaysShowHorizontalScroll(true);
      gridApi.setAlwaysShowVerticalScroll(true);

      // gridApi.redrawRows();
      // gridApi.autoSizeAllColumns();

      // const allColumnIds = [];
      // gridColumnApi && gridColumnApi.getAllColumns().forEach((column) => {
      //   allColumnIds.push(column.colId);
      // });
      // gridColumnApi && gridColumnApi.autoSizeColumns(allColumnIds);

      gridApi.hideOverlay();
      gridApi.ensureIndexVisible(400);
    }
  }, [rowData]);

  //=====onSearch

  const onSearch = (value) => {
    console.log('search1', value);
    setSearchText(value);
  };
  //=====onSearch

  return (
    <DIVFLEX>
      <DivButtonBar>
        <Button
          type="primary"
          size="middle"
          style={{ marginRight: 10 }}
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
            disabled={hardError || isLoading || rowData.length < 1 || importDOSuccess}
            onClick={() => {
              // setImportRecipientSuccess(true);
              console.log("ตรวจสอบและนำเข้าข้อมูล", rowDataArray)
              importOrderItems({ data: rowDataArray }).then((res) => {
                if (res?.data?.success == true) {
                  setResultRows(res.data.data)
                }
                console.log("res", res)
              });
              // dispatch(allAction.orderItemImportAction.setImportRecipientSuccess(true))

            }}
          >
            ตรวจสอบและนำเข้าข้อมูล
          </Button> :
          <Button
            danger
            type="primary"
            size="middle"
            disabled={hardError || isLoading || rowData.length < 1 || importDOSuccess}
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
            if (v.target.value == '') onSearch('');
          }}
          style={{ width: 200, marginLeft: 20 }}
        />
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

export default Tab2;

const DivButtonBar = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: row;
  //   background-color: white;
  //   height: calc(100vh - 130px);
  //   display: flex;
  //   flex-direction: column;

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

  if (params.column.colId == 'D') {
    if (params.data?.isGenDoNo == true) return { color: 'blue' };
    else return { color: null };
  }



  return null;
  // return null;
};