/* eslint-disable no-unneeded-ternary */
/* eslint-disable radix */
/* eslint-disable quotes */
/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable comma-dangle */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable space-before-blocks */
/* eslint-disable keyword-spacing */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-max-props-per-line */
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
  Checkbox,
  Select
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  RollbackOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';
import PackageDetail from './PackageDetail';

const PackageInput = (props) => {
  const { actionPage } = useSelector((state) => state.lineReducer);
  const { isMobile } = useSelector((state) => state.mainReducer);
  const { id } = useSelector((state) => state.authenReducer);
  const [loading, setLoadIng] = useState(false);
  const [limited, setLimited] = useState(false);
  const {
    match: {
      params: { packageId },
    },
  } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchMyAPI() {
      if (packageId !== 'create') {
        callInformation(packageId);
      }
    }
    fetchMyAPI();
  }, [actionPage]);

  const callInformation = async (packageId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/packages/${packageId}`,
    })
      .then((res) => {
        setLoadIng(false);
        var list = []
        for (const element of res.data.data.options){
            list.push(element)
        }
        var size = 4 - res.data.data.options.length;
        if (size !== 0){
            for (let i = 0; i < size; i++) {
                list.push('')
            }
        }
        const initFormData = {
          id: res.data.data.id,
          name: res.data.data.name,
          price: res.data.data.price,
          detail: list,
          perDay: res.data.data.per_day,
          welcomemsg: res.data.data.welcomemsg,
          keywordmsg: res.data.data.keywordmsg,
          count: res.data.data.page_limit,
          days: res.data.data.days,
          line_notification_limit: res.data.data.line_notification_limit,
          quota_limit: res.data.data.quota_limit,
          special_text: res.data.data.special_text,
          quota_limit_comment_box: res.data.data.quota_limit_comment_box,
          quota_limit_comment_send: res.data.data.quota_limit_comment_send,
          isActive: res.data.data.status === 'active' ? true : false,
        };

        if (res.data.data.quota_limit === 1000000){
          setLimited(true)
        }else{
          setLimited(false)
        }
        form.setFieldsValue(initFormData);
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  // //  handleSubmit ?
  const handleSubmit = (values) => {
    var result = {
      name: values.name,
      price: parseInt(values.price),
      options: values.detail,
      status: values.isActive ? "active" : "inactive",
      pageLimit: parseInt(values.count),
      perDay: values.perDay,
      welcomemsg: values.welcomemsg,
      keywordmsg: values.keywordmsg,
      lineNotificationLimit: parseInt(values.line_notification_limit),
      quotaLimit: limited ? parseInt(1000000) : parseInt(values.quota_limit),
      quota_limit_comment_box: limited ? parseInt(1000000) : parseInt(values.quota_limit_comment_box),
      quota_limit_comment_send: limited ? parseInt(1000000) : parseInt(values.quota_limit_comment_send),
      specialText: values.special_text === 1 ? "ขายดี" : "ธรรมดา",
      days: parseInt(values.days),
    };
    Modal.confirm({
      title:
        packageId === 'create'
          ? 'คุณต้องการสร้าง Package?'
          : 'คุณต้องการเเก้ไข Package?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (packageId === 'create') {
          window.scrollTo(0, 0);
          dispatch(allAction.packageAction.createPackageData(result))
            .then(() => {
              message.success('Create Success!');
              history.push('../package');
            })
            .catch((e) => message.error(e.message));
        } else {
          dispatch(
            allAction.packageAction.updatePackageDetail(packageId, result)
          )
            .then(() => {
              message.success('Update Success!');
              history.push('../package');
            })
            .catch((e) => message.error(e.message));
        }
      },
      onCancel() {},
    });
  };

  if (packageId !== 'create' && actionPage === 'view') {
    return <PackageDetail {...props} />;
  }

  const handleLimited = (value) => {
    setLimited(value.target.checked)
  }




  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
        <Form.Item>
                        {isMobile ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Button
                                            type="default"
                                            icon={<RollbackOutlined />}
                                            onClick={() => history.push('../package')}
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
                                    onClick={() => history.push('../package')}
                                    style={{ width: '100px', float: 'left' }}
                                >
                                    ยกเลิก
                                </Button>
                            </>
                        )}
        </Form.Item>
          <Card
            // eslint-disable-next-line react/jsx-indent-props
            title={
              <Typography.Title level={3}>
                <span>
                  {packageId === 'create'
                    ? 'สร้างข้อมูล Package'
                    : 'Package ID : ' + packageId}
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

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="name"
                    label="ชื่อเเพ็คเกจ"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Package Name!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                  name="isActive"
                  label="สถานะ"
                  valuePropName="checked"
                  rules={[
                  {
                    required: true,
                    message: 'Please input your Status!',
                  },
                  ]}
                  >
                    <Checkbox>Active</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle">
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="price"
                    label="ราคา"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Package Price!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="count"
                    label="จำนวนเพจ"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Package Count!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle">
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="days"
                    label="จำนวนวัน"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your number of days!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="line_notification_limit"
                    label="จำนวน Line Notification"
                    rules={[
                      {
                        required: true,
                        message:
                          'Please input your number of line notification!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle">
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="quota_limit"
                    label="จำนวนการตอบกลับของ Bot"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your number of Quota Bot!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} disabled={limited} />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                      name="special_text"
                      label="ข้อความพิเศษ"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your message special',
                        },
                      ]}
                    >
                         <Select
                            optionFilterProp="children"
                            defaultValue=""
                         >
                            {[1, 2].map((val) => (
                                // eslint-disable-next-line quotes
                                <Option style={{ backgroundColor: '#FFF' }} value={val}>{val === 1 ? "ขายดี" : "ธรรมดา"}</Option>
                            ))}
                         </Select>
                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle">
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="quota_limit_comment_box"
                    label="ดึงคอมเม้นเข้า Inbox / วัน"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาใส่จำนวนวัน ดึงคอมเม้นเข้า!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} disabled={limited} />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item
                    name="quota_limit_comment_send"
                    label="ตอบคอมเม้น / วัน"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาใส่จำนวนวัน ตอบคอมเม้น!',
                      },
                    ]}
                  >
                    <Input style={{ fontFamily: 'KanitRegular' }} disabled={limited} />
                  </Form.Item>
                </Col>
              </Row>
              <Row align="middle" >
                <Col xs={{ span: 24 }} lg={{ span: 24 }}>

                <Form.Item
                  name="perDay"
                  label="สถานะ"
                  valuePropName="checked"
                  rules={[
                  {
                    required: true,
                    message: 'Please input your Status!',
                  },
                  ]}
                  >
                    <Checkbox>เลือกจำกัดตอบกลับของ Bot รายวัน</Checkbox>
                  </Form.Item>

                     
                </Col>
              </Row>
              <Row align="middle" >
                <Col xs={{ span: 24 }} lg={{ span: 24 }}>

                <Form.Item
                  name="welcomemsg"
                  label="สถานะ"
                  valuePropName="checked"
                  >
                    <Checkbox>เปิดใช้งาน ข้อความต้อนรับ</Checkbox>
                  </Form.Item>

                     
                </Col>
              </Row>
              <Row align="middle" >
                <Col xs={{ span: 24 }} lg={{ span: 24 }}>

                <Form.Item
                  name="keywordmsg"
                  label="สถานะ"
                  valuePropName="checked"
                  >
                    <Checkbox>เปิดใช้งาน ตอบตามคีย์เวิร์ด</Checkbox>
                  </Form.Item>

                     
                </Col>
              </Row>
              <Row align="middle" style={{ marginBottom: 24 }}>
                <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                     <Checkbox value={limited} onChange={handleLimited}>การตอบกลับของ Bot เเบบไม่มีจำกัด</Checkbox>
                </Col>
              </Row>

              <Row gutter={[8, 8]} align="middle">
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: 12 }}>
                        <Typography.Text>รายละเอียด</Typography.Text>
                      </div>
                      {packageId === 'create' ? (
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <Form.List name="detail">
                          {() => {
                            return (
                              <>
                                {[0, 1, 2, 3, 4, 5].map((field, index) => (
                                  <Form.Item
                                  label={'รายละเอียดที่ ' + [index+1]}
                                    name={[index]}
                                    rules={[
                                      {
                                        message:
                                          'Please input your Package Detail!',
                                      },
                                    ]}
                                  >
                                    <Input
                                      style={{ fontFamily: 'KanitRegular' }}
                                    />
                                  </Form.Item>
                                ))}
                              </>
                            );
                          }}
                        </Form.List>
                      ) : (
                        <Form.List name="detail">
                          {(fields) => {
                            return (
                              <>
                                {fields.map((field, index) => (
                                  <Form.Item
                                    name={[index]}
                                  >
                                    <Input
                                      style={{ fontFamily: 'KanitRegular' }}
                                    />
                                  </Form.Item>
                                ))}
                              </>
                            );
                          }}
                        </Form.List>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item style={{ marginTop: '12px' }}>
                {isMobile ? (
                  <>
                    <Row gutter={[16, 16]}>
                      {/* <Col xs={24}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          block
                        >
                          {t('save')}
                        </Button>
                      </Col> */}
                      <Col xs={24}>
                        <Button
                          type="default"
                          icon={<RollbackOutlined />}
                          onClick={() => history.push('../package')}
                          block
                        >
                          {t('cancel')}
                        </Button>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    {/* <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      style={{ width: '100px', float: 'Right', marginLeft: 15 }}
                      onClick={() => history.push('../package')}
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

export default PackageInput;
