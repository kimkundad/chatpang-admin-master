import React, { useEffect, useState, useRef} from 'react';
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
} from 'antd';

import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';

const { Column } = Table;

const StoreSellOrder = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { pageCode } = props;
  const [dataSearch, setDataSearch] = useState({});
  const { sellOrderData, masterStatus } = useSelector((state) => state.storeSellOrderReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    permission, userLevel, agencyId, isCustomer,
  } = useSelector((state) => state.authenReducer);

  const exportFunction = useRef(() => { });

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

    dispatch(allAction.StoreSellOrder.getSellOrderList(
      {
        startDate: moment(std).format('YYYY-MM-DD'),
        endDate: moment(end).format('YYYY-MM-DD'),
        orderStatus: '',
      },
    ))
      .then(() => {
        setDataSearch({
          startDate: moment(std).format('YYYY-MM-DD'),
          endDate: moment(end).format('YYYY-MM-DD'),
          orderStatus: '',
        });
      })
      .catch((e) => message.error(e.message));
    // return () => {
    //   dispatch(allAction.hubListSellAction.clearData())
    //     .then()
    //     .catch((e) => message.error(e.message));
    // };
  }, []);
  const onSearch = (value) => {
    console.log(value);
    dispatch(allAction.StoreSellOrder.getSellOrderList(value))
      .then(() => {
        setDataSearch(value);
      })
      .catch((e) => message.error(e.message));
  };

  const cancelOrder = (value) => {
    Modal.confirm({
      title: `ต้องการยกเลิกออร์เดอร์ ${value.orderId}`,
      onOk() {
        dispatch(allAction.StoreSellOrder.cancelOrder(value.orderId))
          .then(() => {
            const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
            const end = moment(new Date(), 'YYYY-MM-DD');
            if (agencyId && !isCustomer) {
              dispatch(allAction.storeWallet.getAgencyWallet(agencyId));
            }
            dispatch(allAction.StoreSellOrder.getSellOrderList(
              dataSearch,
            ))
              .then()
              .catch((e) => message.error(e.message));
            message.success('Cancel Order Success!');
          })
          .catch((e) => message.error(e.message));
      },
    });
  };

  const checkOrderStatus = (value) => {
    if (value.orderStatusCode === 'DRF') {
      history.push(`./store-sell/${value.orderId}/edit`);
    } else {
      dispatch(allAction.storeSellAction.updateBackDraft(value.orderId))
        .then(() => history.push(`./store-sell/${value.orderId}/edit`))
        .catch((err) => message.error(err.message));
    }
    //
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]} style={{ marginBottom: -20 }}>
            <Col xs={24} sm={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('ASO')}</span>
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
              <FilterData onSearch={onSearch} exportFunction={exportFunction} pageCode={pageCode} />
            </Col>
            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={sellOrderData}
                scroll={{ x: 1000 }}
                pagination={{
                  total: sellOrderData?.length || 0,
                  showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                    'from',
                  )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              >
                {FilterUserLevel(['SAD']) && (
                  <Column
                    width={180}
                    title={t('company-select')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.companyData?.companyName}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM']) && (
                  <Column
                    width={150}
                    title={t('hub')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.hubData?.hubName}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
                  <Column
                    width={180}
                    title={t('agency')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    // render={(text) => (text?.isCustomer
                    //   ? text?.agencyName || '-'
                    //   : text?.agencyCode || '-')}
                    render={(text) => (text?.agencyCode)}
                  />
                )}
                <Column
                  width={200}
                  title={t('date-time')}
                  ellipsis
                  dataIndex="createdAt"
                  key="createdAt"
                  render={(text, row) => {
                    return text ? moment(text).format('YYYY-MM-DD HH:mm') : '-'
                  }}
                />
                <Column
                  width={200}
                  title={t('billing-no')}
                  ellipsis
                  dataIndex="receiptNo"
                  key="receiptNo"
                  render={(text, row) => text || row?.soNo}
                />
                <Column
                  width={150}
                  title={t('total-price')}
                  ellipsis
                  dataIndex="totalPrice"
                  key="totalPrice"
                  render={(text, row) => text || '-'}
                />
                <Column
                  width={150}
                  title={t('status')}
                  ellipsis
                  dataIndex="orderStatus"
                  key="orderStatus"
                  render={(text) => text?.orderStatusDesc || '-'}
                />
                <Column
                  width={150}
                  title={t('sale-name')}
                  ellipsis
                  dataIndex="saleName"
                  key="saleName"
                />
                <Column
                  width={250}
                  title={t('action')}
                  align="center"
                  dataIndex="recipientName"
                  key="recipientName"
                  render={(text, row) => (
                    <>
                      <Space>
                        {FilterPermission('isRead') && (
                          <Button
                            size="small"
                            type="primary"
                            disabled={row?.orderStatusCode === 'DRF'}
                            style={{ width: '60px' }}
                            onClick={() => history.push(`./store-sell/${row.orderId}`)}
                          >
                            {t('view')}
                          </Button>
                        )}
                        {(FilterPermission('isUpdate') && !FilterUserLevel('HUB')) && (
                          <Button
                            size="small"
                            type="primary"
                            style={{ width: '60px' }}
                            disabled={!['DRF', 'SAV'].includes(row?.orderStatusCode)}
                            onClick={() => checkOrderStatus(row)}
                          >
                            {t('edit')}
                          </Button>
                        )}
                        {((FilterPermission('isUpdate') || FilterPermission('isDelete')) && !FilterUserLevel('HUB')) && (
                          <Button
                            size="small"
                            type="primary"
                            danger
                            style={{ width: '60px' }}
                            disabled={['CRE', 'PAI', 'CAN'].includes(row?.orderStatusCode)}
                            onClick={() => cancelOrder(row)}
                          >
                            {t('cancel-modal')}
                          </Button>
                        )}
                      </Space>
                    </>
                  )}
                />
              </Table>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default StoreSellOrder;
