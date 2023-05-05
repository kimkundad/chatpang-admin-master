import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Checkbox,
  Modal,
  message,
  Card,
  Tabs,
  InputNumber,
} from 'antd';
import { useHistory } from 'react-router-dom';

import {
  RollbackOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import Map from './component/Map';
import CompanyDetail from './CompanyDetail';

const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const itemLayout = { xs: 24, sm: { span: 20 } };

const CompanyInput = (props) => {
  const { actionPage, companyDetail } = useSelector(
    (state) => state.companyReducer,
  );
  const { permission } = useSelector((state) => state.authenReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();

  const [tabSelect, setTabSelect] = useState('1');

  const {
    match: {
      params: { companyId },
    },
    pageCode,
  } = props;

  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (companyId === 'create') {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
      });
    } else {
      dispatch(allAction.companyAction.getCompanyDetail(companyId));
      const initFormData = {
        companyId: companyDetail?.companyId,
        companyCode: companyDetail?.companyCode,
        companyName: companyDetail?.companyName,
        contactName: companyDetail?.contactName,
        phoneNoC: companyDetail?.phoneNo,
        address: companyDetail?.address,
        lat: companyDetail?.lat,
        lng: companyDetail?.lng,
        isActive: companyDetail?.isActive,
      };
      form.setFieldsValue(initFormData);
    }
    console.log('action Page : ', actionPage);
  }, [actionPage]);

  const onFinish = (value) => {
    console.log('name', value);
    const data = { company: {} };
    data.company.companyCode = value.companyCode;
    data.company.companyName = value.companyName;
    data.company.contactName = value.contactName;
    data.company.address = value.address;
    data.company.phoneNo = value.phoneNoC;
    data.company.lat = value.lat;
    data.company.lng = value.lng;
    data.company.isActive = value.isActive;

    // if (!value.name) return message.error('Please fill out the information completely.');
    if (companyId === 'create') {
      // if (!value.name) {
      //   setTabSelect('2');
      //   return message.error('Please fill out the information completely.');
      // }

      // data.admin.password = value.password;
      Modal.confirm({
        title: 'Do you want to create company ?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(allAction.companyAction.createCompanyDetail(data))
            .then(() => {
              message.success('Create Success!');
              history.push('../company');
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      // data.admin.userId = adminDetail.userId;
      Modal.confirm({
        title: 'Do you want to update company ?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(allAction.companyAction.updateCompanyDetail(companyId, data))
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.companyAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  const onSearchMap = (value) => {
    if (value.description) {
      form.setFieldsValue({
        address: value?.description,
      });
    }
    form.setFieldsValue({
      lat: value?.lat.toFixed(6),
      lng: value?.lng.toFixed(6),
    });
  };

  const onChangeEmail = (e) => {
    const { value } = e.target;

    form.setFieldsValue({
      email: value.replace(
        /[^\S]|<|>|\(|\)|`|\$|%|\^|\&|\*|\+|=|"|:|;|\?|,/g,
        '',
      ),
    });
  };

  if (companyId !== 'create' && actionPage === 'view') {
    return <CompanyDetail {...props} />;
  }
  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Card
          title={(
            <Typography.Title level={3}>
              <span className="text-primary">
                {companyId === 'create'
                  ? t('create-company-management')
                  : t('edit-company-management')}
              </span>
            </Typography.Title>
          )}
        >
          <Form
            layout="horizontal"
            name="search"
            form={form}
            {...formItemLayout}
            onFinish={onFinish}
            onFinishFailed={() => message.error('Please fill out the information completely.')}
          >
            <Tabs
              type="card"
              activeKey={tabSelect}
              onTabClick={(key) => {
                setTabSelect(key);
              }}
            >
              <TabPane tab={t('company')} key="1">
                <Row>
                  <Col xs={24} sm={14}>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('company-code')}
                        name="companyCode"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Company Code!',
                          },
                        ]}
                      >
                        <Input
                          disabled={companyId !== 'create'}
                          autocomplete="new-password"
                          placeholder={t('company-code')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('company-name')}
                        name="companyName"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Company Name!',
                          },
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('company-name')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('contact-person')}
                        name="contactName"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Contact Person!',
                          },
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('contact-person')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('phone')}
                        name="phoneNoC"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Phone No!',
                          },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              if (!value || !isNaN(value)) {
                                if (value.length === 9 || value.length === 10) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  'Phone Number Length 9-10 Digits!',
                                );
                              }
                              return Promise.reject(
                                'Phone Number Incorrect Format!',
                              );
                            },
                          }),
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('phone')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('address')}
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Address!',
                          },
                        ]}
                      >
                        <Input.TextArea
                          row={3}
                          autocomplete="new-password"
                          placeholder={t('address')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('lat')}
                        name="lat"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Latitude!',
                          },
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('lat')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('lng')}
                        name="lng"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Longitude!',
                          },
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('lng')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('status-active')}
                        name="isActive"
                        valuePropName="checked"
                      >
                        <Checkbox />
                      </Form.Item>
                    </Col>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Map {...props} onSearchMap={onSearchMap} />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
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
                        onClick={() => (companyId === 'create'
                          ? history.push('../company')
                          : dispatch(
                            allAction.companyAction.setActionPage('view'),
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
                    onClick={() => (companyId === 'create'
                      ? history.push('../company')
                      : dispatch(
                        allAction.companyAction.setActionPage('view'),
                      ))}
                    style={{ width: '100px', float: 'Right', marginLeft: 15 }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    style={{ width: '100px', float: 'Right' }}
                  >
                    {t('save')}
                  </Button>
                </>
              )}
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </>
  );
};

export default CompanyInput;
