/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
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
  Badge,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import allAction from '../../../app/actions/index';

const { Column } = Table;
const { Option } = Select;

const ManageDriver = (props) => {
  const { manageDriverData, companyData, hubData } = useSelector(
    (state) => state.manageDriverReducer
  );
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, roleLevel, companyId, hubId } = useSelector(
    (state) => state.authenReducer
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [companyIdBySelect, setCompanyIdBySelect] = useState(0);
  const [form] = Form.useForm();
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
    if (roleLevel === 'COM') {
      const obj = {
        companyId,
        hubId: 0,
      };
      dispatch(allAction.manageDriverAction.getManageDriver(obj))
        .then(() => {})
        .catch((e) => message.error(e.message));
    } else if (roleLevel === 'HUB') {
      const obj = {
        companyId,
        hubId,
      };
      dispatch(allAction.manageDriverAction.getManageDriver(obj))
        .then(() => {})
        .catch((e) => message.error(e.message));
    } else if (roleLevel === 'SAD') {
      const obj = {
        companyId: 0,
        hubId: 0,
      };
      dispatch(allAction.manageDriverAction.getManageDriver(obj))
        .then(() => {})
        .catch((e) => message.error(e.message));
    }

    form.setFieldsValue({
      search: '',
      isActive: '',
    });
  }, []);

  const handleFilterChange = (value) => {
    if (value === '') {
      value = 0;
    }
    form.setFieldsValue({
      hubId: '',
      search: '',
    });
    const obj = {
      companyId: value,
      hubId: 0,
    };
    setCompanyIdBySelect(value);
    dispatch(allAction.manageDriverAction.getManageDriver(obj))
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const handleFilterHubChange = (value) => {
    form.setFieldsValue({
      search: '',
    });
    const obj = {
      companyId:
        companyIdBySelect == 0
          ? companyId == ''
            ? 0
            : companyId
          : companyIdBySelect,
      hubId: value == '' ? 0 : value,
    };
    dispatch(allAction.manageDriverAction.getManageDriver(obj))
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const onFinishSearch = (value) => {
    if (roleLevel === 'SAD') {
      if (value.companyId == null) {
        dispatch(allAction.manageDriverAction.filterManageDriver(value))
          .then(() => {})
          .catch((e) => message.error(e.message));
      } else {
        dispatch(allAction.manageDriverAction.filterManageDriver(value))
          .then(() => {})
          .catch((e) => message.error(e.message));
      }
    } else if (roleLevel === 'COM') {
      const obj = {
        companyId,
        hubId: value.hubId,
        search: value.search,
      };
      dispatch(allAction.manageDriverAction.filterManageDriver(obj))
        .then(() => {})
        .catch((e) => message.error(e.message));
    } else if (roleLevel === 'HUB') {
      const obj = {
        companyId,
        hubId,
        search: value.search,
      };
      dispatch(allAction.manageDriverAction.filterManageDriver(obj))
        .then(() => {})
        .catch((e) => message.error(e.message));
    }
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        {/* <Spin spinning={false} tip="Loading..."> */}
        <Layout style={{ minHeight: '100vh' }}>
          {isMobile ? (
            <Row gutter={[24, 24]}>
              <Col xs={{ span: 24 }}>
                <Typography.Title level={3}>
                  <span className="text-primary">{t('menu-hub-employee')}</span>
                </Typography.Title>
              </Col>
            </Row>
          ) : (
            ''
          )}
          {isMobile ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('./hub-employee/create')}
              block
            >
              {t('create')}
            </Button>
          ) : (
            <Row gutter={[24, 24]}>
              <Col span={20}>
                <Typography.Title level={3}>
                  <span className="text-primary">{t('menu-hub-employee')}</span>
                </Typography.Title>
              </Col>
              <Col span={4} style={{ textAlign: 'end' }}>
                {FilterPermission('isCreate') && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push('./hub-employee/create')}
                    style={{ width: '120px' }}
                    block
                  >
                    {t('create')}
                  </Button>
                )}
              </Col>
            </Row>
          )}
          <Form layout="vertical" form={form} onFinish={onFinishSearch}>
            <Row gutter={[8, 8]} align="middle">
              {roleLevel === 'SAD' ? (
                <Col
                  xs={{ span: roleLevel === 'SAD' ? 24 : 12 }}
                  lg={{ span: roleLevel === 'SAD' ? 4 : 6 }}
                >
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
                </Col>
              ) : (
                <></>
              )}
              {roleLevel == 'SAD' || roleLevel == 'COM' ? (
                <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                  <Form.Item label={t('hub')} name="hubId">
                    <Select
                      defaultValue={t('all-select')}
                      onChange={handleFilterHubChange}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="">{t('all-select')}</Option>
                      {hubData &&
                        hubData.map((item) => (
                          <Option key={item.hubId}>{item.hubName}</Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              ) : (
                <></>
              )}
              {roleLevel == 'COM' || roleLevel == 'HUB' ? (
                <Col
                  xs={{ span: roleLevel === 'SAD' ? 24 : 12 }}
                  lg={{ span: roleLevel === 'SAD' ? 4 : 6 }}
                >
                  <Form.Item name="search" label="&nbsp;">
                    <Input placeholder={t('search')} allowClear />
                  </Form.Item>
                </Col>
              ) : (
                <></>
              )}
              <Col
                xs={{ span: roleLevel === 'SAD' ? 12 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 6 : 2 }}
              >
                {roleLevel === 'SAD' ? (
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
                xs={{ span: roleLevel === 'SAD' ? 12 : 0 }}
                lg={{ span: roleLevel === 'SAD' ? 2 : 4 }}
              >
                <Form.Item label="&nbsp;">
                  {roleLevel === 'SAD' ? (
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
            </Row>
          </Form>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }}>
              <Table
                scroll={{ x: 500 }}
                style={{ cursor: 'pointer' }}
                dataSource={manageDriverData}
                pagination={{
                  total: manageDriverData?.length || 0,
                  showTotal: (total, range) => `${t('show')}
                  ${range[0]}  ${t('to')} ${range[1]} ${t('from')} ${total} ${t(
                    'record'
                  )}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(`./hub-employee/${record.userId}`);
                    dispatch(
                      allAction.manageDriverAction.setActionPage('view')
                    );
                  },
                })}
              >
                <Column
                  title={t('order')}
                  width={80}
                  dataIndex="id"
                  key="id"
                  align="center"
                />

                {roleLevel === 'SAD' ? (
                  <Column
                    title={t('company')}
                    width={100}
                    dataIndex="companyName"
                    key="companyName"
                  />
                ) : (
                  <></>
                )}

                {roleLevel == 'SAD' || roleLevel == 'COM' ? (
                  <Column
                    title={t('hub-name')}
                    width={80}
                    dataIndex="hubName"
                    key="hubName"
                  />
                ) : (
                  <></>
                )}

                <Column
                  title={t('manage-driver-fistname-last-name')}
                  width={100}
                  dataIndex="name"
                  key="name"
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
                  title={t('manage-driver-phone-number')}
                  width={100}
                  dataIndex="phone"
                  key="phone"
                />
              </Table>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default ManageDriver;
