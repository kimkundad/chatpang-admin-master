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
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import SettingCustomeTypeDetail from './SettingCustomeTypeDetail';
import { fetch } from '../../utils/fetch';

const { Option } = Select;

const SettingMorePriceInput = (props) => {
  const { companyData, actionPage } = useSelector(
    (state) => state.settingCustomeTypeReducer
  );
  const { userLevel, companyId } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useSelector((state) => state.mainReducer);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const {
    match: {
      params: { customerTypeId },
    },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };
  const handleSubmit = (values) => {
    if (customerTypeId === 'create') {
      Modal.confirm({
        title: 'Do you want to create?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          if (companyId) {
            const obj = {
              companyId,
              description: values.description,
              discount: values.discount,
            };
            dispatch(
              allAction.settingCustomeTypeAction.createSettingCustomeType(obj)
            )
              .then(() => {
                message.success('Create Success!');
                history.push('../setting-customer-type');
              })
              .catch((e) => message.error(e.message));
          } else {
            const obj = {
              companyId: values.companyId,
              description: values.description,
              discount: values.discount,
            };
            dispatch(
              allAction.settingCustomeTypeAction.createSettingCustomeType(obj)
            )
              .then(() => {
                message.success('Create Success!');
                history.push('../setting-customer-type');
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
        ({ companyName }) => companyName === values.companyId
      );
      let objData;
      if (getCompanyId) {
        const obj = {
          companyId: getCompanyId.companyId,
          description: values.description,
          discount: values.discount,
        };
        objData = obj;
      } else {
        const obj = {
          companyId: values.companyId,
          description: values.description,
          discount: values.discount,
        };
        objData = obj;
      }
      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.settingCustomeTypeAction.updateSettingCustomeTypeDetail(
              customerTypeId,
              objData
            )
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(
                allAction.settingCustomeTypeAction.setActionPage('view')
              );
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      const getCompanyId = companyData.find(
        ({ companyName }) => companyName === values.companyId
      );
      let objData;
      if (getCompanyId) {
        const obj = {
          companyId: getCompanyId.companyId,
          description: values.description,
          discount: values.discount,
        };
        objData = obj;
      } else {
        const obj = {
          companyId: values.companyId,
          description: values.description,
          discount: values.discount,
        };
        objData = obj;
      }
      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.settingCustomeTypeAction.updateSettingCustomeTypeDetail(
              customerTypeId,
              objData
            )
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(
                allAction.settingCustomeTypeAction.setActionPage('view')
              );
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
    if (customerTypeId === 'create') {
      dispatch(allAction.settingCustomeTypeAction.getSettingCustomeType())
        .then(() => {})
        .catch((e) => message.error(e.message));
      const formData = {
        companyId: '',
        description: '',
        discount: '',
      };
      form.setFieldsValue(formData);
    } else {
      dispatch(allAction.settingCustomeTypeAction.getSettingCustomeType())
        .then(() => {})
        .catch((e) => message.error(e.message));
      setLoading(true);
      fetch({
        method: 'get',
        url: `/customer-type/${customerTypeId}`,
      })
        .then((res) => {
          if (res.data.success) {
            setLoading(false);
            const initFormData = {
              companyId: res.data.data.companyData.companyName,
              description: res.data.data.description,
              discount: res.data.data.discount,
            };
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

  if (customerTypeId !== 'create' && actionPage === 'view') {
    return <SettingCustomeTypeDetail {...props} />;
  }
  return (
    <Spin spinning={loading} tip="Loading...">
      <Card
        title={
          <Typography.Title level={3}>
            <span className="text-primary">
              {customerTypeId === 'create'
                ? t('store-customer-type-create')
                : t('store-customer-type-edit')}
            </span>
          </Typography.Title>
        }
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
                <Select defaultValue={t('select-company')}>
                  <Option value="">{t('select-company')}</Option>
                  {companyData &&
                    companyData.map((item) => (
                      <Option key={item.companyId}>{item.companyName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col {...itemLayout}>
            <Form.Item
              label={t('menu-setting-customer-type')}
              name="description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <Input placeholder={t('menu-setting-customer-type')} />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              label={t('setting-agency-degree-discount')}
              name="discount"
              rules={[{ required: true, message: 'Please input discount!' }]}
              validateTrigger="onBlur"
            >
              <Input placeholder={t('discount')} />
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
                      onClick={() =>
                        customerTypeId === 'create'
                          ? history.push('../setting-customer-type')
                          : dispatch(
                              allAction.settingCustomeTypeAction.setActionPage(
                                'view'
                              )
                            )
                      }
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
                  onClick={() =>
                    customerTypeId === 'create'
                      ? history.push('../setting-customer-type')
                      : dispatch(
                          allAction.settingCustomeTypeAction.setActionPage(
                            'view'
                          )
                        )
                  }
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

export default SettingMorePriceInput;
