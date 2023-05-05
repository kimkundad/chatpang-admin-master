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

const SettingDegreeDetail = (props) => {
  const dispatch = useDispatch();

  const { actionPage, agencyBankDetail, companyData } = useSelector(
    (state) => state.settingBankReducer
  );

  const { permission } = useSelector((state) => state.authenReducer);

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const {
    match: {
      params: { agencyLevelId },
    },
    pageCode,
  } = props;
  const history = useHistory();
  const [loading, setLoadIng] = useState(false);
  const [detail, setDetail] = useState({});
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [list_cod_default, setListCODDefault] = useState([]);
  const [list_discount_default, setListDiscountDefault] = useState([]);
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
    async function fetchMyAPI() {
      callInformation(agencyLevelId);
    }
    fetchMyAPI();
  }, [actionPage]);

  const callInformation = async (agencyLevelId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/agency-level/${agencyLevelId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          const initFormData = {
            agencyLevelName: res.data.data?.agencyLevelName,
            agencyLevelDiscount: [],
            agencyLevelCOD: [],
            companyName: res.data.data?.companyData.companyName,
          };
          const arrayCOD = JSON.parse(`[${res.data.data?.agencyLevelCOD}]`);
          const arrayDiscount = JSON.parse(
            `[${res.data.data?.agencyLevelDiscount}]`
          );

          const discount = arrayDiscount.map((i) => `${i}%`);
          const cod = arrayCOD.map((i) => `${i}%`);
          setListDiscountDefault(discount);
          setListCODDefault(cod);
          setDetail(initFormData);
          form.setFieldsValue(initFormData);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: 'Do you want to delete ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(allAction.settingLevelAction.deleteAgencyLevelDetail(id))
          .then(() => {
            message.success('Delete Success!');
            history.push('../setting-level');
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
                {t('setting-agency-degree-detail')}
              </span>
            </Typography.Title>
          }
          extra={
            FilterPermission('isDelete') && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showConfirm(agencyLevelId)}
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
                label={t('setting-agency-degree-level')}
                name="agencyLevelName"
              >
                <span className="ant-form-text">
                  {detail.agencyLevelName || '-'}
                </span>
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                label={t('setting-agency-degree-discount')}
                name="agencyLevelDiscount"
              >
                {/* <span className="ant-form-text">{detail.bankName || '-'}</span> */}
                {list_discount_default.map((item, index) => (
                  <Tag
                    style={{
                      marginLeft: 8,
                      marginRight: 8,
                      marginTop: 4,
                    }}
                    color="blue"
                  >
                    {item}
                  </Tag>
                ))}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item
                label={t('setting-agency-degree-cod')}
                name="agencyLevelCOD"
              >
                {list_cod_default.map((item, index) => (
                  <Tag
                    style={{
                      marginLeft: 8,
                      marginRight: 8,
                      marginTop: 4,
                    }}
                    color="blue"
                  >
                    {item}
                  </Tag>
                ))}
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
                              allAction.settingLevelAction.setActionPage('edit')
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
                        onClick={() => history.push('../setting-level')}
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
                    onClick={() => history.push('../setting-level')}
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
                          allAction.settingLevelAction.setActionPage('edit')
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

export default SettingDegreeDetail;
