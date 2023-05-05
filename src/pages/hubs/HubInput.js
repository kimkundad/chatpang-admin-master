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
  Checkbox,
  Card,
  Divider,
  Modal,
  Tabs,
  Image,
  Alert,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  RollbackOutlined,
  SaveOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';
import HubDetail from './HubDetail';

import Map from './component/Map';
import gmap_icon from '../../assets/gmap_icon.png';

const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;

const HubsInput = (props) => {
  const {
    actionPage, companyData,
    //  adminDetail
  } = useSelector(
    (state) => state.hubReducer,
  );
  const { isMobile } = useSelector((state) => state.mainReducer);
  const { roleLevel } = useSelector((state) => state.authenReducer);
  const [loading, setLoadIng] = useState(false);
  const {
    match: {
      params: { hubId },
    },
  } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listSubDistrict, setListSubDistrict] = useState([]);

  const [province, setProviceID] = useState(0);
  const [district, setDistrictID] = useState(0);
  const [subDistrict, setSubDistrictID] = useState(0);
  // const [adminId, setAdminID] = useState(0);
  const [comId, setComID] = useState(0);

  // const [adminName, setAdminName] = useState('');
  // const [adminPhone, setAdminPhone] = useState('');
  // const [adminEmail, setAdminEmail] = useState('');
  const [LatLng, setLatLng] = useState({ lat: 13.0, lng: 100.0 });

  const [isSelectProvince, setIsSelectProvince] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isSelectSubDistrict, setIsSelectSubDistrict] = useState(false);
  const [isSelectCompany, setIsSelectCompany] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [isCheckPostCode, setIsCheckPostCode] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckPostCodeValidate, setIsCheckPostCodeValidate] = useState(false);

  const [tabSelect, setTabSelect] = useState('1');

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (hubId === 'create') {
      const initFormData = {
        hubCode: '',
        isActive: true,
        provinceId: '',
        districtId: '',
        subdistrictId: '',
        postcode: '',
        addressNo: '',
        addressSoi: '',
        addressMoo: '',
        addressRoad: '',
        addressOther: '',
        lat: '',
        lng: '',
        companyName: '',
        phoneNo: '',
        contactName: '',
        hubName: '',
        // adminName: '',
        // adminEmail: '',
        // adminPhone: '',
        // adminId: '',
      };
      form.setFieldsValue(initFormData);
      callProvince();
    } else {
      async function fetchMyAPI() {
        callInformation(hubId);
      }
      fetchMyAPI();
    }
  }, [actionPage]);

  const callInformation = async (hubId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/hub/${hubId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          const initFormData = {
            hubCode: res.data.data.hubCode,
            isActive: res.data.data.isActive,
            provinceId: res.data.data.provinceId,
            districtId: res.data.data.districtId,
            subdistrictId: res.data.data.subdistrictId,
            postcode: res.data.data.postcode,
            addressNo: res.data.data.addressNo,
            addressSoi: res.data.data.addressSoi,
            addressMoo: res.data.data.addressMoo,
            addressRoad: res.data.data.addressRoad,
            addressOther: res.data.data.addressOther,
            lat: res.data.data.lat,
            lng: res.data.data.lng,
            companyName: res.data.data.companyData.companyName,
            phoneNo: res.data.data.phoneNo,
            contactName: res.data.data.contactName,
            hubName: res.data.data.hubName,
            // adminName: res.data.data.admin.name,
            // adminEmail: res.data.data.admin.email,
            // adminPhone: res.data.data.admin.phoneNo,
            // adminId: res.data.data.admin.userId,
          };
          form.setFieldsValue(initFormData);
          setProviceID(res.data.data.provinceId);
          setDistrictID(res.data.data.districtId);
          setSubDistrictID(res.data.data.subdistrictId);
          setComID(res.data.data.companyId);
          // setAdminID(res.data.data.admin.userId);
          // setAdminName(res.data.data.admin.name);
          // setAdminPhone(res.data.data.admin.phoneNo);
          // setAdminEmail(res.data.data.admin.email);
          callProvince();
          callDistrict(res.data.data.provinceId);
          callSubDistrict(res.data.data.districtId);

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

  const callProvince = async () => {
    // setLoadIng(true);
    fetch({
      method: 'get',
      url: '/master/province',
    })
      .then((res) => {
        // setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListProvince(list);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  const callDistrict = async (provinceId) => {
    // setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/district/?provinceId=${provinceId}`,
    })
      .then((res) => {
        // setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListDistrict(list);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  const callSubDistrict = async (districtId) => {
    // setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/subdistrict/?districtId=${districtId}`,
    })
      .then((res) => {
        // setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          let chkHasPostcode = false;
          const pc = form.getFieldValue('postcode');
          for (i = 0; i < res.data.data.length; i++) {
            if (pc && res.data.data[i].postcode === pc) chkHasPostcode = true;
            console.log('res.data.data[i]', res.data.data[i]);
            list.push(res.data.data[i]);
          }
          if (!chkHasPostcode) {
            form.setFieldsValue({
              postcode: '',
            });
          }
          setListSubDistrict(list);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  //  handleSubmit ?
  const handleSubmit = (values) => {
    console.log('handleSubmit', values);
    // if (hubId == 'create'
    //   // && !values.adminName
    // ) {
    //   setTabSelect('2');
    //   window.scrollTo(0, 0);
    //   return message.error('Please fill out the information completely.');
    // }

    const companyId = companyData.filter(
      (item) => item.companyName == values.companyName,
    );

    console.log('companyId', companyId);

    let provinceId = 0;
    let districtId = 0;
    let subDistrictId = 0;
    let compId = 0;
    if (hubId == 'create') {
      if (typeof values.provinceId === 'string') {
        provinceId = province;
      } else {
        provinceId = Number(values.provinceId);
      }

      if (typeof values.districtId === 'string') {
        districtId = district;
      } else {
        districtId = Number(values.districtId);
      }
      subDistrictId = Number(values.subdistrictId);
      compId = companyId[0]?.companyId;
    } else {
      if (isSelectProvince) {
        provinceId = Number(values.provinceId);
      } else {
        provinceId = province;
      }

      if (isSelectDistrict) {
        districtId = Number(values.districtId);
      } else {
        districtId = district;
      }

      if (isSelectSubDistrict) {
        subDistrictId = Number(values.subdistrictId);
      } else {
        subDistrictId = subDistrict;
      }

      if (isSelectCompany) {
        compId = companyId[0]?.companyId;
      } else {
        compId = comId;
      }
    }
    let dataSubmit = {};
    if (hubId == 'create') {
      dataSubmit = {
        hub: {
          hubName: values.hubName,
          hubCode: values.hubCode,
          contactName: values.contactName,
          phoneNo: values.phoneNo,
          isActive: values.isActive,
          companyId: roleLevel == 'SAD' ? compId : null,
          lat: parseFloat(values.lat),
          lng: parseFloat(values.lng),
          provinceId,
          districtId,
          subdistrictId: subDistrictId,
          postcode: values.postcode,
          addressNo: values.addressNo,
          addressSoi: values.addressSoi,
          addressMoo: values.addressMoo,
          addressRoad: values.addressRoad,
          addressOther: values.addressOther,
        },
        // admin: {
        //   name: values.adminName,
        //   phoneNo: values.adminPhone,
        //   email: values.adminEmail,
        //   password: values.password,
        // },
      };
    } else {
      dataSubmit = {
        hub: {
          hubName: values.hubName,
          hubCode: values.hubCode,
          contactName: values.contactName,
          phoneNo: values.phoneNo,
          isActive: values.isActive,
          companyId: roleLevel == 'SAD' ? compId : null,
          lat: parseFloat(values.lat),
          lng: parseFloat(values.lng),
          provinceId,
          districtId,
          subdistrictId: subDistrictId,
          postcode: values.postcode,
          addressNo: values.addressNo,
          addressSoi: values.addressSoi,
          addressMoo: values.addressMoo,
          addressRoad: values.addressRoad,
          addressOther: values.addressOther,
        },
        // admin: {
        //   name: values.adminName || adminName,
        //   phoneNo: values.adminPhone || adminPhone,
        //   email: values.adminEmail || adminEmail,
        //   userId: adminId,
        // },
      };
    }

    Modal.confirm({
      title:
        hubId === 'create'
          ? 'Do you want to create Hub ?'
          : 'Do you want to update Hub ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        window.scrollTo(0, 0);
        if (hubId === 'create') {
          dispatch(allAction.hubAction.createHubDetail(dataSubmit))
            .then(() => {
              message.success('Create Success!');
              history.push('../hub-management');
            })
            .catch((e) => message.error(e.message));
        } else {
          dispatch(allAction.hubAction.updateHubDetail(hubId, dataSubmit))
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.hubAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        }
      },
      onCancel() { },
    });
  };

  const handleFilterProvice = (value) => {
    callDistrict(value);
    setIsSelectProvince(true);
    setIsFirst(true);
    setListDistrict([]);
    setListSubDistrict([]);
    form.setFieldsValue({
      districtId: '',
      subdistrictId: '',
      postcode: '',
    });
  };

  const handleFilterDistrict = (value) => {
    if (value === '') {
      callDistrict(province);
      form.setFieldsValue({
        postcode: '',
        districtId: '',
      });
      // return null;
    }

    callSubDistrict(value);
    setIsSelectDistrict(true);
    if (isCheckPostCode) {
      form.setFieldsValue({
        subdistrictId: '',
      });
    } else {
      form.setFieldsValue({
        subdistrictId: '',
        // postcode: '',
      });
    }
  };

  const handleFilterSubDistrict = (value) => {
    if (value === '') return null;
    console.log(value);
    console.log(listSubDistrict);
    const found = listSubDistrict.find((item) => {
      console.log(value, item);
      if (item?.subdistrictId === value) return true;
    });

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

  const handleFilterCompany = (value) => {
    setIsSelectCompany(true);
  };

  const onChangePostcode = (e) => {
    if (e.target.value === '') {
      setListDistrict([]);
      setListSubDistrict([]);
      form.setFieldsValue({
        provinceId: '',
        districtId: '',
        subdistrictId: '',
      });
      setIsCheckPostCode(false);
      return false;
    }
    if (e.target.value.length === 5) {
      // setLoadIng(true);
      fetch({
        method: 'get',
        url: `/master/postcode/?postcode=${e.target.value}`,
      })
        .then((res) => {
          // setLoadIng(false);
          if (res.data.success) {
            // if(!res?.data?.data?.province?.provinceId) return f

            setIsCheckPostCode(true);
            setProviceID(res.data.data.province.provinceId);
            console.log('res.data.data.district', res.data.data.district);

            if (res.data.data.district.length === 1) {
              setDistrictID(res.data.data.district[0].districtId);
            }

            //* ****/
            setListSubDistrict(res.data.data.subdistrict);

            if (comId === 0) {
              callProvince(0, 'new');
            } else {
              callProvince(comId, 'filter');
            }
            // callDistrict(res.data.data.province.provinceId);
            setListDistrict(res.data.data.district);
            // if (res.data.data.district.length === 1) {
            // callSubDistrict(res.data.data.district[0].districtId);
            // }
            // setListDistrict([])
            // setListSubDistrict([])

            form.setFieldsValue({
              provinceId: res.data.data.province.provinceId,
              districtId: res.data.data.district.length === 1
                ? res.data.data.district[0].districtId : '',
              subdistrictId: res.data.data.subdistrict.length === 1
                ? res.data.data.subdistrict[0].subdistrictId : '',
            });
            // form.setFieldsValue({
            //   provinceId: res.data.data.province.provinceId,
            //   districtId: res.data.data.district[0].districtId,
            //   subdistrictId: '',
            // });
          } else {
            setListDistrict([]);
            setListSubDistrict([]);
            form.setFieldsValue({
              provinceId: '',
              districtId: '',
              subdistrictId: '',
            });
            setIsCheckPostCode(false);
          }
        })
        .catch((error) => {
          setListDistrict([]);
          setListSubDistrict([]);
          form.setFieldsValue({
            provinceId: '',
            districtId: '',
            subdistrictId: '',
          });
          setIsCheckPostCode(false);
        });
    }
  };

  function isInputDouble(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9.]/.test(ch)) {
      evt.preventDefault();
    }
  }

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 8 },
      lg: { span: 8 },
    },
  };

  const itemLayout = { xs: 24, sm: { span: 20 } };
  const formItemStyle = { marginBottom: 12 };

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

    // if (!/[0-9.]/.test(ch)) {
    //   evt.preventDefault();
    // }

    // setLatLng
  }

  const onSearchMap = (value) => {
    form.setFieldsValue({
      lat: value?.lat.toFixed(6),
      lng: value?.lng.toFixed(6),
    });

    console.log(value);
  };

  const onChangeEmail = (e) => {
    const { value } = e.target;

    form.setFieldsValue({
      adminEmail: value.replace(
        /[^\S]|<|>|\(|\)|`|\$|%|\^|\&|\*|\+|=|"|:|;|\?|,/g,
        '',
      ),
    });
  };

  if (hubId !== 'create' && actionPage === 'view') {
    return <HubDetail {...props} />;
  }

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
          <Card
            title={(
              <Typography.Title level={3}>
                <span className="text-primary">
                  {hubId === 'create'
                    ? t('hubs-head-create')
                    : t('hubs-head-edit')}
                </span>
              </Typography.Title>
            )}
          >
            <Form
              layout="horizontal"
              name="search"
              form={form}
              {...formItemLayout}
              onFinish={handleSubmit}
            // onFinishFailed={(values) => {
            //   // if (!values.adminName) {
            //   //   setTabSelect('2');
            //   //   window.scrollTo(0, 0);
            //   // }

            //   message.error('Please fill out the information completely.');
            // }}
            >
              <Tabs
                type="card"
                activeKey={tabSelect}
                onTabClick={(key) => {
                  setTabSelect(key);
                }}
              >
                <TabPane tab={t('hub-name')} key="1">
                  {roleLevel == 'SAD' ? (
                    <Row
                      gutter={[8, 8]}
                      align="middle"
                      style={{ marginBottom: -10 }}
                    >
                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          label={t('company')}
                          name="companyName"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Company Name!',
                            },
                          ]}
                        >
                          <Select
                            defaultValue={t('all-select')}
                            onChange={handleFilterCompany}
                            disabled={hubId != 'create'}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {companyData.map((item) => (
                              <Option key={item.companyName}>
                                {item.companyName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : (
                    <></>
                  )}

                  <Row
                    gutter={[8, 8]}
                    align="middle"
                    style={{ marginBottom: -10 }}
                  >
                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                      <Form.Item
                        name="hubCode"
                        label={t('hubs_code')}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Hub Code!',
                          },
                        ]}
                      >
                        <Input
                          style={{ fontFamily: 'KanitRegular' }}
                          disabled={hubId != 'create'}
                        />
                      </Form.Item>
                    </Col>

                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 15, offset: 1 }}
                      xxl={{ span: 15, offset: 1 }}
                    >
                      <Form.Item name="isActive" valuePropName="checked">
                        <Checkbox style={{ fontFamily: 'KanitRegular' }}>
                          {t('hubs-close')}
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Card
                    style={{ fontFamily: 'KanitRegular', marginTop: 24 }}
                    title={t('hubs-detail')}
                  >
                    <Row
                      align="middle"
                      style={{ marginBottom: -8 }}
                      gutter={[8, 8]}
                    >
                      <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                        <Form.Item
                          name="hubName"
                          label={t('hubs_name')}
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Hub Name!',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row
                      align="middle"
                      style={{ marginBottom: -8 }}
                      gutter={[8, 8]}
                    >
                      <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                        <Form.Item
                          label={t('hubs_contact')}
                          name="contactName"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Contact Name!',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: -8 }} gutter={[8, 8]}>
                      <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                        <Form.Item
                          label={t('information-phone')}
                          name="phoneNo"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your phone!',
                            },
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputNumber(event);
                            }}
                            maxLength={10}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{
                      fontFamily: 'KanitRegular',
                      marginTop: 32,
                      paddingLeft: 12,
                      paddingRight: 12,
                    }}
                    bodyStyle={{ padding: 0 }}
                    title={t('address-location')}
                  >
                    <Row
                      align="middle"
                      style={{
                        marginTop: 16,
                        marginBottom: -10,
                      }}
                    >
                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="lat"
                          label={t('lat')}
                          rules={[
                            {
                              required: true,
                              message: 'Please input your lat!',
                            },
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputDouble(event);
                            }}
                            onChange={changeLatLng}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          label={t('lng')}
                          name="lng"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your lng!',
                            },
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputDouble(event);
                            }}
                            onChange={changeLatLng}
                          />
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

                    <Row>
                      <Col xs={6} lg={3}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-number')}
                          name="addressNo"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your No!',
                            },
                          ]}
                        >
                          <Input
                            autocomplete="new-password"
                            placeholder={t('address-number')}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={6} lg={3}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-village')}
                          name="addressMoo"
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
                          name="addressSoi"
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
                          name="addressRoad"
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
                          name="addressOther"
                        >
                          <Input
                            autocomplete="new-password"
                            placeholder={t('address-other')}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-postal')}
                          name="postcode"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your postcode!',
                            },
                          ]}
                        >
                          <Input
                            autocomplete="new-password"
                            placeholder={t('address-postal')}
                            onChange={onChangePostcode}
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
                            {
                              required: true,
                              message: 'Please select your Sub District!',
                            },
                          ]}

                        >
                          <Select
                            defaultValue={t('all-select')}
                            onChange={handleFilterSubDistrict}
                            showSearch
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listSubDistrict.map((item) => {
                              if (form.getFieldValue('postcode')) {
                                if (item.postcode !== form.getFieldValue('postcode')) { return null; }
                              }
                              return (
                                <Option
                                  value={item.subdistrictId}
                                  key={item.subdistrictId}
                                >
                                  {item.subdistrictName}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={12} lg={6}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-district')}
                          name="districtId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your District!',
                            },
                          ]}
                        >
                          <Select
                            defaultValue={t('all-select')}
                            onChange={handleFilterDistrict}
                            showSearch
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listDistrict.map((item) => (
                              <Option
                                value={item.districtId}
                                key={item.districtId}
                              >
                                {item.districtName}
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
                          rules={[
                            {
                              required: true,
                              message: 'Please select your Province!',
                            },
                          ]}
                          defaultValue={t('all-select')}
                        >
                          <Select
                            showSearch
                            onChange={handleFilterProvice}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listProvince.map((item) => (
                              <Option
                                value={item.provinceId}
                              // key={item.provinceId}
                              >
                                {item.provinceName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </TabPane>
                {/* <TabPane tab={t('admin')} key="2">
                  <>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('username')}
                        name="adminName"
                        rules={[
                          { required: true, message: 'Please input Name!' },
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('username')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('phone')}
                        name="adminPhone"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Phone No!',
                          },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              if (
                                !value
                                || getFieldValue('adminPhone').length === 10
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                'Please Input Phone Number Correct Format!',
                              );
                            },
                          }),
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('phone')}
                          onKeyPress={(event) => {
                            isInputNumber(event);
                          }}
                          maxLength={10}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('email')}
                        name="adminEmail"
                        rules={[
                          {
                            required: true,
                            message: 'Please input E-mail!',
                            type: 'email',
                          },
                        ]}
                      >
                        <Input
                          onChange={onChangeEmail}
                          autocomplete="new-password"
                          placeholder={t('email')}
                        />
                      </Form.Item>
                    </Col>
                    {hubId === 'create' && (
                      <>
                        <Col {...itemLayout}>
                          <Form.Item
                            label={t('first-password')}
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: 'Please input First Login Password!',
                              },
                            ]}
                          >
                            <Input.Password
                              autocomplete="new-password"
                              placeholder={t('first-password')}
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
                                  if (
                                    !value
                                    || getFieldValue('password') === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    'The two passwords that you entered do not match!',
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              autocomplete="new-password"
                              placeholder={t('confirm-password')}
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </>
                </TabPane> */}
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
                          onClick={() => history.push('../hub-management')}
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
                      onClick={() => handleCancel()}
                      style={{ width: '100px', float: 'Right', marginLeft: 15 }}
                      onClick={() => history.push('../hub-management')}
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

export default HubsInput;
