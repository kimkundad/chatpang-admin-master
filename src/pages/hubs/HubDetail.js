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
  Modal,
  Tag,
  message,
  Card,
  Tabs,
  Checkbox,
  Select,
  Image,
} from 'antd';
import { useHistory } from 'react-router-dom';

import {
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';

import Map from './component/Map';
import gmap_icon from '../../assets/gmap_icon.png';

const { TabPane } = Tabs;

const HubDetail = (props) => {
  const {
    companyDetail,
    // adminDetail
  } = useSelector(
    (state) => state.hubReducer,
  );
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, roleLevel } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const [detail, setDetail] = useState({});

  const [LatLng, setLatLng] = useState({ lat: 13.0, lng: 100.0 });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    match: {
      params: { hubId },
    },
    pageCode,
  } = props;

  const history = useHistory();

  const [loading, setLoadIng] = useState(false);

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };
  const formItemStyle = { marginBottom: 6 };
  const formItemDistrict = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

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

  // onSearchMap
  const onSearchMap = (value) => {
    form.setFieldsValue({
      lat: value?.lat.toFixed(6),
      lng: value?.lng.toFixed(6),
    });

    console.log(value);
  };

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    async function fetchMyAPI() {
      callInformation(hubId);
    }
    fetchMyAPI();
  }, []);

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
            provinceId: res.data.data.provinceData.provinceName,
            districtId: res.data.data.districtData.districtName,
            subdistrictId: res.data.data.subdistrictData.subdistrictName,
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
          };
          setDetail(initFormData);
          // fetch - setLatLng
          if (res.data.data?.lat && res.data.data?.lng) {
            setLatLng({
              lat: parseFloat(res.data.data?.lat),
              lng: parseFloat(res.data.data?.lng),
            });
          }

          form.setFieldsValue(initFormData);
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
        dispatch(allAction.hubAction.deleteHubDetail(id))
          .then(() => {
            message.success('Delete Success!');
            history.push('../hub-management');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() { },
    });
  };

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Card
          title={(
            <Typography.Title level={3}>
              <span className="text-primary">{t('hubs-head-detail')}</span>
            </Typography.Title>
          )}
          extra={
            FilterPermission('isDelete') && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                style={{ width: isMobile ? '100%' : '100px' }}
                onClick={() => showConfirm(hubId)}
              >
                {t('delete')}
              </Button>
            )
          }
        >
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab={t('hub-name')} key="1">
              {roleLevel == 'SAD' ? (
                <Row gutter={[8, 8]} align="middle">
                  <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                    <Form.Item>
                      <Typography.Text>
                        {t('company')}
                        {' '}
                        :
                        {' '}
                      </Typography.Text>
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
                      {t('hubs_code')}
                      {' '}
                      :
                    </Typography.Text>
                  </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                  <Form.Item>
                    <span className="ant-form-text" style={{ paddingLeft: 24 }}>
                      {detail.hubCode}
                      {' '}
                    </span>
                  </Form.Item>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  lg={{ span: 18, offset: 1 }}
                  xxl={{ span: 18, offset: 1 }}
                >
                  <Form.Item>
                    <Checkbox
                      disabled
                      style={{ fontFamily: 'KanitRegular' }}
                      checked={detail.isActive}
                    >
                      {t('hubs-close')}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              <Card
                style={{ fontFamily: 'KanitRegular', marginTop: 24 }}
                title={t('hubs-detail')}
              >
                <Row align="middle">
                  <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                    <Form.Item>
                      <Typography.Text>
                        {t('hubs_name')}
                        {' '}
                        :
                        {' '}
                      </Typography.Text>
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} lg={{ span: 9 }}>
                    <Form.Item>
                      <span className="ant-form-text">
                        {detail?.hubName}
                        {' '}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>

                <Row align="middle">
                  <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                    <Form.Item>
                      <Typography.Text>
                        {t('hubs_contact')}
                        {' '}
                        :
                        {' '}
                      </Typography.Text>
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} lg={{ span: 9 }}>
                    <Form.Item>
                      <span className="ant-form-text">
                        {detail?.contactName}
                        {' '}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>

                <Row align="middle">
                  <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                    <Form.Item>
                      <Typography.Text>
                        {t('information-phone')}
                        {' '}
                        :
                        {' '}
                      </Typography.Text>
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} lg={{ span: 9 }}>
                    <Form.Item>
                      <span className="ant-form-text">
                        {detail?.phoneNo}
                        {' '}
                      </span>
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
            </TabPane>

            {/* <TabPane tab={t('admin')} key="2">
              <Form
                layout="horizontal"
                name="search"
                form={form}
                {...formItemLayout}
              >
                <Col {...itemLayout}>
                  <Form.Item label={t('username')} name="name">
                    <span className="ant-form-text">{detail?.adminName} </span>
                  </Form.Item>
                </Col>
                <Col {...itemLayout}>
                  <Form.Item label={t('email')} name="email">
                    <span className="ant-form-text">{detail?.adminEmail} </span>
                  </Form.Item>
                </Col>
                <Col {...itemLayout}>
                  <Form.Item label={t('phone')} name="phoneNo">
                    <span className="ant-form-text">
                      {detail?.adminPhone || '-'}{' '}
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
                        onClick={() => dispatch(allAction.hubAction.setActionPage('edit'))}
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
                  onClick={() => history.push('../hub-management')}
                  style={{ width: '100px', float: 'right', marginLeft: 15 }}
                >
                  {t('cancel')}
                </Button>
                {FilterPermission('isUpdate') && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ width: '100px', float: 'right' }}
                    onClick={() => dispatch(allAction.hubAction.setActionPage('edit'))}
                  >
                    {t('edit')}
                  </Button>
                )}
              </>
            )}
          </Form.Item>
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
      </Spin>
    </>
  );
};

export default HubDetail;
