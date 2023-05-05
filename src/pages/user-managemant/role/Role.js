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

const Role = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;

  const { roleData } = useSelector((state) => state.roleManagementReducer);
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
    dispatch(allAction.roleManagementAction.getRoleData())
      .then()
      .catch((e) => message.error(e.message));
  }, []);

  const onSearch = (value) => {
    console.log('serach', value);

    dispatch(allAction.roleManagementAction.getRoleData(value))
      .then()
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
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={18}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('role-management')}</span>
              </Typography.Title>
            </Col>
            {FilterPermission('isCreate') && (
              <Col xs={24} sm={6}>
                <Button
                  style={{ float: 'right', width: isMobile ? '100%' : '120px' }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push('./permission/create')}
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
                dataSource={roleData}
                scroll={{ x: 1000 }}
                style={{ cursor: 'pointer' }}
                onRow={(record) => ({
                  onClick: () => {
                    history.push(`./permission/${record.roleId}`);
                    dispatch(allAction.superAdminAction.setActionPage('view'));
                  },
                })}
                onChange={handleChange}
                pagination={{
                  total: roleData?.length || 0,
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
                    title={t('role-level')}
                    ellipsis
                    dataIndex="roleLevelData"
                    key="levelName"
                    filters={[
                      { text: 'Company', value: 'COM' },
                      { text: 'Hub', value: 'HUB' },
                      { text: 'Agency', value: 'AGN' },
                    ]}
                    filteredValue={filteredInfo?.levelName || null}
                    onFilter={(value, record) => {
                      console.log(value, record);
                      return record.roleLevel.includes(value);
                    }}
                    render={(text) => text?.levelName || '-'}
                  />
                )}
                {FilterUserLevel(['SAD']) && (
                  <Column
                    width={200}
                    title={t('company-name')}
                    ellipsis
                    dataIndex="roleDetailData"
                    key="companyName"
                    render={(text) => text?.companyData?.companyName || '-'}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM']) && (
                  <Column
                    width={150}
                    title={t('hub')}
                    ellipsis
                    dataIndex="roleDetailData"
                    key="hubData"
                    render={(text) => text?.hubData?.hubName || '-'}
                  />
                )}
                {/* {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
                  <Column
                    width={150}
                    title={t('agency')}
                    ellipsis
                    dataIndex="roleDetailData"
                    key="agencyData"
                    render={(text) => text?.agencyData?.agencyName || '-'}
                  />
                )} */}
                <Column
                  title={t('role-name')}
                  width={200}
                  dataIndex="roleName"
                  key="roleName"
                  ellipsis
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

export default Role;
