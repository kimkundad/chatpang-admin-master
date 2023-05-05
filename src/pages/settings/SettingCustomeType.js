/* eslint-disable react/prop-types */
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
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import allAction from '../../app/actions/index';

const { Column } = Table;
const { Option } = Select;

const SettingCustomeType = (props) => {
  const { settingCustomeType, companyData } = useSelector(
    (state) => state.settingCustomeTypeReducer
  );
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, roleLevel, companyId } = useSelector(
    (state) => state.authenReducer
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [companyIdBySelect, setCompanyIdBySelect] = useState(null);
  const [form] = Form.useForm();
  const history = useHistory();

  const checkNullCompanyId =
    roleLevel === 'SAD' ? companyIdBySelect : companyId;
  const { pageCode } = props;

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(
      allAction.settingCustomeTypeAction.getSettingCustomeType(
        checkNullCompanyId
      )
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
    form.setFieldsValue({
      search: '',
      isActive: '',
    });
  }, []);

  const handleFilterChange = (value) => {
    setCompanyIdBySelect(value);
    const obj = {
      companyId: value,
    };
    dispatch(allAction.settingCustomeTypeAction.getSettingCustomeType(obj))
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const onFinishSearch = (value) => {
    if (roleLevel === 'SAD') {
      if (value.companyId == null) {
        dispatch(
          allAction.settingCustomeTypeAction.filterSettingCustomeType(value)
        )
          .then(() => {})
          .catch((e) => message.error(e.message));
      } else {
        dispatch(
          allAction.settingCustomeTypeAction.filterSettingCustomeType(value)
        )
          .then(() => {})
          .catch((e) => message.error(e.message));
      }
    } else {
      const obj = {
        search: value.search,
        companyId,
      };
      dispatch(allAction.settingCustomeTypeAction.filterSettingCustomeType(obj))
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
                  <span className="text-primary">
                    {t('menu-setting-customer-type')}
                  </span>
                </Typography.Title>
              </Col>
            </Row>
          ) : (
            ''
          )}
          {isMobile ? (
            FilterPermission('isCreate') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => history.push('./setting-customer-type/create')}
                block
              >
                {t('create')}
              </Button>
            )
          ) : (
            <Row gutter={[24, 24]}>
              <Col span={20}>
                <Typography.Title level={3}>
                  <span className="text-primary">
                    {t('menu-setting-customer-type')}
                  </span>
                </Typography.Title>
              </Col>
              <Col span={4} style={{ textAlign: 'end' }}>
                {FilterPermission('isCreate') && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      history.push('./setting-customer-type/create')
                    }
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
              <Col
                xs={{ span: roleLevel === 'SAD' ? 24 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 4 : 6 }}
              >
                {roleLevel === 'SAD' ? (
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
                dataSource={settingCustomeType}
                pagination={{
                  total: settingCustomeType?.length || 0,
                  showTotal: (total, range) => `${t('show')}
                  ${range[0]}  ${t('to')} ${range[1]} ${t('from')} ${total} ${t(
                    'record'
                  )}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(
                      `./setting-customer-type/${record.customerTypeId}`
                    );
                    dispatch(
                      allAction.settingCustomeTypeAction.setActionPage('view')
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

                <Column
                  title={t('menu-setting-customer-type')}
                  width={100}
                  dataIndex="description"
                  key="description"
                />

                <Column
                  title={t('setting-agency-degree-discount')}
                  width={100}
                  dataIndex="discount"
                  key="discount"
                />
              </Table>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default SettingCustomeType;
