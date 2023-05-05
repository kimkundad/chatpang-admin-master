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
import SettingMorePriceDetail from './SettingMorePriceDetail';
import { fetch } from '../../utils/fetch';

const { Option } = Select;

const SettingMorePriceInput = (props) => {
  const { companyData, actionPage } = useSelector(
    (state) => state.settingMorePriceReducer
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
      params: { settingMorePriceId },
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
    if (settingMorePriceId === 'create') {
      Modal.confirm({
        title: 'Do you want to create?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          if (companyId) {
            dispatch(
              allAction.settingMorePriceAction.createSettingMorePrice(
                values,
                companyId
              )
            )
              .then(() => {
                message.success('Create Success!');
                history.push('../setting-more-price');
              })
              .catch((e) => message.error(e.message));
          } else {
            dispatch(
              allAction.settingMorePriceAction.createSettingMorePrice(
                values,
                values.companyId
              )
            )
              .then(() => {
                message.success('Create Success!');
                history.push('../setting-more-price');
              })
              .catch((e) => message.error(e.message));
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else if (FilterUserLevel(['SAD'])) {
      console.log(values);
      const getCompanyId = companyData.find(
        ({ companyName }) => companyName === values.companyId
      );
      console.log(getCompanyId);
      let objData;
      if (getCompanyId) {
        const obj = {
          companyId: getCompanyId.companyId,
          description: values.description,
          price: values.price,
        };
        objData = obj;
      } else {
        const obj = {
          companyId: values.companyId,
          description: values.description,
          price: values.price,
        };
        objData = obj;
      }
      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.settingMorePriceAction.updateSettingMorePriceDetail(
              settingMorePriceId,
              objData
            )
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.settingMorePriceAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      const obj = {
        companyId: '',
        description: values.description,
        price: values.price,
      };
      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.settingMorePriceAction.updateSettingMorePriceDetail(
              settingMorePriceId,
              obj
            )
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.settingMorePriceAction.setActionPage('view'));
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
    if (settingMorePriceId === 'create') {
      dispatch(allAction.settingMorePriceAction.getSettingMorePrice(null))
        .then(() => {})
        .catch((e) => message.error(e.message));
      const formData = {
        companyId: '',
        description: '',
        price: '',
      };
      form.setFieldsValue(formData);
    } else {
      dispatch(allAction.settingMorePriceAction.getSettingMorePrice())
        .then(() => {})
        .catch((e) => message.error(e.message));
      setLoading(true);
      fetch({
        method: 'get',
        url: `/incrementalPrice/getOneList/${settingMorePriceId}`,
      })
        .then((res) => {
          if (res.data.success) {
            setLoading(false);
            const initFormData = {
              companyId: res.data.data.companyData.companyName,
              description: res.data.data.description,
              price: res.data.data?.price,
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

  if (settingMorePriceId !== 'create' && actionPage === 'view') {
    return <SettingMorePriceDetail {...props} />;
  }
  return (
    <Spin spinning={loading} tip="Loading...">
      <Card
        title={
          <Typography.Title level={3}>
            <span className="text-primary">
              {settingMorePriceId === 'create'
                ? t('setting-more-price-create')
                : t('setting-more-price-edit')}
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
              label={t('setting-more-price-detail')}
              name="description"
              rules={[{ required: true, message: 'Please input Detail!' }]}
            >
              <Input placeholder={t('setting-more-price-detail')} />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              label={t('price')}
              name="price"
              rules={[{ required: true, message: 'Please input Price!' }]}
              validateTrigger="onBlur"
            >
              <Input placeholder={t('price')} />
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
                        settingMorePriceId === 'create'
                          ? history.push('../setting-more-price')
                          : dispatch(
                              allAction.settingMorePriceAction.setActionPage(
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
                    settingMorePriceId === 'create'
                      ? history.push('../setting-more-price')
                      : dispatch(
                          allAction.settingMorePriceAction.setActionPage('view')
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
