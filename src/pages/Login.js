/* eslint-disable object-curly-newline */
/* eslint-disable no-empty-pattern */
import {
  Form,
  Input,
  Button,
  message,
  Layout,
  Col,
  Row,
  Spin,
  Card,
  Checkbox,
  Image,
} from 'antd';
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import allAction from '../app/actions/index';
import LOGO from '../assets/LOGO.png';

// const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Content } = Layout;

const Login = () => {
  const { isLoading } = useSelector((state) => state.mainReducer);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   let newSocket = null;
  //   newSocket = io(endpoint.replace('/api', ''));

  //   console.log('Socket io start:', newSocket);
  //   setSocket(newSocket);

  //   return () => newSocket?.close();
  // }, [setSocket]);

  // useEffect(() => {
  //   const messageListener = (msg) => {
  //     console.log(msg.txt, msg.msg);
  //   };
  //   socket?.on('debug', messageListener);
  //   return () => {
  //     socket?.off('debug', messageListener);
  //   };
  // }, [socket]);

  const onFinish = (values) => {
    dispatch(allAction.authenAction.toLogin(values.username, values.password))
      .then(() => {
        message.success('Login Success!');
      })
      .catch((e) => message.error(e.message));
  };

  // useEffect(() => {
  //   console.log('username: ', form.getFieldValue('username'));
  //   // form.setFieldsValue({
  //   //   username: 'xxx',
  //   // });
  // }, [usernameChk]);

  return (
    <>
      <Spin
        style={{ verticalAlign: 'middle', minHeight: '80vh' }}
        spinning={isLoading}
        tip="Loading..."
      >
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ff7157' }}>
          <Content style={{ overflow: 'hidden' }}>
            <Row
              gutter={24}
              justify="center"
              align="middle"
              style={{ minHeight: '100vh' }}
            >
              <Col lg={{ span: 7 }} md={{ span: 10 }} xs={{ span: 20 }}>
                <Card style={{ borderRadius: 15 }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 18 }}>
                    <Image src={LOGO} preview={false} />
                  </div>
                  <Form
                    layout="vertical"
                    name="login"
                    onFinish={onFinish}
                    form={form}
                  >
                    <h3 style={{ textAlign: 'left' }}>ยินดีต้อนรับสู่ Chatpang </h3>
                    <h3 style={{ textAlign: 'left', marginTop: -8 }}>กรุณาเข้าสู่ระบบด้วย Username เเละ Password</h3>
                    <Form.Item
                      value="sss"
                      label="Username"
                      name="username"
                      style={{ marginTop: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please input username!',
                        },
                        ({ }) => ({
                          validator(rule, value) {
                            if (/[^A-Za-z\d|^@+_.\\-]/g.test(value)
                            ) {
                              return Promise.reject(
                                new Error(
                                  'Incorrect characters.',
                                ),
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please input your username!',
                    //   },
                    // ]}
                    >
                      <Input
                        // onChange={onChangeUsername}
                        style={{ borderRadius: 5 }}
                      // onKeyPress={(event) => {
                      //   if (event.key === 'Enter') {
                      //     // onHandleSaveDiscount(text_discount);
                      //   } else {
                      //     isInputDouble(event);
                      //   }
                      // }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input password!',
                        },
                        () => ({
                          validator(rule, value) {
                            if (/[^A-Za-z\d|^~`!@#$%^&*()_\-+={[}\]\\|\\:;"'<,>.?/]/g.test(value)
                            ) {
                              return Promise.reject(
                                new Error(
                                  'Incorrect characters.',
                                ),
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        // onChange={onChangePassword}
                        style={{ borderRadius: 5 }}

                      />
                    </Form.Item>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
                      <Form.Item name="remember" valuePropName="checked" noStyle style={{ flex: 1 }}>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                        <a href="/forgot-password">ลืมรหัสผ่าน</a>
                      </div> */}

                    </div>

                    <Row gutter={[24, 24]}>
                      {/* <Col xs={24}>
                        <a style={{ float: 'right', color: '#000' }} href="">
                          {t('forget-pass')}
                        </a>
                      </Col> */}
                      <Col xs={24}>
                        <Form.Item>
                          <Button
                            style={{ borderRadius: 5, marginTop: 24, backgroundColor: '#000' }}
                            type="primary"
                            htmlType="submit"
                            block
                          >
                            {t('submit')}
                          </Button>
                        </Form.Item>
                      </Col>

                    </Row>
                    {/* <Row style={{ marginTop: -8 }}>
                      <div>สมาชิกใหม่ของเรา?</div>
                      <a href="/register" style={{ marginLeft: 4 }}>สร้างบัญชีใหม่</a>
                    </Row> */}
                  </Form>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Spin>
    </>
  );
};

export default Login;
