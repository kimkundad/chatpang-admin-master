/* eslint-disable  */
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
  Checkbox,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import {
  FileOutlined,
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';

const { Column } = Table;
const { Option } = Select;

const Agencys = (props) => {
  const { agencyData, companyData, hubData } = useSelector(
    (state) => state.agencyReducer
  );

  const { permission, roleLevel } = useSelector((state) => state.authenReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [hubFilter, setHubFilter] = useState('');
  const [isNoHub, setNoHub] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [hubName, setHubName] = useState('');
  const [agencys, setListAgencys] = useState([]);

  const history = useHistory();

  const [form] = Form.useForm();

  const { pageCode } = props;

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.agencyAction.getAgencyData())
      .then(() => {})
      .catch((e) => message.error(e.message));
  }, []);

  const [checkStrictly, setCheckStrictly] = useState(false);

  const handleFilterCompanyChange = (value) => {
    setListAgencys([]);
    if (value[0] != undefined) {
      setCompanyName(
        companyData.filter((item) => item.companyId == value)[0].companyName
      );
      setCompanyFilter(value);
    }
    dispatch(
      allAction.agencyAction.getAgencyDataSerachFilter(
        value,
        hubFilter,
        search,
        isNoHub,
        'company'
      )
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const handleFilterHubChange = (value) => {
    setHubFilter(value);
    dispatch(
      allAction.agencyAction.getAgencyDataSerachFilter(
        companyFilter,
        value,
        search,
        isNoHub,
        'hub'
      )
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const onFinishSearch = (value) => {
    console.log('search : ', value);
    setSearch(value.search);
    dispatch(
      allAction.agencyAction.getAgencyDataSerachFilter(
        companyFilter,
        hubFilter,
        value.search,
        isNoHub,
        'search'
      )
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const onCheckNohubs = (e) => {
    setNoHub(e.target.checked);
    dispatch(
      allAction.agencyAction.getAgencyDataSerachFilter(
        companyFilter,
        hubFilter,
        search,
        e.target.checked,
        'check'
      )
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    onSelect: (record, selected, selectedRows) => {
      if (selected) {
        let newArr = [...agencys];
        newArr[agencys.length] = record.agencyId;
        setListAgencys(newArr);
        setHubName(record.hubData);
      } else {
        const listAgency = agencys.filter(
          (agencyId) => agencyId !== record.agencyId
        );
        setListAgencys(listAgency);
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      var i = 0;
      setListAgencys([]);
      if (selected) {
        let newArr = [...agencys];
        for (i = 0; i < selectedRows.length; i++) {
          newArr[i] = selectedRows[i].agencyId;
        }
        setListAgencys(newArr);
        setHubName(selectedRows[0].hubData);
      } else {
        setListAgencys([]);
      }
    },
  };

  return (
    <>
      <Spin
        style={{ verticalAlign: 'middle', minHeight: '80vh' }}
        spinning={isLoading}
        tip="Loading..."
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }}>
              <Typography.Title level={3}>
                <span className="text-primary"> {t('agency')}</span>
              </Typography.Title>
            </Col>
          </Row>

          <Form layout="vertical" form={form} onFinish={onFinishSearch}>
            <Row gutter={[8, 8]} align="middle">
              {roleLevel == 'SAD' ? (
                <>
                  <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                    <Form.Item label={t('company')} name="companyId">
                      <Option value="">{t('all-select')}</Option>
                      {roleLevel == 'SAD' ? (
                        <Select
                          showSearch
                          defaultValue={t('all-select')}
                          onChange={handleFilterCompanyChange}
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
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                    <Form.Item label={t('hub')} name="hubId">
                      <Option value="">{t('all-select')}</Option>
                      {roleLevel == 'SAD' || roleLevel == 'COM' ? (
                        <Select
                          showSearch
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
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 12 }} lg={{ span: 4 }}>
                    <Form.Item name="search" label="&nbsp;">
                      <Input placeholder={t('search')} allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 12 }} lg={{ span: 2 }}>
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
                  </Col>

                  <Col xs={{ span: 12 }} lg={{ span: 3 }}>
                    <Form.Item label="&nbsp;">
                      <Checkbox
                        style={{
                          fontFamily: 'KanitRegular',
                          paddingLeft: isMobile ? 0 : 24,
                        }}
                        onChange={onCheckNohubs}
                      >
                        {t('no-hubs')}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </>
              ) : roleLevel == 'HUB' ? (
                <>
                  <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                    <Form.Item name="search" label="&nbsp;">
                      <Input placeholder={t('search')} allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 12 }} lg={{ span: 2 }}>
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
                  </Col>

                  <Col xs={{ span: 12 }} lg={{ span: 3 }}>
                    <Form.Item label="&nbsp;">
                      <Checkbox
                        style={{
                          fontFamily: 'KanitRegular',
                          paddingLeft: isMobile ? 0 : 24,
                        }}
                        onChange={onCheckNohubs}
                      >
                        {t('no-hubs')}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}></Col>
                </>
              ) : (
                <>
                  <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                    <Form.Item label={t('hub')} name="hubId">
                      <Option value="">{t('all-select')}</Option>
                      {roleLevel == 'SAD' || roleLevel == 'COM' ? (
                        <Select
                          showSearch
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
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                    <Form.Item name="search" label="&nbsp;">
                      <Input placeholder={t('search')} allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 12 }} lg={{ span: 2 }}>
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
                  </Col>

                  <Col xs={{ span: 12 }} lg={{ span: 3 }}>
                    <Form.Item label="&nbsp;">
                      <Checkbox
                        style={{
                          fontFamily: 'KanitRegular',
                          paddingLeft: isMobile ? 0 : 24,
                        }}
                        onChange={onCheckNohubs}
                      >
                        {t('no-hubs')}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 2 }}></Col>
                </>
              )}

              <Col
                // xs={{ span: 24 }}
                lg={{ span: 5, offset: 2 }}
                xxl={{ span: 5, offset: 2 }}
              >
                <Form.Item label="&nbsp;">
                  {isMobile ? (
                    roleLevel == 'HUB' ? (
                      <>
                        {FilterPermission('isCreate') && (
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              history.push('/agency-management/create')
                            }
                            block
                          >
                            {t('create')}
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {FilterPermission('isCreate') && (
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              history.push('/agency-management/create')
                            }
                            block
                          >
                            {t('create')}
                          </Button>
                        )}
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          style={{ marginTop: 24 }}
                          onClick={() => {
                            history.push({
                              pathname: '/agency-management-sethub',
                              search: '',
                              state: {
                                companyName: companyName,
                                agencyId: agencys,
                                companyId: companyFilter,
                                hubName: hubName,
                              },
                            });
                            localStorage.setItem('companyName', companyName);
                            localStorage.setItem(
                              'agencyId',
                              JSON.stringify(agencys)
                            );
                            localStorage.setItem('companyId', companyFilter);
                            localStorage.setItem('hubName', hubName);
                          }}
                          block
                          disabled={
                            roleLevel == 'SAD' && companyFilter == ''
                              ? true
                              : agencys.length > 0
                              ? false
                              : true
                          }
                        >
                          {t('set-hub')}
                        </Button>
                      </>
                    )
                  ) : (
                    <Row gutter={[8, 8]} justify="end">
                      <Col>
                        {FilterPermission('isCreate') &&
                          (roleLevel == 'HUB' ? (
                            <></>
                          ) : (
                            <Button
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() =>
                                history.push('/agency-management/create')
                              }
                              style={{ width: 106, marginRight: 8 }}
                            >
                              {t('create')}
                            </Button>
                          ))}
                        {roleLevel == 'HUB' ? (
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              history.push('/agency-management/create')
                            }
                            style={{ width: 106, marginRight: 8 }}
                          >
                            {t('create')}
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            disabled={
                              roleLevel == 'SAD' && companyFilter == ''
                                ? true
                                : agencys.length > 0
                                ? false
                                : true
                            }
                            icon={<PlusOutlined />}
                            onClick={() => {
                              history.push({
                                pathname: '/agency-management-sethub',
                                search: '',
                                state: {
                                  companyName: companyName,
                                  agencyId: agencys,
                                  companyId: companyFilter,
                                  hubName: hubName,
                                },
                              });

                              localStorage.setItem('companyName', companyName);
                              localStorage.setItem(
                                'agencyId',
                                JSON.stringify(agencys)
                              );
                              localStorage.setItem('companyId', companyFilter);
                              localStorage.setItem('hubName', hubName);
                            }}
                            style={{ width: 106 }}
                          >
                            {t('set-hub')}
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
                scroll={{ x: 1000 }}
                dataSource={agencyData}
                style={{ fontFamily: 'KanitRegular' }}
                rowSelection={{ ...rowSelection, checkStrictly }}
                style={{ cursor: 'pointer' }}
                pagination={{
                  total: agencyData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(`./agency-management/${record.key}`);
                    dispatch(allAction.agencyAction.setActionPage('view'));
                  },
                })}
              >
                {roleLevel == 'SAD' ? (
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
                    dataIndex="hubData"
                    key="hubData"
                  />
                ) : (
                  <></>
                )}
                <Column
                  title={t('agency-code')}
                  width={80}
                  dataIndex="agencyCode"
                  key="agencyCode"
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
                  title={t('agency-name')}
                  width={150}
                  dataIndex="firstName"
                  key="firstName"
                />
                <Column
                  title={t('agency-last-name')}
                  width={150}
                  dataIndex="lastName"
                  key="lastName"
                />
                <Column
                  title={t('information-phone')}
                  dataIndex="phoneNo"
                  width={100}
                  key="phoneNo"
                />
                <Column
                  title={t('agency-tag-no')}
                  dataIndex="taxNumber"
                  width={100}
                  key="taxNumber"
                />
                <Column
                  title={t('address-provice')}
                  dataIndex="provinceName"
                  width={90}
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

export default Agencys;
