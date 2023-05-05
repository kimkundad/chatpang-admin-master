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

import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';

import FilterData from '../component/FilterData';

const { Column } = Table;

const User = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;

  const { userData } = useSelector((state) => state.userManagementReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel } = useSelector((state) => state.authenReducer);

  const [filteredInfo, setFilteredInfo] = useState({});

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.userManagementAction.getUserData())
      .then()
      .catch((e) => message.error(e.message));
  }, []);
  const onSearch = (value) => {
    dispatch(allAction.userManagementAction.getUserData(value))
      .then()
      .catch((e) => message.error(e.message));
  };

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    // setSortedInfo(sorter);
  };

  useEffect(() => {
    console.log('filteredInfo', filteredInfo);
  }, [filteredInfo]);

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={18}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('user-management')}</span>
              </Typography.Title>
            </Col>
            {FilterPermission('isCreate') && (
              <Col xs={24} sm={6}>
                <Button
                  style={{ float: 'right', width: isMobile ? '100%' : '120px' }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push('./user/create')}
                >
                  {t('create')}
                </Button>
              </Col>
            )}

            <Col xs={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
            <Col xs={24}>
              <Table
                dataSource={userData}
                scroll={{ x: 1000 }}
                style={{ cursor: 'pointer' }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(`./user/${record.userId}`);
                    dispatch(allAction.superAdminAction.setActionPage('view'));
                  },
                })}
                onChange={handleChange}
                pagination={{
                  total: userData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              >
                {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
                  <Column
                    width={100}
                    title={t('user-level')}
                    ellipsis
                    dataIndex="userData"
                    key="userLevelName"
                    filters={[
                      { text: 'Company', value: 'COM' },
                      { text: 'Hub', value: 'HUB' },
                      { text: 'Agency', value: 'AGN' },
                    ]}
                    filteredValue={filteredInfo?.userLevelName || null}
                    onFilter={(value, record) => {
                      console.log(value, record.userData.userLevel);
                      return record.userData.userLevel.includes(value);
                    }}
                    render={(text) => text?.levelData?.levelName || '-'}
                  />
                )}
                {FilterUserLevel(['SAD']) && (
                  <Column
                    width={200}
                    title={t('company-name')}
                    ellipsis
                    dataIndex="userData"
                    key="companyName"
                    render={(text) => text?.companyData?.companyName || '-'}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM']) && (
                  <Column
                    width={150}
                    title={t('hub')}
                    ellipsis
                    dataIndex="userData"
                    key="hubData"
                    render={(text) => text?.hubData?.hubName || '-'}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
                  <Column
                    width={150}
                    title={t('agency')}
                    ellipsis
                    dataIndex="userData"
                    key="agencyData"
                    render={(text) => text?.agencyData?.agencyCode || '-'}
                  />
                )}
                <Column
                  title={t('role-name')}
                  width={200}
                  dataIndex="userData"
                  key="userData"
                  filters={[
                    { text: 'Active', value: true },
                    { text: 'Inactive', value: false },
                  ]}
                  filteredValue={filteredInfo?.userData || null}
                  onFilter={(value, record) => {
                    console.log(value, record);
                    return record.isActive == value;
                  }}
                  ellipsis
                  render={(text, row) => (
                    <>
                      <Badge
                        status={row?.isActive ? 'success' : 'error'}
                        text={text?.roleData?.roleName}
                      />
                    </>
                  )}
                />
                <Column
                  title={t('username')}
                  width={200}
                  dataIndex="userData"
                  key="userData"
                  // filters={[
                  //   { text: 'Active', value: true },
                  //   { text: 'Inaction', value: false },
                  // ]}
                  // filteredValue={filteredInfo?.userData || null}
                  // onFilter={(value, record) => {
                  //   console.log(value, record);
                  //   return record.isActive == value;
                  // }}
                  ellipsis
                  render={(text) => (
                    <>
                      {text?.name || '-'}
                      {/* <Badge
                        status={row?.isActive ? 'success' : 'error'}
                        text={text?.name}
                      /> */}
                    </>
                  )}
                />
                <Column
                  width={200}
                  title={t('email')}
                  ellipsis
                  dataIndex="email"
                  key="email"
                  render={(text) => text || '-'}
                />
                <Column
                  width={200}
                  title={t('phone')}
                  ellipsis
                  dataIndex="phoneNo"
                  key="phoneNo"
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

export default User;
