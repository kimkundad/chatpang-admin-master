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
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import allAction from '../../app/actions/index';

const { Column } = Table;
const { Option } = Select;

const SettingDegree = (props) => {
  const { agencyLevelData, companyData } = useSelector(
    (state) => state.settingLevelReducer
  );
  const { permission, roleLevel } = useSelector((state) => state.authenReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const { t } = useTranslation();

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
    dispatch(allAction.settingLevelAction.getAgencyLevelData())
      .then(() => {})
      .catch((e) => message.error(e.message));
    form.setFieldsValue({
      search: '',
      isActive: '',
    });
  }, []);

  const onFinishSearch = (value) => {
    setSearch(value.search);
    dispatch(
      allAction.settingLevelAction.getAgencyLevelDataSerachFilter(
        filter,
        value.search
      )
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    dispatch(
      allAction.settingLevelAction.getAgencyLevelDataSerachFilter(value, search)
    )
      .then(() => {})
      .catch((e) => message.error(e.message));
  };

  const columns = [
    // {
    //   title: t('no'),
    //   dataIndex: 'no',
    //   key: 'no',
    //   width: 50,
    //   align: 'center',
    //   render: (text) => <Typography.Text>{text}</Typography.Text>,
    // },
    {
      title: t('agency-name-company'),
      dataIndex: 'company',
      key: 'company',
      width: 150,
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: t('setting-agency-degree-level'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: t('setting-agency-degree-discount'),
      dataIndex: 'discount',
      width: 200,
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'blue' : 'blue';
            if (tag === 'blue') {
              color = 'blue';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: t('setting-agency-degree-cod'),
      key: 'tags',
      dataIndex: 'cod',
      width: 200,
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'blue' : 'blue';
            if (tag === 'blue') {
              color = 'blue';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const columns_company = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 80,
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: t('setting-agency-degree-level'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: t('setting-agency-degree-discount'),
      dataIndex: 'discount',
      width: 200,
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'blue' : 'blue';
            if (tag === 'blue') {
              color = 'blue';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: t('setting-agency-degree-cod'),
      key: 'tags',
      dataIndex: 'cod',
      width: 200,
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'blue' : 'blue';
            if (tag === 'blue') {
              color = 'blue';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  let i = 0;
  const list = [];
  let data = {};
  if (agencyLevelData != undefined) {
    for (i = 0; i < agencyLevelData.length; i++) {
      const arrayCOD = JSON.parse(`[${agencyLevelData[i].agencyLevelCOD}]`);
      const arrayDiscount = JSON.parse(
        `[${agencyLevelData[i].agencyLevelDiscount}]`
      );
      console.log(agencyLevelData[i].companyData);
      data = {
        no: i + 1,
        key: agencyLevelData[i].agencyLevelId,
        company:
          agencyLevelData[i].companyData == null
            ? ''
            : agencyLevelData[i].companyData.companyName,
        name: agencyLevelData[i].agencyLevelName,
        discount: arrayDiscount.map((i) => `${i}%`),
        cod: arrayCOD.map((i) => `${i}%`),
      };

      list.push(data);
    }
  }

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }}>
              <Typography.Title level={3}>
                <span className="text-primary">
                  {t('setting-agency-degree')}
                </span>
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
                      onClick={() => history.push('/setting-level/create')}
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
                              history.push('/setting-level/create')
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
                columns={roleLevel == 'SAD' ? columns : columns_company}
                dataSource={list}
                style={{ fontFamily: 'KanitRegular' }}
                style={{ cursor: 'pointer' }}
                pagination={{
                  total: agencyLevelData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(`./setting-level/${record.key}`);
                    dispatch(
                      allAction.settingLevelAction.setActionPage('view')
                    );
                  },
                })}
              />
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default SettingDegree;
