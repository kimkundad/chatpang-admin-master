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
import { useHistory } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';
import MpayIcon from '../../../assets/mPay.png';

const { Column } = Table;

const data = [
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    sell: 1000,
    volume: 1000,
    weight: 1000,
    parcel: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    sell: 1000,
    volume: 1000,
    weight: 1000,
    parcel: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    sell: 1000,
    volume: 1000,
    weight: 1000,
    parcel: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    sell: 1000,
    volume: 1000,
    weight: 1000,
    parcel: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    sell: 1000,
    volume: 1000,
    weight: 1000,
    parcel: 1000,
  },
];

const ReportSell = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { pageCode } = props;

  const { storeWalletData, agencyWallet } = useSelector(
    (state) => state.storeWalletReducer
  );
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel, isCustomer, agencyId, companyId, hubId } =
    useSelector((state) => state.authenReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState({});

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
    console.log(value);
    const newValue = value;
    newValue.startDate = value?.createdAt
      ? format(new Date(value?.createdAt[0]), 'yyyy-MM-dd')
      : '';
    newValue.endDate = value?.createdAt
      ? format(new Date(value?.createdAt[1]), 'yyyy-MM-dd')
      : '';
    delete newValue.createdAt;
    setSearch(newValue);
    dispatch(allAction.storeWallet.getWalletList(newValue))
      .then()
      .catch((e) => message.error(e.message));
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('RCO')}</span>
              </Typography.Title>
            </Col>

            <Col xs={24} md={12}>
              <Row align="middle" style={{ float: 'right' }}>
                <Col flex="auto" style={{ paddingLeft: 10 }}>
                  <Button
                    type="primary"
                    style={{ width: 120 }}
                    icon={<DownloadOutlined />}
                    // onClick={downloadFile}
                  >
                    {t('export-file')}
                  </Button>
                </Col>
              </Row>
            </Col>

            <Col sm={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={data}
                // scroll={{ x: 1500 }}
                // pagination={{
                //   total: storeWalletData?.length || 0,
                //   showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                //     'from',
                //   )} ${total} ${t('record')}`,
                //   defaultPageSize: 10,
                //   defaultCurrent: 1,
                // }}
                summary={(pageData) => {
                  let totalSell = 0;
                  let totalVolume = 0;
                  let totalWeight = 0;
                  let totalParcel = 0;

                  pageData.forEach(({ sell, volume, weight, parcel }) => {
                    totalSell += sell;
                    totalVolume += volume;
                    totalWeight += weight;
                    totalParcel += parcel;
                  });

                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={5} />
                        <Table.Summary.Cell>
                          <b>{t('sum')}</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <b>{totalSell}</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <b>{totalVolume}</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <b>{totalWeight}</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <b>{totalParcel}</b>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              >
                {FilterUserLevel(['SAD']) && (
                  <Column
                    width={100}
                    title={t('company-select')}
                    ellipsis
                    dataIndex="companyName"
                    key="companyName"
                  />
                )}
                {FilterUserLevel(['SAD', 'COM']) && (
                  <Column
                    width={100}
                    title={t('hub')}
                    ellipsis
                    dataIndex="hubName"
                    key="hubName"
                  />
                )}
                {FilterUserLevel(['SAD', 'COM', 'HUB', 'AGN']) && (
                  <Column
                    width={100}
                    title={t('agency')}
                    ellipsis
                    dataIndex="agencyCode"
                    key="agencyCode"
                  />
                )}
                <Column
                  width={100}
                  title={t('subdistrict')}
                  ellipsis
                  dataIndex="subdistrict"
                  key="subdistrict"
                  render={(text) => text || '-'}
                />

                <Column
                  width={100}
                  title={t('district')}
                  ellipsis
                  dataIndex="district"
                  key="district"
                  render={(text) => text || '-'}
                />
                <Column
                  width={100}
                  title={t('province')}
                  ellipsis
                  dataIndex="province"
                  key="province"
                />
                <Column
                  width={80}
                  title={t('menu-report-sell')}
                  ellipsis
                  dataIndex="sell"
                  key="sell"
                  render={(text) => text || '-'}
                />
                <Column
                  width={80}
                  title={t('volume')}
                  ellipsis
                  dataIndex="volume"
                  key="volume"
                  render={(text) => text || '-'}
                />
                <Column
                  width={80}
                  title={t('weight')}
                  ellipsis
                  dataIndex="weight"
                  key="weight"
                  render={(text) => text || '-'}
                />
                <Column
                  width={80}
                  title={t('parcel-qty')}
                  ellipsis
                  dataIndex="parcel"
                  key="parcel"
                  render={(text) => text || '-'}
                />
              </Table>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default ReportSell;
