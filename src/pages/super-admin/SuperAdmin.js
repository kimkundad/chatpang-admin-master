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
} from 'antd';
import { useHistory } from 'react-router-dom';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';

const { Column } = Table;

const SuperAdmin = (props) => {
  const { superAdminData } = useSelector((state) => state.superAdminReducer);
  const { permission } = useSelector((state) => state.authenReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
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
    window.scrollTo(0, 0);
    dispatch(allAction.superAdminAction.getSuperAdminData())
      .then(() => {})
      .catch((e) => message.error(e.message));

    form.setFieldsValue({
      search: '',
      isActive: '',
    });
  }, []);

  const onFinishSearch = (value) => {
    dispatch(allAction.superAdminAction.getSuperAdminData(value))
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row>
            <Col xs={24}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('super-admin')}</span>
              </Typography.Title>
            </Col>
            <Col xs={24}>
              <Form
                layout="vertical"
                name="listSP"
                form={form}
                onFinish={onFinishSearch}
              >
                <Row gutter={[8, 8]} align="middle">
                  <Col xs={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item name="search">
                      <Input placeholder={t('search')} allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 12 }} lg={{ span: 4 }}>
                    <Form.Item>
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
                            onClick={() => history.push('./super-admin/create')}
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
                                  history.push('./super-admin/create')
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
                </Row>
              </Form>
              <Row gutter={[24, 24]}>
                <Col xs={{ span: 24 }}>
                  <Table
                    scroll={{ x: 500 }}
                    style={{ cursor: 'pointer' }}
                    onRow={(record) => ({
                      onClick: () => {
                        history.push(`./super-admin/${record.userId}`);
                        dispatch(
                          allAction.superAdminAction.setActionPage('view')
                        );
                      },
                    })}
                    pagination={{
                      total: superAdminData?.length || 0,
                      showTotal: (total, range) =>
                        `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                          'from'
                        )} ${total} ${t('record')}`,
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                    }}
                    dataSource={superAdminData}
                  >
                    <Column
                      title={t('no')}
                      width={50}
                      dataIndex="key"
                      key="key"
                      align="center"
                    />
                    <Column
                      title={t('username')}
                      width={200}
                      dataIndex="userData"
                      key="userData"
                      ellipsis
                      render={(text, row) => (
                        <>
                          <Badge
                            status={row?.isActive ? 'success' : 'error'}
                            text={text?.name}
                          />
                        </>
                      )}
                    />
                    <Column
                      title={t('email')}
                      width={200}
                      dataIndex="email"
                      key="email"
                      ellipsis
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

export default SuperAdmin;
