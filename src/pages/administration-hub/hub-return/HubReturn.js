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
  Input,
  Modal,
  Space,
  Button,
} from 'antd';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';
import ModalDo from './component/ModalDo';

const { Column } = Table;

const HubReturn = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { pageCode } = props;
  const { hubId, permission, userLevel } = useSelector(
    (state) => state.authenReducer,
  );
  const { orderItemData } = useSelector((state) => state.hubSaleOrder);
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hubIdSelect, setHubIdSelect] = useState(null);
  const { dataRlEx } = useSelector((state) => state.hubReturn);
  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.hubReturn.getOrderHubReturn())
      .then()
      .catch((e) => message.error(e.message));

    return () => {
      dispatch(allAction.hubReturn.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearch = (value) => {
    console.log(value);
    if (value?.hubId) {
      setHubIdSelect(value?.hubId);
    }
    dispatch(allAction.hubReturn.getOrderHubReturn(value))
      .then()
      .catch((e) => message.error(e.message));
  };

  const searchParcelByDoNo = ({ doNo }) => {
    dispatch(
      allAction.hubSaleOrder.getOrderItemByDo({
        doNo,
        hubId: hubIdSelect || hubId || '',
      }),
      console.log('orderItemData', orderItemData),

    )
      .then((res) => {
        if (res) {
          showModal();
          form.setFieldsValue({ doNo: '' });

          // ModalDo({ ...props, data: res });
          // Show edit dimension modal
        } else {
          modalInfo();
          form.setFieldsValue({ doNo: '' });
        }
      })
      .catch((e) => message.error(e.message));
  };

  const modalInfo = () => {
    Modal.info({
      title: 'ไม่พบรายที่ค้นหา',
      content: (
        <div>
          <p>กรุณาลองใหม่อีกครั้ง</p>
        </div>
      ),
      onOk() { },
    });
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={18}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('HRT')}</span>
              </Typography.Title>
            </Col>
            <Col sm={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
            <Col sm={12}>
              <Form
                form={form}
                onFinish={searchParcelByDoNo}
                initialValues={{ doNo: '' }}
              >
                <Form.Item label={t('scan-parcel')} name="doNo">
                  <Input />
                </Form.Item>
              </Form>
            </Col>
            <Col sm={24}>
              <Table
                // onChange={handleChange}
                dataSource={dataRlEx}
                scroll={{ x: 1000 }}
                pagination={{
                  total: dataRlEx?.length || 0,
                  showTotal: (total, range) => `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                    'from',
                  )} ${total} ${t('record')}`,
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                }}
              >
                {FilterUserLevel(['SAD']) && (
                  <Column
                    width={180}
                    title={t('company-select')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => text?.companyData?.companyName}
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
                {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
                  <Column
                    width={180}
                    title={t('agency')}
                    ellipsis
                    dataIndex="agencyData"
                    key="agencyData"
                    render={(text) => (text?.isCustomer
                      ? text?.agencyCode || '-'
                      : text?.agencyCode || '-')}
                  />
                )}
                <Column
                  width={200}
                  title={t('billing-no')}
                  ellipsis
                  dataIndex="receiptNo"
                  key="receiptNo"
                  render={(text, row) => text || row?.soNo}
                />
                <Column
                  width={200}
                  title={t('status')}
                  // ellipsis
                  dataIndex="orderStatusCode"
                  key="orderStatusCode"
                  render={(text, row) => {
                    if(text==="CRE") return "พัสดุส่งคืน"
                    // const priority = row?.transportationOrderStatusData?.priority;
                    // const txt = text.transportationOrderStatusAgency;
                    // let color = '';

                    // if (priority === 5) {
                    //   color = 'purple';
                    //   // txt = "อยู่ที่เอเจนซี่"
                    // }
                    // if (priority === 6) {
                    //   color = 'volcano';
                    //   // txt = "รอตรวจสอบ"
                    // }
                    // if ([7, 8, 9, 10].indexOf(priority) > -1) color = 'green';
                    // if (priority > 10) color = 'blue';
                    return text;
                  }}
                />

                <Column
                  width={100}
                  title={t('sale-name')}
                  ellipsis
                  dataIndex="saleName"
                  key="saleName"
                />

                <Column
                  width={150}
                  title={t('action')}
                  align="center"
                  dataIndex="recipientName"
                  key="recipientName"
                  render={(text, row) => (
                    <>
                      <Space>
                        {FilterPermission('isRead') && (
                          <Button
                            size="small"
                            type="primary"
                            disabled={row?.orderStatusCode === 'DRF'}
                            style={{ width: '60px' }}
                            onClick={() => history.push(`./store-sell/${row.orderId}`)}
                          >
                            {t('view')}
                          </Button>
                        )}
                        {/* {FilterPermission('isUpdate') && (
                          <Button
                            size="small"
                            type="primary"
                            style={{ width: '60px' }}
                            disabled={row?.orderStatusCode === 'CRE'}
                            onClick={() => history.push(`./store-sell/${row.orderId}/edit`)}
                          >
                            {t('edit')}
                          </Button>
                        )} */}
                        {FilterPermission('isRead') && (
                          <Button
                            size="small"
                            type="primary"
                            danger
                            style={{ width: '60px' }}
                            disabled={row?.orderStatusCode === 'CRE'}
                            // onClick={() => cancelOrder(row)}
                          >
                            {t('cancel-modal')}

                          </Button>
                        )}
                      </Space>
                    </>
                  )}
                />
              </Table>
            </Col>
            {/* {FilterPermission('isCreate') && (
              <Col xs={24} sm={6}>
                <Button
                  style={{ float: 'right', width: isMobile ? '100%' : '120px' }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push('./user/create')}
                >
                  {t('create')}
                </Button>
              </Col>
            )} */}

            {/* <Col xs={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col> */}
          </Row>
          <ModalDo
            showModal={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            data={orderItemData}
          />
        </Layout>
      </Spin>
    </>
  );
};

export default HubReturn;
