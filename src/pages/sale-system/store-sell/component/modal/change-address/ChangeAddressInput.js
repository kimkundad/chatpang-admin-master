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
import { useHistory } from 'react-router-dom';
import {
  SaveOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { fetch } from '../../../../../../utils/fetch';
import allAction from '../../../../../../app/actions';

const { Option } = Select;
const { Text } = Typography;

const ChangeAddressInput = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile, isLoading } = useSelector((state) => state.mainReducer);
  const { companyId } = useSelector((state) => state.authenReducer);

  const [form] = Form.useForm();
  const history = useHistory();
  const {
    customerId, onCancel, showCode, formBig,
  } = props;
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
  const formItemStyle = { marginBottom: 8 };
  const cardStyle = { padding: 12 };
  const cardBodyStyle = { padding: 0 };

  useEffect(() => {
    callProvince();
  }, []);

  const onChange = (e) => {
    if (e.target.value.length == 5) {
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
      subdistrictId: '',
      districtId: '',
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
    console.log('vv', value);
    if (customerId) {
      const newVal = value;
      // newVal.addressType = 'CUR',
      dispatch(
        allAction.storeSellAction.createAddress(newVal, customerId),
      ).then((data) => {
        setData(data);
        console.log(data);
      });
    } else {
      message.error('customerId not found!');
      onCancel();
    }
  };

  const setData = (data) => {
    const keys = formBig.getFieldsValue();
    console.log('dataaaa', data);

    let addressRes = '';
    const moo = data.moo ? `${t('address-village')}${data.moo}` : '';
    const alley = data.alley ? `${t('address-lane')}${data.alley}` : '';
    const road = data.road ? `${t('address-road')}${data.road}` : '';
    const subdistrict = data.subdistrictData.subdistrictName
      ? `${t('address-sub-district')}${data.subdistrictData.subdistrictName}`
      : '';
    const district = data.districtData.districtName
      ? `${t('address-district')}${data.districtData.districtName}`
      : '';
    const provice = data.provinceData.provinceName
      ? `${t('address-provice')}${data.provinceData.provinceName}`
      : '';
    const postcode = data.postcode ? `${data.postcode}` : '';
    addressRes = `${data.no} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;

    if (showCode.value === 'change-address') {
      const itemSs = keys.itemStoreSell[showCode.key];
      itemSs.recipientAddressId = data.customerAddressId || null;
      itemSs.recipientNo = data.no;
      itemSs.recipientMoo = data.moo || null;
      itemSs.recipientAlley = data.alley || null;
      itemSs.recipientRoad = data.road || null;
      itemSs.recipientDistrictId = data.districtId;
      itemSs.recipientDistrictName = data.districtData?.districtName || null;
      itemSs.recipientSubdistrictId = data.subdistrictId;
      itemSs.recipientSubdistrictName = data.subdistrictData?.subdistrictName || null;
      itemSs.recipientProvinceId = data.provinceId;
      itemSs.recipientProvinceName = data.provinceData?.provinceName || null;
      itemSs.recipientPostcode = data.postcode;
      itemSs.recipientOther = data.other;

      formBig.setFieldsValue({
        ...keys,
        [keys.itemStoreSell[showCode.key]]: itemSs,
      });
      onCancel();
    }
    if (showCode === 'change-address-customer') {
      formBig.setFieldsValue({
        ...keys,
        customerNo: data.no,
        customerMoo: data.moo || null,
        customerAlley: data.alley || null,
        customerRoad: data.road || null,
        customerDistrictId: data.districtId || null,
        customerSubdistrictId: data.subdistrictId || null,
        customerProvinceId: data.provinceId || null,
        customerPostcode: data.postcode || null,
        customerAddressOther: data.other || null,
        customerTaxpayerNumber: data.taxpayerNumber || null,
        customerAddressId: data.customerAddressId,
        addressCustomer: addressRes,
      });
      onCancel();
    }
    if (showCode === 'change-address-sender') {
      formBig.setFieldsValue({
        ...keys,
        senderNo: data.no,
        senderMoo: data.moo || null,
        senderAlley: data.alley || null,
        senderRoad: data.road || null,
        senderDistrictId: data.districtId || null,
        senderSubdistrictId: data.subdistrictId || null,
        senderProvinceId: data.provinceId || null,
        senderPostcode: data.postcode || null,
        senderAddressId: data.customerAddressId,
        addressSender: addressRes,
      });
      onCancel();
    }
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
        name="change-address"
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Card style={cardStyle} bodyStyle={cardBodyStyle}>
          <Row>
            <Col xs={24}>
              <Form.Item
                style={formItemStyle}
                name="defaultAddress"
                valuePropName="checked"
              >
                <Checkbox>{t('set-default')}</Checkbox>
              </Form.Item>
            </Col>

            <Col xs={3}>
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
            <Col xs={3}>
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
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Col xs={6}>
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
            onClick={() => dispatch(allAction.storeSellAction.setActionModal('view'))}
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

export default ChangeAddressInput;
