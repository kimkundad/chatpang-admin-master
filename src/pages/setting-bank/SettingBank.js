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

const SettingBank = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;

  const { userData } = useSelector((state) => state.userManagementReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel } = useSelector((state) => state.authenReducer);

  const [filteredInfo, setFilteredInfo] = useState({});

  return (
    <>
      <Spin spinning={false} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={18}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('menu-setting-bank')}</span>
              </Typography.Title>
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default SettingBank;
