/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Card,
  Modal,
  message,
  Tag,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  DeleteOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import { fetch } from '../../../utils/fetch';

const ManageDriverDetail = (props) => {
  const { actionPage } = useSelector((state) => state.manageDriverReducer);

  const { permission, roleLevel } = useSelector((state) => state.authenReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useSelector((state) => state.mainReducer);
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  const {
    match: {
      params: { driverId },
    },
    pageCode,
  } = props;

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          allAction.manageDriverAction.deleteManageDriverDetail(driverId)
        )
          .then(() => {
            message.success('Delete Success!');
            history.push('../hub-employee');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch({
      method: 'get',
      url: `/manageDriver/getOneDriverByUserId/${driverId}`,
    })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          const initFormData = {
            companyId: res.data.data.userData.companyData.companyName,
            hubId:
              res.data.data.userData.hubData == null
                ? ''
                : res.data.data.userData.hubData.hubName,
            name: res.data.data.userData.name,
            phoneNo: res.data.data.phoneNo,
            isActive: res.data.data.isActive,
          };
          setDetail(initFormData);
        } else {
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [actionPage]);

  return (
    <Spin spinning={loading} tip="Loading...">
      <Card
        // style={{ margin: '0 30px 0 30px' }}
        title={
          <Typography.Title level={isMobile ? 4 : 3}>
            <span className="text-primary">{t('manage-driver-info')}</span>
          </Typography.Title>
        }
        extra={
          FilterPermission('isDelete') && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showConfirm(driverId)}
              style={{ width: isMobile ? '100%' : '100px' }}
            >
              {t('delete')}
            </Button>
          )
        }
      >
        <Form layout="horizontal" name="search" form={form} {...formItemLayout}>
          {roleLevel == 'SAD' ? (
            <Col {...itemLayout}>
              <Form.Item label={t('company')} name="company">
                <span className="ant-form-text">
                  {detail?.companyId || '-'}{' '}
                </span>
              </Form.Item>
            </Col>
          ) : (
            <></>
          )}
          {roleLevel == 'HUB' ? (
            <></>
          ) : (
            <Col {...itemLayout}>
              <Form.Item label={t('hub-name')} name="hub">
                <span className="ant-form-text">{detail?.hubId || '-'} </span>
              </Form.Item>
            </Col>
          )}

          <Col {...itemLayout}>
            <Form.Item
              label={t('manage-driver-fistname-last-name')}
              name="name"
            >
              <span className="ant-form-text">{detail?.name || '-'} </span>
            </Form.Item>
          </Col>
          {/* <Col {...itemLayout}>
            <Form.Item label={t('manage-driver-last-name')} name="lastName">
              <span className="ant-form-text">
                {detail?.description || '-'}
                {' '}
              </span>
            </Form.Item>
          </Col> */}
          <Col {...itemLayout}>
            <Form.Item
              label={t('manage-driver-phone-number')}
              name="phoneNumber"
            >
              <span className="ant-form-text">{detail?.phoneNo || '-'} </span>
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item label={t('status-active')} name="isActive">
              <span className="ant-form-text">
                {detail?.isActive ? (
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
                        icon={<EditOutlined />}
                        onClick={() =>
                          dispatch(
                            allAction.superAdminAction.setActionPage('edit')
                          )
                        }
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
                      onClick={() => history.push('../hub-employee')}
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
                  onClick={() => history.push('../hub-employee')}
                  style={{ width: '100px', float: 'right', marginLeft: 15 }}
                  block
                >
                  {t('cancel')}
                </Button>
                {FilterPermission('isUpdate') && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ width: '100px', float: 'right' }}
                    onClick={() =>
                      dispatch(allAction.superAdminAction.setActionPage('edit'))
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
  );
};

export default ManageDriverDetail;
