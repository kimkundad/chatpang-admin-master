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
import { useHistory, useLocation } from 'react-router-dom';
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

// import SettingBankDetail from './SettingBankDetail';

const AgencysSetHub = (props) => {
  const { hubData, hubSelected } = useSelector((state) => state.agencyReducer);
  const { permission, roleLevel } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
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
  const location = useLocation();

  const { pageCode } = props;

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const handleSubmit = (values) => {
    var submitData = {
      companyId: parseInt(localStorage.getItem('companyId')),
      agencyList: JSON.parse(localStorage.getItem('agencyId')),
      hubId: parseInt(values.hubId),
    };

    Modal.confirm({
      title: 'Do you want to set hubs ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(allAction.agencyAction.updateHubAgency(submitData))
          .then(() => {
            message.success('Update Success!');
            history.push('../agency-management');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    var compId = parseInt(localStorage.getItem('companyId'));
    dispatch(allAction.agencyAction.getHubMasterList(compId))
      .then(() => {})
      .catch((e) => message.error(e.message));
  }, []);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
          <Space size={[24, 24]} direction="vertical">
            <Card
              style={{ fontFamily: 'KanitRegular' }}
              title={
                <Typography.Title level={3}>
                  <span className="text-primary">{t('set-hub')}</span>
                </Typography.Title>
              }
            >
              <Form form={form} onFinish={handleSubmit} {...formItemLayout}>
                {roleLevel == 'SAD' && (
                  <Col {...itemLayout}>
                    <Form.Item label={t('hubs-company')}>
                      <span
                        className="ant-form-text"
                        style={{ paddingLeft: 24 }}
                      >
                        {localStorage.getItem('companyName')}{' '}
                      </span>
                    </Form.Item>
                  </Col>
                )}

                {roleLevel == 'SAD' || roleLevel == 'COM' ? (
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('hub')}
                      name="hubId"
                      rules={[
                        { required: true, message: 'Please input Hub Name!' },
                      ]}
                    >
                      <Select
                        showSearch
                        defaultValue=""
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="">{t('please-select')}</Option>
                        {hubData &&
                          hubData.map((item) => (
                            <Option key={item.hubId}>{item.hubName}</Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                ) : (
                  <span className="ant-form-text" style={{ paddingLeft: 24 }}>
                    {localStorage.getItem('hubName')}{' '}
                  </span>
                )}

                <Form.Item style={{ marginTop: '50px' }}>
                  {isMobile ? (
                    <>
                      <Row gutter={[16, 16]}>
                        <Col xs={24}>
                          {roleLevel == 'SAD' || roleLevel == 'COM' ? (
                            FilterPermission('isCreate') && (
                              <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                block
                              >
                                {t('save')}
                              </Button>
                            )
                          ) : (
                            <></>
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
                        onClick={() => handleCancel()}
                        style={{
                          width: '100px',
                          float: 'Right',
                          marginLeft: 15,
                        }}
                        onClick={() => history.push('../agency-management')}
                      >
                        {t('cancel')}
                      </Button>
                      {roleLevel == 'SAD' || roleLevel == 'COM' ? (
                        FilterPermission('isCreate') && (
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            style={{ width: '100px', float: 'Right' }}
                          >
                            {t('save')}
                          </Button>
                        )
                      ) : (
                        <></>
                      )}
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

export default AgencysSetHub;
