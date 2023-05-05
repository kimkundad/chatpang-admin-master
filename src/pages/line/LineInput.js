/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-wrap-multilines */
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
import LineDetail from './LineDetail';

const LineInput = (props) => {
  const { actionPage } = useSelector((state) => state.lineReducer);
  const { isMobile } = useSelector((state) => state.mainReducer);
  // const { roleLevel } = useSelector((state) => state.authenReducer);
  const [loading, setLoadIng] = useState(false);
  const {
    match: {
      params: { lineId },
    },
  } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchMyAPI() {
      callInformation(lineId);
    }
    fetchMyAPI();
  }, [actionPage]);

  const callInformation = async (lineId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/line-notifications/${lineId}`,
    })
      .then((res) => {
        setLoadIng(false);
        const initFormData = {
          name: res.data.data.name,
          token: res.data.data.token,
          status: res.data.data.status === 'active' ? true : false,
        };
        form.setFieldsValue(initFormData);
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  // //  handleSubmit ?
  const handleSubmit = (values) => {
    const data = {
        name: values.name,
        token: values.token,
        status: values.status ? 'active' : 'inactive',
      };
    Modal.confirm({
      title: 'คุณต้องการเเก้ไข Line Notify?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        window.scrollTo(0, 0);
        dispatch(allAction.lineAction.updateLineDetail(lineId, data))
          .then(() => {
            message.success('Update Success!');
            history.push('../line');
            // dispatch(allAction.lineAction.setActionPage('view'));
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {},
    });
  };

  if (lineId !== 'create' && actionPage === 'view') {
    return <LineDetail {...props} />;
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
                                            onClick={() => history.push('../line')}
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
                                    onClick={() => history.push('../line')}
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
                <span className="text-primary">แก้ไข Line Notify</span>
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
                    label="ชื่อกลุ่ม"
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
                    name="token"
                    label="Line access token"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Line access token!',
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
                    name="status"
                    label="สถานะ"
                    valuePropName="checked"
                    rules={[
                    {
                      required: true,
                      message: 'Please input your Status!',
                    },
                    ]}>
                    <Checkbox>Active</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
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
                          onClick={() => history.push('../line')}
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
                      onClick={() => history.push('../line')}
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

export default LineInput;
