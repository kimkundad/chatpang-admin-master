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
  Image,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import truck from '../assets/truck.png';

const NotFound = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;

  const { userData } = useSelector((state) => state.userManagementReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel } = useSelector((state) => state.authenReducer);

  const [filteredInfo, setFilteredInfo] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Spin spinning={false} tip="Loading...">
        <Layout>
          {/* <Row gutter={[8, 8]}>
            <Col xs={24} sm={18}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('menu-dashboard')}</span>
              </Typography.Title>
            </Col>
          </Row> */}
          {/* <Row justify="center">
            <Col span={24} flex={1}> */}
          <div
            style={{
              // backgroundColor: 'yellow',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 'calc(100vh - 150px)',
            }}
          >
            <Image
              height={400}
              width={550}
              style={{ padding: '20px 10px' }}
              src={truck}
              preview={false}
            />
          </div>
          {/* </Col>
          </Row> */}
        </Layout>
      </Spin>
    </>
  );
};

export default NotFound;
