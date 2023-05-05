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

const SettingBankDetail = (props) => {
  const dispatch = useDispatch();

  const { actionPage, agencyBankDetail, companyData } = useSelector(
    (state) => state.settingBankReducer
  );
  const { permission } = useSelector((state) => state.authenReducer);

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    match: {
      params: { agencyBankId },
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
      url: `/bank/${agencyBankId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          const initFormData = {
            bankName: res.data.data.bankName,
            bankCode: res.data.data.bankCode,
            companyName: res.data.data.companyData.companyName,
          };
          setDetail(initFormData);
          form.setFieldsValue(initFormData);
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
        dispatch(allAction.settingBankAction.deleteAgencyBankDetail(id))
          .then(() => {
            message.success('Delete Success!');
            history.push('../setting-bank');
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
                {t('setting-agency-bank-menu-detail')}
              </span>
            </Typography.Title>
          }
          extra={
            FilterPermission('isDelete') && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showConfirm(agencyBankId)}
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
              <Form.Item label={t('setting-agency-code-bank')} name="bankCode">
                <span className="ant-form-text">{detail.bankCode || '-'}</span>
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label={t('setting-agency-name-bank')} name="bankName">
                <span className="ant-form-text">{detail.bankName || '-'}</span>
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
                              allAction.settingBankAction.setActionPage('edit')
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
                    onClick={() => history.push('../setting-bank')}
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
                          allAction.settingBankAction.setActionPage('edit')
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

export default SettingBankDetail;
