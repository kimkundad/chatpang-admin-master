import {
  Form, Input, Button, message, Layout, Col, Row, Spin, Select, Typography, Table,
} from 'antd';
import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import {
  FileOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import allAction from '../../app/actions/index';

const { Column } = Table;
const { Option } = Select;

const Customers = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { customerData } = useSelector((state) => state.customerReducer);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(allAction.customerAction.getCustomerData());
  }, []);

  const onFinish = (values) => {
    // console.log('Success:', values);
    // dispatch(login(values.username))
    dispatch(allAction.customerAction.getCustomerData(values));
  };

  return (
    <>
      <Spin style={{ verticalAlign: 'middle', minHeight: '80vh' }} spinning={isLoading} tip="Loading...">

        <Layout style={{ minHeight: '100vh' }}>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }}>
              <Typography.Title level={3}>{t('customer')}</Typography.Title>
            </Col>
          </Row>

          <Form
            layout="vertical"
            name="customer"
            onFinish={onFinish}
          >
            <Row gutter={[8, 8]} align="middle">
              <Col xs={{ span: 24 }} lg={{ span: 5 }}>

                <Form.Item>
                  <Select placeholder={t('search')} defaultValue="all">
                    <Option value="all">
                      ค้นหาจากทั้งหมด
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 5 }}>

                <Form.Item>
                  <Input placeholder={t('search')} />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 2 }}>

                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: isMobile ? '100%' : '100px' }}>{t('search')}</Button>
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 10, offset: 2 }} xxl={{ span: 8, offset: 4 }}>
                <Row gutter={[8, 8]} justify="end">
                  <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 10 }}>

                    <Form.Item>
                      <Button type="default" icon={<FileOutlined />} style={{ width: isMobile ? '100%' : '180px' }}>{t('template-file')}</Button>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 10 }}>

                    <Form.Item>
                      <Button type="primary" icon={<DownloadOutlined />} style={{ width: isMobile ? '100%' : '180px' }}>{t('import-file')}</Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          <Row gutter={[24, 24]}>

            <Col xs={{ span: 24 }}>
              <Table scroll={{ x: 1000 }} dataSource={customerData}>
                <Column title="Customer ID" width={150} sorter dataIndex="customerId" key="customerId" />
                <Column title="Zone" width={150} dataIndex="zone" key="zone" />
                <Column title="Address" width={200} dataIndex="address" key="address" />
                <Column title="Lat, Long" width={150} dataIndex="latLong" key="latLong" />
                <Column title="Lat, Long Diff (km.)" width={150} dataIndex="latLongDiff" key="latLongDiff" />
                <Column title="Remark" dataIndex="remark" width={150} key="remark" />
              </Table>
            </Col>

          </Row>
        </Layout>
      </Spin>

    </>
  );
};

export default Customers;
