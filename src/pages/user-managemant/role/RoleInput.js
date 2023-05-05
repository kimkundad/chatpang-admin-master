import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Select,
  Card,
  Tree,
  message,
  Modal,
} from 'antd';

import {
  RollbackOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';

import RoleDetail from './RoleDetail';

const { Option } = Select;

const RoleInput = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
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

  const {
    roleDetail,
    masterPageList,
    actionPage,
    expandList,
    checkList,
    dataList,
    resultList,
    masterHubList,
  } = useSelector((state) => state.roleManagementReducer);

  const { masterLevelList } = useSelector(
    (state) => state.userManagementReducer
  );

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { companyData } = useSelector((state) => state.companyReducer);

  const { permission, userLevel, companyId, hubId } = useSelector(
    (state) => state.authenReducer
  );
  const [newMasterLevel, setNewMasterLevel] = useState(masterLevelList);

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
    dispatch(allAction.companyAction.getCompanyData())
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.roleManagementAction.getHubList({ companyId }))
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.roleManagementAction.getAgencyList({ hubId }))
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.userManagementAction.getMasterLevel()).then((e) => {
      checkLevelMaster(e);
    });
    // checkLevelMaster(masterLevelList);
    if (roleId === 'create') {
      form.resetFields();
      form.setFieldsValue({
        roleLevel: userLevel === 'SAD' ? 'COM' : userLevel,
      });
      dispatch(
        allAction.roleManagementAction.getMasterPage(
          userLevel === 'SAD' ? 'COM' : userLevel
        )
      )
        .then((e) => {
          formatDataRender(e);
          expandedKeys(e);
        })
        .catch((e) => message.error(e.message));
      dispatch(allAction.roleManagementAction.setCheckList([]));
      dispatch(allAction.roleManagementAction.setResultList([]));
    } else {
      dispatch(allAction.roleManagementAction.getRoleDetail(roleId))
        .then((e) => {
          checkedKeys(e);
          dispatch(
            allAction.roleManagementAction.getMasterPage(e.roleLevel)
          ).then((data) => {
            formatDataRender(data);
            expandedKeys(data);
          });
        })
        .catch((e) => message.error(e.message));
      dispatch(allAction.roleManagementAction.setResultList(roleDetail));
      // checkRenderPage();
      const initForm = {
        roleLevel: roleDetail?.roleLevel,
        companyId: roleDetail?.roleDetailData?.companyId,
        hubId: roleDetail?.roleDetailData?.hubId,
        agencyId: roleDetail?.userData?.agencyId,
        roleName: roleDetail?.roleName,
      };

      form.setFieldsValue(initForm);
    }
  }, [actionPage]);

  const checkLevelMaster = (masterLevel) => {
    if (userLevel === 'SAD') {
      setNewMasterLevel(
        masterLevel.filter((val) => !['SAD'].includes(val.levelCode))
      );
    } else if (userLevel === 'COM') {
      setNewMasterLevel(
        masterLevel.filter((val) => !['SAD'].includes(val.levelCode))
      );
    } else if (userLevel === 'HUB') {
      setNewMasterLevel(
        masterLevel.filter((val) => !['SAD', 'COM'].includes(val.levelCode))
      );
    } else if (userLevel === 'AGN') {
      setNewMasterLevel(
        masterLevel.filter(
          (val) => !['SAD', 'COM', 'HUB'].includes(val.levelCode)
        )
      );
    }
  };

  const formatDataRender = (masterPage) => {
    const list = [];

    for (const data of masterPage) {
      const obj = {};

      if (data.render) {
        (obj.title = t(data.pageCode)), (obj.key = data.pageCode);
        for (const child of data.pageActionData) {
          const list2 = [];

          if (child.isCreate) {
            list2.push({
              title: t('is-create'),
              key: `${data.pageCode}-isCreate`,
            });
          }
          if (child.isRead) {
            list2.push({
              title: t('is-read'),
              key: `${data.pageCode}-isRead`,
            });
          }
          if (child.isUpdate) {
            list2.push({
              title: t('is-update'),
              key: `${data.pageCode}-isUpdate`,
            });
          }
          if (child.isDelete) {
            list2.push({
              title: t('is-delete'),
              key: `${data.pageCode}-isDelete`,
            });
          }
          obj.children = list2;
        }
        list.push(obj);
      }
    }
    const listRes = [
      {
        title: t('is-all'),
        key: 'ALL',
        children: list,
      },
    ];
    dispatch(allAction.roleManagementAction.setDataList(listRes));
    // console.log(list);
    // return list;
  };

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
    // return list;
  };

  const expandedKeys = (masterPage) => {
    const list = [];
    for (const data of masterPage) {
      list.push(`${data.pageCode}`);
    }
    dispatch(allAction.roleManagementAction.setExpandList(list));
  };

  const onExpand = (expandedKeysValue) => {
    // console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    if (!expandedKeysValue.includes('ALL')) {
      dispatch(allAction.roleManagementAction.setExpandList([]));
    } else {
      dispatch(allAction.roleManagementAction.setExpandList(expandedKeysValue));
    }
  };

  const onCheck = (checkedKeysValue) => {
    if (roleId === 'create') {
      const objRole = masterPageList;
      const list = [];
      for (const data of objRole) {
        for (const data2 of data?.pageActionData) {
          if (checkedKeysValue.includes(`${data2.pageCode}-isCreate`)) {
            data2.isCreate = true;
          }
          if (!checkedKeysValue.includes(`${data2.pageCode}-isCreate`)) {
            data2.isCreate = false;
          }
          if (checkedKeysValue.includes(`${data2.pageCode}-isRead`)) {
            data2.isRead = true;
          }
          if (!checkedKeysValue.includes(`${data2.pageCode}-isRead`)) {
            data2.isRead = false;
          }
          if (checkedKeysValue.includes(`${data2.pageCode}-isDelete`)) {
            data2.isDelete = true;
          }
          if (!checkedKeysValue.includes(`${data2.pageCode}-isDelete`)) {
            data2.isDelete = false;
          }
          if (checkedKeysValue.includes(`${data2.pageCode}-isUpdate`)) {
            data2.isUpdate = true;
          }
          if (!checkedKeysValue.includes(`${data2.pageCode}-isUpdate`)) {
            data2.isUpdate = false;
          }
          list.push(data2);
        }
        dispatch(allAction.roleManagementAction.setResultList(list));
      }
    } else {
      const objRole = roleDetail;
      for (const data of objRole?.rolePermissionData) {
        // console.log(`${data.pageCode}-isCreate`);
        if (checkedKeysValue.includes(`${data.pageCode}-isCreate`)) {
          data.isCreate = true;
        }
        if (!checkedKeysValue.includes(`${data.pageCode}-isCreate`)) {
          data.isCreate = false;
        }
        if (checkedKeysValue.includes(`${data.pageCode}-isRead`)) {
          data.isRead = true;
        }
        if (!checkedKeysValue.includes(`${data.pageCode}-isRead`)) {
          data.isRead = false;
        }
        if (checkedKeysValue.includes(`${data.pageCode}-isDelete`)) {
          data.isDelete = true;
        }
        if (!checkedKeysValue.includes(`${data.pageCode}-isDelete`)) {
          data.isDelete = false;
        }
        if (checkedKeysValue.includes(`${data.pageCode}-isUpdate`)) {
          data.isUpdate = true;
        }
        if (!checkedKeysValue.includes(`${data.pageCode}-isUpdate`)) {
          data.isUpdate = false;
        }
        dispatch(allAction.roleManagementAction.setResultList(objRole));
      }
    }
    dispatch(allAction.roleManagementAction.setCheckList(checkedKeysValue));
    // console.log('onCheck', obj);
  };

  const handleSearchHub = (value) => {
    const objSearch = {
      search: value,
    };
    if (form.getFieldValue('companyId'))
      objSearch.companyId = form.getFieldValue('companyId');
    dispatch(allAction.userManagementAction.getHubList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };

  const onFinishCreate = (value) => {
    if (resultList.length === 0)
      return message.error('Please fill out the information completely.');
    const resData = {
      roleName: value?.roleName,
      roleLevel: value?.roleLevel,
      rolePermission: resultList.map((val) => ({
        pageCode: val.pageCode,
        isRead: val.isRead,
        isCreate: val.isCreate,
        isDelete: val.isDelete,
        isUpdate: val.isUpdate,
      })),
    };
    console.log(value.companyId, companyId);
    if (userLevel === 'SAD') {
      if (value.roleLevel === 'COM') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
        if (!value.companyId)
          return message.error('Please fill out the information completely.');
      } else if (value.roleLevel === 'HUB') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
        resData.hubId = value?.hubId ? `${value?.hubId}` : `${hubId}`;
        if (!value.companyId || !value.hubId)
          return message.error('Please fill out the information completely.');
      } else if (value.roleLevel === 'AGN') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
        if (!value.companyId)
          return message.error('Please fill out the information completely.');
      }
    }
    if (userLevel === 'COM') {
      if (value.roleLevel === 'COM') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
      } else if (value.roleLevel === 'HUB') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
        resData.hubId = value?.hubId ? `${value?.hubId}` : `${hubId}`;
        if (!value.hubId)
          return message.error('Please fill out the information completely.');
      } else if (value.roleLevel === 'AGN') {
        // console.log(value.companyId, companyId);
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
      }
    } else if (userLevel === 'HUB') {
      if (value.roleLevel === 'HUB') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
        resData.hubId = value?.hubId ? `${value?.hubId}` : `${hubId}`;
      } else if (value.roleLevel === 'AGN') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${companyId}`;
      }
    }
    Modal.confirm({
      title: 'Do you want to create role ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          allAction.roleManagementAction.createRoleManagementDetail(resData)
        )
          .then(() => {
            message.success('Create Success!');
            history.push('../permission');
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onFinishUpdate = (value) => {
    // console.log(resultList);

    if (!resultList)
      return message.error('Please fill out the information completely.');
    const resData = {
      roleName: value?.roleName,
      roleLevel: value?.roleLevel,
      rolePermission: resultList?.rolePermissionData.map((val) => ({
        pageCode: val.pageCode,
        isRead: val.isRead,
        isCreate: val.isCreate,
        isDelete: val.isDelete,
        isUpdate: val.isUpdate,
      })),
    };
    if (userLevel === 'SAD') {
      if (value.roleLevel === 'COM') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
        if (!value.companyId)
          return message.error('Please fill out the information completely.');
      } else if (value.roleLevel === 'HUB') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
        resData.hubId = value?.hubId
          ? `${value?.hubId}`
          : `${resultList?.roleDetailData?.hubId}`;
        if (!value.companyId || !value.hubId)
          return message.error('Please fill out the information completely.');
      } else if (value.roleLevel === 'AGN') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
        if (!value.companyId)
          return message.error('Please fill out the information completely.');
      }
    }
    if (userLevel === 'COM') {
      if (value.roleLevel === 'COM') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
      } else if (value.roleLevel === 'HUB') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
        resData.hubId = value?.hubId
          ? `${value?.hubId}`
          : `${resultList?.roleDetailData?.hubId}`;
        if (!value.hubId)
          return message.error('Please fill out the information completely.');
      } else if (value.roleLevel === 'AGN') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
      }
    } else if (userLevel === 'HUB') {
      if (value.roleLevel === 'HUB') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
        resData.hubId = value?.hubId
          ? `${value?.hubId}`
          : `${resultList?.roleDetailData?.hubId}`;
      } else if (value.roleLevel === 'AGN') {
        resData.companyId = value?.companyId
          ? `${value?.companyId}`
          : `${resultList?.roleDetailData?.companyId}`;
      }
    }

    Modal.confirm({
      title: 'Do you want to update role ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          allAction.roleManagementAction.updateRoleManagementDetail(
            roleId,
            resData
          )
        )
          .then(() => {
            message.success('Update Success!');
            dispatch(allAction.roleManagementAction.setActionPage('view'));
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const toFilterSaveBtn = () => {
    if (roleId === 'create') {
      return FilterPermission('isCreate');
    }
    return FilterPermission('isUpdate');
  };

  if (roleId !== 'create' && actionPage === 'view') {
    return <RoleDetail {...props} />;
  }

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Card
          title={
            <Typography.Title level={3}>
              <span className="text-primary">
                {roleId === 'create'
                  ? t('create-role-management')
                  : t('edit-role-management')}
              </span>
            </Typography.Title>
          }
        >
          <Form
            layout="horizontal"
            {...formItemLayout}
            form={form}
            onFinish={roleId === 'create' ? onFinishCreate : onFinishUpdate}
          >
            <Row gutter={[8, 8]}>
              {FilterUserLevel(['SAD', 'COM', 'HUB', 'AGN']) && (
                <Col {...itemLayout}>
                  <Form.Item
                    label={t('role-level')}
                    name="roleLevel"
                    rules={[
                      { required: true, message: 'Please Input Role Level!' },
                    ]}
                  >
                    <Select
                      allowClear
                      onChange={(e) => {
                        form.resetFields(['companyId', 'hubId', 'agencyId']);
                        dispatch(
                          allAction.userManagementAction.getMasterRole({
                            roleLevel: e,
                          })
                        );
                        dispatch(
                          allAction.roleManagementAction.getMasterPage(e)
                        ).then((data) => {
                          formatDataRender(data);
                          expandedKeys(data);
                        });
                      }}
                      disabled={roleId !== 'create'}
                    >
                      {newMasterLevel &&
                        newMasterLevel.map((val) => (
                          <Option value={val.levelCode}>{val.levelName}</Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {FilterUserLevel(['SAD']) && (
                <Col {...itemLayout}>
                  <Form.Item label={t('company')} name="companyId">
                    <Select
                      allowClear
                      showSearch
                      // disabled={form.getFieldValue('userLevel') !== 'COM'}
                      disabled={
                        !['COM', 'HUB', 'AGN'].includes(
                          form.getFieldValue('roleLevel')
                        ) || roleId !== 'create'
                      }
                      optionFilterProp="children"
                      onChange={() => {
                        form.resetFields(['hubId', 'agencyId']);
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onSelect={(e) => {
                        dispatch(
                          allAction.roleManagementAction.getHubList({
                            companyId: e,
                          })
                        );
                        dispatch(
                          allAction.roleManagementAction.getMasterRole({
                            roleLevel: form.getFieldValue('roleLevel'),
                            companyId: e,
                          })
                        );
                      }}
                    >
                      {companyData.map((val) => (
                        <Option value={val.companyId}>{val.companyName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {FilterUserLevel(['SAD', 'COM']) && (
                <Col {...itemLayout}>
                  <Form.Item label={t('hub')} name="hubId">
                    <Select
                      allowClear
                      showSearch
                      onSearch={handleSearchHub}
                      showArrow={false}
                      filterOption={false}
                      disabled={
                        !['HUB'].includes(form.getFieldValue('roleLevel')) ||
                        roleId !== 'create'
                      }
                      onChange={() => {
                        form.resetFields(['agencyId']);
                      }}
                      onSelect={(e) => {
                        dispatch(
                          allAction.roleManagementAction.getAgencyList({
                            hubId: e,
                          })
                        );
                      }}
                    >
                      {masterHubList.map((val) => (
                        <Option value={val.hubId}>{val.hubName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Col {...itemLayout}>
                <Form.Item
                  label={t('role-name')}
                  name="roleName"
                  rules={[
                    { required: true, message: 'Please Input Role Name!' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...itemLayout}>
                <Form.Item label={t('permission')}>
                  <Tree
                    // height={400}
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandList}
                    autoExpandParent
                    onCheck={onCheck}
                    checkedKeys={checkList}
                    treeData={dataList}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item style={{ marginTop: '50px' }}>
                  {isMobile ? (
                    <>
                      <Row gutter={[16, 16]}>
                        {toFilterSaveBtn() && (
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
                        )}
                        <Col xs={24}>
                          <Button
                            type="default"
                            icon={<RollbackOutlined />}
                            onClick={() =>
                              roleId === 'create'
                                ? history.push('../permission')
                                : dispatch(
                                    allAction.userManagementAction.setActionPage(
                                      'view'
                                    )
                                  )
                            }
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
                        onClick={() =>
                          roleId === 'create'
                            ? history.push('../permission')
                            : dispatch(
                                allAction.userManagementAction.setActionPage(
                                  'view'
                                )
                              )
                        }
                        style={{
                          width: '100px',
                          float: 'right',
                          marginLeft: 15,
                        }}
                      >
                        {t('cancel')}
                      </Button>
                      {toFilterSaveBtn() && (
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          style={{ width: '100px', float: 'right' }}
                          htmlType="submit"
                        >
                          {t('save')}
                        </Button>
                      )}
                    </>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </>
  );
};

export default RoleInput;
