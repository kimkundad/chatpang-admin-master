/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import {
  Form,
  Input,
  Button,
  message,
  Layout,
  Col,
  Row,
  Spin,
  Select,
  Typography,
  Table,
  Modal,
  Upload,
  DatePicker,
} from 'antd';
import React, { useEffect, useState } from 'react';

import moment from 'moment';
import momenttz from 'moment-timezone';

import { useTranslation } from 'react-i18next';
import {
  DownloadOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';

const { Option } = Select;

const SettingTransport = (props) => {
  const {
    settingTransportData, companyData, columns, calculatePrice,
  } = useSelector((state) => state.settingTransportReducer);

  const effectiveAtDisplay = useSelector((state) => state.settingTransportReducer.effectiveAt);

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { permission, roleLevel, companyId } = useSelector(
    (state) => state.authenReducer,
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [companyIdBySelect, setCompanyIdBySelect] = useState(null);
  const [fileExcel, setFileExcel] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formCal] = Form.useForm();
  const [formModal] = Form.useForm();
  const [fileName, setFileName] = useState('');
  const [effectiveAt, setEffectiveAt] = useState(null);
  const checkNullCompanyId = roleLevel === 'SAD' ? companyIdBySelect : companyId;
  const { pageCode } = props;

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(
      allAction.settingTransportAction.getSettingTransportData(
        checkNullCompanyId,
      ),
    )
      .then(() => { })
      .catch((e) => message.error(e.message));
    dispatch(allAction.settingTransportAction.calculate(0, 0, 0))
      .then(() => { })
      .catch((e) => message.error(e.message));
    form.setFieldsValue({
      search: '',
      isActive: '',
    });
    formCal.setFieldsValue({
      weight: '',
      size: '',
      price: '',
    });
  }, []);

  const handleFilterChange = (value) => {
    if (value === '') {
      value = null;
    }
    setCompanyIdBySelect(value);
    dispatch(allAction.settingTransportAction.getSettingTransportData(value))
      .then(() => { })
      .catch((e) => message.error(e.message));
  };

  const onFinishSearch = (value) => {
    if (roleLevel === 'SAD') {
      value.companyId == null
        ? message.error('กรุณาเลือกบริษัท')
        : dispatch(
          allAction.settingTransportAction.filterSettingTransport(value),
        )
          .then(() => { })
          .catch((e) => message.error(e.message));
    } else {
      const obj = {
        search: value.search,
        companyId,
      };
      dispatch(allAction.settingTransportAction.filterSettingTransport(obj))
        .then(() => { })
        .catch((e) => message.error(e.message));
    }
  };

  const onFinishCalculator = (value) => {
    if (roleLevel === 'SAD') {
      companyIdBySelect == null
        ? message.error('กรุณาเลือกบริษัท')
        : dispatch(
          allAction.settingTransportAction.calculate(
            companyIdBySelect,
            value.weight,
            value.size,
          ),
        )
          .then(() => { })
          .catch((e) => message.error(e.message));
      // formCal.resetFields();
    } else {
      dispatch(
        allAction.settingTransportAction.calculate(
          checkNullCompanyId,
          value.weight,
          value.size,
        ),
      )
        .then(() => { })
        .catch((e) => message.error(e.message));
    }
    // formCal.resetFields();
  };

  const showModal = () => {
    setIsModalVisible(true);
    setFileName();
  };
  const handleOk = () => {
    const { effectiveDate } = formModal.getFieldsValue();

    if (fileExcel != null && checkNullCompanyId != null && effectiveDate != null) {
      if (
        fileExcel.type
        === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const current = moment().format('YYYY-MM-DD');
        const effective = moment(effectiveAt).format('YYYY-MM-DD');
        console.log(`${effective},${current}`);
        if (effective == current) {
          dispatch(
            allAction.settingTransportAction.importFile(
              fileExcel,
              checkNullCompanyId,
              effectiveAt,
            ),
          );
        } else {
          dispatch(
            allAction.settingTransportAction.uploadFile(
              fileExcel,
              checkNullCompanyId,
              effectiveAt,
            ),
          );
        }
        setFileName('');
        setFileExcel(null);
        formModal.setFieldsValue({
          effectiveDate: null,
        });
      } else {
        message.warning('กรุณาอัพโหลดไฟล์(.xlsx)');
      }
    }

    checkNullCompanyId == null ? message.error('กรุณาเลือกบริษัท') : '';
    fileExcel == null ? message.error('กรุณาเลือกอัพโหลดไฟล์') : '';
    effectiveDate == null ? message.error('กรุณาเลือกวันที่') : '';

    if (effectiveDate) console.log(true);
    else console.log(false);

    if (checkNullCompanyId && fileExcel && effectiveDate) { setIsModalVisible(false); }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileName();
  };

  const exportFile = () => {
    checkNullCompanyId == null ? message.error('กรุณาเลือกบริษัท') : '';
    if (checkNullCompanyId != null) {
      dispatch(allAction.settingTransportAction.exportFile(checkNullCompanyId));
    }
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const uploadProps = {
    listType: 'picture',
    onChange(info) {
      if (info.file.status === 'removed') {
        setFileName();
      }
      if (info.file.status !== 'ok') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        setFileExcel(info.file.originFileObj);
        setFileName(info.file.originFileObj.name);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onEffectiveDateChange = (date, dateString) => {
    console.log(dateString);
    setEffectiveAt(dateString);
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        {/* <Spin spinning={false} tip="Loading..."> */}
        <Layout style={{ minHeight: '100vh' }}>
          {isMobile ? (
            <Row gutter={[24, 24]}>
              <Col xs={{ span: 24 }}>
                <Typography.Title level={3}>
                  <span className="text-primary">
                    {t('menu-setting-transport')}
                  </span>
                </Typography.Title>
              </Col>
            </Row>
          ) : (
            ''
          )}
          {isMobile ? (
            checkNullCompanyId == null ? (
              <></>
            ) : (
              FilterPermission('isCreate') && (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={showModal}
                  style={{ marginBottom: 10 }}
                  block
                >
                  {t('import-file')}
                </Button>
              )
            )
          ) : (
            ''
          )}
          {isMobile ? (
            checkNullCompanyId == null ? (
              <></>
            ) : (
              FilterPermission('isRead') && (
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={exportFile}
                  block
                >
                  {t('export-file')}
                </Button>
              )
            )
          ) : (
            <Row
              xs={{ span: 24 }}
              lg={{ span: 5, offset: 2 }}
              xxl={{ span: 3, offset: 4 }}
            >
              <Col span={12}>
                <Typography.Title level={3}>
                  <span className="text-primary">
                    {t('menu-setting-transport')}
                  </span>
                </Typography.Title>
              </Col>
              <Col span={12}>
                <div style={{ float: 'right' }}>
                  {checkNullCompanyId == null ? (
                    <></>
                  ) : (
                    FilterPermission('isCreate') && (
                      <Button
                        type="primary"
                        onClick={showModal}
                        icon={<DownloadOutlined />}
                        style={{ width: '135px', marginRight: 6 }}
                        block
                      >
                        {t('import-file')}
                      </Button>
                    )
                  )}

                  {checkNullCompanyId == null ? (
                    <></>
                  ) : (
                    FilterPermission('isRead') && (
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={exportFile}
                        style={{ width: '135px' }}
                        block
                      >
                        {t('export-file')}
                      </Button>
                    )
                  )}
                </div>
              </Col>
            </Row>
          )}

          <Form layout="vertical" form={form} onFinish={onFinishSearch}>
            <Row gutter={[8, 8]} align="middle">
              <Col
                xs={{ span: roleLevel === 'SAD' ? 24 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 4 : 6 }}
              >
                {roleLevel === 'SAD' ? (
                  <Form.Item label={t('company')} name="companyId">
                    <Select
                      defaultValue={t('select-company')}
                      onChange={handleFilterChange}
                    >
                      <Option value="">{t('select-company')}</Option>
                      {companyData
                        && companyData.map((item) => (
                          <Option key={item.companyId}>
                            {item.companyName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                ) : (
                  ''
                )}
              </Col>
              {/* <Col xs={24} lg={{ span: roleLevel === 'SAD' ? 4 : 6 }}>
                {roleLevel === 'SAD' ? (
                  <Form.Item label={t('effective_date')} name="effectiveDate">
                    <DatePicker onChange={onEffectiveDateChange} />
                  </Form.Item>
                ) : (
                  ''
                )}
              </Col> */}
              {/* <Col
                xs={{ span: roleLevel === 'SAD' ? 12 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 6 : 2 }}
              >
                {roleLevel === 'SAD' ? (
                  <Form.Item name="search" label="&nbsp;">
                    <Input placeholder={t('search')} allowClear />
                  </Form.Item>
                ) : (
                  <Form.Item label="&nbsp;">
                    <Button
                      type="default"
                      icon={<SearchOutlined />}
                      htmlType="submit"
                      style={{ width: isMobile ? '100%' : '100px' }}
                    >
                      {t('search')}
                    </Button>
                  </Form.Item>
                )}
              </Col>
              <Col
                xs={{ span: roleLevel === 'SAD' ? 12 : 0 }}
                lg={{ span: roleLevel === 'SAD' ? 2 : 4 }}
              >
                <Form.Item label="&nbsp;">
                  {roleLevel === 'SAD' ? (
                    <Button
                      type="default"
                      icon={<SearchOutlined />}
                      htmlType="submit"
                      style={{ width: isMobile ? '100%' : '100px' }}
                    >
                      {t('search')}
                    </Button>
                  ) : (
                    <></>
                  )}
                </Form.Item>
              </Col> */}
            </Row>
          </Form>

          <Form layout="vertical" form={formCal} onFinish={onFinishCalculator}>
            <Row gutter={[8, 8]} align="middle">
              <Col
                xs={{ span: roleLevel === 'SAD' ? 24 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 4 : 6 }}
              >
                <Form.Item label={t('weight')} name="weight">
                  <Input
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    placeholder={t('weight')}
                    allowClear
                    required
                  />
                </Form.Item>
              </Col>
              <Col
                xs={{ span: roleLevel === 'SAD' ? 24 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 4 : 6 }}
              >
                <Form.Item label={t('size')} name="size">
                  <Input
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    placeholder={t('size')}
                    allowClear
                    required
                  />
                </Form.Item>
              </Col>
              <Col
                xs={{ span: roleLevel === 'SAD' ? 24 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 4 : 2 }}
              >
                <Form.Item label={t('price')} name="price">
                  <span>{calculatePrice}</span>
                </Form.Item>
              </Col>
              <Col
                xs={{ span: roleLevel === 'SAD' ? 12 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 6 : 4 }}
              >
                <Form.Item label="&nbsp;">
                  <Button
                    type="default"
                    htmlType="submit"
                    style={{ width: isMobile ? '100%' : '125px' }}
                  >
                    {t('calculate-price')}
                  </Button>
                </Form.Item>
              </Col>
              <Col
                xs={{ span: roleLevel === 'SAD' ? 12 : 12 }}
                lg={{ span: roleLevel === 'SAD' ? 6 : 6 }}
              >
                <Form.Item label="&nbsp;" style={{ float: 'right' }}>
                  <span>{effectiveAtDisplay && `Effective : ${moment(effectiveAtDisplay).format('DD-MM-YYYY')}`}</span>
                </Form.Item>
              </Col>

            </Row>
          </Form>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }}>
              <Table
                scroll={{ x: 500 }}
                style={{ cursor: 'pointer' }}
                dataSource={settingTransportData}
                columns={columns}
                pagination={{
                  total: settingTransportData?.length || 0,
                  showTotal: (total, range) => `${t('show')}
                  ${range[0]}  ${t('to')} ${range[1]} ${t('from')} ${total} ${t(
                    'record',
                  )}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              />
            </Col>
          </Row>
        </Layout>
      </Spin>

      <Modal
        title={t('title-modal-setting-area')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            {t('ok-modal')}
          </Button>,
          <Button key="back" onClick={handleCancel}>
            {t('cancel-modal')}
          </Button>,
        ]}
        width={400}
        destroyOnClose
      >
        <Form form={formModal}>
          <Row>
            <Col span={4} />
            <Col span={16}>
              <Form.Item label={t('effective_date')} name="effectiveDate" required>
                <DatePicker
                  onChange={onEffectiveDateChange}
                  disabledDate={(current) =>
                    // console.log(momenttz().tz('Asia/Bangkok'));
                    // console.log('current', current);
                    current && current < moment(momenttz().tz('Asia/Bangkok').format('YYYY-MM-DD'))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={4} />
            <Col span={16}>
              <Form.Item required>
                <Upload
                  required
                  {...uploadProps}
                  customRequest={dummyRequest}
                  maxCount={1}
                  allowClear
                >
                  <Row>
                    <Col span={15}>
                      <Input width={100} placeholder={fileName} disabled />
                    </Col>
                    <Col span={6} offset={1}>
                      <Button>Browse</Button>
                    </Col>
                  </Row>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={4} />
          </Row>

        </Form>
      </Modal>
    </>
  );
};

export default SettingTransport;
