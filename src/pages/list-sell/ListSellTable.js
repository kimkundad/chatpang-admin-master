/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Input, Form, Button, Radio, Checkbox, Select, message } from 'antd';

const { Search } = Input;
const { Option } = Select;

// import TabTableTest3 from './TabTableTest3';
import ListSellGrid from './ListSellGrid';

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

const ListSellTable = (props) => {
    const {
        // DIVFLEX,
        // setImportReceiverSuccess,
        // cName,
        // createOrder,
        // isCreateOrder,
        ActionComponent,
        orderItemStoreData,
        FilterPermission,
        FilterUserLevel,
        showConfirmOrderByPass,

    } = props;

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const [isUploadDone, setIsUploadDone] = useState(false);
    // const [searchText, setSearchText] = useState('');

    const [headerColumns, setHeaderColumns] = useState([
        "orderItemStatusCode",
        "orderId",
        "receiptNo",
        "doNo",
        "senderInput",
        "recipientInput",
        "transportationTypeCode"]);

    const columnDefs = useRef([]);
    const [rowData, setRowData] = useState([]);

    const [filterEXCOD, selectEXCOD] = useState("ALL")
    const [filterDoNo, searchDoNo] = useState("")
    const [filterSenderID_doNo, searchSenderID_doNo] = useState("")

    const [chkAllCREWFS, setAllCREWFS] = useState(false)

    const { senderInput, orderId: orderId_Editing, receiptNo } = useSelector(
        (state) => state.orderItemImportReducer
    );

    const [showCount, setShowCount] = useState("0/0")

    const dispatch = useDispatch();

    const history = useHistory();

    //----------- RTK QUERY ---------------
    const [filterState, setFilterState] = useState("IMP")

    //   const {
    //     data: OrderItems,
    //     isFetching,
    //     isLoading,
    //     isSuccess, /* */
    //     isError,
    //     error,
    //     refetch,
    //   } = useGetOrderItemsImportQuery(filterState);

    //   const [deleteOrderItems] = useDeleteOrderItemsMutation();

    // ถ้า fetch ไม่ได้ให้เคลีย table ไปเลย
    // useEffect(() => {
    //   if (!isFetching && !isLoading) {
    //     if (isError) setRowData([])
    //   }
    // }, [isFetching, isLoading])

    // const [removeDOfromOrder] = useRemoveDOfromOrderMutation();
    // const [addOrderItems] = useAddOrderItemsMutation();
    // const [bypassOrderItems] = useBypassOrderItemsMutation();


    //-------------------------------------

    const { t } = useTranslation();

    useEffect(() => {
        console.log("orderItemStoreData", orderItemStoreData)
        setRowData(orderItemStoreData);
    }, [orderItemStoreData])

    const onModelUpdated = () => {
        var filteredCount = 0
        var rowDataCount = 0;
        if (gridApi) {
            filteredCount = gridApi.getDisplayedRowCount()
            rowDataCount = rowData ? rowData.length : "0"
        }
        setShowCount(`${filteredCount}/${rowDataCount}`)
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


    //-------- Filter -------
    useEffect(() => {
        // console.log('search2', searchText);
        gridApi && gridApi.onFilterChanged();
    }, [filterEXCOD, filterSenderID_doNo]);

    const isExternalFilterPresent = () => {
        // return searchText !== '';
        return true;
    };

    const doesExternalFilterPass = (node) => {
        const { transportationTypeCode } = node.data

        const chkEXCOD = filterEXCOD == "ALL" ? true : filterEXCOD == transportationTypeCode ? true : false;
        const chkSenderID = (new RegExp(`${filterSenderID_doNo}`, 'ig')).test(node.data.senderInput)
        const chkDoNo = (new RegExp(`${filterSenderID_doNo}`, 'ig')).test(node.data.doNo)

        if (chkEXCOD && (chkSenderID || chkDoNo)) return true;
        else return false;
    };
    //-------- Filter -------

    const onSelectionChanged = (select) => {
        const rows = gridApi.getSelectedNodes();
        if (rows.length > 0) {
            const chkAllCREWFS = rows.every((element, idx) => {
                // console.log("rows[0]", rows[0])
                // console.log("element", element)
                // console.log("idx", idx)
                if (element.data.orderItemStatusCode == "CRE"
                    || element.data.orderItemStatusCode == "WFS") return true
                else return false

            });

            if (chkAllCREWFS)
                setAllCREWFS(true)
            else
                setAllCREWFS(false)
            // console.log("sameSenderTmp", sameSenderTmp)
        } else {
            setAllCREWFS(false)
        }
    }

    const onBypassOrderItems = () => {
        var bypassDOs = gridApi.getSelectedNodes().map((row) => {
            return row?.data?.orderItemId
        })

        showConfirmOrderByPass(bypassDOs)

        // console.log("bypassDOs",bypassDOs)
        // bypassOrderItems({ remark : "aaa" , orderItems: bypassDOs })


    }

    return (
        <DIVFLEX>
            <DivButtonBar>
                {/* <Radio.Group value={filterState} buttonStyle="solid" style={{ marginRight: 10 }}
          onChange={async (e) => {
            gridApi && gridApi.setRowData([]);
            setFilterState(e.target.value)
            dispatch(
              orderItemsApi.util.invalidateTags([{ type: 'OrderItems', id: e.target.value }])
            )
          }}
        >
          <Radio.Button value="IMP">Import</Radio.Button>
          <Radio.Button value="DRF">Draft</Radio.Button>
        </Radio.Group> */}


                <Select defaultValue="ALL" style={{ width: 120 }} onChange={selectEXCOD}>
                    <Option value="ALL">EX , COD</Option>
                    <Option value="EX">EX</Option>
                    <Option value="COD">COD</Option>
                </Select>
                {/* <div>
          <Search
            placeholder="ค้นหาด้วยรหัสลูกค้า/เลขพัสดุ"
            allowClear
            onSearch={searchSenderID_doNo}
            onChange={(v) => {
              if (v.target.value == '') searchSenderID_doNo('');
            }}
            style={{ width: 250, marginLeft: 20 }}
          />
        </div> */}
                <div>
                    {FilterPermission('isUpdate') &&
                        !FilterUserLevel(['AGN']) &&

                        <Button
                            // size="small"
                            type="primary"
                            style={{
                                marginLeft: 20,
                                fontSize: 'small'
                            }}
                            disabled={!chkAllCREWFS}
                            onClick={() => {
                                onBypassOrderItems();
                                // showConfirmOrderByPass(params.data?.orderItemId);
                            }}
                        >
                            {t('bypass')}
                        </Button>
                    }

                    {/* <Button
                        danger
                        type="primary"
                        size="middle"
                        style={{ marginLeft: 20, marginRight: 10 }}
                        icon={<FileDoneOutlined />}
                        // disabled={true}
                        onClick={() => {
                            delSelectedDO()
                        }}
                    >
                        ลบ
                    </Button> */}

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
            <ListSellGrid
                rowData={rowData}
                headerColumns={headerColumns}
                // searchText={searchText}
                gridApi={gridApi}
                setGridApi={setGridApi}
                // gridColumnApi={gridColumnApi}
                // setGridColumnApi={setGridColumnApi}
                // setColumnDefs={setColumnDefs}
                // cName={cName}
                doesExternalFilterPass={doesExternalFilterPass}
                isExternalFilterPresent={isExternalFilterPresent}
                onSelectionChanged={onSelectionChanged}
                onModelUpdated={onModelUpdated}
                ActionComponent={ActionComponent}
            />
        </DIVFLEX>
    );
};

export default ListSellTable;

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
  height: 100%;
  display: flex;
  flex-direction: column;

  //   color: blue;
  //   flex: 1;
  //   border: 2px solid blue;
//   margin-top: -16px;
`;
