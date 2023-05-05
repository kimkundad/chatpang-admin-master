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

import SettingBankDetail from './SettingBankDetail';

const SettingBankInput = (props) => {
  const { actionPage, agencyBankDetail, companyData } = useSelector(
    (state) => state.settingBankReducer
  );
  const { roleLevel } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    match: {
      params: { agencyBankId },
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
      bankName: values.bankName,
      bankCode: values.bankCode,
      companyId: roleLevel == 'SAD' ? companyId[0].companyId : null,
    };
    Modal.confirm({
      title:
        agencyBankId === 'create'
          ? 'Do you want to create agency bank ?'
          : 'Do you want to edit agency bank ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (agencyBankId === 'create') {
          dispatch(
            allAction.settingBankAction.createAgencyBankDetail(dataSubmit)
          )
            .then(() => {
              message.success('Create Success!');
              history.push('../setting-bank');
            })
            .catch((e) => message.error(e.message));
        } else {
          dispatch(
            allAction.settingBankAction.updateAgencyBankDetail(
              agencyBankId,
              dataSubmit
            )
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.settingBankAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        }
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (agencyBankId === 'create') {
      const initFormData = {
        bankName: '',
        bankCode: '',
        companyName: '',
      };
      form.setFieldsValue(initFormData);
    } else {
      dispatch(allAction.settingBankAction.getAgencyBankDetail())
        .then(() => {})
        .catch((e) => message.error(e.message));
      setLoadIng(true);
      fetch({
        method: 'get',
        url: `/bank/${agencyBankId}`,
      })
        .then((res) => {
          if (res.data.success) {
            setLoadIng(false);
            const initFormData = {
              bankName: res.data.data?.bankName,
              bankCode: res.data.data?.bankCode,
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

  if (agencyBankId !== 'create' && actionPage === 'view') {
    return <SettingBankDetail {...props} />;
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
                    {agencyBankId === 'create'
                      ? t('setting-agency-bank-menu-create')
                      : t('setting-agency-bank-menu-edit')}
                  </span>
                </Typography.Title>
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
                    label={t('setting-agency-code-bank')}
                    name="bankCode"
                    rules={[
                      { required: true, message: 'Please input Bank Code!' },
                    ]}
                  >
                    <Input placeholder={t('setting-agency-code-bank')} />
                  </Form.Item>
                </Col>

                <Col {...itemLayout}>
                  <Form.Item
                    label={t('setting-agency-name-bank')}
                    name="bankName"
                    rules={[
                      { required: true, message: 'Please input Bank Name!' },
                    ]}
                  >
                    <Input placeholder={t('setting-agency-name-bank')} />
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
                            onClick={() => history.push('../setting-bank')}
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
                        onClick={() => history.push('../setting-bank')}
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

export default SettingBankInput;
