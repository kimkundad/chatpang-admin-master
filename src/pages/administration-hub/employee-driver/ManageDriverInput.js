/* eslint-disable no-array-constructor */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-const-assign */
/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Card,
  Select,
  message,
  Modal,
  Checkbox,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import ManageDriverDetail from './ManageDriverDetail';
import { fetch } from '../../../utils/fetch';

const { Option } = Select;

const ManageDriverInput = (props) => {
  const { companyData, actionPage, hubData } = useSelector(
    (state) => state.manageDriverReducer,
  );
  const { userLevel, companyId, hubId } = useSelector(
    (state) => state.authenReducer,
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useSelector((state) => state.mainReducer);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { roleLevel } = useSelector((state) => state.authenReducer);
  const [companyIdCheckClear, setCompanyIdCheckClear] = useState();
  const {
    match: {
      params: { driverId },
    },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  const handleFilterChange = (value) => {
    console.log(value);
    if (value === '') {
      value = 0;
    }
    if (value != companyIdCheckClear) {
      form.setFieldsValue({
        hubId: '',
      });
    }
    setCompanyIdCheckClear(value);
    const resData = new Array();
    dispatch(allAction.manageDriverAction.getCompanyData(resData, value))
      .then(() => { })
      .catch((e) => message.error(e.message));
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }

  const handleSubmit = (values) => {
    if (driverId === 'create') {
      Modal.confirm({
        title: 'Do you want to create?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          if (companyId) {
            if (hubId) {
              const obj = {
                hubId,
                fistnameLastName: values.fistnameLastName,
                phone: values.phone,
                firstPassword: values.firstPassword,
                confirmPassword: values.confirmPassword,
                isActive: values.isActive,
              };
              dispatch(
                allAction.manageDriverAction.createManageDriver(obj, companyId),
              )
                .then(() => {
                  message.success('Create Success!');
                  history.push('../hub-employee');
                })
                .catch((e) => message.error(e.message));
            } else {
              dispatch(
                allAction.manageDriverAction.createManageDriver(
                  values,
                  companyId,
                ),
              )
                .then(() => {
                  message.success('Create Success!');
                  history.push('../hub-employee');
                })
                .catch((e) => message.error(e.message));
            }
          } else {
            dispatch(
              allAction.manageDriverAction.createManageDriver(
                values,
                values.companyId,
              ),
            )
              .then(() => {
                message.success('Create Success!');
                history.push('../hub-employee');
              })
              .catch((e) => message.error(e.message));
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else if (FilterUserLevel(['SAD'])) {
      const getCompanyId = companyData.find(
        ({ companyName }) => companyName === values.companyId,
      );
      const getHubData = hubData.find(
        ({ hubName }) => hubName === values.hubId,
      );
      let objData;
      if (getCompanyId) {
        const obj = {
          companyId: getCompanyId.companyId,
          hubId: getHubData === undefined ? values.hubId : getHubData.hubId,
          name: values.fistnameLastName,
          email: values.phone,
          phoneNo: values.phone,
          password: values.firstPassword,
          isActive: values.isActive,
        };
        objData = obj;
      } else {
        const obj = {
          companyId: values.companyId,
          hubId: getHubData === undefined ? values.hubId : getHubData.hubId,
          name: values.fistnameLastName,
          email: values.phone,
          phoneNo: values.phone,
          password: values.firstPassword,
          isActive: values.isActive,
        };
        objData = obj;
      }
      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.manageDriverAction.updateManageDriverDetail(
              driverId,
              objData,
            ),
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.manageDriverAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else if (FilterUserLevel(['COM'])) {
      const getHubData = hubData.find(
        ({ hubName }) => hubName === values.hubId,
      );
      let objData;
      if (getHubData) {
        const obj = {
          hubId: getHubData.hubId,
          name: values.fistnameLastName,
          email: values.phone,
          phoneNo: values.phone,
          isActive: values.isActive,
          password: values.firstPassword,
        };
        objData = obj;
      } else {
        const obj = {
          hubId: values.hubId,
          name: values.fistnameLastName,
          email: values.phone,
          phoneNo: values.phone,
          isActive: values.isActive,
          password: values.firstPassword,
        };
        objData = obj;
      }
      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.manageDriverAction.updateManageDriverDetail(
              driverId,
              objData,
            ),
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.manageDriverAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else if (FilterUserLevel(['HUB'])) {
      const obj = {
        name: values.fistnameLastName,
        email: values.phone,
        phoneNo: values.phone,
        isActive: values.isActive,
        password: values.firstPassword,
      };

      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.manageDriverAction.updateManageDriverDetail(driverId, obj),
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.manageDriverAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (driverId === 'create') {
      const resData = new Array();
      dispatch(
        allAction.manageDriverAction.getCompanyData(
          resData,
          companyId == '' ? 0 : companyId,
        ),
      )
        .then(() => { })
        .catch((e) => message.error(e.message));
      const formData = {
        companyId: '',
        hubId: '',
        fistnameLastName: '',
        confirmPassword: '',
        firstPassword: '',
        phone: '',
        isActive: true,
      };
      form.setFieldsValue(formData);
    } else {
      const resData = new Array();
      dispatch(
        allAction.manageDriverAction.getCompanyData(
          resData,
          companyId == '' ? 0 : companyId,
        ),
      )
        .then(() => { })
        .catch((e) => message.error(e.message));
      setLoading(true);
      fetch({
        method: 'GET',
        url: `/manageDriver/getOneDriverByUserId/${driverId}`,
      })
        .then((res) => {
          if (res.data.success) {
            setLoading(false);
            const initFormData = {
              companyId: res.data.data.userData.companyData.companyName,
              hubId:
                res.data.data.userData.hubData == null
                  ? ''
                  : res.data.data.userData.hubData.hubName,
              fistnameLastName: res.data.data.userData.name,
              phone: res.data.data.phoneNo,
              confirmPassword: '',
              firstPassword: '',
              isActive: res.data.data.isActive,
            };
            // handleFilterChange(res.data.data.userData.companyData.companyId);
            setCompanyIdCheckClear(
              res.data.data.userData.companyData.companyId,
            );
            form.setFieldsValue(initFormData);
          } else {
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, [actionPage]);

  if (driverId !== 'create' && actionPage === 'view') {
    return <ManageDriverDetail {...props} />;
  }
  return (
    <Spin spinning={loading} tip="Loading...">
      <Card
        title={(
          <Typography.Title level={3}>
            <span className="text-primary">
              {driverId === 'create'
                ? t('manage-driver-create')
                : t('manage-driver-edit')}
            </span>
          </Typography.Title>
        )}
      >
        <Form
          layout="horizontal"
          form={form}
          name="userInput"
          {...formItemLayout}
          onFinish={handleSubmit}
        >
          {FilterUserLevel(['SAD']) && (
            <Col {...itemLayout}>
              <Form.Item
                label={t('company')}
                name="companyId"
                rules={[{ required: true, message: 'Please select Company!' }]}
              >
                <Select
                  defaultValue={t('select-company')}
                  onChange={handleFilterChange}
                >
                  <Option value="">{t('select-company')}</Option>
                  {companyData
                    && companyData.map((item) => (
                      <Option key={item.companyId}>{item.companyName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {roleLevel == 'SAD' || roleLevel == 'COM' ? (
            <Col {...itemLayout}>
              <Form.Item
                label={t('hub-name')}
                name="hubId"
                rules={[{ required: true, message: 'Please select Hub!' }]}
              >
                <Select defaultValue={t('select-hub')}>
                  <Option value="">{t('select-hub')}</Option>
                  {hubData
                    && hubData.map((item) => (
                      <Option key={item.hubId}>{item.hubName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          ) : (
            <></>
          )}

          <Col {...itemLayout}>
            <Form.Item
              label={t('manage-driver-fistname-last-name')}
              name="fistnameLastName"
              rules={[{ required: true, message: 'Please input name!' }]}
            >
              <Input placeholder={t('manage-driver-fistname-last-name')} />
            </Form.Item>
          </Col>
          {/* <Col {...itemLayout}>
            <Form.Item
              label={t('manage-driver-last-name')}
              name="lastName"
              rules={[{ required: true, message: 'Please input last name!' }]}
            >
              <Input placeholder={t('manage-driver-last-name')} />
            </Form.Item>
          </Col> */}
          <Col {...itemLayout}>
            <Form.Item
              label={t('manage-driver-phone-number')}
              name="phone"
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
              validateTrigger="onBlur"
            >
              <Input
                autocomplete="new-password"
                maxLength={10}
                onKeyPress={(event) => {
                  isInputNumber(event);
                }}
                placeholder={t('manage-driver-phone-number')}
              />
            </Form.Item>
          </Col>
          {driverId === 'create' ? (
            <Col {...itemLayout}>
              <Form.Item
                label={t('first-password')}
                name="firstPassword"
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
                validateTrigger="onBlur"
              >
                <Input.Password
                  autocomplete="new-password"
                  placeholder={t('first-password')}
                />
              </Form.Item>
            </Col>
          ) : (
            <Col {...itemLayout}>
              <Form.Item
                label={t('new-password')}
                name="firstPassword"
                rules={[
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
                validateTrigger="onBlur"
              >
                <Input.Password
                  autocomplete="new-password"
                  placeholder={t('first-password')}
                />
              </Form.Item>
            </Col>
          )}
          {driverId === 'create' ? (
            <Col {...itemLayout}>
              <Form.Item
                label={t('confirm-password')}
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Please input confirm password!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('firstPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'The two passwords that you entered do not match!',
                      );
                    },
                  }),
                ]}
                validateTrigger="onBlur"
              >
                <Input.Password
                  autocomplete="new-password"
                  placeholder={t('confirm-password')}
                />
              </Form.Item>
            </Col>
          ) : (
            <Col {...itemLayout}>
              <Form.Item
                label={t('confirm-password')}
                name="confirmPassword"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (value) {
                        if (getFieldValue('firstPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          'The two passwords that you entered do not match!',
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                validateTrigger="onBlur"
              >
                <Input.Password
                  autocomplete="new-password"
                  placeholder={t('confirm-password')}
                />
              </Form.Item>
            </Col>
          )}

          <Col {...itemLayout}>
            <Form.Item
              label={t('hubs-close')}
              name="isActive"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
          <Form.Item style={{ marginTop: '50px' }}>
            {isMobile ? (
              <>
                <Row gutter={[16, 16]}>
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
                  <Col xs={24}>
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      onClick={() => (driverId === 'create'
                        ? history.push('../hub-employee')
                        : dispatch(
                          allAction.manageDriverAction.setActionPage('view'),
                        ))}
                      block
                    >
                      {t('cancel')}
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Button
                  type="default"
                  icon={<RollbackOutlined />}
                  onClick={() => (driverId === 'create'
                    ? history.push('../hub-employee')
                    : dispatch(
                      allAction.manageDriverAction.setActionPage('view'),
                    ))}
                  style={{ width: '100px', float: 'right', marginLeft: 15 }}
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
      </Card>
    </Spin>
  );
};

export default ManageDriverInput;
