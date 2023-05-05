import React, { useEffect } from 'react';
import { Row, Col, Spin, Typography, Table, Layout, message } from 'antd';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';

const { Column } = Table;

const HubListSell = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;

  const { orderItemData } = useSelector((state) => state.hubListSellReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.hubListSellAction.getOrderItemInHubWarehouse())
      .then()
      .catch((e) => message.error(e.message));
    return () => {
      dispatch(allAction.hubListSellAction.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);
  const onSearch = (value) => {
    console.log(value);
    dispatch(allAction.hubListSellAction.getOrderItemInHubWarehouse(value))
      .then()
      .catch((e) => message.error(e.message));
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={18}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('HLS')}</span>
              </Typography.Title>
            </Col>
            <Col sm={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={orderItemData}
                scroll={{ x: 1000 }}
                pagination={{
                  total: orderItemData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              >
                <Column
                  width={180}
                  title={t('transportation-order-no')}
                  ellipsis
                  dataIndex="transportationOrderData"
                  key="transportationOrderData"
                  render={(text) => text?.transportationOrderNo}
                />
                <Column
                  width={150}
                  title={t('do-no')}
                  ellipsis
                  dataIndex="doNo"
                  key="doNo"
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
                    if (value)
                      return record?.orderData?.agencyData?.isCustomer === true;
                    return record?.orderData?.agencyData?.isCustomer !== true;
                    // record.customerCategoryData.customerCategoryId === value
                  }}
                  render={(text) => {
                    if (text?.agencyData?.isCustomer)
                      return text?.agencyData?.agencyName;
                    return text?.agencyData?.agencyCode;
                  }}
                />
                <Column
                  width={180}
                  title={t('driver')}
                  ellipsis
                  dataIndex="transportationOrderData"
                  key="transportationOrderData"
                  render={(text) => text?.driverData?.userData?.name}
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
      </Spin>
    </>
  );
};

export default HubListSell;
