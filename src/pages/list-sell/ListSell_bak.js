import React, { useEffect, useState, useRef } from 'react';
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
  Form,
  Input,
  Modal,
  Tag,
} from 'antd';

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import allAction from '../../app/actions/index';
import FilterData from './component/FilterData';
import { useGetOrderItemsQuery } from '../../app/api/orderItemsApi';

const { Column } = Table;
const { TextArea } = Input;
const ListSell = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [transportationOrderForCancel, setTransportationOrderForCancel] =
    useState(null);
  const [orderItemIdForBypass, setOrderItemIdForBypass] = useState(null);
  const [remark, setRemark] = useState(null);
  const [showBypass, setShowBypass] = useState(false);
  const [modalSelector, setModalSelector] = useState('Cancel');

  //----------- RTK QUERY ---------------
  const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
  const end = moment(new Date(), 'YYYY-MM-DD');
  const [toQuery, setToQuery] = useState({
    startDate: moment(std).format('YYYY-MM-DD'),
    endDate: moment(end).format('YYYY-MM-DD'),
    orderItemStatusCode: '',
  });

  const {
    data: orderItemStoreData,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetOrderItemsQuery(toQuery);

  //-------------------------------------

  // const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  // const { orderItemStoreData } = useSelector((state) => state.listSellReducer);
  const { hubId, permission, userLevel, agencyId } = useSelector(
    (state) => state.authenReducer
  );

  const exportFunction = useRef(() => {});

  useEffect(() => {
    if(isError) {
      message.error(error.status)
    }
  }, [error])

  useEffect(() => {
    window.scrollTo(0, 0);
    // const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    // const end = moment(new Date(), 'YYYY-MM-DD');

    // dispatch(allAction.listSellAction.getOrderItemStore(
    //   {
    //     startDate: moment(std).format('YYYY-MM-DD'),
    //     endDate: moment(end).format('YYYY-MM-DD'),
    //     orderItemStatusCode: '',
    //   },
    // ))
    //   .then()
    //   .catch((e) => message.error(e.message));

    // setToQuery({
    //   startDate: moment(std).format('YYYY-MM-DD'),
    //   endDate: moment(end).format('YYYY-MM-DD'),
    //   orderItemStatusCode: '',
    // });

    dispatch(allAction.listSellAction.getMasterItemStatus());
    return () => {
      dispatch(allAction.listSellAction.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);

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

  const onSearch = (value) => {
    console.log('search', value);
    if (!value?.startDate || !value?.endDate) {
      value.startDate = moment(std).format('YYYY-MM-DD');
      value.endDate = moment(end).format('YYYY-MM-DD');
    }

    if (JSON.stringify(value) === JSON.stringify(toQuery)) {
      refetch();
    } else {
      setToQuery(value);
    }

    if (value.search) {
      setShowBypass(true);
    } else {
      setShowBypass(false);
    }
    // dispatch(allAction.listSellAction.getOrderItemStore(value))
    //   .then()
    //   .catch((e) => message.error(e.message));
  };

  const showModalCancel = (val) => {
    setModalSelector('Cancel');
    setTransportationOrderForCancel(val);
    setModalCancelVisible(true);
  };

  const showConfirmOrderFound = (orderItemId) => {
    setModalSelector('Found');
    setOrderItemIdForBypass(orderItemId);
    setModalCancelVisible(true);
  };

  const showConfirmOrderByPass = (orderItemId) => {
    setModalSelector('ByPass');
    setOrderItemIdForBypass(orderItemId);
    setModalCancelVisible(true);
  };

  const modalCancelCancel = () => {
    clearModalCancelValue();
  };

  const cancelContent = () => (
    <>
      <Row>
        {`${t('remark')}`}
        <TextArea
          rows={4}
          onChange={(e) => {
            setRemark(e.target.value);
          }}
          value={remark}
        />
      </Row>
      <Row style={{ marginTop: 24 }} gutter={24}>
        <Col span={24}>
          <Space style={{ float: 'right' }}>
            {renderButtonModal()}
            <Button
              key="submit"
              // type="primary"
              // disabled={!remark}
              onClick={() => {
                clearModalCancelValue();
              }}
            >
              {t('cancel')}
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );

  const checkContentUpdate = () => {
    if (modalSelector === 'Cancel') {
      dispatch(
        allAction.storeSellAction.deleteItem(
          transportationOrderForCancel.orderId,
          transportationOrderForCancel.orderItemId,
          { remark }
        )
      )
        .then((e) => {
          if (agencyId) {
            dispatch(allAction.storeWallet.getAgencyWallet(agencyId));
          }
          // dispatch(allAction.listSellAction.getOrderItemStore())
          //   .then()
          //   .catch((e) => message.error(e.message));

          // setToQuery();
          refetch();
          clearModalCancelValue();
        })
        .catch((e) => message.error(e.message));
    } else if (modalSelector === 'Found') {
      dispatch(
        allAction.listSellAction.updateOrderFound(orderItemIdForBypass, {
          remark,
        })
      )
        .then((e) => {
          // dispatch(allAction.listSellAction.getOrderItemStore())
          //   .then()
          //   .catch((e) => message.error(e.message));
          // setToQuery();
          refetch();
          clearModalCancelValue();
        })
        .catch((e) => message.error(e.message));
    } else if (modalSelector === 'ByPass') {
      dispatch(
        allAction.listSellAction.updateOrderBypass(orderItemIdForBypass, {
          remark,
        })
      )
        .then((e) => {
          // dispatch(allAction.listSellAction.getOrderItemStore())
          //   .then()
          //   .catch((e) => message.error(e.message));

          // setToQuery();
          refetch();
          clearModalCancelValue();
        })
        .catch((e) => message.error(e.message));
    }
  };

  const renderTitleModal = () => {
    if (modalSelector === 'Cancel') {
      return t('cancel-modal');
    }
    if (modalSelector === 'Found') {
      return t('found');
    }
    if (modalSelector === 'ByPass') {
      return t('bypass');
    }
  };

  const renderButtonModal = () => {
    if (modalSelector === 'Cancel') {
      return (
        <Button
          key="submit"
          type="danger"
          // disabled={!remark}
          onClick={() => checkContentUpdate()}
        >
          {t('cancel-modal')}
        </Button>
      );
    }
    if (modalSelector === 'Found') {
      return (
        <Button
          key="submit"
          type="primary"
          // disabled={!remark}
          onClick={() => checkContentUpdate()}
        >
          {t('found')}
        </Button>
      );
    }
    if (modalSelector === 'ByPass') {
      return (
        <Button
          key="submit"
          type="primary"
          // disabled={!remark}
          onClick={() => checkContentUpdate()}
        >
          {t('bypass')}
        </Button>
      );
    }
  };

  const clearModalCancelValue = () => {
    setRemark(null);
    setModalCancelVisible(false);
    setTransportationOrderForCancel(null);
    setOrderItemIdForBypass(null);
    setModalSelector('Cancel');
  };

  const renderModalCancel = () => cancelContent();

  const filterDisable = (obj) => {
    if (
      FilterUserLevel(['SAD', 'COM']) &&
      ['VBH', 'CRE', 'WFS'].includes(obj?.orderItemStatusCode)
    ) {
      return false;
    }
    if (
      FilterUserLevel(['HUB']) &&
      ['VBH'].includes(obj?.orderItemStatusCode)
    ) {
      return false;
    }
    if (
      FilterUserLevel(['AGN']) &&
      ['CRE', 'WFS'].includes(obj?.orderItemStatusCode)
    ) {
      return false;
    }
    return true;
  };

  return (
    <>
      {/* {console.log(orderItems)} */}
      <Spin spinning={isFetching} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('LIS')}</span>
              </Typography.Title>
            </Col>

            <Col xs={24} md={12}>
              <Row align="middle" style={{ float: 'right' }}>
                <Col flex="auto" style={{ paddingLeft: 10 }}>
                  <Button
                    type="primary"
                    // disabled={reportCodData?.length < 1}
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
              <FilterData
                exportFunction={exportFunction}
                onSearch={onSearch}
                pageCode={pageCode}
              />
            </Col>
            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={orderItemStoreData}
                scroll={{ x: 1000 }}
                pagination={{
                  total: orderItemStoreData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              >
                <Column
                  width={!FilterUserLevel(['AGN']) ? 280 : 120}
                  fixed="left"
                  // ellipsis
                  dataIndex="orderItemId"
                  key="orderItemId"
                  render={(text, obj) => (
                    // console.log(obj);
                    <Space>
                      {FilterPermission('isUpdate') &&
                        !FilterUserLevel(['AGN']) &&
                        showBypass && (
                          <Button
                            size="small"
                            style={{
                              width: '80px',
                            }}
                            disabled={
                              !['CRE', 'WFS'].includes(obj?.orderItemStatusCode)
                            }
                            onClick={() => {
                              showConfirmOrderByPass(text);
                            }}
                          >
                            {t('bypass')}
                          </Button>
                        )}
                      {FilterPermission('isUpdate') && (
                        <Button
                          size="small"
                          type="danger"
                          style={{ width: '80px' }}
                          disabled={filterDisable(obj)}
                          onClick={() => {
                            showModalCancel(obj);
                          }}
                        >
                          {t('cancel-modal')}
                        </Button>
                      )}
                      {FilterPermission('isUpdate') &&
                        !FilterUserLevel(['AGN']) && (
                          <Button
                            size="small"
                            type="warning"
                            style={{ width: '80px', fontSize: 'small' }}
                            disabled={obj?.orderItemStatusCode !== 'ITM'}
                            onClick={() => {
                              showConfirmOrderFound(text);
                            }}
                          >
                            {t('found')}
                          </Button>
                        )}
                    </Space>
                  )}
                />
                <Column
                  width={150}
                  title={t('do-no')}
                  ellipsis
                  dataIndex="doNo"
                  key="doNo"
                />
                {/* รายการพัสดุ state orderItemStatusDesc */}
                <Column
                  width={180}
                  title={t('status')}
                  ellipsis
                  // filters={[
                  //   {
                  //     text: 'เติม Wallet',
                  //     value: 'เติม',
                  //   },
                  //   {
                  //     text: 'บันทึกใบเสร็จ',
                  //     value: 'บันทึกใบเสร็จ',
                  //   },
                  //   {
                  //     text: 'แก้ไขใบเสร็จ',
                  //     value: 'แก้ไขใบเสร็จ',
                  //   },
                  //   // {
                  //   //   text: 'ลบใบเสร็จ',
                  //   //   value: 'ลบใบเสร็จ',
                  //   // },
                  //   {
                  //     text: 'ยกเลิกใบเสร็จ',
                  //     value: 'ยกเลิก',
                  //   },
                  //   {
                  //     text: 'ตัดเงิน Wallet',
                  //     value: 'ตัดเงิน',
                  //   },
                  // ]}
                  onFilter={(value, record) => record.action.startsWith(value)}
                  dataIndex="orderItemStatus"
                  key="orderItemStatus"
                  render={(text, row) => {
                    // console.log('row', row);
                    const code = row?.orderItemStatus?.orderItemStatusCode;
                    const priority = row?.orderItemStatus?.priority;
                    let txt = text?.orderItemStatusDesc
                      ? text?.orderItemStatusDesc
                      : '-';
                    let color = '';

                    if (priority >= 4) color = 'green';
                    if (priority == 5) txt = 'ตรวจสอบแล้ว';

                    if (priority >= 6) {
                      txt = 'พัสดุถึงฮับ';
                      color = 'blue';
                    }
                    if (priority == 7) color = 'blue';
                    if (code === 'ITM') {
                      color = 'red';
                      txt = 'ของหาย';
                    }

                    return <Tag color={color}>{txt}</Tag>;
                  }}
                />
                <Column
                  width={200}
                  title={t('transportation-order-no')}
                  ellipsis
                  dataIndex="transportationOrderData"
                  key="transportationOrderData"
                  render={(text) => text?.transportationOrderNo || '-'}
                />
                <Column
                  width={150}
                  title={t('billing-no')}
                  ellipsis
                  dataIndex="orderData"
                  key="orderData"
                  render={(text, row) => text?.receiptNo || text?.soNo}
                />

                <Column
                  width={150}
                  title={t('date')}
                  ellipsis
                  dataIndex="createdAt"
                  key="createdAt"
                  render={(text) =>
                    text ? moment(text).format('DD-MM-YYYY') : '-'
                  }
                />
                <Column
                  width={150}
                  title={t('menu-setting-supplies')}
                  ellipsis
                  dataIndex="parcelTypeData"
                  key="parcelTypeData"
                  render={(text) => text?.category || '-'}
                />
                <Column
                  width={150}
                  title={t('hubs_code')}
                  ellipsis
                  dataIndex="orderData"
                  key="orderData"
                  render={(text) => {
                    if (text?.agencyData?.isCustomer) {
                      return text?.agencyData?.hubData?.hubName;
                    }
                    return text?.agencyData?.hubData?.hubCode;
                  }}
                />
                <Column
                  width={150}
                  title={t('agency-code')}
                  ellipsis
                  dataIndex="orderData"
                  key="orderData"
                  filters={[
                    { text: t('agency-tabs'), value: false },
                    { text: t('big-sender'), value: true },
                  ]}
                  // filteredValue={filteredInfo?.orderData || null}
                  onFilter={(value, record) => {
                    console.log('sss', value, record);
                    if (value) {
                      return record?.orderData?.agencyData?.isCustomer === true;
                    }
                    return record?.orderData?.agencyData?.isCustomer !== true;
                    // record.customerCategoryData.customerCategoryId === value
                  }}
                  render={(text) => {
                    if (text?.agencyData?.isCustomer) {
                      return text?.agencyData?.agencyCode;
                    }
                    return text?.agencyData?.agencyCode;
                  }}
                />
                <Column
                  width={150}
                  title={t('sender-name')}
                  ellipsis
                  dataIndex="orderData"
                  key="orderData"
                  render={(text) =>
                    `${text?.senderName || ''} ${text?.senderLastName || ''}`
                  }
                />

                <Column
                  width={100}
                  title={t('transportation-net-price')}
                  ellipsis
                  dataIndex="transportationNetPrice"
                  key="transportationNetPrice"
                />

                <Column
                  width={100}
                  title={t('cod')}
                  ellipsis
                  dataIndex="cod"
                  key="cod"
                />

                <Column
                  width={100}
                  title={t('weight')}
                  ellipsis
                  dataIndex="weight"
                  key="weight"
                />

                <Column
                  width={100}
                  title={t('volume')}
                  ellipsis
                  dataIndex="volume"
                  key="volume"
                />
                <Column
                  width={150}
                  title={t('recipient')}
                  ellipsis
                  dataIndex="recipientName"
                  key="recipientName"
                  render={(text, obj) => {
                    if (obj?.recipientLastName) {
                      return `${text} ${obj?.recipientLastName}`;
                    }
                    return text;
                  }}
                />
                <Column
                  width={150}
                  title={t('subdistrict')}
                  ellipsis
                  dataIndex="recipientSubdistrictData"
                  key="recipientSubdistrictData"
                  render={(text) => text?.subdistrictName || ''}
                />

                <Column
                  width={150}
                  title={t('district')}
                  ellipsis
                  dataIndex="recipientDistrictData"
                  key="recipientDistrictData"
                  render={(text) => text?.districtName || ''}
                />

                <Column
                  width={200}
                  title={t('province')}
                  ellipsis
                  dataIndex="recipientProvinceData"
                  key="recipientProvinceData"
                  render={(text) => text?.provinceName || ''}
                />
              </Table>
            </Col>
            {/* {FilterPermission('isCreate') && (
              <Col xs={24} sm={6}>
                <Button
                  style={{ float: 'right', width: isMobile ? '100%' : '120px' }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push('./user/create')}
                >
                  {t('create')}
                </Button>
              </Col>
            )} */}

            {/* <Col xs={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col> */}
          </Row>
        </Layout>
        <Modal
          style={{}}
          width="65%"
          centered
          visible={modalCancelVisible}
          title={renderTitleModal()}
          // onOk={modalCancelOK}
          onCancel={modalCancelCancel}
          footer={null}
        >
          {renderModalCancel()}
        </Modal>
      </Spin>
    </>
  );
};

export default ListSell;
