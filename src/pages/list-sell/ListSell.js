import React, { useEffect, useState, useRef } from 'react';
import {
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  message,
  Button,
  Space,
  Form,
  Input,
  Modal,
  Tag,
} from 'antd';

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import allAction from '../../app/actions/index';
import FilterData from './component/FilterData';
import ListSellTable from './ListSellTable';

import {
  orderItemsApi,
  useBypassOrderItemsMutation,
  useGetOrderItemsQuery
} from '../../app/api/orderItemsApi';

const { Column } = Table;
const { TextArea } = Input;
const ListSell = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pageCode } = props;
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [transportationOrderForCancel, setTransportationOrderForCancel] =
    useState(null);
  const [orderItemIdForBypass, setOrderItemIdForBypass] = useState(null);
  const [remark, setRemark] = useState(null);
  const [showBypass, setShowBypass] = useState(false);
  const [modalSelector, setModalSelector] = useState('Cancel');

  const [orderItemsForBypass, setOrderItemsForBypass] = useState([])

  //----------- RTK QUERY ---------------
  const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
  const end = moment(new Date(), 'YYYY-MM-DD');
  const [toQuery, setToQuery] = useState({
    startDate: moment(std).format('YYYY-MM-DD'),
    endDate: moment(end).format('YYYY-MM-DD'),
    orderItemStatusCode: '',
  });

  const {
    data: orderItemStoreData,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetOrderItemsQuery(toQuery,
    {
      // pollingInterval: 3000,
      refetchOnMountOrArgChange: true,
      // skip: !orderId || !Number(orderId),
    });

  const [bypassOrderItems] = useBypassOrderItemsMutation();

  //-------------------------------------

  // const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  // const { orderItemStoreData } = useSelector((state) => state.listSellReducer);
  const { hubId, permission, userLevel, agencyId } = useSelector(
    (state) => state.authenReducer
  );

  const exportFunction = useRef(() => { });

  useEffect(() => {
    if (isError) {
      message.error(error.status)
    }
  }, [error])

  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(orderItemsApi.util.invalidateTags(['OrderItems', 'Recipient', 'Orders']))

    dispatch(allAction.listSellAction.getMasterItemStatus());
    return () => {
      dispatch(allAction.listSellAction.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, []);

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

  const onSearch = (value) => {
    console.log('search', value);
    if (!value?.startDate || !value?.endDate) {
      value.startDate = moment(std).format('YYYY-MM-DD');
      value.endDate = moment(end).format('YYYY-MM-DD');
    }

    if (JSON.stringify(value) === JSON.stringify(toQuery)) {
      refetch();
    } else {
      setToQuery(value);
    }

    if (value.search) {
      setShowBypass(true);
    } else {
      setShowBypass(false);
    }
    // dispatch(allAction.listSellAction.getOrderItemStore(value))
    //   .then()
    //   .catch((e) => message.error(e.message));
  };

  const showModalCancel = (val) => {
    setModalSelector('Cancel');
    setTransportationOrderForCancel(val);
    setModalCancelVisible(true);
  };

  const showConfirmOrderFound = (orderItemId) => {
    setModalSelector('Found');
    setOrderItemIdForBypass(orderItemId);
    setModalCancelVisible(true);
  };

  const showConfirmOrderByPass = (orderItems) => {
    setModalSelector('ByPass');
    setOrderItemsForBypass(orderItems)
    // setOrderItemIdForBypass();
    setModalCancelVisible(true);
  };

  const modalCancelCancel = () => {
    clearModalCancelValue();
  };

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

  const checkContentUpdate = () => {
    if (modalSelector === 'Cancel') {
      dispatch(
        allAction.storeSellAction.deleteItem(
          transportationOrderForCancel.orderId,
          transportationOrderForCancel.orderItemId,
          { remark }
        )
      )
        .then((e) => {
          if (agencyId) {
            dispatch(allAction.storeWallet.getAgencyWallet(agencyId));
          }
          // dispatch(allAction.listSellAction.getOrderItemStore())
          //   .then()
          //   .catch((e) => message.error(e.message));

          // setToQuery();
          refetch();
          clearModalCancelValue();
        })
        .catch((e) => message.error(e.message));
    } else if (modalSelector === 'Found') {
      dispatch(
        allAction.listSellAction.updateOrderFound(orderItemIdForBypass, {
          remark,
        })
      )
        .then((e) => {
          // dispatch(allAction.listSellAction.getOrderItemStore())
          //   .then()
          //   .catch((e) => message.error(e.message));
          // setToQuery();
          refetch();
          clearModalCancelValue();
        })
        .catch((e) => message.error(e.message));
    } else if (modalSelector === 'ByPass') {

      bypassOrderItems({ remark, orderItems: orderItemsForBypass }).then((e) => {
        clearModalCancelValue();
      })

      // dispatch(
      //   allAction.listSellAction.updateOrderBypass(orderItemIdForBypass, {
      //     remark,
      //   })
      // )
      //   .then((e) => {
      //     // dispatch(allAction.listSellAction.getOrderItemStore())
      //     //   .then()
      //     //   .catch((e) => message.error(e.message));

      //     // setToQuery();
      //     refetch();
      //     clearModalCancelValue();
      //   })
      //   .catch((e) => message.error(e.message));
    }
  };

  const renderTitleModal = () => {
    if (modalSelector === 'Cancel') {
      return t('cancel-modal');
    }
    if (modalSelector === 'Found') {
      return t('found');
    }
    if (modalSelector === 'ByPass') {
      return t('bypass');
    }
  };

  const renderButtonModal = () => {
    if (modalSelector === 'Cancel') {
      return (
        <Button
          key="submit"
          type="danger"
          // disabled={!remark}
          onClick={() => checkContentUpdate()}
        >
          {t('cancel-modal')}
        </Button>
      );
    }
    if (modalSelector === 'Found') {
      return (
        <Button
          key="submit"
          type="primary"
          // disabled={!remark}
          onClick={() => checkContentUpdate()}
        >
          {t('found')}
        </Button>
      );
    }
    if (modalSelector === 'ByPass') {
      return (
        <Button
          key="submit"
          type="primary"
          // disabled={!remark}
          onClick={() => checkContentUpdate()}
        >
          {t('bypass')}
        </Button>
      );
    }
  };

  const clearModalCancelValue = () => {
    setRemark(null);
    setModalCancelVisible(false);
    setTransportationOrderForCancel(null);
    setOrderItemIdForBypass(null);
    setModalSelector('Cancel');
  };

  const renderModalCancel = () => cancelContent();

  const filterDisable = (obj) => {
    if (
      FilterUserLevel(['SAD', 'COM']) &&
      ['VBH', 'CRE', 'WFS'].includes(obj?.orderItemStatusCode)
    ) {
      return false;
    }
    if (
      FilterUserLevel(['HUB']) &&
      ['VBH'].includes(obj?.orderItemStatusCode)
    ) {
      return false;
    }
    if (
      FilterUserLevel(['AGN']) &&
      ['CRE', 'WFS'].includes(obj?.orderItemStatusCode)
    ) {
      return false;
    }
    return true;
  };

  const ActionComponent = (params) => {
    // console.log("params", params)
    return <>
      {/* {FilterPermission('isUpdate') &&
      !FilterUserLevel(['AGN']) &&
      showBypass && (
        <Button
          size="small"
          style={{
            fontSize: 'small'
          }}
          disabled={
            !['CRE', 'WFS'].includes(params.data?.orderItemStatusCode)
          }
          onClick={() => {
            showConfirmOrderByPass(params.data?.orderItemId);
          }}
        >
          {t('bypass')}
        </Button>
      )} */}
      {FilterPermission('isUpdate') && (
        <Button
          size="small"
          type="danger"
          style={{ fontSize: 'small', margin: 5 }}
          disabled={filterDisable(params.data)}
          onClick={() => {
            showModalCancel(params.data);
          }}
        >
          {t('cancel-modal')}
        </Button>
      )}
      {/* {FilterPermission('isUpdate') &&
      !FilterUserLevel(['AGN']) && ( */}
      <Button

        size="small"
        type="primary"
        style={{ fontSize: 'small' }}
        disabled={params.data?.orderItemStatusCode !== 'ITM'}
        onClick={() => {
          showConfirmOrderFound(params.data?.orderItemId);
        }}
      >
        {t('found')}
      </Button>
      {/* )} */}
    </>;
  }

  return (
    <>
      {/* {console.log(orderItems)} */}
      <Spin spinning={isFetching} tip="Loading...">
        <Layout >
          <div style={{
            display: "flex", flexDirection: "column",
            height: "calc(100vh - 90px)"
          }}>
            <Row gutter={[8, 8]} style={{ marginBottom: -20 }}>
              <Col xs={24} sm={12}>
                <Typography.Title level={3}>
                  <span className="text-primary">{t('LIS')}</span>
                </Typography.Title>
              </Col>

              <Col xs={24} md={12}>
                <Row align="middle" style={{ float: 'right' }}>
                  <Col flex="auto" style={{ paddingLeft: 10 }}>
                    <Button
                      type="primary"
                      // disabled={reportCodData?.length < 1}
                      style={{ width: 120 }}
                      icon={<DownloadOutlined />}
                      onClick={exportFunction.current}
                    >
                      {t('export-file')}
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col sm={24}>
                <FilterData
                  exportFunction={exportFunction}
                  onSearch={onSearch}
                  pageCode={pageCode}
                />
              </Col>
              <Col sm={24}>

              </Col>
            </Row>
            <div style={{ backgroundColor: 'gray', flex: 1, }}>
              <ListSellTable
                orderItemStoreData={orderItemStoreData}
                FilterPermission={FilterPermission}
                FilterUserLevel={FilterUserLevel}
                ActionComponent={ActionComponent}
                showConfirmOrderByPass={showConfirmOrderByPass}
              // showConfirmOrderByPass(params.data?.orderItemId);

              />
            </div>
          </div>
        </Layout>
        <Modal
          style={{}}
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
      </Spin>
    </>
  );
};



export default ListSell;


