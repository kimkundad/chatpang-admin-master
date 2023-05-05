import React, { useEffect } from 'react';
import { Input, Form, Button, Row, Col, Spin, Typography, message } from 'antd';
import { useHistory } from 'react-router-dom';

import { RollbackOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';

function Account() {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { userDetail } = useSelector((state) => state.userManagementReducer);
  const history = useHistory();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(allAction.userManagementAction.getMeDetail())
      .then()
      .catch((e) => message.error(e.message));
  }, []);

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Row>
          <Col xs={24}>
            <Typography.Title level={4}>
              <span className="text-primary">{t('setting-profile')}</span>
              {/* <span className="text-primary">ตั้งค่าโปรไฟล์</span> */}
            </Typography.Title>
          </Col>

          <Col xs={24} style={{ paddingTop: 30 }}>
            <Form
              layout="horizontal"
              name="search"
              form={form}
              // onFinish={onFinish}
              {...formItemLayout}
            >
              <Col {...itemLayout}>
                <Form.Item
                  label={t('username')}
                  name="name"
                  rules={[{ required: true, message: 'Please input Name!' }]}
                >
                  <span>{userDetail?.userData?.name || '-'}</span>
                </Form.Item>
              </Col>
              <Col {...itemLayout}>
                <Form.Item
                  label={t('email')}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input E-mail!',
                      type: 'email'
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (/[^A-Za-z\d|^@+_.\-]/g.test(value)
                        ) {
                          return Promise.reject(
                            new Error(
                              'Incorrect characters.'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <span>{userDetail?.email || '-'}</span>
                </Form.Item>
              </Col>
              <Col {...itemLayout}>
                <Form.Item
                  label={t('phone')}
                  name="phoneNo"
                  rules={[
                    { required: true, message: 'Please input Phone No!' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || !isNaN(value)) {
                          if (value.length === 9 || value.length === 10) {
                            if (/[^\d]/g.test(value)) {
                              return Promise.reject(
                                new Error(
                                  'Incorrect characters.'
                                )
                              );
                            }
  
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            'Phone Number Length 9-10 Digits!',
                          );
                        }
                        
                        return Promise.reject('Phone Number Incorrect Format!');
                      },
                    }),
                  ]}
                >
                  <span>{userDetail?.phoneNo || '-'}</span>
                </Form.Item>
              </Col>
              <Form.Item style={{ marginTop: '50px' }}>
                {isMobile ? (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Button
                          type="default"
                          icon={<RollbackOutlined />}
                          block
                          onClick={() => {
                            history.push('./');
                            dispatch(
                              allAction.mainAction.onSelectedHeaderKey([])
                            );
                            dispatch(
                              allAction.mainAction.onSelectedKey('/dashboard')
                            );
                          }}
                        >
                          {t('cancel')}
                        </Button>
                      </Col>
                      {/* <Col xs={24}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          // icon={<SaveOutlined />}
                          block
                        >
                          {t('save')}
                        </Button>
                      </Col> */}
                    </Row>
                  </>
                ) : (
                  <>
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      style={{ width: '100px', float: 'right', marginLeft: 15 }}
                      onClick={() => {
                        history.push('./');
                        dispatch(allAction.mainAction.onSelectedHeaderKey([]));
                        dispatch(
                          allAction.mainAction.onSelectedKey('/dashboard')
                        );
                      }}
                    >
                      {t('cancel')}
                    </Button>
                    {/* <Button
                      type="primary"
                      htmlType="submit"
                      // icon={<SaveOutlined />}
                      style={{ width: '100px', float: 'right' }}
                    >
                      {t('save')}
                    </Button> */}
                  </>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Spin>
    </>
  );
}

export default Account;
