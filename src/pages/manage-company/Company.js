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

const Company = (props) => {
  const { companyData } = useSelector((state) => state.companyReducer);
  const { permission } = useSelector((state) => state.authenReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);

  const [filteredInfo, setFilteredInfo] = useState({});

  const dispatch = useDispatch();

  const {
    match: {
      params: { companyId },
    },
    pageCode,
  } = props;

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
    dispatch(allAction.companyAction.getCompanyData())
      .then(() => {})
      .catch((e) => message.error(e.message));

    form.setFieldsValue({
      search: '',
      isActive: '',
    });
  }, []);

  const onFinishSearch = (value) => {
    dispatch(allAction.companyAction.getCompanyData(value))
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
            <Col xs={24}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('company-management')}</span>
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
                            onClick={() => history.push('./company/create')}
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
                                onClick={() => history.push('./company/create')}
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
                    scroll={{ x: 1000 }}
                    style={{ cursor: 'pointer' }}
                    onChange={handleChange}
                    onRow={(record) => ({
                      onClick: () => {
                        history.push(`./company/${record.companyId}`);
                        dispatch(
                          allAction.superAdminAction.setActionPage('view')
                        );
                      },
                    })}
                    pagination={{
                      total: companyData?.length || 0,
                      showTotal: (total, range) =>
                        `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                          'from'
                        )} ${total} ${t('record')}`,
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                    }}
                    dataSource={companyData}
                  >
                    <Column
                      title={t('no')}
                      width={80}
                      dataIndex="key"
                      key="key"
                      align="center"
                    />
                    <Column
                      title={t('company-code')}
                      width={120}
                      dataIndex="companyCode"
                      key="companyCode"
                      filters={[
                        { text: 'Active', value: true },
                        { text: 'Inactive', value: false },
                      ]}
                      filteredValue={filteredInfo?.companyCode || null}
                      onFilter={(value, record) =>
                        // console.log(value, record);
                        record.isActive == value
                      }
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
                      title={t('company-name')}
                      width={150}
                      dataIndex="companyName"
                      key="companyName"
                      ellipsis
                      render={(text) => text || '-'}
                    />
                    <Column
                      title={t('contact-person')}
                      width={150}
                      dataIndex="contactName"
                      key="contactName"
                      ellipsis
                      render={(text) => text || '-'}
                    />
                    <Column
                      title={t('phone')}
                      width={150}
                      dataIndex="phoneNo"
                      key="phoneNo"
                      ellipsis
                      render={(text) => text || '-'}
                    />
                    <Column
                      title={t('address')}
                      width={200}
                      dataIndex="address"
                      key="address"
                      ellipsis
                      render={(text) => text || '-'}
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
