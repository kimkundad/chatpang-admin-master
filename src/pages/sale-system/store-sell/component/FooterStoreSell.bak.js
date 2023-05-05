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

  const calDiscount = (value) => {
    const keys = form.getFieldsValue();
    const disPer = Number(value || 0) / 100;
    const totalTransportationPrice = Number(keys.totalTransportationPrice || 0);
    const discountAmount = totalTransportationPrice * disPer || 0;
    const transportationPriceAfterDiscount = totalTransportationPrice - discountAmount;
    // console.log('item', keys.itemStoreSell);
    const items = keys.itemStoreSell;
    if (items && items.length > 0) {
      for (const data of items) {
        const dis = disPer * Number(data?.transportationPrice || 0);

        data.transportationNetPrice = (Number(data.transportationPrice || 0) + Number(data.chargeCodPrice || 0) - dis).toFixed(2);
      }
    }
    form.setFieldsValue({
      ...keys,
      discountPercent: value,
      discountAmount: discountAmount.toFixed(2),
      transportationPriceAfterDiscount: transportationPriceAfterDiscount.toFixed(2),
    });
    // console.log('value', form.getFieldsValue('itemSellStore'), totalTransportationPrice, discountAmount, transportationPriceAfterDiscount);
  };

  const calTotalPrice = () => {
    const keys = form.getFieldsValue();
    const etcAmount = Number(keys.etcAmount || 0);
    const morePriceAmount = Number(keys.morePriceAmount || 0);
    const totalChargeCodPrice = Number(keys.totalChargeCodPrice || 0);
    const transportationPriceAfterDiscount = Number(keys.transportationPriceAfterDiscount || 0);
    const totalPrice = etcAmount + morePriceAmount + totalChargeCodPrice + transportationPriceAfterDiscount;
    const items = keys.itemStoreSell;
    if (items && items.length > 0) {
      const adding = (Number(etcAmount || 0) + Number(morePriceAmount || 0)) / items.length;

      for (const data of items) {
        const dis = Number(keys?.discountPercent ? keys?.discountPercent / 100 : 0) * Number(data?.transportationPrice || 0);
        data.transportationNetPrice = (Number(data.transportationPrice || 0) + Number(data.chargeCodPrice || 0) - dis + adding).toFixed(2);
      }
    }
    form.setFieldsValue({
      ...keys,
      totalPrice: totalPrice.toFixed(2),
      totalPriceText: THBText(totalPrice),
    });
  };
  if (true) {
    return (
      <>
        <Row gutter={24} align="top" style={{ margin: 0, border: '0px blue solid' }}>
          <Col
            // xs={24}
            flex="auto"
            style={{
              margin: 0, padding: 0, border: '0px blue solid', paddingRight: 0,
            }}
          >
            <div style={{
              display: 'flex', margin: 0, padding: 0, border: '0px blue solid', alignItems: 'center',
            }}
            >
              <Row style={{ width: 770, margin: 'auto', border: '0px blue solid' }}>
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
                <Col flex="110px">
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
                        width: 50,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col flex="140px">
                  <Form.Item
                    labelCol={{ flex: '70px' }}
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
                        width: 50,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col flex="120px">
                  <Form.Item
                    labelCol={{ flex: '50px' }}
                    // wrapperCol={{ xs: 24 }}
                    label={t('cod')}
                    name="totalCod"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 50,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col flex="130px">
                  <Form.Item
                    labelCol={{ flex: '60px' }}
                    // wrapperCol={{ xs: 24 }}
                    label={t('shipping-cost')}
                    name="totalTransportationPrice"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 50,
                        backgroundColor: '#D5F3DB',
                        color: '#535353',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col flex="160px">
                  <Form.Item
                    labelCol={{ flex: '110px' }}
                    wrapperCol={{ xs: 24 }}
                    label={t('charge-cod-price')}
                    name="totalChargeCodPrice"
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      size="small"
                      disabled
                      style={{
                        width: 50,
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
                      style={{ width: 60, backgroundColor: '#7596DE', color: '#ffff' }}
                    />
                  </Form.Item>
                </Col> */}
              </Row>

            </div>

            <Row style={{ border: '0px red solid' }}>
              <Col xs={9}>
                <Form.Item
                  labelCol={{ xs: 5 }}
                  wrapperCol={{ xs: 24, lg: 16 }}
                  style={{ marginBottom: 8 }}
                  label={t('discount')}
                  name="discountText"
                >
                  <Input size="small" placeholder={t('discount')} />
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Form.Item
                  wrapperCol={{ xs: 24, lg: 16 }}
                  style={{ marginBottom: 8 }}
                  name="discountPercent"
                >
                  <Space>
                    <Select
                      size="small"
                      onChange={(e) => {
                        calDiscount(e);
                        calTotalPrice();
                        setDisState(e);
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
                  style={{ marginBottom: 8 }}
                  // label={t('remark')}
                  name="discountAmount"
                >
                  <Input
                    size="small"
                    disabled
                    style={{ backgroundColor: '#ffff', color: '#535353' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={7} style={{ border: '0px blue solid' }}>
                <Form.Item
                  labelCol={{ xs: 16 }}
                  wrapperCol={{ xs: 24, lg: 18 }}
                  style={{ marginBottom: 8 }}
                  label={t('transport-price-discount')}
                  name="transportationPriceAfterDiscount"
                >
                  <Input
                    disabled
                    size="small"
                    style={{ backgroundColor: '#ffff', color: '#535353' }}
                  />
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
                  <Input size="small" disabled={isCustomer} placeholder={t('added-part')} />
                </Form.Item>
              </Col>
              <Col xs={3}>
                <Form.Item
                  // labelCol={{ xs: 12 }}
                  wrapperCol={{ xs: 24, lg: 20 }}
                  style={{ marginBottom: 8 }}
                  // label={t('remark')}
                  name="morePriceAmount"
                >
                  <Input
                    size="small"
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
                  style={{ marginBottom: 8 }}
                  label={t('address-other')}
                  name="etc"
                >
                  <Input size="small"  disabled={isCustomer} placeholder={t('address-other')} />
                </Form.Item>
              </Col>
              <Col xs={3}>
                <Form.Item
                  labelCol={{ xs: 4 }}
                  wrapperCol={{ xs: 24, lg: 20 }}
                  style={{ marginBottom: 8 }}
                  // label={t('other-price')}
                  
                  name="etcAmount"
                >
                  <Input
                    size="small"
                    placeholder={t('other-price')}
                    disabled={isCustomer}
                    onChange={calTotalPrice}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row>
              <Col xs={9}>
                <Form.Item
                  labelCol={{ xs: 5 }}
                  wrapperCol={{ xs: 24, lg: 16 }}
                  style={{ marginBottom: 8 }}
                  label={t('address-other')}
                  name="etc"
                >
                  <Input size="small" placeholder={t('address-other')} />
                </Form.Item>
              </Col>
              <Col xs={3}>
                <Form.Item
                  labelCol={{ xs: 4 }}
                  wrapperCol={{ xs: 24, lg: 20 }}
                  style={{ marginBottom: 8 }}
                  // label={t('other-price')}
                  name="etcAmount"
                >
                  <Input
                    size="small"
                    placeholder={t('other-price')}
                    onChange={calTotalPrice}
                  />
                </Form.Item>
              </Col>
              <Col xs={11} style={{ border: '0px red solid' }}>
                <Form.Item
                  labelCol={{ lg: 6 }}
                  wrapperCol={{ lg: 18 }}
                  style={{ marginBottom: 8 }}
                  label={t('remark')}
                  name="remark"
                >
                  <Input size="small" placeholder={t('remark')} />
                </Form.Item>
              </Col>
            </Row> */}

          </Col>
          <Col flex="100px" style={{ margin: 'auto', border: '0px red solid' }}>
            {/* ราคาสุทธิของใบเสร็จ */}
            <Form.Item
              labelCol={{ xs: 3 }}
              wrapperCol={{ xs: 24, lg: 21 }}
              style={{ marginBottom: 8 }}
              // label={t('net-price')}
              name="totalPrice"
            >

              <Input
                size="small"
                disabled
                style={{
                  backgroundColor: '#264B9B',
                  color: '#fff',
                  height: '60px',
                  width: '151px',
                  textAlign: 'center',
                  fontSize: '30px',
                  fontWeight: 700,
                  // padding: isMobile ? '5% 0' : '10% 0',
                }}
              />
            </Form.Item>
            <div style={{ display: 'flex' }}>
              <Button
                type="danger"
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
                style={{ width: '110px', marginLeft: 10 }}
                onClick={onFinish}
              // disabled={form.getFieldsValue()?.itemStoreSell?.some((val) => !val.transportationNetPrice)}

              >
                {t('save')}
              </Button>

            </div>
          </Col>
        </Row>

      </>
    );
  }
  return (
    <>
      {/* <Row>
        <Col xs={24}>
          <Form.Item
            labelCol={{ xs: 4, lg: 0 }}
            wrapperCol={{ xs: 24, lg: 24 }}
            style={{ marginBottom: 8 }}
            label={t('remark')}
            name="remark"
          >
            <Input.TextArea size="small" placeholder={t('remark')} />
          </Form.Item>
        </Col>
      </Row> */}
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
                <Input size="small" placeholder={t('discount')} />
              </Form.Item>
            </Col>
            <Col xs={4}>

              <Form.Item
                // labelCol={{ xs: 12 }}
                wrapperCol={{ xs: 24, lg: 16 }}
                style={{ marginBottom: 8 }}
                // label={t('remark')}
                name="discountPercent"
              >
                <Space>
                  <Select
                    size="small"
                    defaultValue={0}
                    onChange={(e) => {
                      calDiscount(e);
                      calTotalPrice();
                    }}
                  >
                    <Option value={0}>
                      <Text
                        style={!isMobile ? { width: 70 } : undefined}
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
                          style={!isMobile ? { width: 90 } : undefined}
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
                style={{ marginBottom: 8 }}
                // label={t('remark')}
                name="discountAmount"
              >
                <Input
                  size="small"
                  placeholder={t('discount')}
                  disabled
                  style={{ backgroundColor: '#ffff', color: '#535353' }}
                />
              </Form.Item>
            </Col>
            <Col xs={7}>
              <Form.Item
                labelCol={{ xs: 16 }}
                wrapperCol={{ xs: 24, lg: 18 }}
                style={{ marginBottom: 8 }}
                label={t('transport-price-discount')}
                name="transportationPriceAfterDiscount"
              >
                <Input
                  disabled
                  size="small"
                  placeholder={t('transport-price-discount')}
                  style={{ backgroundColor: '#ffff', color: '#535353' }}
                />
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
                <Input size="small" placeholder={t('added-part')} />
              </Form.Item>
            </Col>
            <Col xs={4} />
            <Col xs={3}>
              <Form.Item
                // labelCol={{ xs: 12 }}
                wrapperCol={{ xs: 24, lg: 20 }}
                style={{ marginBottom: 8 }}
                // label={t('remark')}
                name="morePriceAmount"
              >
                <Input
                  size="small"
                  placeholder={t('more-price')}
                  onChange={calTotalPrice}
                />
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
                <Input size="small" placeholder={t('address-other')} />
              </Form.Item>
            </Col>
            <Col xs={4} />
            <Col xs={3}>
              <Form.Item
                labelCol={{ xs: 4 }}
                wrapperCol={{ xs: 24, lg: 20 }}
                style={{ marginBottom: 8 }}
                // label={t('other-price')}
                name="etcAmount"
              >
                <Input
                  size="small"
                  placeholder={t('other-price')}
                  onChange={calTotalPrice}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Form.Item
                labelCol={{ xs: 2 }}
                wrapperCol={{ xs: 24, lg: 21 }}
                style={{ marginBottom: 8 }}
                label={t('remark')}
                name="remark"
              >
                <Input.TextArea size="small" placeholder={t('remark')} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                labelCol={{ xs: 3 }}
                wrapperCol={{ xs: 24, lg: 20 }}
                style={{ marginBottom: 8 }}
                label={t('net-price')}
                name="totalPriceText"
              >
                <Input
                  size="small"
                  placeholder={t('net-price')}
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
            // label={t('net-price')}
            name="totalPrice"
          >

            <Input
              size="small"
              // placeholder={t('net-price')}
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
    </>
  );
};

export default FooterStoreSell;
