import React, { useEffect } from 'react';
import {
  Input,
  Form,
  Button,
  Modal,
  Row,
  Col,
  Spin,
  Typography,
  Card,
  message,
} from 'antd';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import SuperAdminDetail from './SuperAdminDetail';

const SuperAdminInput = (props) => {
  const { superAdminDetail, actionPage } = useSelector(
    (state) => state.superAdminReducer
  );
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission } = useSelector((state) => state.authenReducer);

  const dispatch = useDispatch();

  const {
    match: {
      params: { userId },
    },
    pageCode,
  } = props;

  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userId === 'create') {
      form.resetFields();
    } else {
      dispatch(allAction.superAdminAction.getSuperAdminDetail(userId));

      const initFormData = {
        name: superAdminDetail?.userData?.name,
        email: superAdminDetail?.email,
        phoneNo: superAdminDetail?.phoneNo,
        password: '',
      };
      form.setFieldsValue(initFormData);
    }
  }, [actionPage]);

  const onChangeEmail = (e) => {
    const { value } = e.target;

    form.setFieldsValue({
      email: value.replace(
        /[^\S]|<|>|\(|\)|`|\$|%|\^|\&|\*|\+|=|"|:|;|\?|,/g,
        ''
      ),
    });
  };

  const onFinish = (value) => {
    const valueData = value;
    if (userId === 'create') {
      delete valueData.confirmPassword;
      Modal.confirm({
        title: 'Do you want to create user ?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(allAction.superAdminAction.createSuperAdminDetail(valueData))
            .then(() => {
              message.success('Create Success!');
              history.push('../super-admin');
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      Modal.confirm({
        title: 'Do you want to update user ?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.superAdminAction.updateSuperAdminDetail(userId, valueData)
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.superAdminAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };
  const toFilterSaveBtn = () => {
    if (userId === 'create') {
      return FilterPermission('isCreate');
    }
    return FilterPermission('isUpdate');
  };

  if (userId !== 'create' && actionPage === 'view') {
    return <SuperAdminDetail {...props} data={superAdminDetail} />;
  }
  return (
    <Spin spinning={isLoading} tip="Loading...">
      <Card
        title={
          <Typography.Title level={3}>
            <span className="text-primary">
              {userId === 'create'
                ? t('create-super-admin')
                : t('edit-super-admin')}
            </span>
          </Typography.Title>
        }
      >
        <Form
          layout="horizontal"
          name="search"
          form={form}
          onFinish={onFinish}
          {...formItemLayout}
        >
          <Col {...itemLayout}>
            <Form.Item
              label={t('username')}
              name="name"
              rules={[{ required: true, message: 'Please input Name!' }]}
            >
              <Input autocomplete="new-password" placeholder={t('username')} />
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
              <Input
                autocomplete="new-password"
                placeholder={t('email')}
                onChange={onChangeEmail}
              />
            </Form.Item>
          </Col>
          {userId === 'create' && (
            <>
              <Col {...itemLayout}>
                <Form.Item
                  label={t('first-password')}
                  name="password"
                  validateTrigger={['onBlur']}
                  rules={[
                    {
                      required: true,
                      message: 'Please input first login password!',
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
                    placeholder={t('first-password')}
                    onChange={() => {
                      form.validateFields(['confirmPassword']);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col {...itemLayout}>
                <Form.Item
                  label={t('confirm-password')}
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: 'Please input Confirm Login Password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
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
                      form.validateFields(['password']);
                    }}
                  />
                </Form.Item>
              </Col>
            </>
          )}
          <Form.Item style={{ marginTop: '50px' }}>
            {isMobile ? (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      onClick={() =>
                        userId === 'create'
                          ? history.push('../super-admin')
                          : dispatch(
                              allAction.superAdminAction.setActionPage('view')
                            )
                      }
                      block
                    >
                      {t('cancel')}
                    </Button>
                  </Col>
                  {toFilterSaveBtn() && (
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
                  )}
                </Row>
              </>
            ) : (
              <>
                <Button
                  type="default"
                  icon={<RollbackOutlined />}
                  onClick={() =>
                    userId === 'create'
                      ? history.push('../super-admin')
                      : dispatch(
                          allAction.superAdminAction.setActionPage('view')
                        )
                  }
                  style={{ width: '100px', float: 'right', marginLeft: 15 }}
                >
                  {t('cancel')}
                </Button>
                {toFilterSaveBtn() && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    style={{ width: '100px', float: 'right' }}
                  >
                    {t('save')}
                  </Button>
                )}
              </>
            )}
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

SuperAdminInput.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default SuperAdminInput;
