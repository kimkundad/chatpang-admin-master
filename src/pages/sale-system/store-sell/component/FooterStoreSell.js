import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  Badge,
  message,
  Image,
  Card,
  DatePicker,
  Select,
  Space,
} from 'antd';

import {
  SaveOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons';

import allAction from '../../../../app/actions/index';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import THBText from 'thai-baht-text';

const { Text } = Typography;
const { Option } = Select;
const FooterStoreSell = (props) => {
  const { t } = useTranslation();
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { agencyDiscountList } = useSelector((state) => state.storeSellReducer);

  const { dec2, Knumber } = useSelector((state) => state.kaiUtilsReducer);

  const isCustomer = useSelector((state) => state.authenReducer.isCustomer);
  const [disState, setDisState] = useState(0);
  const itemLayout = {
    xs: 24,
    sm: 12,
    lg: 6,
  };
  const {
    form, onCancelOrder, onFinish,
  } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 20 },
    },
  };

  const dispatch = useDispatch();

  // console.log("Form Update 2!",form.getFieldsValue());
  // dispatch(allAction.orderItemImportAction.setFormUpdate(form.getFieldsValue()))

  useEffect(
    () => {
      const keys = form.getFieldsValue();
      // console.log('dissss', keys.discountPercent);
      calDiscount(keys?.discountPercent || 0);
      setDisState(keys?.discountPercent || 0);
      calTotalPrice();
    }, [form.getFieldsValue().discountPercent],
  );

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/([0-9]|\.|-)/.test(ch)) {
      evt.preventDefault();
    }
  }

  const calDiscount = (value) => {
    const keys = form.getFieldsValue();
    const disPer = Knumber(value) / 100;
    const totalTransportationPrice = keys.totalTransportationPrice;
    const discountAmount = Knumber(totalTransportationPrice) * Knumber(disPer);
    const transportationPriceAfterDiscount = Knumber(totalTransportationPrice) - Knumber(discountAmount);
    // console.log('item', keys.itemStoreSell);
    const items = keys.itemStoreSell;
    if (items && items.length > 0) {
      for (const data of items) {
        const dis = disPer * Knumber(data?.transportationPrice || 0);

        data.transportationNetPrice = (Knumber(data.transportationPrice || 0) + Knumber(data.chargeCodPrice || 0) - dis);
      }
    }
    form.setFieldsValue({
      ...keys,
      discountPercent: value,
      discountAmount: dec2(discountAmount),
      transportationPriceAfterDiscount: dec2(transportationPriceAfterDiscount),
    });
    // console.log('value', form.getFieldsValue('itemSellStore'), totalTransportationPrice, discountAmount, transportationPriceAfterDiscount);
  };

  const calTotalPrice = () => {
    const keys = form.getFieldsValue();
    const etcAmount = Knumber(keys.etcAmount || 0);
    const morePriceAmount = Knumber(keys.morePriceAmount || 0);
    const totalChargeCodPrice = Knumber(keys.totalChargeCodPrice || 0);
    const transportationPriceAfterDiscount = Knumber(keys.transportationPriceAfterDiscount);
    const totalPrice = Knumber(etcAmount) +
      Knumber(morePriceAmount) + Knumber(totalChargeCodPrice)
      + Knumber(transportationPriceAfterDiscount);
    const items = keys.itemStoreSell;
    if (items && items.length > 0) {
      const adding = (Knumber(etcAmount || 0) + Knumber(morePriceAmount || 0)) / items.length;

      for (const data of items) {
        const dis = Knumber(keys?.discountPercent ? keys?.discountPercent / 100 : 0) * Knumber(data?.transportationPrice || 0);
        data.transportationNetPrice = (Knumber(data.transportationPrice || 0) + Knumber(data.chargeCodPrice || 0) - dis + adding)
      }
    }
    form.setFieldsValue({
      ...keys,
      totalPrice: dec2(totalPrice),
      totalPriceText: THBText(totalPrice),
    });
  };

  const df = (label, txt, type, postfix) => {
    const typeEnum = {
      green: "#d5f3db",
      blue: "#7596de",
      gray: "#f5f5f5",
    }

    // var bgcolor = "#F5F5F5"
    // if(type) {
    //   bgcolor = typeEnum[type]
    // }

    return <span style={{ display: "flex", fontFamily: "sans-serif", }}>{label && `${label} `}
      &nbsp;
      <span
        style={{
          fontFamily: "sans-serif",
          // flex: 1,
          border: "1px solid #eaeaea",
          backgroundColor: !type ? "#F5F5F5" : typeEnum[type],
          color: type === "blue" ? "white" : null,
          paddingLeft: 5,
          paddingRight: 5,
          height: 25,
          // marginLeft: 5,
          // width: 10,
          marginRight: postfix === "" ? 0 : postfix === "%" ? 5 : 5
        }}>{txt || "-"}
      </span>
      {postfix && <span style={{ fontFamily: "sans-serif", }} >{postfix}</span>}&nbsp;&nbsp;
    </span>
  }

  // function dec2(val) {
  //   return fnumber_format(val,2,".",",")
  // }

  if (true) {
    return (
      <>
        <div style={{
          paddingTop: 8,
          paddingBottom: 8,
          display: "grid",
          // border: "1px solid red",
          gridTemplateColumns: "1fr auto",
          height: 120
        }}>
          <div style={{
            paddingBottom: 8,
            padding: 5, display: "flex", flexDirection: "column",
            justifyContent: "center",

            // border: "1px blue solid"
          }}>
            <div style={{

              padding: 5, display: "flex", flexDirection: "row",
              justifyContent: "center", paddingBottom: 10,
              // height: 38,
              // border: "1px blue solid"
            }}>
              <div>
                <Form.Item
                  // labelCol={{ flex: "50px" }}
                  // wrapperCol={{ width: "100%" }}
                  style={{ display: 'none' }}
                  label={t('quantity')}
                  name="totalItem"
                >
                  <Input
                    size="small"
                    disabled
                    style={{
                      textAlign: "center",
                      // flex: 1,
                      // width: 40,
                      backgroundColor: '#D5F3DB',
                      color: '#535353',
                    }}
                  />
                </Form.Item>

                {/* <CodeSandboxOutlined style={{color: 'blue'}}/>
              <span style={{ fontFamily: "sans-serif", color: 'blue'}}>
              &nbsp;{form.getFieldsValue().totalItem}</span> &nbsp; */}
              </div>

              <div>
                <Form.Item
                  style={{ display: 'none' }}
                  label={t('weight')}
                  name="totalWeight"
                // style={{ marginBottom: 0 }}
                >
                  <Input
                    size="small"
                    disabled
                    style={{
                      backgroundColor: '#D5F3DB',
                      color: '#535353',
                    }}
                  />
                </Form.Item>

                {df(t('weight'), form.getFieldsValue().totalWeight, "green")}
              </div>

              <div>
                <Form.Item
                  style={{ display: 'none' }}
                  label={t('volume')}
                  name="totalVolume"
                  // style={{ marginBottom: 8 }}
                  extra={<div style={{ fontSize: '12px' }}>กxยxส</div>}
                >
                  <Input
                    size="small"
                    disabled
                    style={{ display: 'none' }}
                  />
                </Form.Item>
                {df(t('volume'), form.getFieldsValue().totalVolume, "green")}
              </div>

              <div>
                <Form.Item
                  style={{ display: 'none' }}
                  label={t('cod')}
                  name="totalCod"
                // style={{ marginBottom: 8 }}
                >
                  <Input
                    size="small"
                    disabled
                    style={{ display: 'none' }}
                  />
                </Form.Item>
                {df(t('cod'), form.getFieldsValue().totalCod, "green")}
              </div>

              <div>
                <Form.Item
                  style={{ display: 'none' }}
                  label={t('shipping-cost')}
                  name="totalTransportationPrice"
                // style={{ marginBottom: 8 }}
                >
                  <Input
                    size="small"
                    disabled
                    style={{ display: 'none' }}
                  />
                </Form.Item>
                {df(t('shipping-cost'), form.getFieldsValue().totalTransportationPrice, "green")}
              </div>

              <div>
                <Form.Item
                  style={{ display: 'none' }}
                  label={'Charge COD'}
                  name="totalChargeCodPrice"
                >
                  <Input
                    size="small"
                    disabled
                    style={{ display: 'none' }}
                  />
                </Form.Item>
                {df(t('Charge COD'), form.getFieldsValue().totalChargeCodPrice, "green")}
              </div>

            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
              }}>
              {/* <Row style={{ border: '0px red solid' }}> */}
              <Col xs={9}>
                <Form.Item
                  labelCol={{ xs: 5 }}
                  wrapperCol={{ xs: 24, lg: 16 }}
                  style={{ marginBottom: 0 }}
                  label={t('discount')}
                  name="discountText"
                >
                  <Input size="small" disabled={isCustomer} placeholder={t('discount')} />
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Form.Item
                  wrapperCol={{ xs: 24, lg: 16 }}
                  style={{ marginBottom: 0 }}
                  name="discountPercent"
                >
                  <Space>
                    <Select
                      size="small"
                      disabled={isCustomer}
                      onChange={(e) => {
                        calDiscount(e);
                        calTotalPrice();
                        setDisState(e);
                        dispatch(allAction.orderItemImportAction.setFormUpdate(form.getFieldsValue()))
                      }}
                      value={disState}
                    >
                      <Option value={0}>
                        <Text
                          style={!isMobile ? { width: 60 } : undefined}
                          ellipsis={!isMobile ? { tooltip: t('all-select') } : false}
                        >
                          {t('all-select')}
                        </Text>
                      </Option>
                      {agencyDiscountList && agencyDiscountList.map((item) => (
                        <Option
                          value={item}
                          key={item}
                        >
                          <Text
                            style={!isMobile ? { width: 80 } : undefined}
                            ellipsis={!isMobile ? { tooltip: item } : false}
                          >
                            {item}
                          </Text>
                        </Option>
                      ))}
                    </Select>
                    %
                  </Space>
                </Form.Item>

              </Col>
              <Col xs={3}>
                <Form.Item
                  // labelCol={{ xs: 12 }}
                  wrapperCol={{ xs: 24, lg: 20 }}
                  style={{ marginBottom: 0 }}
                  // label={t('remark')}
                  name="discountAmount"
                >
                  <Input
                    size="small"
                    disabled
                    style={{ color: '#535353' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={7} style={{ border: '0px blue solid' }}>
                <Form.Item
                  labelCol={{ xs: 16 }}
                  wrapperCol={{ xs: 24, lg: 18 }}
                  style={{ marginBottom: 0 }}
                  label={t('transport-price-discount')}
                  name="transportationPriceAfterDiscount"
                >
                  <Input
                    disabled
                    size="small"
                    style={{ color: '#535353' }}
                  />
                </Form.Item>
              </Col>
              {/* </Row> */}
            </div>

            <div
              style={{
                flex: 1
              }}>
              <Row>
                <Col xs={9}>
                  <Form.Item
                    labelCol={{ xs: 5 }}
                    wrapperCol={{ xs: 24, lg: 16 }}
                    style={{ marginBottom: 0 }}
                    label={t('added-part')}
                    name="morePriceText"
                  >
                    <Input size="small" disabled={isCustomer} placeholder={t('added-part')} />
                  </Form.Item>
                </Col>
                <Col xs={3}>
                  <Form.Item
                    // labelCol={{ xs: 12 }}
                    wrapperCol={{ xs: 24, lg: 20 }}
                    style={{ marginBottom: 0 }}
                    // label={t('remark')}
                    name="morePriceAmount"
                  >
                    <Input
                      size="small"
                      onKeyPress={(e) => {
                        isInputNumber(e);
                      }}
                      placeholder={t('more-price')}
                      onChange={calTotalPrice}
                      disabled={isCustomer}
                    />
                  </Form.Item>
                </Col>
                {/*  เงินอื่น ๆ */}
                <Col xs={9}>
                  <Form.Item
                    labelCol={{ xs: 5 }}
                    wrapperCol={{ xs: 24, lg: 16 }}
                    style={{ marginBottom: 0 }}
                    label={t('address-other')}
                    name="etc"
                  >
                    <Input size="small" disabled={isCustomer} placeholder={t('address-other')} />
                  </Form.Item>
                </Col>
                <Col xs={3}>
                  <Form.Item
                    labelCol={{ xs: 4 }}
                    wrapperCol={{ xs: 24, lg: 20 }}
                    style={{ marginBottom: 0 }}
                    // label={t('other-price')}

                    name="etcAmount"
                  >
                    <Input
                      size="small"
                      placeholder={t('other-price')}
                      disabled={isCustomer}
                      onChange={calTotalPrice}
                      onKeyPress={(e) => {
                        isInputNumber(e);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

            </div>

          </div>

          {/* ขวา */}
          <div style={{ display: 'grid', gridTemplateRows: "1fr auto" }}>
            <div style={{
              display: 'flex', flex: 1, backgroundColor: '#264B9B', justifyContent: "center", alignItems: "center",
              width: 160, marginBottom: 10
              // , flexDirection: 'row'
            }}>
              <div style={{}}>
                <Form.Item
                  // labelCol={{ xs: 3 }}
                  wrapperCol={{ display: 'flex', flex: 1, height: '100%' }}
                  style={{ display: 'flex', flex: 1, height: '100%', margin: 0 }}
                  // label={t('net-price')}
                  name="totalPrice"
                >

                  <Input
                    size="small"
                    disabled
                    // value={"90,000.00"}
                    style={{
                      borderColor: '#264B9B',
                      backgroundColor: '#264B9B',
                      color: '#fff',
                      // height: '60px',
                      // width: '151px',
                      textAlign: 'center',
                      fontSize: '30px',
                      fontWeight: 700,
                      // display: 'flex', flex: 1,
                      // height: '100%',
                      // padding: isMobile ? '5% 0' : '10% 0',
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: "center" }}>
                <Button
                  type="danger"
                  style={{ flex: 1 }}
                  icon={<CloseCircleOutlined />}
                  // disabled={!draftData.orderId}
                  onClick={onCancelOrder}
                  style={{ width: '30px' }}
                >
                  {/* {t('cancel-modal')} */}
                </Button>
                <Button
                  type="primary"
                  // htmlType="submit"
                  // disabled={true}
                  icon={<SaveOutlined />}
                  style={{ flex: 1, marginLeft: 10 }}
                  onClick={onFinish}
                // disabled={form.getFieldsValue()?.itemStoreSell?.some((val) => !val.transportationNetPrice)}

                >
                  {t('save')}
                </Button>

              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default FooterStoreSell;

// const r2 = (num) => {
//   if (num === null) {
//     num = 0.0
//   }
//   return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100
// }