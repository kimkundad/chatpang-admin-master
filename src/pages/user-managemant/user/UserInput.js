import React, { useEffect, state, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Card,
  Checkbox,
  message,
  Select,
  Modal,
} from 'antd';
import {
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';

import UserDetail from './UserDetail';

const { Option } = Select;
const UserInput = (props) => {
  const {
    match: {
      params: { userId },
    },
    pageCode,
  } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const history = useHistory();

  const {
    userDetail,
    actionPage,
    masterLevelList,
    masterHubList,
    masterAgencyList,
    masterRoleList,
  } = useSelector((state) => state.userManagementReducer);
  const { companyData } = useSelector((state) => state.companyReducer);
  const {
    userLevel, companyId, hubId, agencyId, permission, userAuthId,
  } = useSelector(
    (state) => state.authenReducer,
  );
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);

  const [newMasterLevel, setNewMasterLevel] = useState(masterLevelList);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const itemLayout = { xs: 24, sm: { span: 18, offset: 2 } };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  useEffect(() => {
    dispatch(allAction.userManagementAction.getMasterLevel())
      .then((e) => {
        checkLevelMaster(e);
      })
      .catch((e) => message.error(e.message));
    dispatch(allAction.companyAction.getCompanyData())
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.userManagementAction.getHubList({ companyId }))
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.userManagementAction.getAgencyList({ hubId }))
      .then()
      .catch((e) => message.error(e.message));
    dispatch(
      allAction.userManagementAction.getMasterRole({ roleLevel: userLevel }),
    )
      .then()
      .catch((e) => message.error(e.message));
  }, []);

  const checkLevelMaster = (masterLevel) => {
    if (userLevel === 'SAD') {
      setNewMasterLevel(
        masterLevel.filter((val) => !['SAD'].includes(val.levelCode)),
      );
    } else if (userLevel === 'COM') {
      setNewMasterLevel(
        masterLevel.filter((val) => !['SAD'].includes(val.levelCode)),
      );
    } else if (userLevel === 'HUB') {
      setNewMasterLevel(
        masterLevel.filter((val) => !['SAD', 'COM'].includes(val.levelCode)),
      );
    } else if (userLevel === 'AGN') {
      setNewMasterLevel(
        masterLevel.filter(
          (val) => !['SAD', 'COM', 'HUB'].includes(val.levelCode),
        ),
      );
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkLevelMaster(masterLevelList);
    if (userId === 'create') {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        userLevel: userLevel === 'SAD' ? 'COM' : userLevel,
      });
    } else {
      dispatch(allAction.userManagementAction.getUserDetail(userId))
        .then()
        .catch((e) => message.error(e.message));
      dispatch(
        allAction.userManagementAction.getHubList({
          companyId: userDetail?.userData?.companyId,
        }),
      )
        .then()
        .catch((e) => message.error(e.message));
      dispatch(
        allAction.userManagementAction.getAgencyList({
          companyId: userDetail?.userData?.companyId,
        }),
      )
        .then()
        .catch((e) => message.error(e.message));
      dispatch(
        allAction.userManagementAction.getMasterRole({
          roleLevel: userDetail?.userData?.userLevel,
          companyId: userDetail?.userData?.companyId,
        }),
      )
        .then()
        .catch((e) => message.error(e.message));
      const initForm = {
        userLevel: userDetail?.userData?.userLevel,
        companyId: userDetail?.userData?.companyId,
        hubId: userDetail?.userData?.hubId,
        agencyId: userDetail?.userData?.agencyId,
        name: userDetail?.userData?.name,
        email: userDetail?.email,
        phoneNo: userDetail?.phoneNo,
        roleId: userDetail?.userData?.roleId,
        isActive: userDetail?.isActive,
      };

      form.setFieldsValue(initForm);
    }
  }, [actionPage]);

  const handleSearchHub = (value) => {
    const objSearch = {
      search: value,
    };
    if (form.getFieldValue('companyId')) {
      objSearch.companyId = form.getFieldValue('companyId');
    }
    dispatch(allAction.userManagementAction.getHubList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };

  const handleSearchAgency = (value) => {
    const objSearch = {
      search: value,
    };
    if (form.getFieldValue('companyId')) {
      objSearch.companyId = form.getFieldValue('companyId');
    }
    if (form.getFieldValue('hubId')) {
      objSearch.hubId = form.getFieldValue('hubId');
    }
    dispatch(allAction.userManagementAction.getAgencyList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };

  const onFinish = (value) => {
    const valueData = value;
    // set id and validate field
    if (userLevel === 'SAD') {
      if (valueData.userLevel === 'COM') {
        if (!valueData.companyId) {
          return message.error('Please fill out the information completely.');
        }
      } else if (valueData.userLevel === 'HUB') {
        if (!valueData.companyId || !valueData.hubId) {
          return message.error('Please fill out the information completely.');
        }
      } else if (valueData.userLevel === 'AGN') {
        if (!valueData.companyId || !valueData.agencyId) {
          return message.error('Please fill out the information completely.');
        }
      }
    }
    if (userLevel === 'COM') {
      valueData.companyId = companyId;
      if (valueData.userLevel === 'COM') {
        if (!valueData.companyId) {
          return message.error('Please fill out the information completely.');
        }
      } else if (valueData.userLevel === 'HUB') {
        if (!valueData.companyId || !valueData.hubId) {
          return message.error('Please fill out the information completely.');
        }
      } else if (valueData.userLevel === 'AGN') {
        if (!valueData.companyId || !valueData.agencyId) {
          return message.error('Please fill out the information completely.');
        }
      }
    } else if (userLevel === 'HUB') {
      valueData.companyId = companyId;
      valueData.hubId = hubId;
      if (valueData.userLevel === 'HUB') {
        if (!valueData.hubId) {
          return message.error('Please fill out the information completely.');
        }
      } else if (valueData.userLevel === 'AGN') {
        if (!valueData.agencyId) {
          return message.error('Please fill out the information completely.');
        }
      }
    } else if (userLevel === 'AGN') {
      valueData.companyId = companyId;
      valueData.hubId = hubId;
      valueData.agencyId = agencyId;
      if (valueData.userLevel === 'AGN') {
        if (!valueData.agencyId) {
          return message.error('Please fill out the information completely.');
        }
      }
    }

    // check action
    if (userId === 'create') {
      delete valueData.confirmPassword;
      Modal.confirm({
        title: 'Do you want to create user ?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.userManagementAction.createUserManagementDetail(valueData),
          )
            .then(() => {
              message.success('Create Success!');
              history.push('../user');
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      if (valueData.firstPassword) {
        valueData.password = valueData.firstPassword;
      }
      delete valueData.userLevel;
      delete valueData.firstPassword;
      delete valueData.confirmPassword;
      Modal.confirm({
        title: 'Do you want to update user ?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.userManagementAction.updateUserManagementDetail(
              userId,
              valueData,
            ),
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.userManagementAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const onChangeEmail = (e) => {
    const { value } = e.target;

    form.setFieldsValue({
      email: value.replace(
        /[^\S]|<|>|\(|\)|`|\$|%|\^|\&|\*|\+|=|"|:|;|\?|,/g,
        '',
      ),
    });
  };

  const toFilterSaveBtn = () => {
    if (userId === 'create') {
      return FilterPermission('isCreate');
    }
    return FilterPermission('isUpdate');
  };

  const disableRole = () => {
    if (userId !== 'create') {
      if (`${userId}` === `${userAuthId}`) {
        return true;
      }
      if (form.getFieldValue('companyId')) {
        if (!form.getFieldValue('companyId')) {
          return true;
        }
      } else if (form.getFieldValue('userLevel') && !form.getFieldValue('companyId')) {
        return true;
      }
    }
    return false;
  };

  if (userId !== 'create' && actionPage === 'view') {
    return <UserDetail {...props} />;
  }
  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Card
          title={(
            <Typography.Title level={3}>
              <span className="text-primary">
                {userId === 'create'
                  ? t('create-user-management')
                  : t('edit-user-management')}
              </span>
            </Typography.Title>
          )}
        >
          <Form
            layout="horizontal"
            form={form}
            name="userInput"
            {...formItemLayout}
            onFinish={onFinish}
          >
            {FilterUserLevel(['SAD', 'COM', 'HUB', 'AGN']) && (
              <Col {...itemLayout}>
                <Form.Item
                  label={t('user-level')}
                  name="userLevel"
                  rules={[
                    { required: true, message: 'Please input User Level!' },
                  ]}
                >
                  <Select
                    allowClear
                    onChange={(e) => {
                      form.resetFields([
                        'companyId',
                        'hubId',
                        'agencyId',
                        'roleId',
                      ]);
                      dispatch(
                        allAction.userManagementAction.getMasterRole({
                          roleLevel: e,
                        }),
                      );
                    }}
                    disabled={userId !== 'create'}
                  >
                    {newMasterLevel
                      && newMasterLevel.map((val) => (
                        <Option value={val.levelCode}>{val.levelName}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {FilterUserLevel(['SAD']) && (
              <Col {...itemLayout}>
                <Form.Item label={t('company')} name="companyId"
                  rules={[{
                    required: ['COM', 'HUB', 'AGN'].includes(
                      form.getFieldValue('userLevel'),
                    ) || userId !== 'create', message: 'Please select!'
                  }]}>
                  <Select
                    allowClear
                    showSearch
                    // disabled={form.getFieldValue('userLevel') !== 'COM'}
                    disabled={
                      !['COM', 'HUB', 'AGN'].includes(
                        form.getFieldValue('userLevel'),
                      ) || userId !== 'create'
                    }
                    optionFilterProp="children"
                    onChange={() => {
                      form.resetFields(['hubId', 'agencyId', 'roleId']);
                    }}
                    filterOption={(input, option) => option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0}
                    onSelect={(e) => {
                      dispatch(
                        allAction.userManagementAction.getHubList({
                          companyId: e,
                        }),
                      );
                      dispatch(
                        allAction.userManagementAction.getAgencyList({
                          companyId: e,
                        }),
                      );
                      dispatch(
                        allAction.userManagementAction.getMasterRole({
                          roleLevel: form.getFieldValue('userLevel'),
                          companyId: e,
                        }),
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
                <Form.Item label={t('hub')} name="hubId"
                  rules={[{
                    required: ['HUB', 'AGN'].includes(
                      form.getFieldValue('userLevel'),
                    ) || userId !== 'create', message: 'Please select!'
                  }]}>
                  <Select
                    allowClear
                    showSearch
                    onSearch={handleSearchHub}
                    showArrow={false}
                    filterOption={false}
                    disabled={
                      !['HUB', 'AGN'].includes(
                        form.getFieldValue('userLevel'),
                      ) || userId !== 'create'
                    }
                    onChange={() => {
                      form.resetFields(['agencyId', 'roleId']);
                    }}
                    onSelect={(e) => {
                      dispatch(
                        allAction.userManagementAction.getAgencyList({
                          hubId: e,
                        }),
                      );
                      dispatch(
                        allAction.userManagementAction.getMasterRole({
                          roleLevel: form.getFieldValue('userLevel'),
                          companyId: form.getFieldValue('companyId'),
                          hubId: e,
                        }),
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

            {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
              <Col {...itemLayout}>
                <Form.Item label={t('agency')} name="agencyId"
                  rules={[{
                    required: ['AGN'].includes(form.getFieldValue('userLevel'))
                      || userId !== 'create', message: 'Please select!'
                  }]}>
                  <Select
                    allowClear
                    showSearch
                    onSearch={handleSearchAgency}
                    disabled={
                      !['AGN'].includes(form.getFieldValue('userLevel'))
                      || userId !== 'create'
                    }
                    showArrow={false}
                    filterOption={false}
                    onSelect={(e) => {
                      dispatch(
                        allAction.userManagementAction.getMasterRole({
                          roleLevel: form.getFieldValue('userLevel'),
                          companyId: form.getFieldValue('companyId'),
                          hubId: form.getFieldValue('hubId'),
                          agencyId: e,
                        }),
                      );
                    }}
                  >
                    {masterAgencyList.map((val) => (
                      <Option value={val.agencyId}>{val.agencyCode}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            <Col {...itemLayout}>
              <Form.Item
                label={t('username')}
                name="name"
                rules={[{ required: true, message: 'Please input Name!' }]}
              >
                <Input
                  autocomplete="new-password"
                  placeholder={t('username')}
                />
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                label={t('email')}
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input E-mail!',
                    type: 'email'
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (/[^A-Za-z\d|^@+_.\-]/g.test(value)
                      ) {
                        return Promise.reject(
                          new Error(
                            'Incorrect characters.'
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  autocomplete="email"
                  placeholder={t('email')}
                  disabled={userId !== 'create'}
                  onChange={onChangeEmail}
                />
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                label={t('phone')}
                name="phoneNo"
                rules={[
                  { required: true, message: 'Please input Phone No!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || !isNaN(value)) {
                        if (value.length === 9 || value.length === 10) {
                          if (/[^\d]/g.test(value)) {
                            return Promise.reject(
                              new Error(
                                'Incorrect characters.'
                              )
                            );
                          }

                          return Promise.resolve();
                        }
                        return Promise.reject(
                          'Phone Number Length 9-10 Digits!',
                        );
                      }

                      return Promise.reject('Phone Number Incorrect Format!');
                    },
                  }),
                ]}
              >
                <Input autocomplete="phone-no" placeholder={t('phone')} />
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                label={t('role')}
                name="roleId"
                rules={[{ required: true, message: 'Please input Role!' }]}
              >
                <Select
                  allowClear
                  disabled={
                    disableRole()
                  }
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0}
                >
                  {masterRoleList.map((val) => (
                    <Option value={val.roleId}>{val.roleName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {userId === 'create' ? (
              <>
                <Col {...itemLayout}>
                  <Form.Item
                    label={t('first-password')}
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input first login password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (/[^A-Za-z\d|^~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.?/]/g.test(value)
                          ) {
                            return Promise.reject(
                              new Error(
                                'Incorrect characters.'
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      onChange={() => {
                        form.validateFields(['confirmPassword']);
                      }}
                      autocomplete="new-password"
                      placeholder={t('first-password')}
                    />
                  </Form.Item>
                </Col>
                <Col {...itemLayout}>
                  <Form.Item
                    label={t('confirm-password')}
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input Confirm Login Password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              'The two passwords that you entered do not match!',
                            ),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      onChange={() => {
                        form.validateFields(['password']);
                      }}
                      autocomplete="new-password"
                      placeholder={t('confirm-password')}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : (
              <>
                <Col {...itemLayout}>
                  <Form.Item
                    label={t('new-password')}
                    name="firstPassword"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (/[^A-Za-z\d|^~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.?/]/g.test(value)
                          ) {
                            return Promise.reject(
                              new Error(
                                'Incorrect characters.'
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    validateTrigger="onBlur"
                  >
                    <Input.Password
                      autocomplete="new-password"
                      placeholder={t('first-password')}
                    />
                  </Form.Item>
                </Col>
                <Col {...itemLayout}>
                  <Form.Item
                    label={t('confirm-password')}
                    name="confirmPassword"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (value) {
                            if (getFieldValue('firstPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              'The two passwords that you entered do not match!',
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    validateTrigger="onBlur"
                  >
                    <Input.Password
                      autocomplete="new-password"
                      placeholder={t('confirm-password')}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col {...itemLayout}>
              <Form.Item
                label={t('status-active')}
                name="isActive"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>

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
                        onClick={() => (userId === 'create'
                          ? history.push('../user')
                          : dispatch(
                            allAction.userManagementAction.setActionPage(
                              'view',
                            ),
                          ))}
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
                    onClick={() => (userId === 'create'
                      ? history.push('../user')
                      : dispatch(
                        allAction.userManagementAction.setActionPage('view'),
                      ))}
                    style={{ width: '100px', float: 'right', marginLeft: 15 }}
                  >
                    {t('cancel')}
                  </Button>
                  {toFilterSaveBtn() && (
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      style={{ width: '100px', float: 'right' }}
                    >
                      {t('save')}
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

UserInput.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default UserInput;
