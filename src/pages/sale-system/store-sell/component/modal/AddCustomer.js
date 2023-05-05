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
  Select,
  message,
  Radio,
  Card,
} from 'antd';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  SaveOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { fetch } from '../../../../../utils/fetch';
import allAction from '../../../../../app/actions';

const { Option } = Select;
const { Text } = Typography;
const AddCustomer = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [radioCustomer, setRadioCustomer] = useState(true);
  const { companyId, userLevel } = useSelector((state) => state.authenReducer);
  const { isMobile } = useSelector((state) => state.mainReducer);
  const {
    onCancel, comId, formBig, setShortSender,
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      customerClassId: 1,
      defaultAddress: true,
    });
  }, [props]);
  const formItemLayout = {
    labelCol: {
      // xs: { span: 24 },
      xs: { span: 4 },
      sm: { span: 6 },
      lg: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
    },
  };

  const itemLayout = {
    xs: 24,
    sm: 20,
    lg: radioCustomer ? 6 : 8,
  };
  const [loading, setLoadIng] = useState(false);
  // const [comId, setComID] = useState(0);

  const [listProvince2, setListProvince2] = useState([]);
  const [listDistrict2, setListDistrict2] = useState([]);
  const [listSubDistrict2, setListSubDistrict2] = useState([]);

  const [province, setProviceID] = useState(0);
  const [district, setDistrictID] = useState(0);

  const [isSelectProvince, setIsSelectProvince] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isCheckPostCode, setIsCheckPostCode2] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const formItemStyle = { marginBottom: 12 };
  const cardStyle = { padding: 12 };
  const cardBodyStyle = { padding: 0 };

  useEffect(() => {
    callProvince();
  }, []);

  const onChange = (e, key) => {
    if (e.target.value.length === 5) {
      setLoadIng(true);
      fetch({
        method: 'get',
        url: `/master/postcode/?postcode=${e.target.value}`,
      })
        .then((res) => {
          setLoadIng(false);
          if (res.data.success) {
            setIsCheckPostCode2(true);
            setProviceID(res.data.data.province.provinceId);
            // setDistrictID(res.data.data.district[0].districtId);

            if (res.data.data.district.length === 1) {
              setDistrictID(res.data.data.district[0].districtId);
            }

            //* ****/
            setListSubDistrict2(res.data.data.subdistrict);

            if (companyId === 0) {
              callProvince(0, 'new');
            } else {
              callProvince(companyId, 'filter');
            }
            // callDistrict(res.data.data.province.provinceId);
            setListDistrict2(res.data.data.district);
            // callSubDistrict(res.data.data.district[0].districtId);
            // setListDistrict2([])
            // setListSubDistrict2([])

            form.setFieldsValue({
              provinceId: res.data.data.province.provinceId,
              districtId: res.data.data.district[0].districtId,
              subdistrictId:
                res.data.data.subdistrict.length === 1
                  ? res.data.data.subdistrict[0].subdistrictId
                  : '',
            });
            // console.log(keys)
          } else {
            setListDistrict2([]);
            setListSubDistrict2([]);
            form.setFieldsValue({
              provinceId: '',
              districtId: '',
              subdistrictId: '',
            });
            setIsCheckPostCode2(false);
          }
        })
        .catch((error) => {
          setLoadIng(false);
          console.log(error);
        });
    }
  };
  const callProvince = async () => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: '/master/province',
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListProvince2(list);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const callSubDistrict = async (districtId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/subdistrict/?districtId=${districtId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListSubDistrict2(list);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const handleFilterDistrict = (value, key) => {
    callSubDistrict(value);

    setIsSelectDistrict(true);
    if (isCheckPostCode) {
      form.setFieldsValue({
        subdistrictId: '',
      });
    } else {
      form.setFieldsValue({
        subdistrictId: '',
      });
    }
  };
  const handleFilterProvice = (value, key) => {
    callDistrict(value);
    setIsSelectProvince(true);
    setIsFirst(true);

    form.setFieldsValue({
      districtId: '',
      subdistrictId: '',
    });
  };

  const callDistrict = async (provinceId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/district/?provinceId=${provinceId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListDistrict2(list);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }

  const onFinish = (value) => {
    console.log(value);
    let newValue = {};
    newValue = {
      customer: {
        customerClassId: value.customerClassId,
        customerCategoryId: 1,
        customerName: value.customerName,
        customerLastName: value.customerLastName,
        phoneNumber: value.phoneNumber,
        taxpayerNumber: value.taxpayerNumber,
        companyId: companyId || comId,
      },
      address: [
        {
          no: value.no || '',
          moo: value.moo || '',
          alley: value.alley || '',
          road: value.road || '',
          districtId: value.districtId || '',
          subdistrictId: value.subdistrictId || '',
          provinceId: value.provinceId || '',
          postcode: value.postcode || '',
          other: value.other || '',
          defaultAddress: value.defaultAddress,
          addressType: value.customerClassId === 1 ? 'IDC' : 'CUR',
        },
      ],
    };

    dispatch(allAction.storeCustomeAction.createStoreCustome(newValue))
      .then(
        (res) => {
          // console.log('crestee', res);
          // const keys = formBig.getFieldValue();
          const objSearch = {};
          objSearch.search = res?.createdCustomer?.phoneNumber;
          if (userLevel === 'SAD') { objSearch.companyId = formBig.getFieldsValue().companyId; }
          dispatch(allAction.storeSellAction.getCustomerDetail(objSearch))
            .then((data) => {
              let addressRes = '';
              if (data) {
                const keys = formBig.getFieldValue();
                data.customerAddressData.filter((val) => {
                  if (val.defaultAddress) {
                    const moo = val.moo
                      ? `${t('address-village')}${val.moo}`
                      : '';
                    const alley = val.alley
                      ? `${t('address-lane')}${val.alley}`
                      : '';
                    const road = val.road
                      ? `${t('address-road')}${val.road}`
                      : '';
                    const subdistrict = val.subdistrictData?.subdistrictName
                      ? `${t('address-sub-district')}${val.subdistrictData.subdistrictName
                      }`
                      : '';
                    const district = val.districtData?.districtName
                      ? `${t('address-district')}${val.districtData.districtName}`
                      : '';
                    const provice = val.provinceData?.provinceName
                      ? `${t('address-provice')}${val.provinceData.provinceName}`
                      : '';
                    const postcode = val.postcode ? `${val.postcode}` : '';
                    addressRes = `${val.no} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;

                    formBig.setFieldsValue({
                      ...keys,
                      customerAddressId: val?.customerAddressId || '',
                      customerNo: val?.no || '',
                      customerMoo: val?.moo || '',
                      customerAlley: val?.alley || '',
                      customerRoad: val?.road || '',
                      customerDistrictId: val?.districtData?.districtId || '',
                      customerSubdistrictId:
                        val?.subdistrictData?.subdistrictId || '',
                      customerProvinceId: val?.provinceData?.provinceId || '',
                      customerPostcode: val?.postcode || '',
                      customerAddressOther: val?.other || '',
                      customerTaxpayerNumber: val?.taxpayerNumber || '',
                    });
                  }
                });
                formBig.setFieldsValue({
                  ...keys,
                  customerId: data.customerId,
                  customerInput: data.phoneNumber,
                  customerName: data.customerName,
                  customerLastName: data.customerLastName,
                  customerSumName: data?.customerName
                    ? `${data.customerName} ${data.customerLastName || ''}`
                    : '-',
                  customerBankName:
                    data?.customerBankData[0]?.bankData?.bankName || '',
                  customerBankAccountNo:
                    data?.customerBankData[0]?.bankAccountNo || '',
                  customerBankAccountName:
                    data?.customerBankData[0]?.bankAccountName || '',
                  customerBankId:
                    data?.customerBankData[0]?.bankData?.bankId || '',
                  addressCustomer: addressRes || '',
                });

                setShortSender({
                  customerName: data?.customerName || '',
                  customerLastName: data?.customerLastName || '',
                  addressCustomer: addressRes,
                });

                message.success("เพิ่มสำเร็จ")
              }
              // console.log('gettt', form.getFieldValue());
            })
            .catch((e) => message.error(e.message));
        },
      )
      .catch((e) => message.error(e.message));
    onCancel();
  };

  const handleFilterSubDistrict = (value) => {
    if (value === '') return null;
    console.log(value);
    console.log(listSubDistrict2);
    const found = listSubDistrict2.find((item) => {
      console.log(value, item);
      if (item?.subdistrictId === value) return true;
    });

    console.log('found : ', found);
    if (found) {
      form.setFieldsValue({
        postcode: found.postcode,
        districtId: found.districtId,
      });
    }

    console.log(found);
    // if (isSelectProvince || isSelectDistrict) {
    //   form.setFieldsValue({
    //     postcode: '',
    //   });
    // } else {
    //   if (isCheckPostCode) {
    //   } else {
    //     form.setFieldsValue({
    //       postcode: '',
    //     });
    //   }
    // }
  };
  return (
    <>
      <Form
        name="add-customer"
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Card style={cardStyle} bodyStyle={cardBodyStyle}>
          <Row>
            <Col xs={24} style={{ textAlign: 'left' }}>
              <Form.Item
                name="customerClassId"
                rules={[{ required: true, message: 'Please pick an item!' }]}
              >
                <Radio.Group
                  defaultValue={1}
                  onChange={(e) => {
                    e.target.value === 1
                      ? setRadioCustomer(true)
                      : setRadioCustomer(false);
                  }}
                >
                  <Radio value={1}>{t('person')}</Radio>
                  <Radio value={2}>{t('company')}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                labelCol={{ xs: radioCustomer ? 3 : 6 }}
                label={
                  radioCustomer
                    ? t('agency-fistname')
                    : t('store-customer-name-company')
                }
                name="customerName"
                rules={[
                  { required: true, message: 'Please input Name or Customer!' },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={
                    radioCustomer
                      ? t('agency-fistname')
                      : t('store-customer-name-company')
                  }
                />
              </Form.Item>
            </Col>
            {radioCustomer && (
              <Col {...itemLayout}>
                <Form.Item
                  labelCol={{ xs: radioCustomer ? 8 : 6 }}
                  label={
                    radioCustomer
                      ? t('agency-lastname')
                      : t('store-customer-name-company')
                  }
                  name="customerLastName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input Name or Customer!',
                    },
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    autocomplete="new-password"
                    placeholder={
                      radioCustomer
                        ? t('agency-lastname')
                        : t('store-customer-name-company')
                    }
                  />
                </Form.Item>
              </Col>
            )}
            <Col {...itemLayout}>
              <Form.Item
                labelCol={{ xs: radioCustomer ? 12 : 8 }}
                label={
                  radioCustomer
                    ? t('store-customer-id-card')
                    : t('store-customer-tax-number')
                }
                name="taxpayerNumber"
                rules={[
                  {
                    required: false,
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (value) {
                        if (!isNaN(value)) {
                          if (value.length === 13) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Only Length 13 Digits!');
                        }
                        return Promise.reject('Incorrect Format!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={
                    radioCustomer
                      ? t('store-customer-id-card')
                      : t('store-customer-tax-number')
                  }
                />
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                labelCol={{ xs: 10 }}
                label={t('manage-driver-phone-number')}
                name="phoneNumber"
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
                      return Promise.reject('Phone Number Incorrect Format!');
                    },
                  }),
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('manage-driver-phone-number')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card style={cardStyle} bodyStyle={cardBodyStyle}>
          <Row>
            <Col xs={{ span: 24 }}>
              <Form.Item style={formItemStyle} name="defaultAddress">
                <Radio checked>
                  :
                  {' '}
                  {t('set-default')}
                </Radio>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={6} lg={3}>
              <Form.Item
                labelCol={{ xs: 10 }}
                style={formItemStyle}
                label={t('address-number')}
                name="no"
                rules={[
                  { required: true, message: 'Please input Address Number!' },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('address-number')}
                />
              </Form.Item>
            </Col>
            <Col xs={6} lg={3}>
              <Form.Item
                labelCol={{ xs: 10 }}
                style={formItemStyle}
                label={t('address-village')}
                name="moo"
                // rules={[
                //   { required: true, message: 'Please input Address Village!' }]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('address-village')}
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={formItemStyle}
                label={t('address-lane')}
                name="alley"
                // rules={[
                //   { required: true, message: 'Please input Address Lane!' }]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('address-lane')}
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={formItemStyle}
                label={t('address-road')}
                name="road"
                // rules={[
                //   { required: true, message: 'Please input Address Road!' }]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('address-road')}
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={formItemStyle}
                label={t('address-other')}
                name="other"
                // rules={[
                //   { required: true, message: 'Please input Other!' }]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('address-other')}
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                labelCol={{ xs: 10 }}
                style={formItemStyle}
                label={t('address-postal')}
                name="postcode"
                rules={[{ required: true, message: 'Please input Postal!' }]}
                validateTrigger="onBlur"
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('address-postal')}
                  onChange={onChange}
                  onKeyPress={(event) => {
                    isInputNumber(event);
                  }}
                  maxLength={5}
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={formItemStyle}
                label={t('address-sub-district')}
                name="subdistrictId"
                rules={[
                  { required: true, message: 'Please input Sub District!' },
                ]}
                validateTrigger="onBlur"
              >
                <Select
                  defaultValue={t('all-select')}
                  onChange={handleFilterSubDistrict}
                >
                  <Option value="">{t('all-select')}</Option>
                  {listSubDistrict2.map((item) => (
                    <Option value={item.subdistrictId} key={item.subdistrictId}>
                      <Text
                        style={!isMobile ? { width: 90 } : undefined}
                        ellipsis={
                          !isMobile ? { tooltip: item.subdistrictName } : false
                        }
                      >
                        {item.subdistrictName}
                      </Text>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={formItemStyle}
                label={t('address-district')}
                name="districtId"
                rules={[{ required: true, message: 'Please input District!' }]}
                validateTrigger="onBlur"
              >
                <Select
                  defaultValue={t('all-select')}
                  onChange={handleFilterDistrict}
                >
                  <Option value="">{t('all-select')}</Option>
                  {listDistrict2.map((item) => (
                    <Option value={item.districtId} key={item.districtId}>
                      <Text
                        style={!isMobile ? { width: 90 } : undefined}
                        ellipsis={
                          !isMobile ? { tooltip: item.districtName } : false
                        }
                      >
                        {item.districtName}
                      </Text>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={formItemStyle}
                label={t('address-provice')}
                name="provinceId"
                rules={[{ required: true, message: 'Please input Provice!' }]}
                validateTrigger="onBlur"
              >
                <Select
                  defaultValue={t('all-select')}
                  onChange={handleFilterProvice}
                >
                  <Option value="">{t('all-select')}</Option>
                  {listProvince2.map((item) => (
                    <Option value={item.provinceId} key={item.provinceId}>
                      <Text
                        style={!isMobile ? { width: 90 } : undefined}
                        ellipsis={
                          !isMobile ? { tooltip: item.provinceName } : false
                        }
                      >
                        {item.provinceName}
                      </Text>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Form.Item style={{ margin: '20px 0 8px 0' }}>
          <Button
            type="default"
            icon={<CloseCircleOutlined />}
            onClick={onCancel}
            style={{ width: '100px', float: 'right', marginLeft: 15 }}
          >
            {t('cancel-modal')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ width: '100px', float: 'right' }}
          >
            {t('save')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddCustomer;
