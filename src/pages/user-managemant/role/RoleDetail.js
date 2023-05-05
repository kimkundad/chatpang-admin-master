import React, { useEffect } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Modal,
  Card,
  Tree,
  message,
} from 'antd';

import {
  RollbackOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';

const RoleDetail = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const {
    match: {
      params: { roleId },
    },
    pageCode,
  } = props;

  const { roleDetail, actionPage, expandList, checkList, dataList } =
    useSelector((state) => state.roleManagementReducer);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, userLevel } = useSelector((state) => state.authenReducer);

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.roleManagementAction.setCheckList([]));
    dispatch(allAction.roleManagementAction.setResultList([]));
    dispatch(allAction.roleManagementAction.getRoleDetail(roleId))
      .then((e) => {
        checkedKeys(e);
      })
      .catch((e) => message.error(e.message));
  }, [actionPage]);

  const checkedKeys = (roleData) => {
    const list = [];
    for (const data of roleData?.rolePermissionData) {
      if (data.isRead) {
        list.push(`${data.pageCode}-isRead`);
      }
      if (data.isUpdate) {
        list.push(`${data.pageCode}-isUpdate`);
      }
      if (data.isDelete) {
        list.push(`${data.pageCode}-isDelete`);
      }
      if (data.isCreate) {
        list.push(`${data.pageCode}-isCreate`);
      }
    }
    dispatch(allAction.roleManagementAction.setCheckList(list));
  };

  const onExpand = (expandedKeysValue) => {
    if (!expandedKeysValue.includes('ALL')) {
      dispatch(allAction.roleManagementAction.setExpandList([]));
    } else {
      dispatch(allAction.roleManagementAction.setExpandList(expandedKeysValue));
    }
  };

  const showConfirm = (roleId) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          allAction.roleManagementAction.deleteRoleManagementDetail(roleId)
        )
          .then(() => {
            message.success('Delete Success!');
            history.push('../permission');
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
          title={
            <Typography.Title level={3}>
              <span className="text-primary">
                {t('detail-role-management')}
              </span>
            </Typography.Title>
          }
          extra={
            FilterPermission('isDelete') && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showConfirm(roleId)}
                style={{ width: isMobile ? '100%' : '100px' }}
              >
                {t('delete')}
              </Button>
            )
          }
        >
          <Form layout="horizontal" {...formItemLayout}>
            <Row gutter={[8, 8]}>
              {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
                <Col {...itemLayout}>
                  <Form.Item label={t('role-level')}>
                    <span>{roleDetail?.roleLevelData?.levelName || '-'}</span>
                  </Form.Item>
                </Col>
              )}
              {FilterUserLevel(['SAD', 'HUB']) && (
                <Col {...itemLayout}>
                  <Form.Item label={t('company-select')}>
                    <span>
                      {roleDetail?.roleDetailData?.companyData?.companyName ||
                        '-'}
                    </span>
                  </Form.Item>
                </Col>
              )}
              {FilterUserLevel(['SAD', 'COM']) && (
                <Col {...itemLayout}>
                  <Form.Item label={t('hub')}>
                    <span>
                      {roleDetail?.roleDetailData?.hubData?.hubName || '-'}
                    </span>
                  </Form.Item>
                </Col>
              )}
              {/* <Col {...itemLayout}>
                <Form.Item label={t('agency')}>
                  <span>{roleDetail?.roleDetailData?.agencyId || '-'}</span>
                </Form.Item>
              </Col> */}
              <Col {...itemLayout}>
                <Form.Item label={t('role-name')}>
                  <span>{roleDetail?.roleName || '-'}</span>
                </Form.Item>
              </Col>
              <Col {...itemLayout}>
                <Form.Item label={t('permission')}>
                  <Tree
                    // height={400}
                    checkable
                    onExpand={onExpand}
                    disabled
                    expandedKeys={expandList}
                    autoExpandParent
                    checkedKeys={checkList}
                    treeData={dataList}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <div style={{ marginTop: '50px' }}>
                  {isMobile ? (
                    <>
                      <Row gutter={[16, 16]}>
                        <Col xs={24}>
                          {FilterPermission('isUpdate') && (
                            <Button
                              type="primary"
                              onClick={() =>
                                dispatch(
                                  allAction.roleManagementAction.setActionPage(
                                    'edit'
                                  )
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
                            onClick={() => history.push('../permission')}
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
                        onClick={() => history.push('../permission')}
                        style={{
                          width: '100px',
                          float: 'right',
                          marginLeft: 15,
                        }}
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
                              allAction.roleManagementAction.setActionPage(
                                'edit'
                              )
                            )
                          }
                        >
                          {t('edit')}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </>
  );
};

export default RoleDetail;
