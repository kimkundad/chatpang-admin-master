import {
  Form,
  Input,
  Button,
  message,
  Layout,
  Col,
  Row,
  Spin,
  Card,
  Modal,
} from 'antd';
import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import allAction from '../app/actions/index';

const { Content } = Layout;

const FirstLogin = (props) => {
  const { isLoading } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.resetFields();
  }, []);

  const onFinish = (value) => {
    delete value.confirmPassword;
    Modal.confirm({
      title: 'Do you want to update password ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log(value);

        dispatch(allAction.authenAction.updateFirstPassword(value))
          .then(() => {
            message.success('Update Success!');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <>
      <Layout style={{ minHeight: '100vh', backgroundColor: ' #224b99' }}>
        <Content style={{ overflow: 'hidden' }}>
          <Row
            gutter={24}
            justify="center"
            align="middle"
            style={{ minHeight: '100vh' }}
          >
            <Col lg={{ span: 8 }} md={{ span: 10 }} xs={{ span: 20 }}>
              <Card style={{ borderRadius: 15 }}>
                <Form layout="vertical" name="login" onFinish={onFinish}>
                  <h1 style={{ textAlign: 'center' }}>
                    {t('change-pass-first')}
                  </h1>
                  <Form.Item
                    label={t('password')}
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input new password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (/[^A-Za-z\d|^~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.?/]/g.test(value)
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
                    <Input.Password
                      autocomplete="new-password"
                      placeholder={t('password')}
                      onChange={() => {
                        form.validateFields(['confirmPassword']);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t('confirm-password')}
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input Confirm New Password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (
                            !value ||
                            getFieldValue('newPassword') === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              'The two passwords that you entered do not match!'
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      autocomplete="new-password"
                      placeholder={t('confirm-password')}
                      onChange={() => {
                        form.validateFields(['newPassword']);
                      }}
                    />
                  </Form.Item>
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Form.Item>
                        <Button
                          style={{ borderRadius: 5 }}
                          type="primary"
                          htmlType="submit"
                          block
                        >
                          {t('submit')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default FirstLogin;
