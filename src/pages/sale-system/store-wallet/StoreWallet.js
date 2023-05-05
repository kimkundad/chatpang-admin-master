import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  message,
  Button,
  Space,
  Modal,
  Image,
  Input,
} from 'antd';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';

import moment from 'moment';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';
import MpayIcon from '../../../assets/mPay.png';
import ModalWallet from './component/ModalWallet';
import ModalQR from './component/ModalQR';
import PendingButton from './PendingButton'

import {
  useLazyGetEnquiryQuery,
  useGetAgencyWalletQuery
} from '../../../app/api/walletApi';

const { Column } = Table;

const StoreWallet = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { pageCode } = props;

  // const { storeWalletData, agencyWallet } = useSelector(
  //   (state) => state.storeWalletReducer,
  // );

  const { storeWalletData } = useSelector(
    (state) => state.storeWalletReducer,
  );

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    permission, userLevel, isCustomer, agencyId, companyId, hubId,
  } = useSelector((state) => state.authenReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState({});

  const [urlQR, setUrlQR] = useState(null);
  const [enqOrderID, setEnqOrderID] = useState(null);

  const [selectedBank, setSelectedBank] = useState(null);

  // const [messages, setMessages] = useState({});
  const transactionId = new URLSearchParams(useLocation().search).get(
    'transactionId',
  );
  // console.log('transactionId', transactionId);

  const [getEnquiry] = useLazyGetEnquiryQuery()

  const {
    data: agencyWallet,
    // isFetching,
    // isLoading,
    // isSuccess, /* */
    // isError,
    // error,
    // refetch,
  } = useGetAgencyWalletQuery(!isCustomer && agencyId ? agencyId : undefined);

  // const {
  //   data: resultEnquiry,
  //   isFetching: isFetchingEnq,
  //   isLoading: isLoadingEnq,
  //   isSuccess: isSuccessEnq,
  //   // isError,
  //   // error,
  //   refetch,
  // } = useGetEnquiryQuery(enqOrderID, {
  //   refetchOnMountOrArgChange: false,
  //   skip: !enqOrderID
  // });



  // useEffect(() => {
  //   console.log("resultEnquiry-store1", isSuccessEnq, resultEnquiry)
  //   if (isSuccessEnq) {
  //     console.log("resultEnquiry-store2", resultEnquiry)
  //   }

  //   if (urlQR && !(isLoadingEnq || isFetchingEnq)) {
  //     setUrlQR(null)
  //   }
  // }, [isLoadingEnq, isFetchingEnq]);


  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    const end = moment(new Date(), 'YYYY-MM-DD');
    const query = {};
    if (companyId) query.companyId = companyId;
    if (hubId) query.hubId = hubId;
    if (agencyId) query.agencyId = agencyId;
    query.startDate = moment(std).format('YYYY-MM-DD');
    query.endDate = moment(end).format('YYYY-MM-DD');
    dispatch(allAction.storeWallet.getWalletList(query))
      .then()
      .catch((e) => message.error(e.message));
    if (agencyId && !isCustomer) {
      dispatch(allAction.storeWallet.getAgencyWallet(agencyId))
        .then()
        .catch((e) => message.error(e.message));
    }
    return () => {
      dispatch(allAction.storeWallet.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);

  const downloadFile = () => {
    // console.log('query', search);
    dispatch(allAction.storeWallet.downloadFileWallet(search))
      .then(() => message.success('Download Success!'))
      .catch((e) => message.error(e.message));
  };

  const onSearch = (value) => {
    console.log('onSearch',value);
    const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    const newValue = value;
    // newValue.startDate = value?.createdAt
    //   ? format(new Date(value?.createdAt[0]), 'yyyy-MM-dd')
    //   : '';
    // newValue.endDate = value?.createdAt
    //   ? format(new Date(value?.createdAt[1]), 'yyyy-MM-dd')
    //   : '';
    // delete newValue.createdAt;

    newValue.startDate = value?.startDate || moment(std).format('YYYY-MM-DD')
    newValue.endDate = value?.endDate || moment(new Date()).format('YYYY-MM-DD')
    
    setSearch(newValue);
    dispatch(allAction.storeWallet.getWalletList(newValue))
      .then()
      .catch((e) => message.error(e.message));
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onQrOk = () => {
    getEnquiry(enqOrderID)
      .unwrap()
      .then(data => {
        // setValuesToForm(data)
        setUrlQR(null)
      })
      .catch((e) => {
        // message.error("ERROR")
        // setIsDataLoading(false)
        setUrlQR(null)
      })
  }

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('SWA')}</span>
              </Typography.Title>
            </Col>
            <Col sm={12} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                style={{ width: 120 }}
                icon={<DownloadOutlined />}
                onClick={downloadFile}
              >
                {t('export-file')}
              </Button>
            </Col>

            <Col xs={24}>
              {FilterUserLevel(['AGN']) && !isCustomer && (
                <Row align="middle" gutter={16} style={{ float: 'right' }}>
                  <Col md={6}>
                    <Row align="middle">
                      <Col xs={10} lg={8}>
                        <Typography>
                          {t('wallet')}
                          {' '}
                          :
                        </Typography>
                      </Col>
                      <Col xs={10} lg={12} style={{ paddingLeft: 5 }}>
                        <Input style={{ color: "black", textAlign: "right" }} disabled value={dec2(agencyWallet?.wallet || 0)} />
                      </Col>
                      <Col xs={4} style={{ paddingLeft: 5 }}>
                        {t('thb')}
                        {' '}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row align="middle">
                      <Col xs={8}>
                        <Typography>
                          {t('reserve')}
                          {' '}
                          :
                        </Typography>
                      </Col>
                      <Col xs={12} style={{ paddingLeft: 5 }}>
                        <Input style={{ color: "black", textAlign: "right" }} disabled value={dec2(agencyWallet?.reservePrice || 0)} />
                      </Col>
                      <Col xs={4} style={{ paddingLeft: 5 }}>
                        {t('thb')}
                        {' '}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={9}>
                    <Row align="middle">
                      <Col xs={12} lg={8}>
                        <Typography>
                          {t('balance')}
                          {' '}
                          :
                        </Typography>
                      </Col>
                      <Col xs={10} lg={10} style={{ paddingLeft: 5 }}>
                        <Input style={{ color: "black", textAlign: "right" }} disabled value={dec2(((agencyWallet?.wallet || 0) - (agencyWallet?.reservePrice || 0)))} />
                      </Col>
                      <Col xs={2} lg={4} style={{ paddingLeft: 5 }}>
                        {t('thb')}
                        {' '}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={3}>
                    <Row align="middle">
                      <Col xs={24} style={{ paddingLeft: 10, marginTop: 8 }}>
                        <Image
                          src={MpayIcon}
                          width={40}
                          onClick={showModal}
                          preview={false}
                          style={{ cursor: 'pointer' }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Col>

            <Col sm={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={storeWalletData}
                scroll={{ x: 1000 }}
                pagination={{
                  total: storeWalletData?.length || 0,
                  showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                    'from',
                  )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              >
                {FilterUserLevel(['SAD']) && (
                  <Column
                    width={70}
                    title={t('company-select')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.companyData?.companyName}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM']) && (
                  <Column
                    width={70}
                    title={t('hub')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.hubData?.hubName}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM', 'HUB', 'AGN']) && (
                  <Column
                    width={70}
                    title={t('agency')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.agencyCode || '-'}
                  />
                )}
                {/* <Column
                  width={150}
                  title={t('date')}
                  ellipsis
                  dataIndex="createdAt"
                  key="createdAt"
                  render={(text) => (text ? format(new Date(text), 'dd/MM/yyyy') : '-')}
                /> */}
                <Column
                  width={80}
                  title={t('time')}
                  ellipsis
                  dataIndex="createdAt"
                  key="createdAt"
                  render={(text) => (text ? format(new Date(text), 'yyyy-MM-dd HH:mm') : '-')}
                />
                <Column
                  width={60}
                  align="right"
                  title={t('payment-price')}
                  ellipsis
                  dataIndex="amount"
                  key="amount"
                  render={(text) => (text ? dec2(text) : '-')}
                />
                <Column
                  width={70}
                  align='center'
                  title="STATUS"
                  // ellipsis
                  dataIndex="statusCode"
                  key="statusCode"
                  // render={(text) => text || '-'}
                  render={(text, row) => {
                    if (text.toUpperCase().trim() === "PENDING" || text.toUpperCase().trim() === "FAIL") {
                      return <PendingButton rowData={row} urlQR={urlQR} type="primary">PENDING</PendingButton>
                    }
                    if (text.toUpperCase().trim() === "SUCCESS") {
                      return <span style={{ color: "green" }}>SUCCESS</span>
                    }
                    return <span style={{ color: "red" }}>{text || '-'}</span>
                  }}
                />
                <Column
                  width={80}
                  title={t('add-payment-type')}
                  ellipsis
                  dataIndex="paymentChannelData"
                  key="paymentChannelData"
                  render={(text) => text?.paymentChannelName || '-'}
                />
                <Column
                  width={50}
                  title={t('bank')}
                  ellipsis
                  dataIndex="bankCode"
                  key="bankCode"
                  render={(text) => text || '-'}
                />
                <Column
                  width={80}
                  title="txn_id"
                  ellipsis
                  dataIndex="txnId"
                  key="txnId"
                  // render={(text) => text || '-'}
                />
              </Table>
            </Col>
          </Row>
          <ModalWallet
            setSelectedBank={setSelectedBank}
            showModal={isModalVisible}
            setUrlQR={setUrlQR}
            setEnqOrderID={setEnqOrderID}
            onOk={handleOk}
            onCancel={handleCancel}
          />
          <ModalQR
            selectedBank={selectedBank}
            urlQR={urlQR}
            setUrlQR={setUrlQR}
            setEnqOrderID={setEnqOrderID}
            onQrOk={onQrOk}
            onCancel={handleCancel}
          />
        </Layout>
      </Spin>
    </>
  );
};

export default StoreWallet;

const dec2 = (num) => {
  return fnumber_format(num, 2, ".", ",")
}

function fnumber_format(number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    toFixedFix = function (n, prec) {
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      var k = Math.pow(10, prec);
      return Math.round(n * k) / k;
    },
    s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}