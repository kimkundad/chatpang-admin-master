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
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  DeleteOutlined,
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
const { Option } = Select;
import { fetch } from '../../utils/fetch';
import SettingCategoryDetail from './SettingCategoryDetail';

const SettingCategoryInput = (props) => {
  const { actionPage, agencyTypeDetail, companyData } = useSelector(
    (state) => state.settingAgencyReducer
  );
  const { roleLevel } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    match: {
      params: { agencyTypeId },
    },
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoadIng] = useState(false);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  const history = useHistory();
  const handleSubmit = (values) => {
    var companyId = companyData.filter(
      (item) => item.companyName == values.companyName
    );

    var dataSubmit = {
      agencyTypeName: values.agencyTypeName,
      description: values.description,
      companyId: roleLevel == 'SAD' ? companyId[0].companyId : null,
    };
    Modal.confirm({
      title:
        agencyTypeId === 'create'
          ? 'Do you want to create agency type ?'
          : 'Do you want to update agency type ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (agencyTypeId === 'create') {
          dispatch(
            allAction.settingAgencyAction.createAgencyTypeDetail(dataSubmit)
          )
            .then(() => {
              message.success('Create Success!');
              history.push('../setting-agency');
            })
            .catch((e) => message.error(e.message));
        } else {
          dispatch(
            allAction.settingAgencyAction.updateAgencyTypeDetail(
              agencyTypeId,
              dataSubmit
            )
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.settingAgencyAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        }
      },
      onCancel() {},
    });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(allAction.settingAgencyAction.deleteAgencyTypeDetail(id))
          .then(() => {
            message.success('Delete Success!');
            history.push('../setting-agency');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (agencyTypeId === 'create') {
      const initFormData = {
        agencyTypeName: '',
        description: '',
        companyName: '',
      };
      form.setFieldsValue(initFormData);
    } else {
      setLoadIng(true);
      fetch({
        method: 'get',
        url: `/agency-type/${agencyTypeId}`,
      })
        .then((res) => {
          if (res.data.success) {
            setLoadIng(false);
            const initFormData = {
              agencyTypeName: res.data.data?.agencyTypeName,
              description: res.data.data?.description,
              companyName: res.data.data?.companyData.companyName,
            };
            form.setFieldsValue(initFormData);
          } else {
          }
        })
        .catch((error) => {
          setLoadIng(false);
          console.log(error);
        });
    }
  }, [actionPage]);

  if (agencyTypeId !== 'create' && actionPage === 'view') {
    return <SettingCategoryDetail {...props} />;
  }

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
          <Space size={[24, 24]} direction="vertical">
            <Card
              style={{ fontFamily: 'KanitRegular' }}
              title={
                <Typography.Title level={3}>
                  <span className="text-primary">
                    {agencyTypeId === 'create'
                      ? t('setting-agency-category-menu-create')
                      : t('setting-agency-category-menu-edit')}
                  </span>
                </Typography.Title>
              }
              extra={
                agencyTypeId === 'create' ? (
                  <></>
                ) : (
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ width: isMobile ? '100%' : '100px' }}
                    onClick={() => showConfirm(agencyTypeId)}
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
                        {
                          required: true,
                          message: 'Please input Company Name!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        defaultValue={t('all-select')}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
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
                ) : (
                  <></>
                )}

                <Col {...itemLayout}>
                  <Form.Item
                    label={t('setting-agency-category-type')}
                    name="agencyTypeName"
                    rules={[
                      { required: true, message: 'Please input Agency Type!' },
                    ]}
                  >
                    <Input placeholder={t('setting-agency-category-type')} />
                  </Form.Item>
                </Col>

                <Col {...itemLayout}>
                  <Form.Item
                    label={t('setting-agency-category-description')}
                    name="description"
                  >
                    <Input
                      placeholder={t('setting-agency-category-description')}
                    />
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
                          >
                            {t('save')}
                          </Button>
                        </Col>
                        <Col xs={24}>
                          <Button
                            type="default"
                            icon={<RollbackOutlined />}
                            onClick={() => history.push('../setting-agency')}
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
                        style={{
                          width: '100px',
                          float: 'Right',
                          marginLeft: 15,
                        }}
                        onClick={() => history.push('../setting-agency')}
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
          </Space>
        </Layout>
      </Spin>
    </>
  );
};

export default SettingCategoryInput;
