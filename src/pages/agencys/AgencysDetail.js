import {
  Form,
  Input,
  Button,
  message,
  Layout,
  Col,
  Row,
  Spin,
  Select,
  Typography,
  Table,
  Space,
  Tag,
  Card,
  Checkbox,
  Radio,
  Tabs,
  InputNumber,
  Modal,
  Image,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {
  FileOutlined,
  DownloadOutlined,
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  RollbackOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { fetch } from '../../utils/fetch';
import allAction from '../../app/actions/index';

import Map from './component/Map';
import gmap_icon from '../../assets/gmap_icon.png';

const { TabPane } = Tabs;

const { Column } = Table;
const { Option } = Select;

const AgencysDetail = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    actionPage, companyData,
    // adminDetail
  } = useSelector(
    (state) => state.agencyReducer,
  );

  const { permission, roleLevel } = useSelector((state) => state.authenReducer);

  const dispatch = useDispatch();

  const [value, setValue] = useState(1);

  const history = useHistory();
  const { t } = useTranslation();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [codeIdentity, setCode] = useState('');

  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listSubDistrict, setListSubDistrict] = useState([]);
  const [listAgencyType, setListAgencyType] = useState([]);
  const [listAgencyLevel, setListAgencyLevel] = useState([]);
  const [listAgencyBank, setListAgencyBank] = useState([]);
  const [listHub, setListHub] = useState([]);
  const [loading, setLoadIng] = useState(false);
  const [list_cod, setListCOD] = useState([]);
  const [list_discount, setListDiscount] = useState([]);
  const [list_bank, setListBank] = useState([]);
  const [list_bank_default, setListBankDefault] = useState([]);
  const [list_cod_default, setListCODDefault] = useState([]);
  const [list_discount_default, setListDiscountDefault] = useState([]);

  const [isCodDefault, setIsCODDefault] = useState(false);
  const [isDiscountDefault, setIsDiscountDefault] = useState(false);

  const [LatLng, setLatLng] = useState({ lat: 13.0, lng: 100.0 });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [detail, setDetail] = useState({});

  const [form] = Form.useForm();
  const {
    match: {
      params: { agencyId },
    },
    pageCode,
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };

  const itemLayout = { xs: 24, sm: { span: 20 } };
  const formItemStyle = { marginBottom: 6 };
  const formItemDistrict = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    if (value == 1) {
      setFirstName(t('agency-fistname'));
      setLastName(t('agency-lastname'));
      setCode(t('store-customer-id-card'));
    } else {
      setFirstName(t('agency-name-company'));
      setLastName(t('agency-name-contact'));
      setCode(t('agency-tag-no'));
    }
  }, [t]);

  useEffect(() => {
    getAgencyBankData();
  }, [actionPage]);

  const getAgencyBankData = () => {
    // setLoadIng(true)
    fetch({
      method: 'get',
      url: '/bank',
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          let i = 0;
          const list = [];
          for (i = 0; i < resData.length; i++) {
            if (resData[i].companyData != null) {
              const obj = {
                key: resData[i].bankId,
                bankName: resData[i].bankName,
                bankCode: resData[i].bankCode,
                companyName: resData[i].companyData.companyName,
              };
              list.push(obj);
            }
          }
          setListAgencyBank(resData);
          if (agencyId != 'create') {
            console.log('data : ');
            callInformation(agencyId, resData);
          }
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const callInformation = async (agencyId, list_bank) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/agency/${agencyId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          if (res.data.data.type == 1) {
            // name = res.data.data.lastName
            setFirstName(t('agency-fistname'));
            setLastName(t('agency-lastname'));
            setCode(t('store-customer-id-card'));
          } else {
            //  name = res.data.data.contactName
            setFirstName(t('agency-name-company'));
            setLastName(t('agency-name-contact'));
            setCode(t('agency-tag-no'));
          }
          let z = 0;
          let objBank = {};
          const listBank = [];
          for (z = 0; z < res.data.data.agencyBanks.length; z++) {
            const { bankName } = list_bank.filter(
              (item) => item.bankId == res.data.data.agencyBanks[z].bankId,
            )[0];
            objBank = {
              bankAccountNo: res.data.data.agencyBanks[z].bankAccountNo,
              bankAccountName: res.data.data.agencyBanks[z].bankAccountName,
              bankId: bankName,
            };
            listBank.push(objBank);
          }
          setListBankDefault(listBank);
          const initFormData = {
            hubId: res.data.data?.hubData?.hubName,
            // hubId:
            //   res.data.data.hubData == null
            //     ? ''
            //     : res.data.data.hubData.hubName,
            agencyTypeId: res.data.data.agencyTypeData.agencyTypeName,
            agencyLevelId: res.data.data.agencyLevelData.agencyLevelName,
            isActive: res.data.data.isActive,
            provinceId: res.data.data.provinceData.provinceName,
            districtId: res.data.data.districtData.districtName,
            subdistrictId: res.data.data.subdistrictData.subdistrictName,
            postcode: res.data.data.postcode,
            firstName: res.data.data.firstName,
            agencyCode: res.data.data.agencyCode,
            taxNumber: res.data.data.taxNumber,
            lastName: res.data.data.lastName,
            contactName: res.data.data.contactName,
            commission: res.data.data.commission,
            addressNo: res.data.data.addressNo,
            addressSoi: res.data.data.addressSoi,
            addressMoo: res.data.data.addressMoo,
            addressRoad: res.data.data.addressRoad,
            addressOther: res.data.data.addressOther,
            lat: res.data.data.lat,
            lng: res.data.data.lng,
            companyName:
              res.data.data.companyData == null
                ? ''
                : res.data.data.companyData.companyName,
            phoneNo: res.data.data.phoneNo,
            contactName: res.data.data.contactName,
            hubName:
              res.data.data.hubData == null
                ? ''
                : res.data.data.hubData.hubName,
            // adminName: res.data.data.admin.name,
            // adminEmail: res.data.data.admin.email,
            // adminPhone: res.data.data.admin.phoneNo,
            // adminId: res.data.data.admin.userId,
            agencyBanks: listBank,
          };
          setDetail(initFormData);
          form.setFieldsValue(initFormData);
          setValue(res.data.data.type);
          const arrayCOD = JSON.parse(`[${res.data.data?.agencyCOD}]`);
          const arrayDiscount = JSON.parse(
            `[${res.data.data?.agencyDiscount}]`,
          );
          const discount = arrayDiscount.map((i) => `${i}%`);
          const cod = arrayCOD.map((i) => `${i}%`);
          setListDiscountDefault(discount);
          setListCODDefault(cod);
          setListBank(res.data.data.agencyBanks);
          //  fetch - setLatLng
          if (res.data.data?.lat && res.data.data?.lng) {
            setLatLng({
              lat: parseFloat(res.data.data?.lat),
              lng: parseFloat(res.data.data?.lng),
            });
          }
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(allAction.agencyAction.deleteAgencyDetail(id))
          .then(() => {
            message.success('Delete Success!');
            history.push('../agency-management');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() { },
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function changeLatLng() {
    const lat = form.getFieldValue('lat');
    const lng = form.getFieldValue('lng');

    let new_latlng;

    if (!lat || !lng) {
      new_latlng = {
        lat: 13.0,
        lng: 100.0,
      };
    } else {
      new_latlng = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
    }

    setLatLng(new_latlng);
    console.log(new_latlng);
  }

  //  onSearchMap
  const onSearchMap = (value) => {
    form.setFieldsValue({
      lat: value?.lat.toFixed(6),
      lng: value?.lng.toFixed(6),
    });

    console.log(value);
  };

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
          <Card
            title={(
              <Typography.Title level={3}>
                <span className="text-primary">{t('agency-head-detail')}</span>
              </Typography.Title>
            )}
            extra={
              FilterPermission('isDelete') && (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ width: isMobile ? '100%' : '100px' }}
                  onClick={() => showConfirm(agencyId)}
                >
                  {t('delete')}
                </Button>
              )
            }
          >
            <Form
              layout="horizontal"
              name="search"
              form={form}
              {...formItemLayout}
              onFinishFailed={() => message.error('Please fill out the information completely.')}
            >
              <Tabs type="card">
                <TabPane tab={t('agency-tabs')} key="1">
                  {roleLevel == 'SAD' ? (
                    <Row gutter={[8, 8]} align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                        <Form.Item>
                          <Typography.Text>{t('company')}</Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                        <Form.Item>
                          <span
                            className="ant-form-text"
                            style={{ paddingLeft: 24 }}
                          >
                            {detail.companyName}
                            {' '}
                          </span>
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : (
                    <></>
                  )}

                  <Row gutter={[8, 8]} align="middle">
                    <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                      <Form.Item>
                        <Typography.Text style={{ fontFamily: 'KanitRegular' }}>
                          {t('agency-code')}
                          {' '}
                          :
                          {' '}
                        </Typography.Text>
                      </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                      <Form.Item
                        name="agencyCode"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Agency Code!',
                          },
                        ]}
                      >
                        <Typography.Text
                          style={{
                            fontFamily: 'KanitRegular',
                            paddingLeft: 32,
                          }}
                        >
                          {detail.agencyCode}
                        </Typography.Text>
                      </Form.Item>
                    </Col>

                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 3 }}
                      xxl={{ span: 3, offset: 1 }}
                    >
                      <Form.Item name="isActive" valuePropName="checked">
                        <Checkbox
                          style={{ fontFamily: 'KanitRegular' }}
                          disabled
                        >
                          {t('hubs-close')}
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                      {/* <Form.Item>
                        <Typography.Text style={{ fontFamily: 'KanitRegular' }}>
                          {t('agency-balance')}
                        </Typography.Text>
                      </Form.Item> */}
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                      {/* <Form.Item
                        style={{
                          backgroundColor: '#96d976',
                          textAlign: 'center',
                        }}
                      >
                        <Typography.Text style={{ fontFamily: 'KanitRegular' }}>
                          0
                        </Typography.Text>
                      </Form.Item> */}
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                      {/* <Form.Item>
                        <Typography.Text
                          style={{
                            fontFamily: 'KanitRegular',
                            paddingLeft: 34,
                          }}
                        >
                          {t('agency-bath')}
                        </Typography.Text>
                      </Form.Item> */}
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 1 }}>
                      {/* <Form.Item>
                        <Image
                          style={{ marginTop: 4 }}
                          width={40}
                          src="https://ucarecdn.com/03fcaf34-3028-4332-ab54-53fc8afc5eba/about_icon_mpaystation.png"
                        />
                      </Form.Item> */}
                    </Col>
                  </Row>

                  <Card
                    style={{ fontFamily: 'KanitRegular' }}
                    title={t('agency-detail')}
                  >
                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <Form.Item>
                          <Radio.Group value={value} disabled>
                            <Radio value={1}>{t('agency-person')}</Radio>
                            <Radio value={2} style={{ marginLeft: 20 }}>
                              {t('agency-company')}
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                        <Form.Item>
                          <Typography.Text>
                            {firstname}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="firstName"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your First Name!',
                            },
                          ]}
                        >
                          <Typography.Text
                            style={{
                              fontFamily: 'KanitRegular',
                              paddingLeft: 32,
                            }}
                          >
                            {detail.firstName}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 3, offset: 1 }}>
                        <Form.Item>
                          <Typography.Text>
                            {lastname}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        {value == 1 ? (
                          <Form.Item
                            name="lastName"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Last Name!',
                              },
                            ]}
                          >
                            <Typography.Text
                              style={{
                                fontFamily: 'KanitRegular',
                                paddingLeft: 32,
                              }}
                            >
                              {detail.lastName}
                            </Typography.Text>
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name="contactName"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Contact Name!',
                              },
                            ]}
                          >
                            <Typography.Text
                              style={{
                                fontFamily: 'KanitRegular',
                                paddingLeft: 32,
                              }}
                            >
                              {detail.contactName}
                            </Typography.Text>
                          </Form.Item>
                        )}
                      </Col>
                    </Row>

                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                        <Form.Item>
                          <Typography.Text>{codeIdentity}</Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="taxNumber"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Tax Number!',
                            },
                          ]}
                        >
                          <Typography.Text
                            style={{
                              fontFamily: 'KanitRegular',
                              paddingLeft: 32,
                            }}
                          >
                            {detail.taxNumber}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 3, offset: 1 }}>
                        <Form.Item>
                          <Typography.Text>
                            {t('setting-agency-category')}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="agencyTypeId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your Agency Type!',
                            },
                          ]}
                        >
                          <Typography.Text
                            style={{
                              fontFamily: 'KanitRegular',
                              paddingLeft: 32,
                            }}
                          >
                            {detail.agencyTypeId}
                          </Typography.Text>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                        <Form.Item>
                          <Typography.Text>
                            {' '}
                            {t('information-phone')}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="phoneNo"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Phone no!',
                            },
                          ]}
                        >
                          <Typography.Text
                            style={{
                              fontFamily: 'KanitRegular',
                              paddingLeft: 32,
                            }}
                          >
                            {detail.phoneNo}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 3, offset: 1 }}>
                        <Form.Item>
                          <Typography.Text>
                            {' '}
                            {t('setting-agency-degree')}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="agencyLevelId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your Agency Level!',
                            },
                          ]}
                        >
                          <Typography.Text
                            style={{
                              fontFamily: 'KanitRegular',
                              paddingLeft: 32,
                            }}
                          >
                            {detail.agencyLevelId}
                          </Typography.Text>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                        <Form.Item>
                          <Typography.Text>
                            {t('hub-name')}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="hubId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your Hub!',
                            },
                          ]}
                        >
                          <Typography.Text
                            style={{
                              fontFamily: 'KanitRegular',
                              paddingLeft: 32,
                            }}
                          >
                            {detail.hubId}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 3, offset: 1 }}>
                        <Form.Item>
                          <Typography.Text>
                            {' '}
                            {t('commission')}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="commission"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your Commission',
                            },
                          ]}
                        >
                          <Typography.Text
                            style={{
                              fontFamily: 'KanitRegular',
                              paddingLeft: 32,
                            }}
                          >
                            {detail.commission}
                          </Typography.Text>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{ fontFamily: 'KanitRegular', marginTop: 24 }}
                    title={t('setting-agency-degree-discount')}
                  >
                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <Form.Item
                          name="agencyDiscount"
                          rules={[
                            {
                              required: list_discount_default.length == 0,
                              message: 'Please input your Level Discount!',
                            },
                          ]}
                        >
                          <ScrollMenu
                            data={list_discount_default.map((item, index) => (
                              <Tag
                                style={{
                                  marginLeft: 8,
                                  marginRight: 8,
                                  marginTop: 4,
                                }}
                                color="blue"
                              >
                                {item}
                              </Tag>
                            ))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{ fontFamily: 'KanitRegular', marginTop: 24 }}
                    title={t('setting-agency-degree-cod')}
                  >
                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <Form.Item
                          name="agencyCOD"
                          rules={[
                            {
                              required: list_cod_default.length == 0,
                              message: 'Please input your Level COD!',
                            },
                          ]}
                        >
                          <ScrollMenu
                            data={list_cod_default.map((item, index) => (
                              <Tag
                                style={{
                                  marginLeft: 8,
                                  marginRight: 8,
                                  marginTop: 4,
                                }}
                                color="blue"
                              >
                                {item}
                              </Tag>
                            ))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{ fontFamily: 'KanitRegular', marginTop: 32 }}
                    title={t('address-location')}
                  >
                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                        <Form.Item>
                          <Typography.Text>
                            {t('lat')}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item>
                          <span className="ant-form-text">
                            {detail?.lat}
                            {' '}
                          </span>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 2, offset: 1 }}>
                        <Form.Item>
                          <Typography.Text>
                            {t('lng')}
                            {' '}
                            :
                            {' '}
                          </Typography.Text>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item>
                          <span className="ant-form-text">
                            {detail?.lng}
                            {' '}
                          </span>
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item>
                          <Typography.Text>
                            <Image
                              height={32}
                              width={52}
                              style={{
                                marginLeft: 20,
                                paddingLeft: '20px',
                                cursor: 'pointer',
                              }}
                              src={gmap_icon}
                              preview={false}
                              onClick={() => {
                                showModal();
                              }}
                            />
                          </Typography.Text>
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
                          <span>{detail.addressNo || '-'}</span>
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
                          <span>{detail.addressMoo || '-'}</span>
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
                          <span>{detail?.addressSoi || '-'}</span>
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
                          <span>{detail?.addressRoad || '-'}</span>
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
                          <span>{detail?.addressOther || '-'}</span>
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
                          <span>{detail?.postcode || '-'}</span>
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
                        >
                          <span>{detail?.subdistrictId || '-'}</span>
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
                          <span>{detail?.districtId || '-'}</span>
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
                          <span>{detail?.provinceId || '-'}</span>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{ fontFamily: 'KanitRegular', marginTop: 24 }}
                    title={t('bank')}
                  >
                    <Form.List name="agencyBanks">
                      {(fields, { add, remove }) => fields.map((field, index) => (
                        <Row align="middle" key={field.key}>
                          <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <Form.Item>
                              <Typography.Text>
                                {t('bank')}
                                {' '}
                                :
                                {' '}
                              </Typography.Text>
                            </Form.Item>
                          </Col>

                          <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <Form.Item>
                              <Typography.Text
                                style={{
                                  fontFamily: 'KanitRegular',
                                  textAlign: 'center',
                                }}
                              >
                                {list_bank_default[index].bankId}
                              </Typography.Text>
                            </Form.Item>
                          </Col>

                          <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <Form.Item>
                              <Typography.Text>
                                {t('bank-no')}
                                {' '}
                                :
                                {' '}
                              </Typography.Text>
                            </Form.Item>
                          </Col>

                          <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <Form.Item>
                              <Typography.Text
                                style={{
                                  fontFamily: 'KanitRegular',
                                  textAlign: 'center',
                                }}
                              >
                                {list_bank_default[index].bankAccountNo}
                              </Typography.Text>
                            </Form.Item>
                          </Col>

                          <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <Form.Item>
                              <Typography.Text>
                                {t('bank-name')}
                                {' '}
                                :
                                {' '}
                              </Typography.Text>
                            </Form.Item>
                          </Col>

                          <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <Form.Item>
                              <Typography.Text
                                style={{
                                  fontFamily: 'KanitRegular',
                                  textAlign: 'center',
                                }}
                              >
                                {list_bank_default[index].bankAccountName}
                              </Typography.Text>
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                    </Form.List>
                  </Card>
                </TabPane>
                {/*
                <TabPane tab={t('admin')} key="2">
                  <Form
                    layout="horizontal"
                    name="search"
                    form={form}
                    {...formItemLayout}
                  >
                    <Col {...itemLayout}>
                      <Form.Item label={t('username')} name="name">
                        <span className="ant-form-text">
                          {detail?.adminName}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('email')} name="email">
                        <span className="ant-form-text">
                          {detail?.adminEmail}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('phone')} name="phoneNo">
                        <span className="ant-form-text">
                          {detail?.adminPhone || '-'}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                  </Form>
                </TabPane> */}
              </Tabs>

              <Form.Item style={{ marginTop: '50px' }}>
                {isMobile ? (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        {FilterPermission('isUpdate') && (
                          <Button
                            type="primary"
                            onClick={() => dispatch(
                              allAction.agencyAction.setActionPage('edit'),
                            )}
                            icon={<EditOutlined />}
                            block
                          >
                            {t('edit')}
                          </Button>
                        )}
                      </Col>
                      <Col xs={24}>
                        <Button
                          type="default"
                          icon={<RollbackOutlined />}
                          onClick={() => history.push('../agency-management')}
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
                      onClick={() => history.push('../agency-management')}
                      style={{ width: '100px', float: 'right', marginLeft: 15 }}
                    >
                      {t('cancel')}
                    </Button>
                    {FilterPermission('isUpdate') && (
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        style={{ width: '100px', float: 'right' }}
                        onClick={() => dispatch(allAction.agencyAction.setActionPage('edit'))}
                      >
                        {t('edit')}
                      </Button>
                    )}
                  </>
                )}
              </Form.Item>
            </Form>
          </Card>
          <Modal
            title={t('show-map')}
            visible={isModalVisible}
            width={1000}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {isModalVisible && (
              <Map {...props} onSearchMap={onSearchMap} LatLng={LatLng} />
            )}
          </Modal>
        </Layout>
      </Spin>
    </>
  );
};

export default AgencysDetail;
