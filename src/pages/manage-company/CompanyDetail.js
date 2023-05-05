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
import Map from './component/Map';

const { TabPane } = Tabs;

const CompanyDetail = (props) => {
  const { companyDetail } = useSelector(
    (state) => state.companyReducer,
  );
  const { permission } = useSelector((state) => state.authenReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();

  const {
    match: {
      params: { companyId },
    },
    pageCode,
  } = props;

  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.companyAction.getCompanyDetail(companyId))
      .then(() => { })
      .catch((e) => message.error(e.message));
  }, []);

  const showConfirm = (id) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(allAction.companyAction.deleteCompanyDetail(id))
          .then(() => {
            message.success('Delete Success!');
            history.push('../company');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  console.log('company detail : ', companyDetail);

  // const onSaveAdmin=(value)=>{
  // 	console.log(value)
  // }
  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Card
          title={(
            <Typography.Title level={3}>
              <span className="text-primary">
                {t('detail-company-management')}
              </span>
            </Typography.Title>
          )}
          extra={
            FilterPermission('isDelete') && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                style={{ width: isMobile ? '100%' : '100px' }}
                onClick={() => showConfirm(companyId)}
              >
                {t('delete')}
              </Button>
            )
          }
        >
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab={t('company')} key="1">
              <Row>
                <Col xs={24} sm={14}>
                  <Form
                    layout="horizontal"
                    name="companyDetail"
                    form={form}
                    {...formItemLayout}
                  >
                    <Col {...itemLayout}>
                      <Form.Item label={t('company-code')} name="companyCode">
                        <span className="ant-form-text">
                          {companyDetail?.companyCode}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('company-name')} name="companyName">
                        <span className="ant-form-text">
                          {companyDetail?.companyName}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('contact-person')} name="contactName">
                        <span className="ant-form-text">
                          {companyDetail?.contactName}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('phone')} name="phoneNo">
                        <span className="ant-form-text">
                          {companyDetail?.phoneNo || '-'}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('address')} name="address">
                        <span className="ant-form-text">
                          {companyDetail?.address || '-'}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('lat')} name="lat">
                        <span className="ant-form-text">
                          {companyDetail?.lat}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('lng')} name="lng">
                        <span className="ant-form-text">
                          {companyDetail?.lng}
                          {' '}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item label={t('status-active')} name="isActive">
                        <span className="ant-form-text">
                          {companyDetail?.isActive ? (
                            <Tag color="green" icon={<CheckCircleOutlined />}>
                              Active
                            </Tag>
                          ) : (
                            <Tag color="red" icon={<CloseCircleOutlined />}>
                              Inactive
                            </Tag>
                          )}
                        </span>
                      </Form.Item>
                    </Col>
                  </Form>
                </Col>
                <Col xs={24} sm={10}>
                  <Map {...props} />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          {isMobile ? (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  {FilterPermission('isUpdate') && (
                    <Button
                      type="primary"
                      onClick={() => dispatch(allAction.companyAction.setActionPage('edit'))}
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
                    onClick={() => history.push('../company')}
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
                onClick={() => history.push('../company')}
                style={{ width: '100px', float: 'right', marginLeft: 15 }}
              >
                {t('cancel')}
              </Button>
              {FilterPermission('isUpdate') && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{ width: '100px', float: 'right' }}
                  onClick={() => dispatch(allAction.companyAction.setActionPage('edit'))}
                >
                  {t('edit')}
                </Button>
              )}
            </>
          )}
        </Card>
      </Spin>
    </>
  );
};

export default CompanyDetail;
