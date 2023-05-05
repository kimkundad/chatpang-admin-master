import React, { useEffect, useState } from 'react';
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
import { fetch } from '../../utils/fetch';

const SettingCategoryDetail = (props) => {
  const dispatch = useDispatch();

  const { actionPage, agencyTypeDetail, companyData } = useSelector(
    (state) => state.settingAgencyReducer
  );
  const { permission } = useSelector((state) => state.authenReducer);

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    match: {
      params: { agencyTypeId },
    },
    pageCode,
  } = props;
  const history = useHistory();
  const [loading, setLoadIng] = useState(false);
  const [detail, setDetail] = useState({});
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
          setDetail(initFormData);
          form.setFieldsValue(initFormData);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  }, [actionPage]);

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

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Card
          title={
            <Typography.Title level={3}>
              <span className="text-primary">
                {t('setting-agency-category-menu-detail')}
              </span>
            </Typography.Title>
          }
          extra={
            FilterPermission('isDelete') && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showConfirm(agencyTypeId)}
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
              <Form.Item label={t('company')} name="companyName">
                <span className="ant-form-text">
                  {detail.companyName || '-'}{' '}
                </span>
              </Form.Item>
            </Col>

            <Col {...itemLayout}>
              <Form.Item
                label={t('setting-agency-category-type')}
                name="agencyTypeName"
              >
                <span className="ant-form-text">
                  {detail.agencyTypeName || '-'}
                </span>
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                label={t('setting-agency-category-description')}
                name="description"
              >
                <span className="ant-form-text">
                  {detail.description || '-'}
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
                              allAction.settingAgencyAction.setActionPage(
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
                    onClick={() => history.push('../setting-agency')}
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
                          allAction.settingAgencyAction.setActionPage('edit')
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

export default SettingCategoryDetail;
