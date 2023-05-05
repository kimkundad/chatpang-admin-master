/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Card,
  Modal,
  message,
  Input,
  Radio,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  DeleteOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import { fetch } from '../../../utils/fetch';

const StoreCustomeDetail = (props) => {
  const { storeCustomerDetail, actionPage } = useSelector(
    (state) => state.storeCustomeReducer,
  );

  const { permission, userLevel } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile, isLoading } = useSelector((state) => state.mainReducer);
  const history = useHistory();
  const [form] = Form.useForm();
  const [addressIDC, setAddressIDC] = useState([]);
  const [addressCUR, setAddressCUR] = useState([]);
  const [bank, setBank] = useState([]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };

  const formItemStyle = { marginBottom: 6 };
  const cardStyle = { padding: 12 };
  const cardBodyStyle = { padding: 0 };
  const itemLayout = { xs: 24, md: { span: 18 } };

  const formItemDistrict = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const {
    match: {
      params: { storeCustomerId },
    },
    pageCode,
  } = props;
  // console.log(props.match);

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  const filterClassType = () => {
    if (FilterUserLevel(['AGN', 'HUB']) && storeCustomerDetail?.customerCategoryId !== 1) {
      return false;
    }
    return true;
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          allAction.storeCustomeAction.deleteStoreCustomeDetail(storeCustomerId),
        )
          .then(() => {
            history.push('../store-customer');
            message.success('Delete Success!');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // setLoading(true);
    form.resetFields();
    dispatch(allAction.storeCustomeAction.setStoreCustomerDetail({}));
    if (actionPage === 'view') {
      dispatch(
        allAction.storeCustomeAction.getStoreCustomerDetail(storeCustomerId),
      )
        .then((data) => {
          const idc = data.customerAddressData.filter(
            (val) => val.addressType === 'IDC',
          );
          setAddressIDC(idc);
          const cur = data.customerAddressData.filter(
            (val) => val.addressType === 'CUR',
          );
          setAddressCUR(cur);
          setBank(data.customerBankData);
          form.setFieldsValue({
            customerClassId: data?.customerClassId || 1,
            customerCategoryId: data?.customerCategoryId || 1,
          });
        })
        .catch((e) => message.error(e));
    }
    // console.log('sss', storeCustomerDetail);
  }, [actionPage]);

  return (
    <Spin spinning={isLoading} tip="Loading...">
      <Card
        // style={{ margin: '0 30px 0 30px' }}
        title={(
          <Typography.Title level={isMobile ? 4 : 3}>
            <span className="text-primary">{t('store-customer-info')}</span>
          </Typography.Title>
        )}
        extra={
          FilterPermission('isDelete') && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showConfirm()}
              style={{ width: isMobile ? '100%' : '100px' }}
            >
              {t('delete')}
            </Button>
          )
        }
      >
        <Form
          layout="horizontal"
          form={form}
          name="userInput"
          {...formItemLayout}
        >
          <Col sm={6}>
            <Form.Item
              style={formItemStyle}
              label={t('company')}
              name="companyId"
              rules={[{ required: true, message: 'Please select Company!' }]}
              labelCol={24}
            >
              <span>
                {storeCustomerDetail?.companyData?.companyName || '-'}
              </span>
            </Form.Item>
          </Col>
          <Card style={cardStyle} bodyStyle={cardBodyStyle}>
            <Row>
              <Col xs={24} md={10}>
                <Row>
                  <Col xs={{ span: 18, offset: 4 }}>
                    <Form.Item
                      style={formItemStyle}
                      name="customerClassId"
                      // label="Radio.Button"
                      rules={[
                        { required: true, message: 'Please pick an item!' },
                      ]}
                    >
                      <Radio.Group disabled>
                        <Radio value={1}>{t('person')}</Radio>
                        <Radio value={2}>{t('company')}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      style={formItemStyle}
                      label={
                        storeCustomerDetail?.customerClassId === 1
                          ? t('manage-driver-fistname-last-name')
                          : t('store-customer-name-company')
                      }
                      name="customerName"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name or Customer!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>
                        {storeCustomerDetail?.customerClassId === 1
                          ? `${storeCustomerDetail?.customerName || ''} 
                        ${storeCustomerDetail?.customerLastName || ''}`
                          : `${storeCustomerDetail?.customerName || ''}`}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      style={formItemStyle}
                      label={
                        storeCustomerDetail?.customerClassId === 1
                          ? t('store-customer-id-card')
                          : t('store-customer-tax-number')
                      }
                      name="tex"
                      validateTrigger="onBlur"
                    >
                      <span>{storeCustomerDetail?.taxpayerNumber || '-'}</span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('manage-driver-phone-number')}
                      name="Phone"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Phone Number!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{storeCustomerDetail?.phoneNumber || '-'}</span>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={14}>
                <Row>
                  <Col xs={{ span: 24, offset: 3 }}>
                    <Form.Item
                      style={formItemStyle}
                      name="customerCategoryId"
                      // label="Radio.Button"
                      rules={[
                        { required: true, message: 'Please pick an item!' },
                      ]}
                    >
                      <Radio.Group disabled>
                        <Radio value={1}>{t('customer')}</Radio>
                        <Radio value={2}>{t('recommender')}</Radio>
                        <Radio value={3}>{t('big-sender')}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Col {...itemLayout}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('customer-type')}
                        name="customerType"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Customer Type!',
                          },
                        ]}
                        validateTrigger="onBlur"
                      >
                        <span>
                          {storeCustomerDetail?.customerTypeData?.description
                            || '-'}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('discount-rate')}
                        name="discountRate"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Discount Rate!',
                          },
                        ]}
                        validateTrigger="onBlur"
                      >
                        <span>
                          {storeCustomerDetail?.discountRate || '0.00'}
                        </span>
                      </Form.Item>
                    </Col>

                    {storeCustomerDetail
                      && storeCustomerDetail?.customerCategoryId === 3 && (
                        <>
                          <Col {...itemLayout}>
                            <Form.Item
                              style={formItemStyle}
                              label={t('cod-rate')}
                              name="agencyCOD"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please input COD Discount Rate!',
                                },
                              ]}
                              validateTrigger="onBlur"
                            >
                              <span>
                                {storeCustomerDetail?.userData?.userData
                                  ?.agencyData?.agencyCOD || '-'}
                              </span>
                            </Form.Item>
                          </Col>
                          <Col {...itemLayout}>
                            <Form.Item
                              style={formItemStyle}
                              label={t('hub')}
                              name="hubId"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please input Hub!',
                                },
                              ]}
                              validateTrigger="onBlur"
                            >
                              <span>
                                {storeCustomerDetail?.userData?.userData
                                  ?.hubData?.hubName || '-'}
                              </span>
                            </Form.Item>
                          </Col>
                          <Col {...itemLayout}>
                            <Form.Item
                              style={formItemStyle}
                              label={t('customer-code')}
                              name="agencyCode"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please input Customer!',
                                },
                              ]}
                              validateTrigger="onBlur"
                            >
                              <span>
                                {storeCustomerDetail?.userData?.userData
                                  ?.agencyData?.agencyCode || '-'}
                              </span>
                            </Form.Item>
                          </Col>
                        </>
                      )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          {storeCustomerDetail && storeCustomerDetail?.customerClassId === 1 && (
            <>
              {addressIDC && addressIDC[0] && (
                <>
                  <br />
                  <span>{t('address-according-to-id-card')}</span>
                  <Card style={cardStyle} bodyStyle={cardBodyStyle}>
                    <Row>
                      <Col xs={{ span: 24 }}>
                        <Form.Item style={formItemStyle} name="defaultAddress">
                          <Radio
                            checked={
                              addressIDC && addressIDC[0]?.defaultAddress
                            }
                            disabled
                          >
                            :
                            {' '}
                            {t('set-default')}
                          </Radio>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={6} lg={{ span: 3 }}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-number')}
                          name="addressNumber"
                          rules={[
                            {
                              required: true,
                              message: 'Please input Address Number!',
                            },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>{addressIDC[0]?.no || '-'}</span>
                        </Form.Item>
                      </Col>
                      <Col xs={6} lg={{ span: 3 }}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-village')}
                          name="addressVillage"
                          rules={[
                            {
                              required: true,
                              message: 'Please input Address Village!',
                            },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>{addressIDC[0]?.moo || '-'}</span>
                        </Form.Item>
                      </Col>
                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-lane')}
                          name="addressLane"
                          rules={[
                            {
                              required: true,
                              message: 'Please input Address Lane!',
                            },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>{addressIDC[0]?.alley || '-'}</span>
                        </Form.Item>
                      </Col>
                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-road')}
                          name="road"
                          rules={[
                            {
                              required: true,
                              message: 'Please input Address Road!',
                            },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>{addressIDC[0]?.road || '-'}</span>
                        </Form.Item>
                      </Col>
                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-other')}
                          name="other"
                          rules={[
                            { required: true, message: 'Please input Other!' },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>{addressIDC[0]?.other || '-'}</span>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={12} lg={{ span: 6 }}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-postal')}
                          name="postal"
                          rules={[
                            { required: true, message: 'Please input Postal!' },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>{addressIDC[0]?.postcode || '-'}</span>
                        </Form.Item>
                      </Col>
                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-sub-district')}
                          name="subDistrict"
                          rules={[
                            {
                              required: true,
                              message: 'Please input Sub District!',
                            },
                          ]}
                          validateTrigger="onBlur"
                          {...formItemDistrict}
                        >
                          <span>
                            {addressIDC[0]?.subdistrictData?.subdistrictName
                              || '-'}
                          </span>
                        </Form.Item>
                      </Col>
                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-district')}
                          name="district"
                          rules={[
                            {
                              required: true,
                              message: 'Please input District!',
                            },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>
                            {addressIDC[0]?.districtData?.districtName || '-'}
                          </span>
                        </Form.Item>
                      </Col>
                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-provice')}
                          name="provice"
                          rules={[
                            {
                              required: true,
                              message: 'Please input Provice!',
                            },
                          ]}
                          validateTrigger="onBlur"
                        >
                          <span>
                            {addressIDC[0]?.provinceData?.provinceName || '-'}
                          </span>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </>
              )}
            </>
          )}
          <br />
          {addressCUR.length > 0 && <span>{t('current-address')}</span>}
          {addressCUR.length > 0
            && addressCUR.map((val) => (
              <Card style={cardStyle} bodyStyle={cardBodyStyle}>
                <Row>
                  <Col xs={{ span: 24 }}>
                    <Form.Item style={formItemStyle} name="defaultAddress">
                      <Radio checked={val?.defaultAddress} disabled>
                        :
                        {' '}
                        {t('set-default')}
                      </Radio>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={6} lg={{ span: 3 }}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-number')}
                      name="addressNumber"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Address Number!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.no || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={6} lg={{ span: 3 }}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-village')}
                      name="addressVillage"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Address Village!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.moo || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-lane')}
                      name="addressLane"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Address Lane!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.alley || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-road')}
                      name="road"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Address Road!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.road || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-other')}
                      name="other"
                      rules={[
                        { required: true, message: 'Please input Other!' },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.other || '-'}</span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={12} lg={{ span: 6 }}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-postal')}
                      name="postal"
                      rules={[
                        { required: true, message: 'Please input Postal!' },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.postcode || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-sub-district')}
                      name="subDistrict"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Sub District!',
                        },
                      ]}
                      validateTrigger="onBlur"
                      {...formItemDistrict}
                    >
                      <span>
                        {val?.subdistrictData?.subdistrictName || '-'}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-district')}
                      name="district"
                      rules={[
                        { required: true, message: 'Please input District!' },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.districtData?.districtName || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-provice')}
                      name="provice"
                      rules={[
                        { required: true, message: 'Please input Provice!' },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <span>{val?.provinceData?.provinceName || '-'}</span>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}

          <br />
          <span>{t('menu-setting-bank')}</span>

          {bank.length > 0
            && bank.map((val) => (
              <Card style={cardStyle} bodyStyle={cardBodyStyle}>
                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('menu-setting-bank')}
                      rules={[
                        { required: true, message: 'Please input Bank!' },
                      ]}
                    >
                      <span>{val?.bankData?.bankName || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('bank-no')}
                      rules={[
                        { required: true, message: 'Please input Bank No!' },
                      ]}
                    >
                      <span>{val?.bankAccountNo || '-'}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('bank-name')}
                      rules={[
                        { required: true, message: 'Please input Bank Name!' },
                      ]}
                    >
                      <span>{val?.bankAccountName || '-'}</span>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}

          <Form.Item style={{ marginTop: '50px' }}>
            {isMobile ? (
              <>
                <Row gutter={[16, 16]}>
                  {(FilterPermission('isUpdate') && filterClassType())
                    && (
                      <Col xs={24}>
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          block
                          onClick={() => dispatch(
                            allAction.storeCustomeAction.setActionPage('edit'),
                          )}
                        >
                          {t('edit')}
                        </Button>
                      </Col>
                    )}
                  <Col xs={24}>
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      onClick={() => history.push('../store-customer')}
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
                  onClick={() => history.push('../store-customer')}
                  style={{ width: '100px', float: 'right', marginLeft: 15 }}
                >
                  {t('cancel')}
                </Button>
                {(FilterPermission('isUpdate') && filterClassType()) && (
                  <Button
                    type="primary"
                    onClick={() => dispatch(
                      allAction.storeCustomeAction.setActionPage('edit'),
                    )}
                    icon={<EditOutlined />}
                    style={{ width: '100px', float: 'right' }}
                  >
                    {t('edit')}
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

export default StoreCustomeDetail;
