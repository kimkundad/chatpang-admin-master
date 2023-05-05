import React, { useEffect, useState } from 'react';
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
  Badge,
  message,
  Select,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';

const { Column } = Table;

const Company = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { roleLevel, companyId, permission } = useSelector(
    (state) => state.authenReducer
  );
  const { storeCustomeData, companyData } = useSelector(
    (state) => state.storeCustomeReducer
  );
  const [filteredInfo, setFilteredInfo] = useState({});

  const dispatch = useDispatch();

  const { pageCode } = props;

  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    dispatch(allAction.storeCustomeAction.getStoreCustomer())
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.storeCustomeAction.getCompanyData())
      .then()
      .catch((e) => message.error(e.message));
    window.scrollTo(0, 0);
  }, []);

  const onFinishSearch = (value) => {
    dispatch(allAction.storeCustomeAction.getStoreCustomer(value))
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    // setSortedInfo(sorter);
  };
  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row>
            <Col xs={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('store-customer-info')}</span>
              </Typography.Title>
            </Col>
            {FilterPermission('isCreate') && (
              <Col
                xs={{ span: 24 }}
                lg={{ span: 10, offset: 2 }}
                xxl={{ span: 8, offset: 4 }}
              >
                <Form.Item>
                  {isMobile ? (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => history.push('./store-customer/create')}
                      block
                    >
                      {t('create')}
                    </Button>
                  ) : (
                    <Row gutter={[8, 8]} justify="end">
                      <Col>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() =>
                            history.push('./store-customer/create')
                          }
                          style={{ width: '120px' }}
                        >
                          {t('create')}
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            )}
            <Col xs={24}>
              <Form
                layout="vertical"
                name="listSP"
                form={form}
                onFinish={onFinishSearch}
              >
                <Row gutter={[8, 8]} align="middle">
                  {roleLevel === 'SAD' && (
                    <Col xs={{ span: 12 }} lg={{ span: 8 }}>
                      <Form.Item label={t('company')} name="companyId">
                        <Select
                          defaultValue={t('all-select')}
                          onSelect={(val) => {
                            dispatch(
                              allAction.storeCustomeAction.getStoreCustomer({
                                companyId: val,
                              })
                            )
                              .then(() => {})
                              .catch((e) => message.error(e.message));
                          }}
                        >
                          <Select.Option value="">
                            {t('all-select')}
                          </Select.Option>
                          {companyData &&
                            companyData.map((item) => (
                              <Select.Option key={item.companyId}>
                                {item.companyName}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  <Col xs={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item label={t('search')} name="search">
                      <Input
                        autocomplete="new-password"
                        placeholder={t('search')}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 12 }} lg={{ span: 4 }}>
                    <Form.Item label=" ">
                      <Button
                        type="default"
                        icon={<SearchOutlined />}
                        htmlType="submit"
                        style={{ width: isMobile ? '100%' : '100px' }}
                      >
                        {t('search')}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              <Row gutter={[24, 24]}>
                <Col xs={{ span: 24 }}>
                  <Table
                    scroll={{ x: 1000 }}
                    style={{ cursor: 'pointer' }}
                    onChange={handleChange}
                    onRow={(record) => ({
                      onClick: () => {
                        history.push(`./store-customer/${record.customerId}`);
                        dispatch(
                          allAction.storeCustomeAction.setActionPage('view')
                        );
                      },
                    })}
                    pagination={{
                      total: storeCustomeData?.length || 0,
                      showTotal: (total, range) =>
                        `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                          'from'
                        )} ${total} ${t('record')}`,
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                    }}
                    dataSource={storeCustomeData}
                  >
                    {roleLevel === 'SAD' && (
                      <Column
                        title={t('company-name')}
                        width={100}
                        dataIndex="companyData"
                        key="companyData"
                        align="center"
                        render={(text, row) => text?.companyName || '-'}
                      />
                    )}
                    <Column
                      title={t('customer-type')}
                      width={100}
                      dataIndex="customerCategoryData"
                      key="customerCategoryData"
                      filters={[
                        { text: t('customer'), value: 1 },
                        { text: t('recommender'), value: 2 },
                        { text: t('big-sender'), value: 3 },
                      ]}
                      filteredValue={filteredInfo?.customerCategoryData || null}
                      onFilter={(value, record) =>
                        // console.log(value, record);
                        record.customerCategoryData.customerCategoryId === value
                      }
                      render={(text, row) => text?.customerCategoryName || '-'}
                    />
                    <Column
                      title={t('agency-name')}
                      width={100}
                      dataIndex="customerName"
                      key="customerName"
                      render={(text, record) =>
                        record.customerCategoryData.customerCategoryId === 1
                          ? `${text} ${record?.customerLastName || ''}`
                          : text
                      }
                    />

                    <Column
                      title={t('phone')}
                      width={100}
                      dataIndex="phoneNumber"
                      key="phoneNumber"
                    />

                    <Column
                      title={t('store-customer-tax-identification-number')}
                      width={100}
                      dataIndex="taxpayerNumber"
                      key="taxpayerNumber"
                      render={(text) => text || '-'}
                    />

                    <Column
                      title={t('address-provice')}
                      width={100}
                      dataIndex="customerAddressData"
                      key="customerAddressData"
                      render={(text, row) =>
                        text[0]?.provinceData?.provinceName || '-'
                      }
                    />

                    <Column
                      title={t('store-customer-update-last-info')}
                      width={100}
                      dataIndex="updatedAt"
                      key="updatedAt"
                      render={(text) =>
                        format(new Date(text), 'dd-MM-yyyy HH:mm') || '-'
                      }
                    />
                  </Table>
                </Col>
              </Row>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default Company;
