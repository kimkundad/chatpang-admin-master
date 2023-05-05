import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Checkbox,
  Layout,
  Modal,
  message,
  Card,
  Tabs,
  Space,
  Select,
  InputNumber,
  Tag,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  DeleteOutlined,
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import StickyBox from 'react-sticky-box';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';
import SettingDegreeDetail from './SettingDegreeDetail';

const { Option } = Select;

const SettingDegreeInput = (props) => {
  const { actionPage, agencyLevelDetail, companyData } = useSelector(
    (state) => state.settingLevelReducer
  );
  const { roleLevel } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const [isDiscount, setIsDiscount] = useState(true);
  const [isCOD, setIsCOD] = useState(true);
  const [text_discount, setTextDiscount] = useState(0);
  const [text_cod, setTextCOD] = useState(0);
  const [isCodSubmit, setIsCodSubmit] = useState(false);
  const [isDiscountSubmit, setIsDiscountSubmit] = useState(false);
  const [list_cod, setListCOD] = useState([]);
  const [list_discount, setListDiscount] = useState([]);
  const [list_cod_default, setListCODDefault] = useState([]);
  const [list_discount_default, setListDiscountDefault] = useState([]);
  const [isCodDefault, setIsCODDefault] = useState(true);
  const [isDiscountDefault, setIsDiscountDefault] = useState(true);
  const [loading, setLoadIng] = useState(false);
  const {
    match: {
      params: { agencyLevelId },
    },
  } = props;

  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    setTextDiscount('');
  }, [list_discount]);

  useEffect(() => {
    setTextCOD('');
  }, [list_cod]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // onChangeDiscount
  const onChangeDiscount = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // const fvalue = value ? parseFloat(value) : 0.0;
      if (value.length > 1) {
        if (value.substring(0, 1) == '0' && value.substring(1, 2) != '.') {
          setTextDiscount(value.substring(1, value.length));
        } else setTextDiscount(value);
      } else {
        setTextDiscount(value);
      }
    }
  };

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }

  function isInputDouble(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9.]/.test(ch)) {
      evt.preventDefault();
    }
  }

  const onChangeTagCod = (removedTag) => {
    const cod_default = list_cod_default.filter((tag) => tag !== removedTag);
    const cod = list_cod.filter((tag) => tag.value !== removedTag);
    setListCOD(cod);
    setListCODDefault(cod_default);
  };

  const onChangeTagDiscount = (removedTag) => {
    const discount_default = list_discount_default.filter(
      (tag) => tag !== removedTag
    );
    const discount = list_discount.filter((tag) => tag.value !== removedTag);
    setListDiscount(discount);
    setListDiscountDefault(discount_default);
  };

  const onChangeCOD = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // const fvalue = value ? parseFloat(value) : 0.0;
      if (value.length > 1) {
        if (value.substring(0, 1) == '0' && value.substring(1, 2) != '.') {
          setTextCOD(value.substring(1, value.length));
        } else setTextCOD(value);
      } else {
        setTextCOD(value);
      }
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };
  const itemTagLayout = { xs: 24, sm: { span: 10, offset: 2 } };

  function onHandleSaveDiscount(value) {
    if (!value || value == '0') {
      setTextDiscount('');
      return false;
    }

    value = parseFloat(value);

    if (list_discount.length == 0) {
      const list = [];
      const obj = { value: `${value}%`, sort: value };
      list.push(obj);
      setListDiscount(list);
    } else {
      const newArr = [...list_discount];
      const check = newArr.filter((item) => item.value == `${value}%`);
      if (check.length == 0) {
        newArr[list_discount.length] = { value: `${value}%`, sort: value };
        newArr.sort((a, b) => a.sort - b.sort);
        setListDiscount(newArr);
      } else setTextDiscount('');
    }
  }

  function onHandleSaveCOD(value) {
    if (!value || value == '0') {
      setTextCOD('');
      return false;
    }
    value = parseFloat(value);

    if (list_cod.length == 0) {
      const list = [];
      const obj = { value: `${value}%`, sort: value };
      list.push(obj);
      setListCOD(list);
    } else {
      const newArr = [...list_cod];
      const check = newArr.filter((item) => item.value == `${value}%`);
      if (check.length == 0) {
        newArr[list_cod.length] = { value: `${value}%`, sort: value };
        newArr.sort((a, b) => a.sort - b.sort);
        setListCOD(newArr);
      } else setTextCOD('');
    }
  }

  useEffect(() => {
    if (agencyLevelId === 'create') {
      const initFormData = {
        agencyLevelName: '',
        agencyLevelDiscount: [],
        agencyLevelCOD: [],
        companyName: '',
      };
      form.setFieldsValue(initFormData);
    } else {
      async function fetchMyAPI() {
        callInformation(agencyLevelId);
      }
      fetchMyAPI();
    }
  }, [actionPage]);

  const callInformation = async (agencyLevelId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/agency-level/${agencyLevelId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          const initFormData = {
            agencyLevelName: res.data.data?.agencyLevelName,
            agencyLevelDiscount: [],
            agencyLevelCOD: [],
            companyName: res.data.data?.companyData.companyName,
          };
          const arrayCOD = JSON.parse(`[${res.data.data?.agencyLevelCOD}]`);
          const arrayDiscount = JSON.parse(
            `[${res.data.data?.agencyLevelDiscount}]`
          );

          const discount = arrayDiscount.map((i) => `${i}%`);
          const cod = arrayCOD.map((i) => `${i}%`);

          let i = 0;
          const listD = [];
          for (i = 0; i < discount.length; i++) {
            const objDiscount = {
              value: discount[i],
              sort: arrayDiscount[i],
            };
            listD.push(objDiscount);
            setListDiscount(listD);
          }

          let j = 0;
          const listC = [];
          for (j = 0; j < cod.length; j++) {
            const objCod = {
              value: cod[j],
              sort: arrayCOD[j],
            };

            listC.push(objCod);
            setListCOD(listC);
          }

          setListDiscountDefault(discount);
          setListCODDefault(cod);

          form.setFieldsValue(initFormData);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const handleSubmit = (values) => {
    // console.log('value : ', values);
    let i = 0;
    let cod = '';
    let discount = '';

    for (i = 0; i < list_cod.length; i++) {
      if (i == list_cod.length - 1) {
        cod += list_cod[i].sort;
      } else {
        cod += `${list_cod[i].sort},`;
      }
    }

    for (i = 0; i < list_discount.length; i++) {
      if (i == list_discount.length - 1) {
        discount += list_discount[i].sort;
      } else {
        discount += `${list_discount[i].sort},`;
      }
    }

    const companyId = companyData.filter(
      (item) => item.companyName == values.companyName
    );

    const dataSubmit = {
      agencyLevelName: values.agencyLevelName,
      description: '',
      agencyLevelDiscount: discount,
      agencyLevelCOD: cod,
      companyId: roleLevel == 'SAD' ? companyId[0].companyId : null,
    };
    Modal.confirm({
      title:
        agencyLevelId === 'create'
          ? 'Do you want to create agency level ?'
          : 'Do you want to update agency level ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (agencyLevelId === 'create') {
          dispatch(
            allAction.settingLevelAction.createAgencyLevelDetail(dataSubmit)
          )
            .then(() => {
              message.success('Create Success!');
              history.push('../setting-level');
            })
            .catch((e) => message.error(e.message));
        } else {
          dispatch(
            allAction.settingLevelAction.updateAgencyLevelDetail(
              agencyLevelId,
              dataSubmit
            )
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.settingLevelAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        }
      },
      onCancel() {},
    });
  };

  const validDateData = () => {
    if (list_cod.length == 0) {
      setIsCodSubmit(true);
    } else {
      setIsCodSubmit(false);
    }

    if (list_discount.length == 0) {
      setIsDiscountSubmit(true);
    } else {
      setIsDiscountSubmit(false);
    }
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(allAction.settingLevelAction.deleteAgencyLevelDetail(id))
          .then(() => {
            message.success('Delete Success!');
            history.push('../setting-level');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {},
    });
  };

  if (agencyLevelId !== 'create' && actionPage === 'view') {
    return <SettingDegreeDetail {...props} />;
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <Layout style={{ minHeight: '100vh' }}>
        <Space size={[24, 24]} direction="vertical">
          <Card
            style={{ fontFamily: 'KanitRegular' }}
            title={
              <Typography.Title level={3}>
                <span className="text-primary">
                  {agencyLevelId === 'create'
                    ? t('setting-agency-degree-create')
                    : t('setting-agency-degree-edit')}
                </span>
              </Typography.Title>
            }
            extra={
              agencyLevelId === 'create' ? (
                <></>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ width: isMobile ? '100%' : '100px' }}
                  onClick={() => showConfirm(agencyLevelId)}
                >
                  {t('delete')}
                </Button>
              )
            }
          >
            <Form form={form} onFinish={handleSubmit} {...formItemLayout}>
              {roleLevel == 'SAD' ? (
                <Col {...itemLayout}>
                  <Form.Item
                    label={t('company')}
                    name="companyName"
                    rules={[
                      { required: true, message: 'Please input Company Name!' },
                    ]}
                  >
                    <Select defaultValue={t('all-select')}>
                      <Option value="">{t('all-select')}</Option>
                      {companyData.map((item) => (
                        <Option key={item.companyName}>
                          {item.companyName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              ) : (
                <></>
              )}

              <Col {...itemLayout}>
                <Form.Item
                  label={t('setting-agency-degree-level')}
                  name="agencyLevelName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input Agency Level Name!',
                    },
                  ]}
                >
                  <Input placeholder={t('setting-agency-degree-level')} />
                </Form.Item>
              </Col>

              <Col {...itemLayout} style={{ height: 60 }}>
                {/*  Col setting-agency */}
                <Form.Item label={t('setting-agency-degree-discount')}>
                  <Row align="middle">
                    <Col
                      // span={14}
                      lg={{ span: 16 }}
                    >
                      <Form.Item
                        name="agencyLevelDiscount"
                        rules={[
                          {
                            required: list_discount.length == 0,
                            message: 'Please input your Level Discount!',
                          },
                        ]}
                      >
                        {list_discount.length == 0 && isDiscountSubmit ? (
                          <div
                            style={{
                              border: '1px solid #ff4d4f',
                              height: 32,
                              borderRadius: 2,
                            }}
                          />
                        ) : isDiscountDefault ? (
                          <div
                            style={{
                              border: '1px solid #e0e0e0',
                              height: 32,
                              width: 350,
                              borderRadius: 2,
                            }}
                          >
                            <StickyBox>
                              <ul
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  overflowY: 'hidden',
                                  whiteSpace: 'nowrap',
                                  listStyleType: 'none',
                                  paddingLeft: '4px',
                                  flexWrap: 'nowrap',
                                  justifyItems: 'center',
                                }}
                              >
                                {list_discount.map((item, index) => (
                                  <Tag
                                    style={{
                                      marginLeft: 8,
                                      marginRight: 8,
                                      marginTop: 4,
                                    }}
                                    closable
                                    color="blue"
                                    onClose={(e) => {
                                      e.preventDefault();
                                      onChangeTagDiscount(item.value);
                                    }}
                                  >
                                    {item.value}
                                  </Tag>
                                ))}
                              </ul>
                            </StickyBox>
                          </div>
                        ) : (
                          <div
                            style={{
                              border: '1px solid #e0e0e0',
                              height: 32,
                              width: 350,
                              borderRadius: 2,
                            }}
                          >
                            <ScrollMenu
                              data={list_discount_default.map((item, index) => (
                                <Tag
                                  style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                    marginTop: 4,
                                  }}
                                  closable
                                  color="blue"
                                  onClose={(e) => {
                                    e.preventDefault();
                                    onChangeTagDiscount(item);
                                  }}
                                >
                                  {item}
                                </Tag>
                              ))}
                            />
                          </div>
                        )}
                      </Form.Item>
                    </Col>

                    <Col
                      // xs={{ span: 24 }}
                      // lg={{ span: isDiscount ? 3 : 1, offset: 1 }}
                      flex="90px"
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        // border: 'green solid 1px',
                      }}
                    >
                      <Form.Item>
                        {/*  InputNumber text_discount */}
                        {isDiscount ? (
                          <Input
                            value={text_discount}
                            onChange={onChangeDiscount}
                            placeholder="0"
                            onKeyPress={(event) => {
                              if (event.key === 'Enter') {
                                onHandleSaveDiscount(text_discount);
                              } else {
                                isInputDouble(event);
                              }
                            }}
                          />
                        ) : (
                          <Button
                            type="primary"
                            shape="circle"
                            style={{
                              backgroundColor: '#96d976',
                              borderColor: '#96d976',
                            }}
                            icon={<PlusOutlined />}
                            onClick={() => {
                              setIsDiscount(true);
                              setIsDiscountDefault(true);
                            }}
                          />
                        )}
                      </Form.Item>
                    </Col>

                    <Col
                      // xs={{ span: 24 }}
                      // lg={{ span: isDiscount ? 2 : 0, offset: 4 }}
                      flex="84px"
                    >
                      <Form.Item>
                        <Button
                          type="primary"
                          style={{
                            width: isMobile ? '100%' : '80px',
                            fontFamily: 'KanitRegular',
                            float: 'Right',
                          }}
                          onClick={() => {
                            onHandleSaveDiscount(text_discount);
                          }}
                        >
                          {t('setting-agency-degree-add')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col {...itemLayout} style={{ height: 60 }}>
                <Form.Item label={t('setting-agency-degree-cod')}>
                  <Row align="middle">
                    <Col
                      // span={14}
                      // lg={{ span: isCOD ? 14 : 22 }}
                      lg={{ span: 16 }}
                      // style={{ border: 'green solid 1px' }}
                    >
                      <Form.Item
                        name="agencyLevelCOD"
                        rules={[
                          {
                            required: list_cod.length == 0,
                            message: 'Please input your Level COD!',
                          },
                        ]}
                      >
                        {list_cod.length == 0 && isCodSubmit ? (
                          <div
                            style={{
                              border: '1px solid #ff4d4f',
                              height: 32,
                              borderRadius: 2,
                            }}
                          />
                        ) : isCodDefault ? (
                          <div
                            style={{
                              border: '1px solid #e0e0e0',
                              height: 32,
                              width: 350,
                              borderRadius: 2,
                            }}
                          >
                            <StickyBox>
                              <ul
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  overflowY: 'hidden',
                                  whiteSpace: 'nowrap',
                                  listStyleType: 'none',
                                  paddingLeft: '4px',
                                  flexWrap: 'nowrap',
                                  justifyItems: 'center',
                                }}
                              >
                                {list_cod.map((item, index) => (
                                  <Tag
                                    style={{
                                      marginLeft: 8,
                                      marginRight: 8,
                                      marginTop: 4,
                                    }}
                                    closable
                                    color="blue"
                                    onClose={(e) => {
                                      e.preventDefault();
                                      onChangeTagCod(item.value);
                                    }}
                                  >
                                    {item.value}
                                  </Tag>
                                ))}
                              </ul>
                            </StickyBox>
                          </div>
                        ) : (
                          <div
                            style={{
                              border: '1px solid #e0e0e0',
                              height: 32,
                              borderRadius: 2,
                            }}
                          >
                            <ScrollMenu
                              data={list_cod_default.map((item, index) => (
                                <Tag
                                  style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                    marginTop: 4,
                                  }}
                                  closable
                                  color="blue"
                                  onClose={(e) => {
                                    e.preventDefault();
                                    onChangeTagCod(item);
                                  }}
                                >
                                  {item}
                                </Tag>
                              ))}
                            />
                          </div>
                        )}
                      </Form.Item>
                    </Col>

                    <Col
                      // xs={{ span: 24 }}
                      // lg={{ span: isCOD ? 3 : 1, offset: 1 }}
                      flex="90px"
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      <Form.Item>
                        {/*  InputCod */}
                        {isCOD ? (
                          <Input
                            value={text_cod}
                            placeholder="0"
                            onChange={onChangeCOD}
                            onKeyPress={(event) => {
                              if (event.key === 'Enter') {
                                onHandleSaveCOD(text_cod);
                              } else {
                                isInputDouble(event);
                              }
                            }}
                          />
                        ) : (
                          <Button
                            type="primary"
                            shape="circle"
                            style={{
                              backgroundColor: '#96d976',
                              borderColor: '#96d976',
                            }}
                            icon={<PlusOutlined />}
                            onClick={() => {
                              setIsCOD(true);
                              setIsCODDefault(true);
                            }}
                          />
                        )}
                      </Form.Item>
                    </Col>

                    <Col
                      // xs={{ span: 24 }}
                      // lg={{ span: isCOD ? 2 : 0, offset: 4 }}
                      flex="84px"
                    >
                      <Form.Item>
                        <Button
                          type="primary"
                          style={{
                            width: isMobile ? '100%' : '80px',
                            fontFamily: 'KanitRegular',
                            float: 'Right',
                          }}
                          onClick={() => {
                            onHandleSaveCOD(text_cod);
                          }}
                        >
                          {t('setting-agency-degree-add')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

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
                          onClick={form.submit}
                        >
                          {t('save')}
                        </Button>
                      </Col>
                      <Col xs={24}>
                        <Button
                          type="default"
                          icon={<RollbackOutlined />}
                          onClick={() => history.push('../setting-level')}
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
                      onClick={() => history.push('../setting-level')}
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      style={{ width: '100px', float: 'Right' }}
                      onClick={() => {
                        form.submit();
                        validDateData();
                      }}
                    >
                      {t('save')}
                    </Button>
                  </>
                )}
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </Spin>
  );
};

export default SettingDegreeInput;
