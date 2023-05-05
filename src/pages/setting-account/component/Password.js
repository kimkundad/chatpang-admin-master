import React, { useEffect } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Modal,
  Layout,
  Card,
  message,
} from 'antd';
import { useHistory } from 'react-router-dom';

import {
  RollbackOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';

function Password() {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  const { t } = useTranslation();

  const [form] = Form.useForm();

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
            history.push('./');
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
      <Spin spinning={isLoading} tip="Loading...">
        <Row>
          <Col xs={24}>
            <Typography.Title level={4}>
              <span className="text-primary">{t('setting-security')}</span>
              {/* <span className="text-primary">ตั้งค่าความปลอดภัย</span> */}
            </Typography.Title>
          </Col>
          <Col xs={24} style={{ paddingTop: 30 }}>
            <Form
              name="search"
              form={form}
              onFinish={onFinish}
              {...formItemLayout}
            >
              <Col {...itemLayout}>
                <Form.Item
                  label={t('new-password')}
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: 'Please input first login password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (
                          /[^A-Za-z\d|^~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.?/]/g.test(
                            value
                          )
                        ) {
                          return Promise.reject(
                            new Error('Incorrect characters.')
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    onChange={() => {
                      form.validateFields(['confirmPassword']);
                    }}
                    autocomplete="new-password"
                    placeholder={t('new-password')}
                  />
                </Form.Item>
              </Col>
              <Col {...itemLayout}>
                <Form.Item
                  label={t('confirm-new-password')}
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: 'Please input Confirm Login Password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('newPassword') === value) {
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
                    onChange={() => {
                      form.validateFields(['newPassword']);
                    }}
                    autocomplete="new-password"
                    placeholder={t('confirm-new-password')}
                  />
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
                      <Col xs={24}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          block
                        >
                          {t('save')}
                        </Button>
                      </Col>
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      style={{ width: '100px', float: 'right' }}
                    >
                      {t('save')}
                    </Button>
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

export default Password;
