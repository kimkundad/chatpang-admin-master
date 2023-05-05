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

import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import TestInput from './TestInput';

const Test = (props) => {
  console.log('ggg:');
  const history = useHistory();
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { pageCode } = props;

  const { userData } = useSelector((state) => state.userManagementReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel } = useSelector((state) => state.authenReducer);

  const [filteredInfo, setFilteredInfo] = useState([]);
  const list = [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  const toAdd = (add) => {
    add();
    list.push('aaaa');
  };

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

            <Form form={form} name="dynamic_form_item" onFinish={onFinish}>

              <Form.List
                name="names"
                rules={[
                  {
                    validator: async (_, names) => {
                      if (!names || names.length < 2) {
                        return Promise.reject(new Error('At least 2 passengers'));
                      }
                    },
                  },
                ]}
              >

                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <TestInput
                        key={field.key}
                        field={field}
                        index={index}
                      />
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => toAdd(add)}
                        style={{ width: '60%' }}
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add('The head item', 0);
                        }}
                        style={{ width: '60%', marginTop: '20px' }}
                        icon={<PlusOutlined />}
                      >
                        Add field at head
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
          {/* </Col>
          </Row> */}
        </Layout>
      </Spin>
    </>
  );
};

export default Test;
