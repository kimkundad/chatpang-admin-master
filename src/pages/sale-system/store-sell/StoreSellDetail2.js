import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Divider,
  Layout,
  Modal,
  message,
  Image,
  Card,
  Space,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FileTextOutlined,
  BarcodeOutlined,
  SolutionOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';



import { useTranslation } from 'react-i18next';

import ItemStoreSell2 from "../store-sell/component/ItemStoreSell2";

import { useSelector, useDispatch } from 'react-redux';
import THBText from 'thai-baht-text';
import ButtonPrint from './component/Printing/ButtonPrint';
import ButtonPrintAllSticker from './component/Printing/ButtonPrintAllSticker';
import ButtonPrintAllDelivery from './component/Printing/ButtonPrintAllDelivery';
import ButtonPrintReceipt from './component/Printing/ButtonPrintReceipt';
import ButtonPrintReceiptNoPrice from './component/Printing/ButtonPrintReceiptNoPrice';
import allAction from '../../../app/actions/index';
// import MpayIcon from '../../../assets/mPay.png';

import "./Antd.css"

const StoreSell = (props) => {
  const {
    isLoading, isMobile, selectedKey, openKey,
  } = useSelector(
    (state) => state.mainReducer,
  );
  const {
    isCustomer, userId, userLevel, agencyId,
  } = useSelector(
    (state) => state.authenReducer,
  );
  const { orderDetail } = useSelector(
    (state) => state.storeSellReducer,
  );
  const { agencyWallet } = useSelector((state) => state.storeWalletReducer);
  const [orderStatus, setOrderStatus] = useState('');
  const dispatch = useDispatch();
  const formItemStyle = { marginBottom: 12 };
  const itemLayout = {
    xs: 24,
    sm: 12,
    lg: 6,
  };
  const {
    match: {
      params: { orderId },
    },
    pageCode,
    openNewOrder,
    itemListData
  } = props;

  // console.log('selectedKey', selectedKey, openKey);
  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      // xs: { span: 24 },
      xs: { span: 4 },
      sm: { span: 6 },
      lg: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 18 },
      lg: { span: 16 },
    },
  };

  useEffect(() => {
    dispatch(allAction.orderItemImportAction.setViewOnly(true))
    return () => {
      dispatch(allAction.orderItemImportAction.setViewOnly(false))
    };
  }, []);
  

  useEffect(() => {
    if (agencyId && !isCustomer) {
      dispatch(allAction.storeWallet.getAgencyWallet(agencyId))
        .then()
        .catch((e) => message.error(e.message));
    }
    dispatch(allAction.storeSellAction.getOrderDetail(orderId)).then((data) => {
      console.log("header getOrderDetail", data)
      // items
      const itemList = [];
      if (data) {
        setOrderStatus(data?.header?.orderStatusCode);
        data.items.map((item) => {
          const obj = {};
          obj.orderItemId = item?.orderItemId || '-';
          obj.doNo = item?.doNo || '-';
          obj.recipientId = item?.recipientId || null;
          obj.recipientAddressId = item?.recipientAddressId || null;
          obj.recipientInput = item?.recipientInput || '-';
          obj.recipientName = item?.recipientName || '-';
          obj.recipientLastName = item?.recipientLastName || '-';
          obj.recipientNo = item?.recipientNo || '-';
          obj.recipientMoo = item?.recipientMoo || '-';
          obj.recipientAlley = item?.recipientAlley || '-';
          obj.recipientRoad = item?.recipientRoad || '-';
          obj.recipientDistrictId = item?.recipientDistrictData?.districtName || '-';
          obj.recipientDistrictName = item?.recipientDistrictData?.districtName || '-';
          obj.recipientSubdistrictId = item?.recipientSubdistrictData?.subdistrictName || '-';
          obj.recipientSubdistrictName = item?.recipientSubdistrictData?.subdistrictName || '-';
          obj.recipientProvinceId = item?.recipientProvinceData?.provinceName || '-';
          obj.recipientProvinceName = item?.recipientProvinceData?.provinceName || '-';
          obj.recipientPostcode = item?.recipientPostcode || '-';
          obj.recipientOther = item?.recipientOther || '-';
          obj.parcelTypeId = item?.parcelTypeData?.category || '-';
          obj.transportationTypeCode = item?.transportationType?.transportationTypeName || '-';
          obj.remark = item?.remark || '-';
          obj.weight = item?.weight || '-';
          obj.width = item?.width || '-';
          obj.height = item?.height || '-';
          obj.length = item?.length || '-';
          obj.dimension = item?.dimension || '-';
          obj.volume = item?.volume || '-';
          obj.cod = item?.cod || '-';
          obj.ratePercent = item?.ratePercent || '-';
          obj.transportationPrice = item?.transportationPrice || '-';
          obj.chargeCodPrice = item?.chargeCodPrice || '-';
          obj.transportationNetPrice = item?.transportationNetPrice || '-';
          itemList.push(obj);
        });
        form.setFieldsValue({
          // header
          companyId: data.header.agencyData.companyData.companyId || '-',
          hubId: data.header.agencyData.hubData.hubId || '-',
          agencyId: data.header.agencyData.agencyId || '-',
          billingNo: data.header.receiptNo || data.header.soNo,
          receiptNo: data.header.receiptNo || '-',
          soNo: data.header.soNo || '-',
          date: data?.header?.date
            ? format(new Date(data.header.date), 'yyyy-MM-dd')
            : null,
          paymentDate: data?.header?.paymentDate
            ? format(new Date(data.header.paymentDate), 'yyyy-MM-dd')
            : '-',
          paymentTypeCode: data.header.paymentTypeData?.paymentTypeName || '-',
          customerId: data.header.customerId || '-',
          customerInput: data.header.customerInput || '-',
          customerAddressId: data.header.customerAddressId || '-',
          customerName: data.header.customerName || '-',
          customerLastName: data.header.customerLastName || '-',
          customerSumName: data.header.customerName
            ? `${data.header.customerName} ${data.header.customerLastName}`
            : '-',
          addressCustomer: sumAddressCustomer(data.header) || '-',
          addressSender: sumAddressSender(data.header) || '-',
          customerNo: data.header.customerNo || '-',
          customerMoo: data.header.customerMoo || '-',
          customerAlley: data.header.customerAlley || '-',
          customerRoad: data.header.customerRoad || '-',
          customerDistrictId: data.header.customerDistrictId || '-',
          customerSubdistrictId: data.header.customerSubdistrictId || '-',
          customerProvinceId: data.header.customerProvinceId || '-',
          customerPostcode: data.header.customerPostcode || '-',
          customerAddressOther: data.header.customerAddressOther || '',
          customerTaxpayerNumber: data.header.customerTaxpayerNumber || '',
          customerBankAccountNo: data.header.customerBankAccountNo || '-',
          customerBankAccountName: data.header.customerBankAccountName || '-',
          customerBankName:
            data.header.customerBankData?.bankData?.bankName || '-',
          customerBankId: data.header.customerBankId || '-',
          senderId: data.header.senderId || '-',
          senderInput: data.header.senderInput || '-',
          senderAddressId: data.header.senderAddressId || '-',
          senderName: data.header.senderName || '-',
          senderLastName: data.header.senderLastName || '-',
          senderSumName: data.header.senderName
            ? `${data.header.senderName} ${data.header.senderLastName}`
            : '-',
          senderNo: data.header.senderNo || '-',
          senderMoo: data.header.senderMoo || '-',
          senderAlley: data.header.senderAlley || '-',
          senderRoad: data.header.senderRoad || '-',
          senderDistrictId: data.header.senderDistrictId || '-',
          senderSubdistrictId: data.header.senderSubdistrictId || '-',
          senderProvinceId: data.header.senderProvinceId || '-',
          senderPostcode: data.header.senderPostcode || '-',
          senderAddressOther: data.header.senderAddressOther || '',
          senderTaxpayerNumber: data.header.senderTaxpayerNumber || '',
          recommenderId: data.header.recommenderId || '-',
          recommenderInput: data.header.recommenderInput || '-',
          recommenderName: data.header.recommenderName || '-',
          recommenderLastName: data.header.recommenderLastName || '-',
          recommenderSumName: data.header.recommenderName
            ? `${data.header.recommenderName} ${data.header.recommenderLastName}`
            : '-',

          itemStoreSell: itemList,
          // footer
          totalItem: data.footer.totalItem || 0,
          totalWeight: data.footer.totalWeight || '-',
          totalVolume: data.footer.totalVolume || '-',
          totalDimension: data.footer.totalDimension || '-',
          totalCod: data.footer.totalCod || '-',
          totalTransportationPrice: data.footer.totalTransportationPrice || '-',
          totalChargeCodPrice: data.footer.totalChargeCodPrice || '-',
          totalNettransportationPrice:
            data.footer.totalNettransportationPrice || '-',
          remark: data.footer.remark || '-',
          discountText: data.footer.discountText || '-',
          discountPercent: data.footer.discountPercent
            ? `${data.footer.discountPercent} %`
            : '0.00 %',
          discountAmount: data.footer.discountAmount || '-',
          transportationPriceAfterDiscount:
            data.footer.transportationPriceAfterDiscount || '-',
          morePriceText: data.footer.morePriceText || '-',
          morePriceAmount: data.footer.morePriceAmount || '-',
          etc: data.footer.etc || '-',
          etcAmount: data.footer.etcAmount || '-',
          totalPrice: data.footer.totalPrice || '-',
          totalPriceText: data?.footer?.totalPrice ? THBText(data?.footer?.totalPrice) : '-',
        });
        // console.log('form', form.getFieldValue());
      } else {
        message.error('data not found');
        history.push('./');
      }
    });
  }, []);

  const sumAddressCustomer = (val) => {
    let addressRes = '';
    const moo = val.customerMoo
      ? ` ${t('address-village')}${val.customerMoo}`
      : '';
    const alley = val.customerAlley
      ? ` ${t('address-lane')}${val.customerAlley}`
      : '';
    const road = val.customerRoad
      ? ` ${t('address-road')}${val.customerRoad}`
      : '';
    const subdistrict = val.customerSubdistrictData?.subdistrictName
      ? ` ${t('address-sub-district2')}${val.customerSubdistrictData?.subdistrictName
      }`
      : '';
    const district = val.customerDistrictData?.districtName
      ? ` ${t('address-district2')}${val.customerDistrictData?.districtName}`
      : '';
    const provice = val.customerProvinceData?.provinceName
      ? ` ${t('address-provice2')}${val.customerProvinceData?.provinceName}`
      : '';
    const postcode = val.customerPostcode ? ` ${val.customerPostcode}` : '';
    addressRes = `${val.customerNo}${moo}${alley}${road}${subdistrict}${district}${provice}${postcode}`;
    return addressRes;
  };

  const sumAddressSender = (val) => {
    let addressRes = '';
    const moo = val.senderMoo ? ` ${t('address-village')}${val.senderMoo}` : '';
    const alley = val.senderAlley
      ? ` ${t('address-lane')}${val.senderAlley}`
      : '';
    const road = val.senderRoad ? ` ${t('address-road')}${val.senderRoad}` : '';
    const subdistrict = val.senderSubdistrictData?.subdistrictName
      ? ` ${t('address-sub-district2')}${val.senderSubdistrictData?.subdistrictName
      }`
      : '';
    const district = val.senderDistrictData?.districtName
      ? ` ${t('address-district2')}${val.senderDistrictData?.districtName}`
      : '';
    const provice = val.senderProvinceData?.provinceName
      ? ` ${t('address-provice2')}${val.senderProvinceData?.provinceName}`
      : '';
    const postcode = val.senderPostcode ? ` ${val.senderPostcode}` : '';
    addressRes = `${val.senderNo}${moo}${alley}${road}${subdistrict}${district}${provice}${postcode}`;
    return addressRes;
  };

  const createOrder = () => {
    if (orderStatus === 'SAV') {
      Modal.confirm({
        title: 'Do you want to create order?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(allAction.storeSellAction.updateSave(orderId))
            .then(() => dispatch(allAction.storeSellAction.getOrderDetail(orderId))
              .then((data) => setOrderStatus(data?.header?.orderStatusCode)))
            .catch((err) => message.error(err.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      window.location.reload();
    }
  };

  const checkOrderStatus = async () => {
    openNewOrder();
    // window.location.reload();
  };

  // const getSticker = (key) => {
  //   const value = form.getFieldValue();
  //   const newValue = {};
  //   newValue.header = {
  //     agencyId: value.agencyId,
  //     receiptNo: value.receiptNo || null,
  //     soNo: value.soNo || null,
  //     date: format(new Date(value.date), 'yyyy-MM-dd'),
  //     paymentDate: value.paymentDate
  //       ? format(new Date(value.paymentDate), 'yyyy-MM-dd')
  //       : null,
  //     paymentTypeCode: value.paymentTypeCode,
  //     customerId: value.customerId,
  //     customerAddressId: value.customerAddressId,
  //     customerName: value.customerName,
  //     customerLastName: value.customerLastName,
  //     customerNo: value.customerNo,
  //     customerMoo: value.customerMoo,
  //     customerAlley: value.customerAlley,
  //     customerRoad: value.customerRoad,
  //     customerDistrictId: value.customerDistrictId,
  //     customerSubdistrictId: value.customerSubdistrictId,
  //     customerProvinceId: value.customerProvinceId,
  //     customerPostcode: value.customerPostcode,
  //     customerBankAccountNo: value.customerBankAccountNo,
  //     customerBankAccountName: value.customerBankAccountName,
  //     customerBankId: value.customerBankId,
  //     senderId: value.senderId,
  //     senderAddressId: value.senderAddressId,
  //     senderName: value.senderName,
  //     senderLastName: value.senderLastName,
  //     senderNo: value.senderNo,
  //     senderMoo: value.senderMoo,
  //     senderAlley: value.senderAlley,
  //     senderRoad: value.senderRoad,
  //     senderDistrictId: value.senderDistrictId,
  //     senderSubdistrictId: value.senderSubdistrictId,
  //     senderProvinceId: value.senderProvinceId,
  //     senderPostcode: value.senderPostcode,
  //     recommenderId: value.recommenderId,
  //     recommenderName: value.recommenderName,
  //     recommenderLastName: value.recommenderLastName,
  //   };
  //   const obj = {};
  //   obj.orderItemId = value.itemStoreSell[key].orderItemId;
  //   obj.doNo = value.itemStoreSell[key].doNo;
  //   obj.recipientId = value.itemStoreSell[key].recipientId
  //     || value.itemStoreSell[key].customerId || null;
  //   obj.recipientAddressId = value.itemStoreSell[key].recipientAddressId || null;
  //   obj.recipientName = value.itemStoreSell[key].recipientName;
  //   obj.recipientLastName = value.itemStoreSell[key].recipientLastName;
  //   obj.recipientNo = value.itemStoreSell[key].recipientNo;
  //   obj.recipientMoo = value.itemStoreSell[key].recipientMoo;
  //   obj.recipientAlley = value.itemStoreSell[key].recipientAlley;
  //   obj.recipientRoad = value.itemStoreSell[key].recipientRoad;
  //   obj.recipientDistrictId = value.itemStoreSell[key].recipientDistrictId;
  //   obj.recipientSubdistrictId = value.itemStoreSell[key].recipientSubdistrictId;
  //   obj.recipientProvinceId = value.itemStoreSell[key].recipientProvinceId;
  //   obj.recipientPostcode = value.itemStoreSell[key].recipientPostcode;
  //   obj.parcelTypeId = value.itemStoreSell[key].parcelTypeId;
  //   obj.transportationTypeCode = value.itemStoreSell[key].transportationTypeCode;
  //   obj.remark = value.itemStoreSell[key].remark;
  //   obj.weight = value.itemStoreSell[key].weight;
  //   obj.width = value.itemStoreSell[key].width;
  //   obj.height = value.itemStoreSell[key].height;
  //   obj.length = value.itemStoreSell[key].length;
  //   obj.dimension = value.itemStoreSell[key].dimension;
  //   obj.volume = value.itemStoreSell[key].volume;
  //   obj.cod = value.itemStoreSell[key].cod;
  //   obj.ratePercent = value.itemStoreSell[key].ratePercent;
  //   obj.transportationPrice = value.itemStoreSell[key].transportationPrice;
  //   obj.chargeCodPrice = value.itemStoreSell[key].chargeCodPrice;
  //   obj.transportationNetPrice = value.itemStoreSell[key].transportationNetPrice;
  //   newValue.item = obj;
  //   console.log(key, newValue);

  //   dispatch(
  //     allAction.storeSellAction.getStickerItem(
  //       draftData.orderId,
  //       value.itemStoreSell[key].orderItemId,
  //       newValue,
  //     ),
  //   )
  //     .then()
  //     .catch((e) => message.error(e));
  // };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Layout className="pos_form">
          <Row align="middle" headStyle={{ padding: 0 }}>
            <Col xs={24} md={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('store-sell')}</span>
              </Typography.Title>
            </Col>
            {/* {(FilterUserLevel(['AGN']) && !isCustomer) && (
              <Col xs={24} md={12}>
                <Row align="middle" style={{ float: 'right' }}>
                  <Col flex="auto">
                    <Typography>
                      {t('balance')}
                      {' '}
                      :
                    </Typography>
                  </Col>
                  <Col flex="auto" style={{ paddingLeft: 10, maxWidth: 120 }}>
                    <Input disabled value={agencyWallet?.wallet || 0} />
                  </Col>
                  <Col flex="auto" style={{ paddingLeft: 5 }}>
                    {t('thb')}
                  </Col>
                  <Col flex="auto" style={{ paddingLeft: 10 }}>
                    <Image src={MpayIcon} width={40} />
                  </Col>
                </Row>

              </Col>
            )} */}
          </Row>
          <Card headStyle={{ padding: '0px 16px' }} bodyStyle={{ padding: 6 }}>
            <Form
              name="store-sell"
              form={form}
              {...formItemLayout}
              // onFinish={(e) => onFinish(e)}
              onSubmit={() => console.log('submit')}
            >
              <Card bodyStyle={{ padding: 12 }} style={{ marginBottom: 8 }}>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      style={{ marginBottom: 8 }}
                      label={t('billing-no')}
                      name="billingNo"
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout} xs={12}>
                    <Form.Item
                      label={t('date')}
                      name="date"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout} xs={12}>
                    <Form.Item
                      label={t('payment-date')}
                      name="paymentDate"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('payment')}
                      name="paymentTypeCode"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('customer-id')}
                      name="customerInput"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('customer-name')}
                      name="customerSumName"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={21}>
                    <Form.Item
                      labelCol={{ xs: 2 }}
                      wrapperCol={{ xs: 24 }}
                      // {...formItemLayout}
                      label={t('address')}
                      name="addressCustomer"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('bank')}
                      name="customerBankName"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('bank-no')}
                      name="customerBankAccountNo"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('bank-name')}
                      name="customerBankAccountName"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('sender-code')}
                      name="senderInput"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('sender-name')}
                      name="senderSumName"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={21}>
                    <Form.Item
                      labelCol={{ xs: 2 }}
                      wrapperCol={{ xs: 24 }}
                      // {...formItemLayout}
                      label={t('address')}
                      name="addressSender"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('referral-code')}
                      name="recommenderInput"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                  <Col {...itemLayout}>
                    <Form.Item
                      label={t('referral-name')}
                      name="recommenderSumName"
                      style={{ marginBottom: 8 }}
                    >
                      <Input size="small" disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* <br /> */}

              <ItemStoreSell2
                showHeader={false}
                shortSender={""}
                setShowHeader={()=>{}}
                itemListData={itemListData}
                orderId={orderId}
                form={form}
                viewOnly={true}
              //  {...props}
              />

              <Row
                style={{
                  width: 1000,
                  margin: 'auto',
                  border: '0px blue solid',
                }}
              >
                <Col flex="110px">
                  <Form.Item
                    labelCol={{ flex: '60px' }}
                    // wrapperCol={{ xs: 24 }}
                    style={{ marginBottom: 8 }}
                    label={t('quantity')}
                    name="totalItem"
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 40,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col flex="100px">
                  <Form.Item
                    labelCol={{ flex: '60px' }}
                    // wrapperCol={{ xs: 24 }}
                    label={t('weight')}
                    name="totalWeight"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 40,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col flex="130px">
                  <Form.Item
                    labelCol={{ flex: '80px' }}
                    // wrapperCol={{ xs: 24 }}
                    label={t('volume')}
                    name="totalVolume"
                    style={{ marginBottom: 8 }}
                    extra={<div style={{ fontSize: '12px' }}>กxยxส</div>}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 40,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col flex="120px">
                  <Form.Item
                    labelCol={{ xs: 8 }}
                    wrapperCol={{ xs: 24 }}
                    label={t('cod')}
                    name="totalCod"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 70,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col flex="150px">
                  <Form.Item
                    labelCol={{ xs: 10 }}
                    wrapperCol={{ xs: 24 }}
                    label={t('shipping-cost')}
                    name="totalTransportationPrice"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 70,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col flex="190px">
                  <Form.Item
                    labelCol={{ xs: 14 }}
                    wrapperCol={{ xs: 24 }}
                    label={t('charge-cod-price')}
                    name="totalChargeCodPrice"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 70,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                {/* <Col flex="auto">
                  <Form.Item
                    labelCol={{ flex: '100px' }}
                    // wrapperCol={{ xs: 24 }}
                    label={t('net-shipping-cost')}
                    name="totalNettransportationPrice"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{ width: 90, backgroundColor: '#7596DE', color: '#ffff' }}
                    />
                  </Form.Item>
                </Col> */}
              </Row>
              {/* <br /> */}
              <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={24} align="top">
                  <Col xs={24} lg={18}>
                    <Row>
                      <Col xs={9}>
                        <Form.Item
                          labelCol={{ xs: 5 }}
                          wrapperCol={{ xs: 24, lg: 16 }}
                          style={{ marginBottom: 8 }}
                          label={t('discount')}
                          name="discountText"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={5}>
                        <Form.Item
                          wrapperCol={{ xs: 24, lg: 18 }}
                          style={{ marginBottom: 8 }}
                          name="discountPercent"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={5}>
                        <Form.Item
                          // labelCol={{ xs: 12 }}
                          wrapperCol={{ xs: 24, lg: 20 }}
                          style={{ marginBottom: 8 }}
                          // label={t('remark')}
                          name="discountAmount"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={5}>
                        <Form.Item
                          labelCol={{ xs: 12 }}
                          wrapperCol={{ xs: 24, lg: 20 }}
                          style={{ marginBottom: 8 }}
                          label={t('transport-price-discount')}
                          name="transportationPriceAfterDiscount"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={9}>
                        <Form.Item
                          labelCol={{ xs: 5 }}
                          wrapperCol={{ xs: 24, lg: 16 }}
                          style={{ marginBottom: 8 }}
                          label={t('added-part')}
                          name="morePriceText"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={5} />
                      <Col xs={5}>
                        <Form.Item
                          // labelCol={{ xs: 12 }}
                          wrapperCol={{ xs: 24, lg: 20 }}
                          style={{ marginBottom: 8 }}
                          // label={t('remark')}
                          name="morePriceAmount"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={9}>
                        <Form.Item
                          labelCol={{ xs: 5 }}
                          wrapperCol={{ xs: 24, lg: 16 }}
                          style={{ marginBottom: 8 }}
                          label={t('address-other')}
                          name="etc"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={5} />
                      <Col xs={5}>
                        <Form.Item
                          labelCol={{ xs: 4 }}
                          wrapperCol={{ xs: 24, lg: 20 }}
                          style={{ marginBottom: 8 }}
                          // label={t('other-price')}
                          name="etcAmount"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      {/* <Col xs={24}>
                        <Form.Item
                          labelCol={{ xs: 3 }}
                          wrapperCol={{ xs: 24, lg: 21 }}
                          style={{ marginBottom: 8 }}
                          label={t('remark')}
                          name="remark"
                        >
                          <Input size="small" disabled />
                        </Form.Item>
                      </Col> */}
                      <Col xs={24}>
                        <Form.Item
                          labelCol={{ xs: 3 }}
                          wrapperCol={{ xs: 24, lg: 21 }}
                          style={{ marginBottom: 8 }}
                          label={t('net-price')}
                          name="totalPriceText"
                        >
                          <Input
                            size="small"
                            disabled
                            style={{
                              backgroundColor: '#264B9B',
                              color: '#fff',
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} lg={6} style={{ margin: 'auto' }}>
                    <Form.Item
                      labelCol={{ xs: 3 }}
                      wrapperCol={{ xs: 24, lg: 21 }}
                      style={{ marginBottom: 8 }}
                      name="totalPrice"
                    >
                      <Input
                        size="small"
                        disabled
                        style={{
                          backgroundColor: '#264B9B',
                          color: '#fff',
                          height: '150px',
                          maxWidth: '100%',
                          textAlign: 'center',
                          fontSize: '48px',
                          fontWeight: 700,
                          padding: isMobile ? '5% 0' : '10% 0',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <div style={{ float: 'right', margin: '20px 0 8px 0' }}>
                {orderStatus === 'SAV' && (
                  <>
                    <Button
                      type="default"
                      onClick={checkOrderStatus}
                      style={{ width: '120px', float: 'right', marginLeft: 15 }}
                    >
                      {t('new-store-sell')}
                    </Button>
                    <Button
                      type="default"
                      onClick={() => createOrder()}
                      style={{ width: '120px', float: 'right', marginLeft: 15 }}
                    >
                      {t('finish')}
                    </Button>
                  </>
                )}
                {/* <Button
                  type="primary"
                  onClick={() => dispatch(allAction.storeSellAction.getDeliveryFile(orderId))}
                  icon={<FileTextOutlined />}
                  style={{ width: '120px', float: 'right', marginLeft: 15 }}
                >
                  {t('print-delivery')}
                </Button> */}

                {/*  ButtonPrintAllDelivery */}
                {['CRE', 'PAI'].includes(orderStatus) && (
                  <>
                    {(!selectedKey.includes('/hub-return') && !selectedKey.includes('/hub-sale-order')) && (
                      <Button
                        type="default"
                        onClick={checkOrderStatus}
                        style={{ width: '120px', float: 'right', marginLeft: 15 }}
                      >
                        {t('new-store-sell')}
                      </Button>
                    )}
                    <ButtonPrintAllDelivery
                      icon={<FileTextOutlined />}
                      orderId={orderId}
                      form={form}
                      style={{
                        width: '120px',
                        height: '32px',
                        float: 'right',
                        marginLeft: 15,
                      }}
                      label={t('print-delivery')}
                      onClickItem={null}
                    >
                      {t('print-delivery')}
                    </ButtonPrintAllDelivery>
                      
                    {/*  ButtonPrintAllSticker */}
                    <ButtonPrintAllSticker
                      index={1}
                      // disabled={!form.getFieldValue('itemStoreSell')[index].recipientNo}
                      form={form}
                      // field={field}
                      // fieldKey={field.key}
                      style={{
                        width: '120px',
                        height: '32px',
                        float: 'right',
                        marginLeft: 15,
                      }}
                      label={t('sticker')}
                      onClickItem={null}
                    >
                      {t('sticker')}
                    </ButtonPrintAllSticker>

                    {orderDetail?.header?.isCompletedReceipt && (
                      <>
                        <ButtonPrintReceipt
                          // disabled={!form.getFieldValue('itemStoreSell')[index].recipientNo}
                          form={form}
                          icon={<FileExclamationOutlined />}
                          style={{
                            width: '120px',
                            height: '32px',
                            float: 'right',
                            marginLeft: 15,
                          }}
                          label={t('print-receipt')}
                          onClickItem={null}
                        >
                          {t('print-receipt')}
                        </ButtonPrintReceipt>
                        <ButtonPrintReceiptNoPrice
                          // disabled={!form.getFieldValue('itemStoreSell')[index].recipientNo}
                          form={form}
                          icon={<FileDoneOutlined />}
                          style={{
                            width: '200px',
                            height: '32px',
                            float: 'right',
                            marginLeft: 15,
                          }}
                          label={t('print-receipt-no-price')}
                          onClickItem={null}
                        >
                          {t('print-receipt-no-price')}
                        </ButtonPrintReceiptNoPrice>
                      </>
                    )}
                  </>
                )}
              </div>
            </Form>
          </Card>
        </Layout>
      </Spin>
    </>
  );
};

export default StoreSell;
