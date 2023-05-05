/* eslint-disable  */
import React, { useState, useEffect,  useRef } from 'react';
import {
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  Button,
  Tag,
} from 'antd';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';
import MpayIcon from '../../../assets/mPay.png';
import { el } from 'date-fns/locale';

const { Column } = Table;

const ReportBalance = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [agencySearch, setAgencySearch] = useState('');
  const [receiptNoFilter, setReceiptNoFilter] = useState([]);
  const [search, setSearch] = useState('');
  const [listResult, setListResult] = useState([]);

  const exportFunction = useRef(()=>{})

  const { pageCode } = props;

  const { reportBalanceData } = useSelector(
    (state) => state.reportBalanceReducer
  );
  var list = [];
  var listSearch = [];
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel, isCustomer, agencyId, companyId, hubId } =
    useSelector((state) => state.authenReducer);

  const onSearch = (value) => {
    setSearch(value)
    if (value.agencyId !== undefined) {
      if (value.filterName === '') {
        var obj = {
          agencyId: value.agencyId, startDate: value?.createdAt
            ? format(new Date(value?.createdAt[0]), 'yyyy-MM-dd')
            : '', endDate: value?.createdAt
              ? format(new Date(value?.createdAt[1]), 'yyyy-MM-dd')
              : ''
        };

        dispatch(allAction.reportBalanceAction.getCodBalanceList(obj));
        setAgencySearch(value.agencyId)
      }

    } else {
      if (agencyId !== "") {
        var obj = {
          agencyId: agencyId, startDate: value?.createdAt
            ? format(new Date(value?.createdAt[0]), 'yyyy-MM-dd')
            : '', endDate: value?.createdAt
              ? format(new Date(value?.createdAt[1]), 'yyyy-MM-dd')
              : ''
        };

        dispatch(allAction.reportBalanceAction.getCodBalanceList(obj));
        setAgencySearch(agencyId)
      } else {
        setAgencySearch('')
      }
    }

  };

  useEffect(() => {
    if (agencyId !== "") {
      setAgencySearch(agencyId)
      var obj = {
        agencyId: agencyId,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
      };
      dispatch(allAction.reportBalanceAction.getCodBalanceList(obj));
    }
  }, [])


  const exportFile = () => {
    // const fileName = { fileName: `Transport-Service-${format(new Date(), 'dd-MM-yyyy')}.xlsx` }
    // dispatch(allAction.report.exportFile(query));
  };




  // useEffect(() => {
  //   if (search.filterName !== "") {
  //     setListResult([])
  //     for (const element of list) {
  //       if (element.orderId !== null) {
  //         if (element.orderId.toLowerCase().includes(search.filterName.toLowerCase()) ||
  //           element.action.toLowerCase().includes(search.filterName.toLowerCase())) {
  //           listSearch.push(element);
  //           setListResult(listSearch)
  //         }
  //       }
  //     }
  //   } else {
  //     setListResult([])
  //   }
  // }, [search.filterName])


  if (agencySearch === '') {
    list = [];
  } else {
    for (const element of reportBalanceData) {
      var wallet = element.wallet
      var reservePrice = element.reservePrice
      var balance = element.balance

      if (element.description == "เติม Wallet") {
        wallet = `+${wallet}`
      }

      if (element.description == "บันทึกใบเสร็จ") {
        reservePrice = `+${reservePrice}`
        balance = `-${balance}`
      }

      if (element.description == "แก้ไขใบเสร็จ") {
        reservePrice = `-${reservePrice}`
        balance = `+${balance}`
      }

      if (element.description == "ยกเลิก(ลบ)ใบเสร็จ") {
        reservePrice = `-${reservePrice}`
        balance = `+${balance}`
      }

      if (element.description == "ตัดเงิน Wallet") {
        wallet = `-${wallet}`
        reservePrice = `-${reservePrice}`
      }

      if (element.description == "ยกเลิกคืนเงินจอง") {
        reservePrice = `-${reservePrice}`
        balance = `+${balance}`
      }

      if (element.description == "ยกเลิกคืน Wallet") {
        wallet = `+${wallet}`
        balance = `+${balance}`
      }

      var obj = {
        // date: format(new Date(element?.createdAt), 'yyyy-MM-dd hh:mm:ss'),
        createdAt: element?.createdAt,
        action: element.description,
        orderId: element.receiptNo,
        netPrice: element.netPrice,
        afterCommissionPrice: element.afterCommissionPrice,
        wallet: wallet,
        reservePrice: reservePrice,
        balance: balance,
      };
      if (element.description != "ลบใบเสร็จ")
        list.push(obj);
    }
  }

  useEffect(() => {
    var filterData = []
    reportBalanceData.map((row) => {

      if (row?.receiptNo && !filterData.find(x => x.text === row?.receiptNo))
        filterData.push({
          text: row.receiptNo,
          value: row.receiptNo
        })
    })

    setReceiptNoFilter(filterData)
  }, [reportBalanceData])

  var showVal = ""
  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('RBL')}</span>
              </Typography.Title>
            </Col>

            <Col xs={24} md={12}>
              <Row align="middle" style={{ float: 'right' }}>
                <Col flex="auto" style={{ paddingLeft: 10 }}>
                  <Button
                    type="primary"
                    // disabled={true}
                    style={{ width: 120 }}
                    icon={<DownloadOutlined />}
                    onClick={exportFunction.current}
                  >
                    {t('export-file')}
                  </Button>
                </Col>
              </Row>
            </Col>

            <Col sm={24}>
              <FilterData onSearch={onSearch} exportFunction={exportFunction} pageCode={pageCode} />
            </Col>
            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={search.filterName === undefined || search.filterName === '' ? list : listResult}
                // scroll={{ x: 1500 }}
                pagination={{
                  total: search.filterName === undefined || search.filterName === '' ? list.length : listResult.length || 0,
                  showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                    'from',
                  )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              >
                <Column
                  width={100}
                  title={t('date')}
                  key="createdAt"
                  dataIndex="createdAt"
                  sorter={
                    (a, b) => {
                      // console.log("a > b", a, b)
                      return a.createdAt > b.createdAt
                    }
                  }
                  render={(text, row) => {
                    console.log("moment",text)
                    return text ? moment(text).format('DD-MM-YYYY HH:mm') : '-'}}
                  sortDirections={['ascend', 'descend']}
                  // sortOrder="ascend"
                  defaultSortOrder="ascend"
                />
                <Column
                  width={140}
                  title={t('record')}
                  key="action"
                  dataIndex="action"
                  filters={[
                    {
                      text: 'เติม Wallet',
                      value: 'เติม',
                    },
                    {
                      text: 'บันทึกใบเสร็จ',
                      value: 'บันทึกใบเสร็จ',
                    },
                    {
                      text: 'แก้ไขใบเสร็จ',
                      value: 'แก้ไขใบเสร็จ',
                    },
                    // {
                    //   text: 'ลบใบเสร็จ',
                    //   value: 'ลบใบเสร็จ',
                    // },
                    {
                      text: 'ยกเลิกใบเสร็จ',
                      value: 'ยกเลิก',
                    },
                    {
                      text: 'ตัดเงิน Wallet',
                      value: 'ตัดเงิน',
                    },
                  ]}
                  onFilter={(value, record) => record.action.startsWith(value)}
                  filterSearch={true}
                />
                <Column
                  width={80}
                  title={t('orderId')}
                  key="orderId"
                  dataIndex="orderId"
                  filters={receiptNoFilter}
                  onFilter={(value, record) => record.orderId == value}
                  filterSearch={true}
                />
                <Column
                  width={80}
                  title={t('net-price-result')}
                  key="netPrice"
                  dataIndex="netPrice"
                  render={(val) => <span>{numberWithCommas(val)}</span>}
                />
                <Column
                  width={120}
                  title={t('deducting')}
                  key="afterCommissionPrice"
                  dataIndex="afterCommissionPrice"
                  render={(val) => <span>{numberWithCommas(val)}</span>}
                />
                <Column
                  width={80}
                  title={t('wallet')}
                  key="wallet"
                  dataIndex="wallet"
                  render={(val) => <span style={{ color: val.startsWith("+") 
                        ? "green" : val.startsWith("-")
                        ? "red" : "black"  }}>
                        {numberWithCommas(val.replace("-", "").replace("+", ""))}
                      </span>}

                />
                <Column
                  width={80}
                  title={t('booking-amount')}
                  key="reservePrice"
                  dataIndex="reservePrice"
                  render={(val) => <span style={{ color: val.startsWith("+") 
                        ? "green" : val.startsWith("-")
                        ? "red" : "black"  }}>
                        {numberWithCommas(val.replace("-", "").replace("+", ""))}
                      </span>}
                />
                <Column
                  width={100}
                  title={t('remaining')}
                  key="balance"
                  dataIndex="balance"
                  render={(val) => <span style={{ color: val.startsWith("+") 
                    ? "green" : val.startsWith("-")
                    ? "red" : "black"  }}>
                    {numberWithCommas(val.replace("-", "").replace("+", ""))}
                  </span>}
                />
              </Table>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

function numberWithCommas(x) {
  if(!x) x = "0"
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default ReportBalance;
