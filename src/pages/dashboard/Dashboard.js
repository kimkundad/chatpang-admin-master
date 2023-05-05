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
  Card,
} from 'antd';
import { format } from 'date-fns';

import { Bar, Chart } from 'react-chartjs-2';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import truck from '../../assets/truck.png';

import SectionFilter from './SectionFilter';
import SectionCharts from './SectionCharts';

const Dashboard = (props) => {
  const { pageCode } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Bar.register(ChartDataLabels);

  return (
    <>
      <Spin spinning={false} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={18}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('menu-dashboard')}</span>
              </Typography.Title>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col sm={24}>
              <SectionFilter pageCode={pageCode} />
            </Col>
          </Row>
          <SectionCharts pageCode={pageCode} />
        </Layout>
      </Spin>
    </>
  );
};

export default Dashboard;
