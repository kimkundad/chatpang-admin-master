/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable quotes */
/* eslint-disable prefer-template */
/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable consistent-return */
/* eslint-disable vars-on-top */
/* eslint-disable semi */
/* eslint-disable no-restricted-syntax */
/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-var */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import {
  Form,
  Layout,
  Spin,
  Typography,
  Card,
  Row,
  Col,
  Input,
  Button,
  Modal,
  message,
  Avatar,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  RollbackOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';
import AdminDetail from './AdminDetail';
// import locations from '../../json/location.json';
// var _ = require('lodash');

// const { TextArea } = Input;
// const { Option } = Select;
const AdminInput = (props) => {
  const { actionPage } = useSelector((state) => state.lineReducer);
  const { isMobile } = useSelector((state) => state.mainReducer);
  const [loading, setLoadIng] = useState(false);
  const [image, setImage] = useState('');
  // const [listsProvince, setListProvince] = useState([]);
  // const [listsDistrict, setListDistrict] = useState([]);
  // const [listsSubDistrict, setListSubDistrict] = useState([]);
  // const [listsPostal, setListPostal] = useState([]);
  // const [province, setProvince] = useState('');
  // const [district, setDistrict] = useState('');
  // const [subDistrict, setSubDistrict] = useState('');

  const {
    match: {
      params: { adminId },
    },
  } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchMyAPI() {
      if (adminId !== 'create') {
        callInformation(adminId);
      }
    }
    fetchMyAPI();
  }, [actionPage]);

  // useEffect(() => {
  //     var provinces = _(locations)
  //         .groupBy(x => x.province)
  //         .map((value, key) => ({ province: key, items: value }))
  //         .value();
  //     var listProvince = [];
  //     for (const element of provinces) {
  //         var item = {
  //             province: element.province
  //         }
  //         listProvince.push(item);
  //     }
  //     setListProvince(listProvince);
  // }, []);

  // useEffect(() => {
  //     if (province !== '') {
  //         fetchDistrict(province);
  //     }
  // }, [province])

  // useEffect(() => {
  //     if (province !== '' && district !== '') {
  //         fetchSubDistrict(province, district);
  //     }
  // }, [province, district])

  // useEffect(() => {
  //     if (province !== '' && district !== '' && subDistrict !== '') {
  //         fetchPostal(province, district, subDistrict);
  //     }
  // }, [province, district, subDistrict])

  const callInformation = async (adminId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/admins/${adminId}`,
    })
      .then((res) => {
        const initFormData = {
          name: res.data.data.first_name + ' ' + res.data.data.last_name,
          email: res.data.data.email,
          imgURL: res.data.data.picture,
          username: res.data.data.username,
          password: res.data.data.password,
          phone: res.data.data.tel,
        };

        setLoadIng(false);
        form.setFieldsValue(initFormData);
        setImage(res.data.data.picture);
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  // //  handleSubmit ?
  const handleSubmit = (values) => {
    Modal.confirm({
      title:
        adminId === 'create'
          ? 'คุณต้องการสร้างผู้ดูเเลระบบ?'
          : 'คุณต้องการเเก้ไขผู้ดูเเลระบบ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (adminId === 'create') {
            console.log(values.name.split(/\s+/));
          var permissionsInput = {
            create: true,
            read: true,
            write: true,
            delete: true,
          };
          var obj = {
            first_name: values.name.split(/\s+/)[0],
            last_name: values.name.split(/\s+/)[1],
            email: values.email,
            picture: image,
            username: values.username,
            password: values.password,
            tel: values.phone,
            permissions: permissionsInput,
            role: 'admin',
          };
          window.scrollTo(0, 0);
          dispatch(allAction.adminAction.createAdminData(obj))
            .then(() => {
              message.success('Create Success!');
              history.push('../admin');
            })
            .catch((e) => message.error(e.message));
        } else {
          var objUpdate = {
            first_name: values.name.split(/\s+/)[0],
            last_name: values.name.split(/\s+/)[1],
            email: values.email,
            picture: image,
            username: values.username,
            tel: values.phone,
          };
          window.scrollTo(0, 0);
          dispatch(allAction.adminAction.updateAdminDetail(adminId, objUpdate))
            .then(() => {
              message.success('Update Success!');
              history.push('../admin');
            })
            .catch((e) => message.error(e.message));
        }
      },
      onCancel() {},
    });
  };

  const onChange = async (file) => {
    var bodyFormData = new FormData();
    bodyFormData.append('file', file.file.originFileObj);
    axios({
      method: 'post',
      url: 'https://chat-pang-api-fy5xytbcca-as.a.run.app/upload',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        setImage(res.data.data.public_url);
        // console.log('data : ', res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (adminId !== 'create' && actionPage === 'view') {
    return <AdminDetail {...props} />;
  }

  // function fetchDistrict(province) {
  //     var provinces = _(locations)
  //         .groupBy(x => x.province)
  //         .map((value, key) => ({ province: key, items: value }))
  //         .value();

  //     var amphoes = _(provinces.filter(item => item.province === province)[0].items)
  //         .groupBy(x => x.amphoe)
  //         .map((value, key) => ({ amphoe: key, items: value }))
  //         .value();

  //     var listAmphoes = []
  //     for (const element of amphoes) {
  //         listAmphoes.push(element.amphoe)
  //     }
  //     setListDistrict(listAmphoes)
  // }

  // function fetchSubDistrict(province, district) {
  //     var provinces = _(locations)
  //         .groupBy(x => x.province)
  //         .map((value, key) => ({ province: key, items: value }))
  //         .value();

  //     var amphoes = _(provinces.filter(item => item.province === province)[0].items)
  //         .groupBy(x => x.amphoe)
  //         .map((value, key) => ({ amphoe: key, items: value }))
  //         .value();

  //     var districtes = _(amphoes.filter(item => item.amphoe === district)[0].items)
  //         .groupBy(x => x.district)
  //         .map((value, key) => ({ district: key, items: value }))
  //         .value();

  //     var listDistrict = []
  //     for (const element of districtes) {
  //         listDistrict.push(element.district)
  //     }

  //     setListSubDistrict(listDistrict)
  // }

  // function fetchPostal(province, district, subDistrict) {
  //     var provinces = _(locations)
  //         .groupBy(x => x.province)
  //         .map((value, key) => ({ province: key, items: value }))
  //         .value();

  //     var amphoes = _(provinces.filter(item => item.province === province)[0].items)
  //         .groupBy(x => x.amphoe)
  //         .map((value, key) => ({ amphoe: key, items: value }))
  //         .value();

  //     var districtes = _(amphoes.filter(item => item.amphoe === district)[0].items)
  //         .groupBy(x => x.district)
  //         .map((value, key) => ({ district: key, items: value }))
  //         .value();

  //     console.log('districtes : ', districtes);

  //     var postals = _(districtes.filter(item => item.district === subDistrict)[0].items)
  //         .groupBy(x => x.zipcode)
  //         .map((value, key) => ({ zipcode: key, items: value }))
  //         .value();

  //     var listPostal = []
  //     for (const element of postals) {
  //         listPostal.push(element.zipcode)
  //     }

  //     setListPostal(listPostal);
  // }

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
      <Form.Item>
                        {isMobile ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Button
                                            type="default"
                                            icon={<RollbackOutlined />}
                                            onClick={() => history.push('../admin')}
                                            block
                                        >
                                            ยกเลิก
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="default"
                                    icon={<RollbackOutlined />}
                                    onClick={() => history.push('../admin')}
                                    style={{ width: '100px', float: 'left' }}
                                >
                                    ยกเลิก
                                </Button>
                            </>
                        )}
      </Form.Item>
        <Layout style={{ minHeight: '100vh' }}>
          <Card
            // eslint-disable-next-line react/jsx-indent-props
            title={
              <Typography.Title level={3}>
                <span>
                  {adminId === 'create'
                    ? 'สร้างผู้ดูเเลระบบ'
                    : 'Admin ID : ' + adminId }
                </span>
              </Typography.Title>
            }
          >
            <Form
              layout="horizontal"
              name="search"
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={[8, 8]} align="middle">
                {/* <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography.Text>รูปโปรไฟล์</Typography.Text>
                      <Avatar
                        src={image}
                        style={{ width: 100, height: 100, marginTop: 6 }}
                      />
                      <Upload
                        {...props}
                        onChange={onChange}
                        showUploadList={false}
                      >
                        <Button
                          style={{ marginTop: 12 }}
                          icon={<UploadOutlined />}
                        >
                          เเก้ไข
                        </Button>
                      </Upload>
                    </div>
                  </Form.Item>
                </Col> */}
                <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                        <Form.Item>
                                            <div style={{
 display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
}}
                                            >
                                                <Typography.Text>
                                                    รูปโปรไฟล์
                                                </Typography.Text>
                                                <Avatar src={image} style={{ width: 140, height: 140, marginTop: 6 }} />
                                                {/* </Form.Item> */}
                                                <Upload {...props} onChange={onChange} showUploadList={false}>
                                                    <Button style={{ marginTop: 18 }} icon={<UploadOutlined />}>เเก้ไข</Button>
                                                </Upload>
                                            </div>
                                        </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="name"
                    label="ชื่อ - นามสกุล"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Line Name!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="username"
                    label="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Username!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="email"
                    label="อีเมล"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Email!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="phone"
                    label="เบอร์โทรศัพท์"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Phone!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>
              </Row>
              {adminId === 'create' ? (
                <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                  <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                      name="password"
                      label="รหัสผ่าน"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Password!',
                        },
                      ]}
                    >
                      <Input style={{ fontFamily: 'KanitRegular' }} />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}

              {/* <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                    <Form.Item
                                        name="province"
                                        label="จังหวัด"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Province!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            optionFilterProp="children"
                                            defaultValue=""
                                            onChange={(e) => {
                                                setProvince(e)
                                            }}
                                        >
                                            <Option value="">{t('all-select')}</Option>
                                            {listsProvince
                                                && listsProvince.map((val) => (
                                                    <Option value={val.province}>{val.province}</Option>
                                                ))}

                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                    <Form.Item
                                        name="district"
                                        label="อำเภอ/เขต"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your District!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            optionFilterProp="children"
                                            defaultValue=""
                                            onChange={(e) => {
                                                setDistrict(e)
                                            }}
                                        >
                                            <Option value="">{t('all-select')}</Option>
                                            {listsDistrict
                                                && listsDistrict.map((val) => (
                                                    <Option value={val}>{val}</Option>
                                                ))}

                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                    <Form.Item
                                        name="subDistrict"
                                        label="ตำบล/เเขวง"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Sub District!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            optionFilterProp="children"
                                            defaultValue=""
                                            onChange={(e) => {
                                                setSubDistrict(e)
                                            }}
                                        >
                                            <Option value="">{t('all-select')}</Option>
                                            {listsSubDistrict
                                                && listsSubDistrict.map((val) => (
                                                    <Option value={val}>{val}</Option>
                                                ))}

                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                    <Form.Item
                                        name="postalCode"
                                        label="รหัสไปรษณีย์"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Postal code!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            optionFilterProp="children"
                                            defaultValue=""
                                        >
                                            <Option value="">{t('all-select')}</Option>
                                            {listsPostal
                                                && listsPostal.map((val) => (
                                                    <Option value={val}>{val}</Option>
                                                ))}

                                        </Select>
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                                <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                    <Form.Item
                                        name="address"
                                        label="ที่อยู่"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Address!',
                                            },
                                        ]}
                                    >

                                        <TextArea rows={6} />
                                    </Form.Item>
                                </Col>
                            </Row> */}
              <Form.Item style={{ marginTop: '12px' }}>
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
                      {/* <Col xs={24}>
                        <Button
                          type="default"
                          icon={<RollbackOutlined />}
                          onClick={() => history.push('../admin')}
                          block
                        >
                          {t('cancel')}
                        </Button>
                      </Col> */}
                    </Row>
                  </>
                ) : (
                  <>
                    {/* <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      style={{ width: '100px', float: 'Right', marginLeft: 15 }}
                      onClick={() => history.push('../admin')}
                    >
                      {t('cancel')}
                    </Button> */}
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
        </Layout>
      </Spin>
    </>
  );
};

export default AdminInput;
