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
  Modal,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import allAction from '../../app/actions/index';

const { Column } = Table;
const { Option } = Select;

const SettingBank = (props) => {
  const { agencyBankData, companyData } = useSelector(
    (state) => state.settingBankReducer
  );
  const { permission, roleLevel, userLevel } = useSelector(
    (state) => state.authenReducer
  );
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const { pageCode } = props;

  const [form] = Form.useForm();

  const history = useHistory();

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.settingBankAction.getAgencyBankData())
      .then(() => {})
      .catch((e) => message.error(e.message));

    form.setFieldsValue({
      search: '',
      isActive: '',
    });
  }, []);

  const handleFilterChange = (value) => {
    setFilter(value);
    dispatch(
      allAction.settingBankAction.getAgencyBankDataSerachFilter(value, search)
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const onFinishSearch = (value) => {
    setSearch(value.search);
    dispatch(
      allAction.settingBankAction.getAgencyBankDataSerachFilter(
        filter,
        value.search
      )
    )
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
                <span className="text-primary">{t('setting-agency-bank')}</span>
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
                      showSearch
                      defaultValue={t('all-select')}
                      onChange={handleFilterChange}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
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
                      onClick={() => history.push('/setting-bank/create')}
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
                            onClick={() => history.push('/setting-bank/create')}
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
                scroll={{ x: 500 }}
                style={{ cursor: 'pointer' }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(`./setting-bank/${record.key}`);
                    dispatch(allAction.settingBankAction.setActionPage('view'));
                  },
                })}
                dataSource={agencyBankData}
                pagination={{
                  total: agencyBankData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
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
                    title={t('agency-name-company')}
                    width={200}
                    dataIndex="companyName"
                    key="companyName"
                  />
                ) : (
                  <></>
                )}

                <Column
                  title={t('setting-agency-code-bank')}
                  width={200}
                  dataIndex="bankCode"
                  key="bankCode"
                />

                <Column
                  title={t('setting-agency-name-bank')}
                  width={200}
                  dataIndex="bankName"
                  key="bankName"
                />
              </Table>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default SettingBank;
