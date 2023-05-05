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
} from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ModalDo from './component/ModalDo';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';

const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;

const HubSaleOrder = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;

  const [hubIdSelect, setHubIdSelect] = useState(null);
  const history = useHistory();
  const { orderData, orderItemData } = useSelector(
    (state) => state.hubSaleOrder
  );

  const { hubId, permission } = useSelector((state) => state.authenReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
    const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    const end = moment(new Date(), 'YYYY-MM-DD');
    dispatch(
      allAction.hubSaleOrder.getOrderForManageSo({
        startDate: moment(std).format('YYYY-MM-DD'),
        endDate: moment(end).format('YYYY-MM-DD'),
        isCompletedReceipt: 0,
      })
    )
      .then()
      .catch((e) => message.error(e.message));
    if (hubId) {
      dispatch(
        allAction.hubSaleOrder.getOrderForManageSo({
          hubId,
          startDate: moment(std).format('YYYY-MM-DD'),
          endDate: moment(end).format('YYYY-MM-DD'),
          isCompletedReceipt: 0,
        })
      )
        .then()
        .catch((e) => message.error(e.message));
    }
    return () => {
      dispatch(allAction.hubSaleOrder.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);

  const onSearch = (value) => {
    // console.log('vv', value);
    form.setFieldsValue({
      search: '',
    });
    if (value?.hubId) {
      setHubIdSelect(value?.hubId);
      dispatch(allAction.hubSaleOrder.getOrderForManageSo(value))
        .then()
        .catch((e) => message.error(e.message));
    } else if (hubId) {
      dispatch(
        allAction.hubSaleOrder.getOrderForManageSo({
          ...value,
          hubId,
        })
      )
        .then()
        .catch((e) => message.error(e.message));
    } else {
      dispatch(allAction.hubSaleOrder.getOrderForManageSo(value))
        .then()
        .catch((e) => message.error(e.message));
      dispatch(allAction.hubSaleOrder.clearData())
        .then()
        .catch((e) => message.error(e.message));
    }
  };

  const searchParcelByDoNo = ({ doNo }) => {
    dispatch(
      allAction.hubSaleOrder.getOrderItemByDo({
        doNo,
        hubId: hubIdSelect || hubId || '',
      })
    )
      .then((res) => {
        if (res) {
          showModal();
          form2.setFieldsValue({ doNo: '' });

          // ModalDo({ ...props, data: res });
          // Show edit dimension modal
        } else {
          modalInfo();
          form2.setFieldsValue({ doNo: '' });
        }
      })
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
          <Row gutter={8}>
            <Col xs={24}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('HSO')}</span>
              </Typography.Title>
            </Col>
            <Col sm={24}>
              <FilterData onSearch={onSearch} pageCode={pageCode} />
            </Col>
          </Row>
          {/* {(hubIdSelect || hubId)
            && ( */}
          <Card>
            {/* {orderItemData?.orderItemId} */}
            <Row>
              <Col xs={24} md={12}>
                <Form
                  form={form2}
                  onFinish={searchParcelByDoNo}
                  initialValues={{ doNo: '' }}
                >
                  <Form.Item label={t('scan-parcel')} name="doNo">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col sm={24}>
                <Table
                  // onChange={handleChange}
                  dataSource={orderData}
                  scroll={{ x: 1000 }}
                  pagination={{
                    total: orderData?.length || 0,
                    showTotal: (total, range) =>
                      `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
                        'from'
                      )} ${total} ${t('record')}`,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                  }}
                  style={{ cursor: 'pointer' }}
                  onRow={(record) => ({
                    onClick: () => {
                      const { checkedOrderItem, countOrderItem, isCompletedReceipt } = record;
                      
                      if (!(checkedOrderItem === countOrderItem && !isCompletedReceipt)) {
                        history.push(`./store-sell/${record.orderId}`);
                      }
                    },
                  })}
                // onRow={(record) => ({
                // onClick: () => {
                //   history.push(`./store-sell/${record.orderId}`);
                // },
                // })}
                >
                  <Column
                    width={200}
                    title={t('billing-no')}
                    ellipsis
                    dataIndex="orderId"
                    key="orderId"
                    render={(_text, obj) => {
                      if (obj?.receiptNo) return obj?.receiptNo;
                      return obj?.soNo;
                    }}
                  />
                  <Column
                    width={200}
                    title={t('big-sender-name')}
                    ellipsis
                    dataIndex="orderId"
                    key="orderId"
                    render={(_text, obj) => {
                      const { receiptNo, customerName, customerLastName } = obj;
                      // if (receiptNo) return '-';

                      if (customerName && customerLastName) {
                        return `${customerName} ${customerLastName}`;
                      }
                      return customerName;
                    }}
                  />
                  <Column
                    width={200}
                    title={t('total-do')}
                    ellipsis
                    dataIndex="orderId"
                    key="orderId"
                    render={(_text, obj) => {
                      const { checkedOrderItem, countOrderItem } = obj;
                      return `${checkedOrderItem}/${countOrderItem}`;
                    }}
                  />
                  <Column
                    width={150}
                    title={t('date')}
                    ellipsis
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(text) =>
                      text ? moment(text).format('DD/MM/YYYY') : '-'
                    }
                  />
                  <Column
                    width={200}
                    title={t('receipt-status')}
                    ellipsis
                    dataIndex="isCompletedReceipt"
                    key="isCompletedReceipt"
                    render={(text, obj) => {
                      const { checkedOrderItem, countOrderItem } = obj;
                      if (text) {
                        return (
                          <>{t('complete')}</>
                          // <Button
                          //   type="default"
                          //   onClick={() => {
                          //     console.log("text", text)
                          //     // history.push(`./store-sell/${obj.orderId}`);
                          //   }}
                          //   style={{ width: isMobile ? '100%' : '100px' }}
                          // >
                          //   {t('complete')}
                          // </Button>
                        );
                      }

                      if (checkedOrderItem !== countOrderItem && !text) {
                        return (
                          <>{t('not-complete')}</>
                          // <Button
                          //   type="default"
                          //   onClick={() => {
                          //     console.log("text", text)
                          //     // history.push(`./store-sell/${obj.orderId}`);
                          //   }}
                          //   style={{ width: isMobile ? '100%' : '100px' }}
                          // >
                          //   {t('not-complete')}
                          // </Button>
                        );
                      }

                      if (checkedOrderItem === countOrderItem && !text) {
                        return (
                          <Button
                            type="default"
                            type="primary"
                            onClick={() => {
                              // console.log("text", text)
                              history.push(`./store-sell/${obj.orderId}`);
                            }}
                            // icon={<SearchOutlined />}
                            // htmlType="submit"
                            style={{ width: isMobile ? '100%' : '100px' }}
                          >
                            สร้างใบเสร็จ
                          </Button>
                        );
                      }
                    }}
                  />
                </Table>
              </Col>
            </Row>
          </Card>
          {/* )} */}
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

export default HubSaleOrder;
