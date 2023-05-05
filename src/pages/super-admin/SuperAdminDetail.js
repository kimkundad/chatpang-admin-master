import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Card,
  Tag,
  message,
} from 'antd';
import { useHistory } from 'react-router-dom';

import {
  EditOutlined,
  RollbackOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import allAction from '../../app/actions/index';

const SuperAdminDetail = (props) => {
  const dispatch = useDispatch();

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission } = useSelector((state) => state.authenReducer);
  const { actionPage, superAdminDetail } = useSelector(
    (state) => state.superAdminReducer
  );

  const {
    match: {
      params: { userId },
    },
    pageCode,
  } = props;

  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.superAdminAction.getSuperAdminDetail(userId))
      .then(() => {
        // message.success("Get Data Success!")
      })
      .catch((e) => message.error(e.message));
  }, [actionPage]);

  const showConfirm = (userId) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(allAction.superAdminAction.deleteSuperAdminDetail(userId))
          .then(() => {
            message.success('Delete Success!');
            history.push('../super-admin');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Card
          // style={{ margin: '0 30px 0 30px' }}
          title={
            <Typography.Title level={3}>
              <span className="text-primary">{t('detail-super-admin')}</span>
            </Typography.Title>
          }
          extra={
            FilterPermission('isDelete') && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showConfirm(userId)}
                style={{ width: isMobile ? '100%' : '100px' }}
              >
                {t('delete')}
              </Button>
            )
          }
        >
          <Form
            layout="horizontal"
            name="search"
            form={form}
            {...formItemLayout}
          >
            <Col {...itemLayout}>
              <Form.Item label={t('username')} name="name">
                <span className="ant-form-text">
                  {superAdminDetail?.userData?.name}{' '}
                </span>
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label={t('email')} name="email">
                <span className="ant-form-text">
                  {superAdminDetail?.email}{' '}
                </span>
              </Form.Item>
            </Col>
            {/* <Col {...itemLayout}>
                            <Form.Item label={t("phone")} name="phoneNo"
                            >
                                <span className="ant-form-text">{superAdminDetail?.phoneNo}</span>

                            </Form.Item>
                        </Col> */}
            <Col {...itemLayout}>
              <Form.Item label={t('status-active')} name="isActive">
                <span className="ant-form-text">
                  {superAdminDetail?.isActive ? (
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
            <Form.Item style={{ marginTop: '50px' }}>
              {isMobile ? (
                <>
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      {FilterPermission('isUpdate') && (
                        <Button
                          type="primary"
                          onClick={() =>
                            dispatch(
                              allAction.superAdminAction.setActionPage('edit')
                            )
                          }
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
                        onClick={() => history.push('../super-admin')}
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
                    onClick={() => history.push('../super-admin')}
                    style={{ width: '100px', float: 'right', marginLeft: 15 }}
                  >
                    {t('cancel')}
                  </Button>
                  {FilterPermission('isUpdate') && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      style={{ width: '100px', float: 'right' }}
                      onClick={() =>
                        dispatch(
                          allAction.superAdminAction.setActionPage('edit')
                        )
                      }
                    >
                      {t('edit')}
                    </Button>
                  )}
                </>
              )}
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </>
  );
};

export default SuperAdminDetail;
