import React from 'react';
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
  Card,
  message,
  Tabs,
} from 'antd';
import { useHistory } from 'react-router-dom';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';

import Account from './component/Account';
import Password from './component/Password';

const { TabPane } = Tabs;
export default function Setting() {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  return (
    <>
      <Layout>
        <Row>
          <Col xs={24}>
            <Typography.Title level={3}>
              {/* <span className="text-primary">{t('setting-account')}</span> */}
              <span className="text-primary">{t('setting')}</span>
            </Typography.Title>
          </Col>
          <Col xs={24}>
            <Card>
              <Tabs tabPosition="left">
                <TabPane tab={t('profile')} key="1">
                  <Account />
                </TabPane>
                <TabPane tab={t('security')} key="2">
                  <Password />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Layout>
    </>
  );
}
