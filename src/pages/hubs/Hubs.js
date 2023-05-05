import {
  Form,
  Input,
  Button,
  message,
  Layout,
  Col,
  Row,
  Spin,
  Select,
  Typography,
  Table,
  Space,
  Badge,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import {
  FileOutlined,
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import allAction from '../../app/actions/index';

const { Column } = Table;
const { Option } = Select;

const HubsList = (props) => {
  const { hubData, companyData } = useSelector((state) => state.hubReducer);
  const { permission, roleLevel } = useSelector((state) => state.authenReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const history = useHistory();

  const { pageCode } = props;

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (allAction?.hubAction?.getHubData()) {
      dispatch(allAction.hubAction.getHubData())
        .then(() => {})
        .catch((e) => message.error(e.message));
      form.setFieldsValue({
        search: '',
        isActive: '',
      });
    }
  }, []);

  const [form] = Form.useForm();
  const handleFilterChange = (value) => {
    setFilter(value);
    dispatch(allAction.hubAction.getHubDataSerachFilter(value, search))
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const onFinishSearch = (value) => {
    setSearch(value.search);
    dispatch(allAction.hubAction.getHubDataSerachFilter(filter, value.search))
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }}>
              <Typography.Title level={3}>
                <span className="text-primary"> {t('hub')} </span>
              </Typography.Title>
            </Col>
          </Row>

          <Form layout="vertical" form={form} onFinish={onFinishSearch}>
            <Row gutter={[8, 8]} align="middle">
              <Col
                xs={{ span: roleLevel == 'SAD' ? 24 : 12 }}
                lg={{ span: roleLevel == 'SAD' ? 4 : 6 }}
              >
                {roleLevel == 'SAD' ? (
                  <Form.Item label={t('company')} name="companyId">
                    <Select
                      defaultValue={t('all-select')}
                      onChange={handleFilterChange}
                    >
                      <Option value="">{t('all-select')}</Option>
                      {companyData &&
                        companyData.map((item) => (
                          <Option key={item.companyId}>
                            {item.companyName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item name="search" label="&nbsp;">
                    <Input placeholder={t('search')} allowClear />
                  </Form.Item>
                )}
              </Col>
              <Col
                xs={{ span: roleLevel == 'SAD' ? 12 : 12 }}
                lg={{ span: roleLevel == 'SAD' ? 6 : 2 }}
              >
                {roleLevel == 'SAD' ? (
                  <Form.Item name="search" label="&nbsp;">
                    <Input placeholder={t('search')} allowClear />
                  </Form.Item>
                ) : (
                  <Form.Item label="&nbsp;">
                    <Button
                      type="default"
                      icon={<SearchOutlined />}
                      htmlType="submit"
                      style={{ width: isMobile ? '100%' : '100px' }}
                    >
                      {t('search')}
                    </Button>
                  </Form.Item>
                )}
              </Col>
              <Col
                xs={{ span: roleLevel == 'SAD' ? 12 : 0 }}
                lg={{ span: roleLevel == 'SAD' ? 2 : 4 }}
              >
                <Form.Item label="&nbsp;">
                  {roleLevel == 'SAD' ? (
                    <Button
                      type="default"
                      icon={<SearchOutlined />}
                      htmlType="submit"
                      style={{ width: isMobile ? '100%' : '100px' }}
                    >
                      {t('search')}
                    </Button>
                  ) : (
                    <></>
                  )}
                </Form.Item>
              </Col>

              <Col
                xs={{ span: 24 }}
                lg={{ span: 10, offset: 2 }}
                xxl={{ span: 8, offset: 4 }}
              >
                <Form.Item label="&nbsp;">
                  {isMobile && FilterPermission('isCreate') ? (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => history.push('/hub-management/create')}
                      block
                    >
                      {t('create')}
                    </Button>
                  ) : (
                    <Row gutter={[8, 8]} justify="end">
                      <Col>
                        {FilterPermission('isCreate') && (
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              history.push('/hub-management/create')
                            }
                            style={{ width: '120px' }}
                          >
                            {t('create')}
                          </Button>
                        )}
                      </Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }}>
              <Table
                scroll={{ x: 800 }}
                dataSource={hubData}
                style={{ fontFamily: 'KanitRegular' }}
                style={{ cursor: 'pointer' }}
                pagination={{
                  total: hubData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(`./hub-management/${record.key}`);
                    dispatch(allAction.hubAction.setActionPage('view'));
                  },
                })}
              >
                {/* <Column
                  title={t('no')}
                  width={80}
                  dataIndex="no"
                  key="no"
                  align="center"
                /> */}

                {roleLevel == 'SAD' ? (
                  <Column
                    title={t('agency-company')}
                    width={140}
                    dataIndex="companyName"
                    key="companyName"
                  />
                ) : (
                  <></>
                )}

                <Column
                  title={t('hubs_code')}
                  width={140}
                  dataIndex="hubCode"
                  key="hubCode"
                />

                <Column
                  title={t('hubs_name')}
                  width={140}
                  dataIndex="hubName"
                  key="hubName"
                  filters={[
                    { text: 'Active', value: true },
                    { text: 'InActive', value: false },
                  ]}
                  onFilter={(value, record) => record.isActive == value}
                  render={(text, row) => (
                    <>
                      {' '}
                      <Badge
                        status={row?.isActive ? 'success' : 'error'}
                        text={text}
                      />{' '}
                    </>
                  )}
                />

                <Column
                  title={t('information-phone')}
                  width={160}
                  dataIndex="phoneNo"
                  key="phoneNo"
                />

                <Column
                  title={t('address-provice')}
                  width={200}
                  dataIndex="provinceName"
                  key="provinceName"
                />
              </Table>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default HubsList;
