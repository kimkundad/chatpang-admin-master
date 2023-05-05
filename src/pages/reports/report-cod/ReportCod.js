/* eslint-disable  */
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
    cod: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    cod: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    cod: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    cod: 1000,
  },
  {
    companyName: 'aaaa',
    hubName: 'bbb',
    agencyCode: '11qq',
    subdistrict: 'aaaa',
    district: 'aaaa',
    province: 'aaaa',
    cod: 1000,
  },
];

const ReportCod = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { pageCode } = props;

  const { reportCodData } = useSelector((state) => state.reportReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel, isCustomer, agencyId, companyId, hubId } =
    useSelector((state) => state.authenReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState({});
  const [query, setQuery] = useState(null);

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  useEffect(() => {
    console.log("reportCodData", reportCodData)
  }, [reportCodData])

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const onSearch = (value) => {
    setQuery(value);
    console.log("value", value);
    const newValue = value;
    newValue.startDate = value?.createdAt
      ? format(new Date(value?.createdAt[0]), 'yyyy-MM-dd')
      : '';
    newValue.endDate = value?.createdAt
      ? format(new Date(value?.createdAt[1]), 'yyyy-MM-dd')
      : '';
    delete newValue.createdAt;
    setSearch(newValue);
    dispatch(allAction.report.getCodList(newValue))
      .then()
      .catch((e) => message.error(e.message));
  };

  const exportFile = () => {
    // const fileName = { fileName: `Transport-Service-${format(new Date(), 'dd-MM-yyyy')}.xlsx` }
    dispatch(allAction.report.exportFile(query));
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
                    disabled={reportCodData?.length < 1}
                    style={{ width: 120 }}
                    icon={<DownloadOutlined />}
                    onClick={exportFile}
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
                dataSource={reportCodData}
                // scroll={{ x: 1500 }}
                // pagination={{
                //   total: reportData?.length || 0,
                //   showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                //     'from',
                //   )} ${total} ${t('record')}`,
                //   defaultPageSize: 10,
                //   defaultCurrent: 1,
                // }}
                summary={(pageData) => {
                  let totalCode = 0;
                  pageData.forEach((cod) => {
                    totalCode +=
                      Math.round(cod['orderItemData.total_cod'] * 100) / 100;
                  });

                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={5} />
                        <Table.Summary.Cell>
                          <b>{t('sum')}</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <b>{totalCode.toFixed(2)}</b>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              >
                {/* {FilterUserLevel(['SAD']) && ( */}
                <Column
                  width={150}
                  title={t('company-select')}
                  ellipsis
                  dataIndex="agencyData.hubData.companyData.companyName"
                  key="agencyData.hubData.companyData.companyName"
                />
                {/* )} */}
                {/* {FilterUserLevel(['SAD', 'COM']) && ( */}
                <Column
                  width={150}
                  title={t('hub')}
                  ellipsis
                  dataIndex="agencyData.hubData.hubName"
                  key="agencyData.hubData.hubName"
                />
                {/* )} */}
                {FilterUserLevel(['SAD', 'COM', 'HUB', 'AGN']) && (
                  <Column
                    width={150}
                    title={t('agency')}
                    ellipsis
                    dataIndex="agencyData.agencyCode"
                    key="agencyData.agencyCode"
                  />
                )}
                <Column
                  width={150}
                  title={t('subdistrict')}
                  ellipsis
                  dataIndex="agencyData.subdistrictData.subdistrictName"
                  key="agencyData.subdistrictData.subdistrictName"
                  render={(text) => text || '-'}
                />

                <Column
                  width={100}
                  title={t('district')}
                  ellipsis
                  dataIndex="agencyData.districtData.districtName"
                  key="agencyData.districtData.districtName"
                  render={(text) => text || '-'}
                />
                <Column
                  width={100}
                  title={t('province')}
                  ellipsis
                  dataIndex="agencyData.provinceData.provinceName"
                  key="agencyData.provinceData.provinceName"
                />
                <Column
                  width={80}
                  title={t('RCO')}
                  ellipsis
                  dataIndex="orderItemData.total_cod"
                  key="orderItemData.total_cod"
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

export default ReportCod;
