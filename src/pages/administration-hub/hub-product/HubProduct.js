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
import ModelDriver from './ModelDriver'

const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;

const HubProduct = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);

  const [hubIdSelect, setHubIdSelect] = useState(null);
  const [statusSelect, setStatusSelect] = useState(null);
  const [createSelect, setCreateSelect] = useState(null);

  const [transportationOrderForCancel, setTransportationOrderForCancel] =
    useState(null);
  const [transportationCode, setTransportationCode] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [remark, setRemark] = useState(null);
  const [modalSelector, setModalSelector] = useState('Cancel');
  const [searchDriver, setSearchDriver] = useState('');
  const [toChangeDriver, setToChangeDriver] = useState(false);
  const [selectedTO, setSelectedTO] = useState(null)

  const {
    transportationOrderData,
    sumOrderItem,
    transportationOrderDetail,
    activeDriverList,
  } = useSelector((state) => state.hubProductReducer);

  const { hubId, permission, userLevel } = useSelector(
    (state) => state.authenReducer
  );

  const { socket } = useSelector((state) => state.mainReducer);

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);

  const [form] = Form.useForm();

  useEffect(() => {
    const reload_to = (msg) => {
      if (form) form.submit();
    };
    if (hubId) {
      const channel = `update_trans_noti_${hubId}`;
      socket?.on(channel, reload_to);
      return () => {
        const channel2 = `update_trans_noti_${hubId}`;
        socket?.off(channel2, reload_to);
      };
    }
  }, [socket, hubId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    const end = moment(new Date(), 'YYYY-MM-DD');

    dispatch(
      allAction.hubProductAction.getTransportationOrderByHub({
        startDate: moment(std).format('YYYY-MM-DD'),
        endDate: moment(end).format('YYYY-MM-DD'),
        status: 'NOT_COMPLETE',
      })
    )
      .then(() => {
        setCreateSelect([std, end]);
        setStatusSelect('NOT_COMPLETE');
      })
      .catch((e) => message.error(e.message));
    return () => {
      dispatch(allAction.hubProductAction.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);

  const onSearch = (value) => {
    // console.log('vv', value);
    form.setFieldsValue({
      search: '',
    });
    setCreateSelect([value.startDate, value.endDate]);
    setStatusSelect(value?.status || 'NOT_COMPLETE');
    setHubIdSelect(value?.hubId);
    dispatch(allAction.hubProductAction.getTransportationOrderByHub(value))
      .then()
      .catch((e) => message.error(e.message));
    // if (value?.hubId) {
    //   setHubIdSelect(value?.hubId);
    //   dispatch(allAction.hubProductAction.getTransportationOrderByHub(value))
    //     .then()
    //     .catch((e) => message.error(e.message));
    //   // dispatch(allAction.storeSettingAction.getSumOrderItemByAgencyId(value))
    //   //   .then()
    //   //   .catch((e) => message.error(e.message));
    // } else {
    //   dispatch(allAction.hubProductAction.clearData())
    //     .then()
    //     .catch((e) => message.error(e.message));
    // }
  };

  const onFinish = (values) => {
    // console.log('Success:', values);
    dispatch(
      allAction.hubProductAction.getTransportationOrderByHub({
        hubId: hubIdSelect || hubId,
        search: values.search,
        status: statusSelect,
        startDate: createSelect?.[0]
          ? moment(createSelect?.[0]).format('YYYY-MM-DD')
          : null,
        endDate: createSelect?.[1]
          ? moment(createSelect?.[1]).format('YYYY-MM-DD')
          : null,
      })
    )
      .then()
      .catch((e) => message.error(e.message));
  };

  const getDoList = (transportationOrderId) => {
    // console.log(transportationOrderId);
    dispatch(
      allAction.hubProductAction.getTransportationOrderDetail(
        transportationOrderId
      )
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

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  const showModalCancel = (transportationOrderId) => {
    setTransportationOrderForCancel(transportationOrderId);
    setModalCancelVisible(true);
  };

  const showConfirmVerify = (transportationOrderId) => {
    setModalSelector('Verify');
    setTransportationOrderForCancel(transportationOrderId);
    setModalCancelVisible(true);
  };
  const showConfirmRescan = (transportationOrderId) => {
    setModalSelector('ReScan');
    setTransportationOrderForCancel(transportationOrderId);
    setModalCancelVisible(true);
  };
  const renderTitleModal = () => {
    if (modalSelector === 'Verify') {
      return t('verified');
    }
    if (modalSelector === 'ReScan') {
      return t('re-scan');
    }
  };

  const renderButtonModal = () => {
    if (modalSelector === 'Cancel') {
      return (
        <>
          <Button
            key="submit"
            type="danger"
            disabled={
              !remark ||
              ['ACH', 'COA', 'CIH', 'DPH', 'HCH', 'COH'].includes(
                transportationCode
              )
            }
            onClick={() => {
              updateTransportationOrderToTOC(transportationOrderForCancel);
            }}
          >
            {t('go-back-to-TOC')}
          </Button>
          {/* ปุ่มเปลี่ยนคนขับ ใต้หมายเหตุ */}
          <Button
            key="submit"
            type="primary"
            disabled={!remark}
            onClick={() => {
              setToChangeDriver(true);
              dispatch(
                allAction.hubProductAction.getActiveDriver({
                  hubId: hubIdSelect || hubId,
                  search: searchDriver,
                })
              )
                .then()
                .catch((e) => message.error(e.message));
              setModalSelector('Driver');
              setTransportationCode(null);
            }}
          >
            {t('change-driver')}
          </Button>
        </>
      );
    }
    if (modalSelector === 'Verify') {
      return (
        <>
          <Button
            key="submit"
            type="primary"
            // disabled={!remark}
            onClick={() =>
              verifyTransportationOrder(transportationOrderForCancel)
            }
          >
            {t('verified')}
          </Button>
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
        </>
      );
    }
    if (modalSelector === 'ReScan') {
      return (
        <>
          <Button
            key="submit"
            type="primary"
            // disabled={!remark}
            onClick={() =>
              reScanTransportationOrder(transportationOrderForCancel)
            }
          >
            {t('re-scan')}
          </Button>
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
        </>
      );
    }
  };
  const modalCancelCancel = () => {
    clearModalCancelValue();
    setSelectedRow([]);
    setSelectedRowKey([]);
  };

  const clearModalCancelValue = () => {
    setSearchDriver('');
    setRemark(null);
    setModalCancelVisible(false);
    setTransportationOrderForCancel(null);
    setModalSelector('Cancel');
    setSelectedRow([]);
    setSelectedRowKey([]);
    setTransportationCode(null);
    dispatch(allAction.hubProductAction.clearActiveDriver({}))
      .then()
      .catch((e) => message.error(e.message));
  };

  const updateTransportationOrderToTOC = (transportationOrderId) => {
    dispatch(
      allAction.hubProductAction.updateTransportationOrderToTOC(
        transportationOrderId,
        remark
      )
    )
      .then(() => {
        message.success('State Change Success!');
        clearModalCancelValue();
        dispatch(allAction.authenAction.getNotification());
        dispatch(
          allAction.hubProductAction.getTransportationOrderByHub({
            hubId: hubIdSelect || hubId,
            status: statusSelect,
            startDate: createSelect?.[0]
              ? moment(createSelect?.[0]).format('YYYY-MM-DD')
              : null,
            endDate: createSelect?.[1]
              ? moment(createSelect?.[1]).format('YYYY-MM-DD')
              : null,
          })
        )
          .then(() => setTransportationCode(null))
          .catch((e) => message.error(e.message));
        form.setFieldsValue({
          search: '',
        });
      })
      .catch((e) => message.error(e.message));
  };

  const showConfirmVerified = (transportationOrderId) => {
    confirm({
      title: 'Do you want to confirm verify this transportation order?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          allAction.hubProductAction.verifyTransportationOrder(
            transportationOrderId
          )
        )
          .then(() => {
            message.success('Verify Success!');
            dispatch(allAction.authenAction.getNotification());
            dispatch(
              allAction.hubProductAction.getTransportationOrderByHub({
                hubId: hubIdSelect || hubId,
                status: statusSelect,
                startDate: createSelect?.[0]
                  ? moment(createSelect?.[0]).format('YYYY-MM-DD')
                  : null,
                endDate: createSelect?.[1]
                  ? moment(createSelect?.[1]).format('YYYY-MM-DD')
                  : null,
              })
            )
              .then()
              .catch((e) => message.error(e.message));
            modalCancelCancel();
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() { },
    });
  };
  const verifyTransportationOrder = (transportationOrderId) => {
    dispatch(
      allAction.hubProductAction.verifyTransportationOrder(
        transportationOrderId,
        { remark }
      )
    )
      .then(() => {
        message.success('Verify Success!');
        clearModalCancelValue();
        setIsModalVisible(false);
        dispatch(allAction.authenAction.getNotification());
        dispatch(
          allAction.hubProductAction.getTransportationOrderByHub({
            hubId: hubIdSelect || hubId,
            status: statusSelect,
            startDate: createSelect?.[0]
              ? moment(createSelect?.[0]).format('YYYY-MM-DD')
              : null,
            endDate: createSelect?.[1]
              ? moment(createSelect?.[1]).format('YYYY-MM-DD')
              : null,
          })
        )
          .then()
          .catch((e) => message.error(e.message));
        modalCancelCancel();
      })
      .catch((e) => message.error(e.message));
  };

  const reScanTransportationOrder = (transportationOrderId) => {
    dispatch(
      allAction.hubProductAction.reScanTransportationOrder(
        transportationOrderId,
        { remark }
      )
    )
      .then(() => {
        message.success('Verify Success!');
        clearModalCancelValue();
        setIsModalVisible(false);
        dispatch(allAction.authenAction.getNotification());
        dispatch(
          allAction.hubProductAction.getTransportationOrderByHub({
            hubId: hubIdSelect || hubId,
            status: statusSelect,
            startDate: createSelect?.[0]
              ? moment(createSelect?.[0]).format('YYYY-MM-DD')
              : null,
            endDate: createSelect?.[1]
              ? moment(createSelect?.[1]).format('YYYY-MM-DD')
              : null,
          })
        )
          .then()
          .catch((e) => message.error(e.message));
        modalCancelCancel();
      })
      .catch((e) => message.error(e.message));
  };

  const exportDOFile = () => {
    dispatch(
      allAction.hubProductAction.exportDOFile(
        transportationOrderDetail?.transportationOrderId,
        transportationOrderDetail?.transportationOrderNo
      )
    );
  };

  const renderModalDo = () => (
    <>
      <Form form={form}>
        <Row gutter={12} align="middle">
          <Col xs={8} sm={6}>
            <Form.Item label={t('status-active')}>
              <Input
                value={
                  transportationOrderDetail?.transportationOrderStatusData
                    ?.transportationOrderStatusHub
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={8} md={6}>
            <Form.Item label={t('date-time')}>
              <Input
                value={moment(transportationOrderDetail?.updatedAt).format(
                  'DD-MM-YYYY HH:mm'
                )}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={8} md={6}>
            <Form.Item label={t('do-scan')}>
              <Input
                value={`${transportationOrderDetail?.scanUp || 0}/${transportationOrderDetail?.scanDown || 0
                  }`}
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
              type="primary"
              disabled={transportationOrderDetail?.orderItemData?.length < 1}
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
              <Input value={transportationOrderDetail?.sumWeight} disabled />
            </Form.Item>
          </Col>
          <Col xs={8} sm={6}>
            <Form.Item label={t('sum-volume')}>
              <Input value={transportationOrderDetail?.sumVolume} disabled />
            </Form.Item>
          </Col>
          <Col xs={8} sm={6}>
            <Form.Item label={t('count-item')}>
              <Input value={transportationOrderDetail?.countItem} disabled />
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
            {/* ปุ่มตรวจสอบแล้ว */}
            {FilterPermission('isUpdate') && (
              <Button
                // size="small"
                type="primary"
                style={{ marginRight: 15 }}
                disabled={
                  transportationOrderDetail?.transportationOrderStatusCode !==
                  'DPH'
                }
                onClick={() => {
                  // showConfirmVerified(text);
                  showConfirmVerify(
                    transportationOrderDetail?.transportationOrderId
                  );
                }}
              >
                {t('verified')}
              </Button>
            )}
            {/* ปุ่มสแกนใหม่ */}
            {/* {FilterPermission('isUpdate') && (
              <Button
                // size="small"
                type="primary"
                // style={{ width: '70px', fontSize: 'x-small' }}
                disabled={
                  !['DPH'].includes(
                    transportationOrderDetail?.transportationOrderStatusCode
                  )
                }
                onClick={() => {
                  // showConfirmVerified(text);
                  showConfirmRescan(
                    transportationOrderDetail?.transportationOrderId
                  );
                }}
              >
                {t('re-scan')}
              </Button>
            )} */}
          </Col>
        </Row>
      </Form>
      <Table
        size="small"
        // onChange={handleChange}
        dataSource={transportationOrderDetail?.orderItemData}
        scroll={{ x: 1000 }}
        pagination={{
          total: transportationOrderDetail?.orderItemData?.length || 0,
          showTotal: (total, range) =>
            `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
              'from'
            )} ${total} ${t('record')}`,
          defaultPageSize: 10,
          defaultCurrent: 1,
        }}
        onRow={(record, index) => ({
          style: {
            background:
              record?.orderItemStatusCode === 'ITM' ? '#ff584d' : '#ffffff',
          },
        })}
      >
        <Column
          width={150}
          title={t('do-no')}
          ellipsis
          dataIndex="doNo"
          key="doNo"
        />
        <Column
          width={100}
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
            // console.log('sss', value, record);
            if (value) {
              return record?.orderData?.agencyData?.isCustomer === true;
            }
            return record?.orderData?.agencyData?.isCustomer !== true;
            // record.customerCategoryData.customerCategoryId === value
          }}
          render={(text) => {
            if (text?.agencyData?.isCustomer) return '-';
            return text?.agencyData?.agencyCode;
          }}
        />
        <Column
          width={150}
          title={t('status')}
          ellipsis
          dataIndex="orderItemStatus"
          key="orderItemStatus"
          render={(text, row) => {
            console.log('row', row);
            const code = row?.orderItemStatus?.orderItemStatusCode;
            const priority = row?.orderItemStatus?.priority;
            let txt = text?.orderItemStatusDesc
              ? text?.orderItemStatusDesc
              : '-';
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
    </>
  );

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
          <Space style={{ float: 'right' }}>{renderButtonModal()}</Space>
        </Col>
      </Row>
      {/* <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Button
            size="large"
            key="submit"
            type="primary"
            disabled={!remark}
            onClick={() => {
              dispatch(allAction.hubProductAction.getActiveDriver({
                hubId: hubIdSelect || hubId,
                search: searchDriver,
              }))
                .then()
                .catch((e) => message.error(e.message));
              setModalSelector('Driver');
            }}
            style={{ width: '100%' }}
          >
            {t('change-driver')}
          </Button>
        </Col>
      </Row> */}
    </>
  );
  // Modal เปลี่ยนคนขับ
  const changeDriverContent = () => (
    <ModelDriver
      toChangeDriver={toChangeDriver}
      selectedTO={selectedTO}
      hubIdSelect={hubIdSelect}
      statusSelect={statusSelect}
      createSelect={createSelect}
      selectedRowKey={selectedRowKey}
      modalCancelCancel={modalCancelCancel}
    />
  );

  const renderModalCancel = () => {
    if (['Cancel', 'Verify', 'ReScan'].includes(modalSelector)) {
      return cancelContent();
    }
    return changeDriverContent();
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
      setSelectedRowKey(selectedRowKeys);
      setSelectedRow(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.transportationOrderStatusCode !== 'TOC' ||
        !(hubIdSelect || hubId),
      // Column configuration not to be checked
    }),
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={8}>
            <Col xs={24}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('HPR')}</span>
              </Typography.Title>
            </Col>
            <Col sm={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
          </Row>

          <Card>
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Row gutter={12} align="middle">
                <Col xs={12} md={8}>
                  <Form.Item label="&nbsp;" name="search">
                    <Input placeholder={t('search')} allowClear />
                  </Form.Item>
                </Col>
                <Col xs={8} md={12} lg={8}>
                  <Row gutter={12}>
                    <Col xs={12}>
                      <Form.Item label="&nbsp;">
                        {/* ปุ่มค้นหา */}
                        <Button
                          htmlType="submit"
                          style={{ width: isMobile ? '100%' : '100px' }}
                        >
                          {t('search')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col xs={4} lg={8}>
                  <Form.Item label="&nbsp;">
                    {/* ปุ่มจ่ายงาน (multi select) */}
                    <Button
                      // size="small"
                      type="primary"
                      style={{
                        width: isMobile ? '100%' : '100px',
                        float: 'right',
                      }}
                      disabled={selectedRowKey.length === 0}
                      onClick={() => {
                        setToChangeDriver(false);
                        dispatch(
                          allAction.hubProductAction.getActiveDriver({
                            hubId: hubIdSelect || hubId,
                            search: searchDriver,
                          })
                        )
                          .then()
                          .catch((e) => message.error(e.message));
                        setModalSelector('Driver');
                        showModalCancel(selectedRow?.transportationOrderId);
                        setModalCancelVisible(true);
                        // console.log('assign', selectedRow, selectedRowKey);
                      }}
                    >
                      {t('assign')}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={transportationOrderData}
                scroll={{ x: 1000 }}
                pagination={{
                  total: transportationOrderData?.length || 0,
                  showTotal: (total, range) =>
                    `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                      'from'
                    )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                  onChange: () => setSelectedRowKey([]),
                }}
                rowSelection={{
                  onChange: (selectedRowKeys, selectedRows) => {
                    console.log(
                      'selectedRowKeys:',
                      selectedRowKeys,
                      'selectedRows: ',
                      selectedRows
                    );
                    setSelectedRowKey(selectedRowKeys);
                    setSelectedRow(selectedRows);
                  },
                  getCheckboxProps: (record) => ({
                    disabled:
                      record.transportationOrderStatusCode !== 'TOC' ||
                      !(hubIdSelect || hubId),
                    // Column configuration not to be checked
                  }),
                  selectedRowKeys: selectedRowKey,
                }}
              >
                <Column
                  width={190}
                  fixed="left"
                  // ellipsis
                  dataIndex="transportationOrderId"
                  key="transportationOrderId"
                  render={(text, obj) => (
                    // console.log(obj);
                    <Space>
                      <Button
                        size="small"
                        type="primary"
                        style={{ width: '60px' }}
                        onClick={() => {
                          getDoList(text);
                        }}
                      >
                        {t('do-no')}
                      </Button>

                      {/* ปุ่มยกเลิก เปิด modal ยกเลิก */}
                      {FilterPermission('isUpdate') && (
                        <Button
                          size="small"
                          type="danger"
                          style={{ width: '60px' }}
                          disabled={['TOC','CIH', 'DPH', 'HCH', 'COH'].includes(
                            obj?.transportationOrderStatusCode
                          )}
                          onClick={() => {
                            // console.log("selectedRows",obj)
                            setSelectedTO(obj)
                            showModalCancel(text);
                            setTransportationCode(
                              obj?.transportationOrderStatusCode
                            );
                          }}
                        >
                          {t('cancel-modal')}
                        </Button>
                      )}
                    </Space>
                  )}
                />
                {FilterUserLevel(['SAD']) && (
                  <Column
                    width={180}
                    title={t('company-select')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.companyData?.companyName || '-'}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM']) && (
                  <Column
                    width={150}
                    title={t('hub')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.hubData?.hubName}
                  />
                )}
                {FilterUserLevel(['SAD', 'COM']) && (
                  <Column
                    width={180}
                    title={t('agency')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) =>
                      text?.isCustomer
                        ? text?.agencyName || '-'
                        : text?.agencyCode || '-'
                    }
                  />
                )}
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
                  render={(text) =>
                    text.length > 0
                      ? moment(text[0].createdAt).format('DD-MM-YYYY HH:mm')
                      : ''
                  }
                />
                <Column
                  width={200}
                  title={t('status')}
                  // ellipsis
                  dataIndex="transportationOrderStatusData"
                  key="transportationOrderStatusData"
                  // render={(text) => text?.transportationOrderStatusHub || '-'}
                  render={(text, row) => {
                    const priority =
                      row?.transportationOrderStatusData?.priority;
                    var txt = text.transportationOrderStatusHub;
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

                    if (priority === 10) {
                      color = 'volcano';
                      txt = "รอตรวจสอบ"
                    }

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
                  render={(text) => text?.userData?.name || '-'}
                />
                <Column
                  width={100}
                  title={t('agency-code')}
                  ellipsis
                  dataIndex="agencyData"
                  key="agencyData"
                  render={(text) => {
                    if (text?.isCustomer) return '-';
                    return text?.agencyCode || '-';
                  }}
                />
                <Column
                  width={200}
                  title={t('agency-name')}
                  ellipsis
                  dataIndex="agencyData"
                  key="agencyData"
                  render={(text) => {
                    if (text?.isCustomer) {
                      return `${text?.customerData?.customerName || ''} ${text?.customerData?.customerLastName || ''
                        }`;
                    }
                    return `${text?.firstName || ''} ${text?.lastName || ''}`;
                  }}
                />
                <Column
                  width={250}
                  title={t('address')}
                  ellipsis
                  dataIndex="agencyData"
                  key="agencyData"
                  render={(text) => {
                    if (text) {
                      const {
                        addressNo,
                        addressSoi,
                        addressMoo,
                        addressRoad,
                        subdistrictData,
                        districtData,
                        provinceData,
                        postcode,
                      } = text;
                      return `เลขที่ ${addressNo} ${addressMoo ? `หมู่ ${addressMoo}` : ''
                        } ${addressSoi ? `ซอย ${addressSoi}` : ''} 
                    ${addressRoad ? `ถนน ${addressRoad}` : ''} เขต ${districtData.districtName
                        } แขวง ${subdistrictData.subdistrictName} ${provinceData.provinceName
                        } ${postcode} `;
                    }
                  }}
                />
                <Column
                  width={140}
                  title={t('phone')}
                  ellipsis
                  dataIndex="agencyData"
                  key="agencyData"
                  render={(text) => {
                    if (text?.isCustomer) {
                      return `${text?.customerData?.phoneNumber || '-'}`;
                    }
                    return `${text?.phoneNo || '-'}`;
                  }}
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
                  render={(text, row) =>
                    `${text || 0} (${row?.snapCountItem || 0})`
                  }
                />
                <Column
                  width={150}
                  title={t('do-scan')}
                  ellipsis
                  dataIndex="scanUp"
                  key="scanUp"
                  render={(text, row) =>
                    `${row?.scanUp || 0}/${row?.scanDown || 0}`
                  }
                />
              </Table>
            </Col>
          </Card>
          {/*  Modal DO */}
          <Modal
            style={{}}
            title={`${t('transportation-order-no')}: ${transportationOrderDetail?.transportationOrderNo
              }`}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width="100%"
            centered
            footer={null}
          >
            {renderModalDo()}
          </Modal>
          {/*  Modal Driver and Cancel */}
          <Modal
            style={{}}
            zIndex={1001}
            width="65%"
            centered
            visible={modalCancelVisible}
            title={
              ['Cancel', 'Verify', 'ReScan'].includes(modalSelector)
                ? renderTitleModal()
                : t('assign-driver')
            }
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

export default HubProduct;
