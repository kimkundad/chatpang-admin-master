import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  message,
  Form,
  Button,
  Input,
  Card,
  Space,
  Modal,
  Tag,
} from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';

const { Column } = Table;
const { TextArea } = Input;

const { confirm } = Modal;

const StoreSetting = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [agencyIdSelect, setAgencyIdSelect] = useState(null);
  const [statusSelect, setStatusSelect] = useState(null);
  const [createSelect, setCreateSelect] = useState(null);

  const { transportationOrderData, sumOrderItem, transportationOrderDetail } = useSelector((state) => state.storeSettingReducer);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [transportationOrderForCancel, setTransportationOrderForCancel] = useState(null);
  const [orderItemIdForBypass, setOrderItemIdForBypass] = useState(null);
  const [remark, setRemark] = useState(null);
  const [modalSelector, setModalSelector] = useState('Cancel');

  const { agencyId, permission } = useSelector((state) => state.authenReducer);

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);

  const { socket } = useSelector((state) => state.mainReducer);

  const [form] = Form.useForm();
  
  useEffect(() => {
    const reload_to = (msg) => {
      console.log("socket-msg",msg)
      if (form) form.submit();
    };
    if (agencyId) {
      const channel = `update_trans_to_agency_${agencyId}`;
      socket?.on(channel, reload_to);
      return () => {
        const channel2 = `update_trans_to_agency_${agencyId}`;
        socket?.off(channel2, reload_to);
      };
    }
  }, [socket, agencyId]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    const end = moment(new Date(), 'YYYY-MM-DD');
    if (agencyId) {
      dispatch(
        allAction.storeSettingAction.getTransportationOrderByAgency({
          startDate: moment(std).format('YYYY-MM-DD'),
          endDate: moment(end).format('YYYY-MM-DD'),
          status: 'NOT_COMPLETE',
          agencyId,
        }),
      ).then(() => {
          setCreateSelect([std, end]);
          setStatusSelect('NOT_COMPLETE');
        })
        .catch((e) => message.error(e.message));
      dispatch(
        allAction.storeSettingAction.getSumOrderItemByAgencyId({ agencyId }),
      )
        .then()
        .catch((e) => message.error(e.message));
    }
    return () => {
      dispatch(allAction.storeSettingAction.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const onSearch = (value) => {
    form.setFieldsValue({
      search: '',
    });
    console.log('vvv', value);
    if (value?.status) {
      setStatusSelect(value?.status);
    }
    setCreateSelect([value.startDate, value.endDate]);
    if (value?.agencyId) {
      setAgencyIdSelect(value?.agencyId);
      dispatch(
        allAction.storeSettingAction.getTransportationOrderByAgency(value),
      )
        .then()
        .catch((e) => message.error(e.message));
      dispatch(allAction.storeSettingAction.getSumOrderItemByAgencyId(value))
        .then()
        .catch((e) => message.error(e.message));
    } else {
      setStatusSelect();
      dispatch(allAction.storeSettingAction.clearData())
        .then()
        .catch((e) => message.error(e.message));
    }
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    dispatch(
      allAction.storeSettingAction.getTransportationOrderByAgency({
        agencyId: agencyIdSelect || agencyId,
        search: values.search,
        status: statusSelect,
        startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
        endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
      }),
    )
      .then()
      .catch((e) => message.error(e.message));
      
    dispatch(
      allAction.storeSettingAction.getSumOrderItemByAgencyId({ agencyId }),
    )
    // dispatch(login(values.username))
    // dispatch(allAction.customerAction.getCustomerData(values));
  };

  const getDoList = (transportationOrderId) => {
    // console.log(transportationOrderId);
    dispatch(
      allAction.storeSettingAction.getTransportationOrderDetail(
        transportationOrderId,
      ),
    )
      .then(showModal())
      .catch((e) => message.error(e.message));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    dispatch(allAction.hubProductAction.clearTransportationOrderDetail())
      .then()
      .catch((e) => message.error(e.message));
  };

  const showConfirm = (agency) => {
    confirm({
      title: 'Do you want to create transportation order?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        createTransportationOrder(agency);
      },
      onCancel() { },
    });
  };

  const showConfirmVerified = (transportationOrderId) => {
    confirm({
      title: 'Do you want to confirm verify this transportation order?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        verifyTransportationOrder(transportationOrderId);
      },
      onCancel() { },
    });
  };

  const createTransportationOrder = (agency) => {
    dispatch(allAction.storeSettingAction.createTransportationOrder(agency))
      .then(() => {
        message.success('Create Success!');
        dispatch(
          allAction.storeSettingAction.getTransportationOrderByAgency(
            agencyIdSelect ? {
              agencyId: agencyIdSelect,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              } : {
              agencyId,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              },

          ),
        )
          .then()
          .catch((e) => message.error(e.message));
        dispatch(
          allAction.storeSettingAction.getSumOrderItemByAgencyId(
            agencyIdSelect ? { agencyId: agencyIdSelect } : { agencyId },
          ),
        )
          .then()
          .catch((e) => message.error(e.message));
      })
      .catch((e) => message.error(e.message));
  };

  const showDeleteConfirm = (transportationOrderId) => {
    confirm({
      title: 'Are you sure delete transportation order?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteTransportationOrder(transportationOrderId);
      },
      onCancel() { },
    });
  };

  const deleteTransportationOrder = (transportationOrderId) => {
    dispatch(
      allAction.storeSettingAction.deleteTransportationOrder(
        transportationOrderId,
      ),
    )
      .then(() => {
        message.success('Delete Success!');
        dispatch(
          allAction.storeSettingAction.getTransportationOrderByAgency(
            agencyIdSelect ? {
              agencyId: agencyIdSelect,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              } : {
              agencyId,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              },
          ),
        )
          .then()
          .catch((e) => message.error(e.message));
        dispatch(
          allAction.storeSettingAction.getSumOrderItemByAgencyId(
            agencyIdSelect ? { agencyId: agencyIdSelect } : { agencyId },
          ),
        )
          .then()
          .catch((e) => message.error(e.message));
      })
      .catch((e) => message.error(e.message));
  };

  const verifyTransportationOrder = (transportationOrderId) => {
    dispatch(
      allAction.storeSettingAction.verifyTransportationOrder(
        transportationOrderId,
        { remark },
      ),
    )
      .then(() => {
        message.success('Verify Success!');
        clearModalCancelValue();
        setIsModalVisible(false)
        dispatch(
          allAction.storeSettingAction.getTransportationOrderByAgency(
            agencyIdSelect ? {
              agencyId: agencyIdSelect,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              } : {
              agencyId,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              },
          ),
        )
          .then()
          .catch((e) => message.error(e.message));
        dispatch(
          allAction.storeSettingAction.getSumOrderItemByAgencyId(
            agencyIdSelect ? { agencyId: agencyIdSelect } : { agencyId },
          ),
        )
          .then()
          .catch((e) => message.error(e.message));
      })
      .catch((e) => message.error(e.message));
  };

  const reScanTransportationOrder = (transportationOrderId) => {
    dispatch(
      allAction.storeSettingAction.reScanTransportationOrder(
        transportationOrderId,
        { remark },
      ),
    )
      .then(() => {
        message.success('ReScan Success!');
        clearModalCancelValue();
        setIsModalVisible(false)
        dispatch(
          allAction.storeSettingAction.getTransportationOrderByAgency(
            agencyIdSelect ? {
              agencyId: agencyIdSelect,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              } : {
              agencyId,
              status: statusSelect,
              startDate: createSelect?.[0] ? moment(createSelect?.[0]).format('YYYY-MM-DD') : null,
              endDate: createSelect?.[1] ? moment(createSelect?.[1]).format('YYYY-MM-DD') : null,
              },
          ),
        )
          .then()
          .catch((e) => message.error(e.message));
        dispatch(
          allAction.storeSettingAction.getSumOrderItemByAgencyId(
            agencyIdSelect ? { agencyId: agencyIdSelect } : { agencyId },
          ),
        )
          .then()
          .catch((e) => message.error(e.message));
      })
      .catch((e) => message.error(e.message));
  };

  const exportDOFile = () => {
    dispatch(
      allAction.storeSettingAction.exportDOFile(
        transportationOrderDetail?.transportationOrderId,
        transportationOrderDetail?.transportationOrderNo,
      ),
    );
  };

  const showConfirmVerify = (transportationOrderId) => {
    setModalSelector('Verify');
    setOrderItemIdForBypass(transportationOrderId);
    setModalCancelVisible(true);
  };
  const showConfirmRescan = (transportationOrderId) => {
    setModalSelector('ReScan');
    setOrderItemIdForBypass(transportationOrderId);
    setModalCancelVisible(true);
  };

  const renderTitleModal = () => {
    if (modalSelector === 'Verify') {
      return t('verified');
    } if (modalSelector === 'ReScan') {
      return t('re-scan');
    }
  };

  const renderButtonModal = () => {
    if (modalSelector === 'Verify') {
      return (
        <Button
          key="submit"
          type="primary"
          // disabled={!remark}
          onClick={() => verifyTransportationOrder(orderItemIdForBypass)}
        >
          {t('verified')}
        </Button>
      );
    } if (modalSelector === 'ReScan') {
      return (
        <Button
          key="submit"
          type="primary"
          // disabled={!remark}
          onClick={() => reScanTransportationOrder(orderItemIdForBypass)}
        >
          {t('re-scan')}
        </Button>
      );
    }
  };

  const clearModalCancelValue = () => {
    setRemark(null);
    setModalCancelVisible(false);
    setTransportationOrderForCancel(null);
    setOrderItemIdForBypass(null);
    setModalSelector('Verify');
  };
  const modalCancelCancel = () => {
    clearModalCancelValue();
  };
  const renderModalCancel = () => cancelContent();

  const cancelContent = () => (
    <>
      <Row>
        {`${t('remark')}`}
        <TextArea
          rows={4}
          onChange={(e) => {
            setRemark(e.target.value);
          }}
          value={remark}
        />
      </Row>
      <Row style={{ marginTop: 24 }} gutter={24}>
        <Col span={24}>
          <Space style={{ float: 'right' }}>
            {renderButtonModal()}
            <Button
              key="submit"
              // type="primary"
              // disabled={!remark}
              onClick={() => {
                clearModalCancelValue();
              }}
            >
              {t('cancel')}
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={8}>
            <Col xs={24}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('SST')}</span>
              </Typography.Title>
            </Col>
            <Col sm={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
          </Row>
          {sumOrderItem?.agencyCode && (
            <Card>
              <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={12} align="middle">
                  <Col xs={24} sm={8}>
                    <Form.Item label={t('agency-code')}>
                      <Input value={sumOrderItem?.agencyCode} disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Item label="&nbsp;" name="search">
                      <Input placeholder={t('search')} allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Item label="&nbsp;">
                      <Button
                        htmlType="submit"
                        style={{ width: isMobile ? '100%' : '100px' }}
                      >
                        {t('search')}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12} align="middle">
                  <Col xs={8} sm={4}>
                    <Form.Item label={t('sum-weight')}>
                      <Input value={sumOrderItem?.sumWeight} disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={8} sm={4}>
                    <Form.Item label={t('sum-volume')}>
                      <Input value={sumOrderItem?.sumVolume} disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={8} sm={4}>
                    <Form.Item label={t('count-item')}>
                      <Input value={sumOrderItem?.countItem} disabled />
                    </Form.Item>
                  </Col>
                  {FilterPermission('isCreate') && (
                    <Col xs={24} sm={12}>
                      <Form.Item label="&nbsp;">
                        <Button
                          disabled={
                            !(
                              sumOrderItem?.countItem
                              && sumOrderItem?.countItem > 0
                            )
                          }
                          type="primary"
                          style={{
                            width: isMobile ? '100%' : '100px',
                            float: 'right',
                          }}
                          onClick={() => {
                            showConfirm(agencyIdSelect || agencyId);
                          }}
                        >
                          {t('call-car')}
                        </Button>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Form>
              <Col sm={24}>
                <Table
                  // onChange={handleChange}
                  dataSource={transportationOrderData}
                  scroll={{ x: 1000 }}
                  pagination={{
                    total: transportationOrderData?.length || 0,
                    showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from',
                    )} ${total} ${t('record')}`,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                  }}
                >
                  <Column
                    width={160}
                    fixed="left"
                    ellipsis
                    dataIndex="transportationOrderId"
                    key="transportationOrderId"
                    render={(text, obj) => (
                      <Space>
                        <Button
                          size="small"
                          type="primary"
                          style={{ width: '60px' }}
                          onClick={() => {
                            console.log('getDoList(text)', text);
                            getDoList(text);
                          }}
                        >
                          {t('do-no')}
                        </Button>
                        {FilterPermission('isUpdate') && (
                          <Button
                            size="small"
                            type="danger"
                            style={{ width: '60px' }}
                            disabled={
                              obj?.transportationOrderStatusCode !== 'TOC'
                            }
                            onClick={() => {
                              showDeleteConfirm(text);
                            }}
                          >
                            {t('cancel-modal')}
                          </Button>
                        )}
                      </Space>
                    )}
                  />
                  <Column
                    width={200}
                    title={t('transportation-order-no')}
                    ellipsis
                    dataIndex="transportationOrderNo"
                    key="transportationOrderNo"
                  />
                  <Column
                    width={150}
                    title={t('date-time')}
                    ellipsis
                    dataIndex="logTransactionOrderStatusData"
                    key="logTransactionOrderStatusData"
                    render={(text) => (text.length > 0 ? moment(text[0].createdAt).format('YYYY-MM-DD HH:mm') : '')}
                  />
                  <Column
                    width={180}
                    title={t('status')}
                    // ellipsis
                    dataIndex="transportationOrderStatusData"
                    key="transportationOrderStatusData"
                    render={(text, row) => {
                      const priority = row?.transportationOrderStatusData?.priority;
                      const txt = text.transportationOrderStatusAgency;
                      let color = '';

                      if (priority === 5) {
                        color = 'purple';
                        // txt = "อยู่ที่เอเจนซี่"
                      }
                      if (priority === 6) {
                        color = 'volcano';
                        // txt = "รอตรวจสอบ"
                      }
                      if ([7, 8, 9, 10].indexOf(priority) > -1) color = 'green';
                      if (priority > 10) color = 'blue';
                      return <Tag color={color}>{txt}</Tag>;
                    }}
                  />

                  <Column
                    width={140}
                    title={t('driver')}
                    ellipsis
                    dataIndex="driverData"
                    key="driverData"
                    render={(text) => text?.userData?.name}
                  />

                  <Column
                    width={100}
                    title={t('weight')}
                    ellipsis
                    dataIndex="sumWeight"
                    key="sumWeight"
                  />

                  <Column
                    width={100}
                    title={t('volume')}
                    ellipsis
                    dataIndex="sumVolume"
                    key="sumVolume"
                  />
                  <Column
                    width={100}
                    title={t('quantity')}
                    ellipsis
                    dataIndex="countItem"
                    key="countItem"
                    render={(text, row) => (`${text || 0} (${row?.snapCountItem || 0})`)}
                  />
                  <Column
                    width={150}
                    title={t('do-scan')}
                    ellipsis
                    dataIndex="scanUp"
                    key="scanUp"
                    render={(text, row) => (`${row?.scanUp || 0}/${row?.scanDown || 0}`)}
                  />
                </Table>
              </Col>
            </Card>
          )}
          {/*  Modal DO */}
          <Modal
            style={{}}
            title={`${t('transportation-order-no')}: ${transportationOrderDetail?.transportationOrderNo
              }`}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            // maskClosable={false}
            width="100%"
            centered
            footer={null}
          >
            <Form form={form}>
              <Row gutter={12} align="middle">
                <Col xs={24} sm={6}>
                  <Form.Item label={t('status')}>
                    <Input
                      value={
                        transportationOrderDetail?.transportationOrderStatusData
                          ?.transportationOrderStatusAgency
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label={t('date-time')}>
                    <Input
                      value={moment(
                        transportationOrderDetail?.updatedAt,
                      ).format('DD-MM-YYYY HH:mm')}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label={t('do-scan')}>
                    <Input
                      value={`${transportationOrderDetail?.scanUp || 0}/${transportationOrderDetail?.scanDown || 0}`}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={8}
                  sm={6}
                  style={{
                    display: 'flex',
                    textAlign: 'right',
                    verticalAlign: 'top',
                    marginBottom: 25,
                  }}
                >
                  <Button
                    // size="small"
                    // type="primary"
                    disabled={
                      transportationOrderDetail?.orderItemData?.length < 1
                    }
                    style={{ width: 120 }}
                    icon={<DownloadOutlined />}
                    onClick={exportDOFile}
                  >
                    {t('export-file')}
                  </Button>
                </Col>

              </Row>

              <Row gutter={12} align="middle">
                <Col xs={8} sm={6}>
                  <Form.Item label={t('sum-weight')}>
                    <Input
                      value={transportationOrderDetail?.sumWeight}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={8} sm={6}>
                  <Form.Item label={t('sum-volume')}>
                    <Input
                      value={transportationOrderDetail?.sumVolume}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={8} sm={6}>
                  <Form.Item label={t('count-item')}>
                    <Input
                      value={transportationOrderDetail?.countItem}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={8}
                  sm={6}
                  style={{
                    display: 'flex',
                    textAlign: 'right',
                    verticalAlign: 'top',
                    marginBottom: 25,
                  }}
                >
                  {FilterPermission('isUpdate') && (
                    <Button
                      // size="small"
                      type="primary"
                      style={{ marginRight: 15 }}
                      disabled={
                        transportationOrderDetail?.transportationOrderStatusCode !== 'PRC'
                      }
                      onClick={() => {
                        showConfirmVerify(transportationOrderDetail?.transportationOrderId);
                      }}
                    >
                      {t('verified')}
                    </Button>
                  )}
                  {FilterPermission('isUpdate') && (
                    <Button
                      // size="small"
                      type="primary"
                      // style={{ width: '70px', fontSize: 'x-small' }}
                      disabled={!['PRC', 'ACH'].includes(transportationOrderDetail?.transportationOrderStatusCode)}
                      onClick={() => {
                        showConfirmRescan(transportationOrderDetail?.transportationOrderId);
                      }}
                    >
                      {t('re-scan')}
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
            <Table
              size="small"
              // onChange={handleChange}
              dataSource={transportationOrderDetail?.orderItemData}
              scroll={{ x: 1000, y: 1000 }}
              pagination={{
                total: transportationOrderDetail?.orderItemData?.length || 0,
                showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                  'from',
                )} ${total} ${t('record')}`,
                defaultPageSize: 10,
                defaultCurrent: 1,
              }}
            // onRow={(record, index) => ({ style: { background: record?.orderItemStatusCode === 'ITM' ? '#ff584d' : '#ffffff' } })}

            // style={{ height: 1000 }}
            >
              <Column
                width={150}
                title={t('do-no')}
                ellipsis
                dataIndex="doNo"
                key="doNo"
              />
              <Column
                width={150}
                title={t('agency-code')}
                ellipsis
                dataIndex="orderData"
                key="orderData"
                filters={[
                  { text: t('agency-tabs'), value: false },
                  { text: t('big-sender'), value: true },
                ]}
                // filteredValue={filteredInfo?.orderData || null}
                onFilter={(value, record) => {
                  console.log('sss', value, record);
                  if (value) { return record?.orderData?.agencyData?.isCustomer === true; }
                  return record?.orderData?.agencyData?.isCustomer !== true;
                  // record.customerCategoryData.customerCategoryId === value
                }}
                render={(text) => {
                  if (text?.agencyData?.isCustomer) return '-';
                  return text?.agencyData?.agencyCode;
                }}
              />
              {/* สถานะ */}
              <Column
                width={150}
                title={t('status')}
                ellipsis
                dataIndex="orderItemStatus"
                key="orderItemStatus"
                // render={(text, row) => {
                //   const priority = row?.transportationOrderStatusData?.priority
                //   let txt = text.transportationOrderStatusAgency
                //   let color = ""

                //   if (priority === 5) {
                //     color = "purple"
                //     // txt = "อยู่ที่เอเจนซี่"
                //   }
                //   if (priority === 6) {
                //     color = "volcano"
                //     // txt = "รอตรวจสอบ"
                //   }
                //   if ([7, 8, 9, 10].indexOf(priority) > -1) color = "green"
                //   if (priority > 10) color = "blue"
                //   return <Tag color={color}>{txt}</Tag>
                // }}
                render={(text, row) => {
                  console.log('row', row);
                  const code = row?.orderItemStatus?.orderItemStatusCode;
                  const priority = row?.orderItemStatus?.priority;
                  let txt = text?.orderItemStatusDesc ? text?.orderItemStatusDesc : '-';
                  let color = '';

                  if (priority >= 4) color = 'green';
                  if (priority == 5) txt = 'ตรวจสอบแล้ว';

                  if (priority >= 6) {
                    txt = 'พัสดุถึงฮับ';
                    color = 'blue';
                  }
                  if (priority == 7) color = 'blue';
                  if (code === 'ITM') {
                    color = 'red';
                    txt = 'ของหาย';
                  }

                  return <Tag color={color}>{txt}</Tag>;
                }}
              />
              <Column
                width={100}
                title={t('transportation-net-price')}
                ellipsis
                dataIndex="transportationNetPrice"
                key="transportationNetPrice"
              />

              <Column
                width={100}
                title={t('cod')}
                ellipsis
                dataIndex="cod"
                key="cod"
              />

              <Column
                width={100}
                title={t('weight')}
                ellipsis
                dataIndex="weight"
                key="weight"
              />

              <Column
                width={100}
                title={t('volume')}
                ellipsis
                dataIndex="volume"
                key="volume"
              />
              <Column
                width={150}
                title={t('recipient')}
                ellipsis
                dataIndex="recipientName"
                key="recipientName"
                render={(text, obj) => {
                  if (obj?.recipientLastName) {
                    return `${text} ${obj?.recipientLastName}`;
                  }
                  return text;
                }}
              />
              <Column
                width={150}
                title={t('subdistrict')}
                ellipsis
                dataIndex="recipientSubdistrictData"
                key="recipientSubdistrictData"
                render={(text) => text?.subdistrictName || ''}
              />

              <Column
                width={150}
                title={t('district')}
                ellipsis
                dataIndex="recipientDistrictData"
                key="recipientDistrictData"
                render={(text) => text?.districtName || ''}
              />

              <Column
                width={200}
                title={t('province')}
                ellipsis
                dataIndex="recipientProvinceData"
                key="recipientProvinceData"
                render={(text) => text?.provinceName || ''}
              />
            </Table>
          </Modal>
          <Modal
            style={{}}
            zIndex={1001}
            width="65%"
            centered
            visible={modalCancelVisible}
            title={renderTitleModal()}
            // onOk={modalCancelOK}
            onCancel={modalCancelCancel}
            footer={null}
          >
            {renderModalCancel()}
          </Modal>
        </Layout>
      </Spin>
    </>
  );
};
export default StoreSetting;
