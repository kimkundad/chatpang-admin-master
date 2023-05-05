/* eslint-disable */
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Space,
  InputNumber,
  message,
  Card,
  Modal,
  Select,
  Divider,
  Image,
  Descriptions
} from 'antd';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import {
  NumberOutlined, QrcodeOutlined,
} from '@ant-design/icons';

import ShowNo from "./showNO"

import allAction from '../../../../../app/actions';

import ButtonPrint from '../Printing/ButtonPrint';
import ButtonPrinting from '../Printing/ButtonPrinting';
import ItemStoreSellPostcode from "./ItemStoreSellPostcode"
import PrintSticker from "../Printing/PrintSticker"


const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const ItemCardEdit = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCode, setShowCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const masterTransportationType = useSelector((state) => state.storeSellReducer.masterTransportationType);

  const agencyCodList = useSelector((state) => state.storeSellReducer.agencyCodList);
  const parcelTypeData = useSelector((state) => state.storeSellReducer.parcelTypeData);


  // const { isMobile, isLoading } = useSelector((state) => state.mainReducer);

  const [isMobile, setIsMobile] = useState(false)
  const [whvKeying, setSetWhvKeying] = useState(false)


  const scrollToRef = () => myRef.current.scrollIntoView();
  const myRef = useRef(null);
  const keyinTimeout = useRef(null);

  const itemLayout = {
    xs: 24,
    sm: 12,
    lg: 3,
  };

  const formItemStyle = { marginBottom: 12 };
  const {
    showModal,
    showHeader,
    setShowHeader,
    shortSender,
    setKeying,
    setForm,
    field, index, fields, form,
    toRemoveAddress,
    callSubDistrict,
    callDistrict,
    isInputNumber,
    calVolumeItem,
    onSearchCustomer,
    checkTypeEx,
    calTransItemPressEnter,
    calTransItem,
    calChargeCod,
    calDiscount,
    calTotalPrice, calWeightItem, checkCOD
    , calCOD, filterDataTransType, getSticker,
    onClickItem,
    checkChangeValue,
    listProvince2, setListProvince2,
    cachePostcode, setCachePostcode,
    remove, add, itemStoreSell, chkChange,
    formX,
    length,
    caling, setCaling,
    orderId
  } = props;

  const printSticker = useRef();

  const volumeWaitKeyIn = (e, key) => {
    clearTimeout(keyinTimeout.current);

    setCaling(index)

    keyinTimeout.current = setTimeout(() => {
      try {
        calTransItem(e, key)
      } catch (e) {
        console.log("ERROR calTransItem(e, key)")
      }
    }, 1000);
  };

  const ItemCardEditRender = () => {
    return (
      <Card
        style={{
          margin: '2px',
          padding: 0,
          backgroundColor: '#F1F1F1',
        }}
        bodyStyle={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingRight: 20,
          paddingLeft: 20,
        }}
      >
        <div key={field.key}>
          <Row>
            <Col
              xs={24}
              style={{
                marginBottom: 6,
              }}
            >
              <ShowNo form={form} index={index} />
              {fields.length > 1 && (
                <Button
                  size="small"
                  type="primary"
                  danger
                  style={{
                    float: 'right',
                    width: '80px',
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    toRemoveAddress(remove, index, fields);
                  }}
                >
                  {t('delete')}
                </Button>
              )}
              <Button
                size="small"
                type="primary"
                style={{
                  float: 'right',
                  marginRight: 10,
                  marginBottom: 6,
                  width: '80px',
                  fontSize: '12px',
                }}
                disabled={
                  !form.getFieldValue('itemStoreSell')[index]
                    .recipientNo
                }
                onClick={() => {
                  dispatch(
                    allAction.storeSellAction.setActionModal(
                      'view'
                    )
                  );
                  showModal('change-address', index);
                }}
              >
                {t('change-address')}
              </Button>
              <PrintSticker
                cachePostcode={cachePostcode}
                componentRef={printSticker}
                index={index}
                form={form}
                field={field}
                fieldKey={field.key}>
              </PrintSticker>
              <ButtonPrinting
                componentRef={printSticker}
                size="small"
                type="primary"
                disabled={
                  !form.getFieldValue('itemStoreSell')[index]
                    .recipientNo
                }
                style={{
                  float: 'right',
                  marginRight: 10,
                  marginBottom: 6,
                  width: '110px',
                  fontSize: '12px',
                }}
                icon={<QrcodeOutlined />}
              >{t('sticker')}</ButtonPrinting>
            </Col>
          </Row>
          <Row>
            <Col flex="1 1 80px">
              <Form.Item
                style={{ marginBottom: 1 }}
                label={t('no')}
                labelCol={{ xs: 6 }}
                wrapperCol={{ xs: 24 }}
                name={[index, 'doNo']}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'doNo']}
              >
                <Input
                  size="small"
                  disabled
                  className="field_id"
                />
              </Form.Item>
            </Col>
            <Col flex="1 1 150px" xs={12}>
              <Form.Item
                label={t('phone')}
                name={[index, 'recipientInput']}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'customerName']}
                labelCol={{ xs: 13 }}
                wrapperCol={{ xs: 15 }}
                style={{ marginBottom: 1 }}
                rules={[
                  {
                    required: true,
                    message: 'Please input phone!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (
                        !value ||
                        value.length === 10 ||
                        value.length === 9
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'Please Input Phone Number Length 9-10 Digits!'
                      );
                    },
                  }),
                ]}
              >
                <Input
                  size="small"
                  onChange={(e) =>
                    onSearchCustomer(e.target.value, field.name)
                  }
                  onKeyPress={(e) => {
                    isInputNumber(e);
                  }}
                  maxLength={10}
                />
              </Form.Item>
            </Col>
            <Col flex="1 1 280px" >
              <Form.Item
                label={t('package-type')}
                name={[index, 'parcelTypeId']}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'parcelTypeId']}
                labelCol={{ xs: 7 }}
                wrapperCol={{ xs: 16 }}
                style={{ marginBottom: 1 }}
                rules={[
                  {
                    required: true,
                    message: 'Please input your package type!',
                  },
                ]}
              >
                <Select
                  size="small"
                  defaultValue={t('please-select')}
                  onChange={(e) =>
                    console.log('e', e, parcelTypeData)
                  }
                >
                  <Option value="">
                    <Text
                      className="pos_select"
                      ellipsis={
                        !isMobile
                          ? { tooltip: t('please-select') }
                          : false
                      }
                    >
                      {t('please-select')}
                    </Text>
                  </Option>
                  {parcelTypeData &&
                    parcelTypeData.map((item) => (
                      <Option
                        value={item.parcelTypeId}
                        key={item.parcelTypeId}
                      >
                        <Text
                          className="pos_select"
                          ellipsis={
                            !isMobile
                              ? { tooltip: item.category }
                              : false
                          }
                        >
                          {item.category}
                        </Text>
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col flex="1 1 70px" xs={12}>
              <Form.Item
                label={t('agency-fistname')}
                name={[index, 'recipientName']}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'recipientName']}
                labelCol={{ xs: 7 }}
                wrapperCol={{ xs: 24 }}
                style={{ marginBottom: 1 }}
                rules={[
                  {
                    required: true,
                    message: 'Please input your first name!',
                  },
                ]}
              >
                <Input
                  size="small"
                  onKeyDown={(e) =>
                    checkChangeValue(e, field.name, remove)
                  }
                />
              </Form.Item>
            </Col>
            <Col flex="1 1 90px" xs={12}>
              <Form.Item
                label={t('agency-lastname')}
                name={[index, 'recipientLastName']}
                fieldKey={[field.fieldKey, 'recipientLastName']}
                labelCol={{ xs: 11 }}
                wrapperCol={{ xs: 24 }}
                style={{ marginBottom: 1 }}
              >
                <Input
                  size="small"
                  onKeyDown={(e) =>
                    checkChangeValue(e, field.name, remove)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={6} lg={3}>
              <Form.Item
                style={{ ...formItemStyle, marginBottom: 1 }}
                labelCol={{ xs: 10 }}
                wrapperCol={{ xs: 24 }}
                label={t('address-number')}
                name={[index, 'recipientNo']}
                rules={[
                  {
                    required: true,
                    message: 'Please input Address Number!',
                  },
                ]}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'recipientNo']}
              >
                <Input
                  size="small"
                  autocomplete="new-password"
                  onKeyDown={(e) =>
                    checkChangeValue(e, field.name, remove)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={6} lg={3}>
              <Form.Item
                style={{ ...formItemStyle, marginBottom: 1 }}
                labelCol={{ xs: 10 }}
                wrapperCol={{ xs: 24 }}
                label={t('address-village')}
                name={[index, 'recipientMoo']}
                fieldKey={[field.fieldKey, 'recipientMoo']}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input
                  size="small"
                  autocomplete="new-password"
                  onKeyDown={(e) =>
                    checkChangeValue(e, field.name, remove)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={{ ...formItemStyle, marginBottom: 1 }}
                label={t('address-lane')}
                name={[index, 'recipientAlley']}
                fieldKey={[field.fieldKey, 'recipientAlley']}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input
                  size="small"
                  autocomplete="new-password"
                  onKeyDown={(e) =>
                    checkChangeValue(e, field.name, remove)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={{ ...formItemStyle, marginBottom: 1 }}
                label={t('address-road')}
                name={[index, 'recipientRoad']}
                fieldKey={[field.fieldKey, 'recipientRoad']}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input
                  size="small"
                  autocomplete="new-password"
                  onKeyDown={(e) =>
                    checkChangeValue(e, field.name, remove)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Item
                style={{ ...formItemStyle, marginBottom: 1 }}
                label={t('address-other')}
                name={[index, 'recipientOther']}
                fieldKey={[field.fieldKey, 'recipientOther']}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input
                  size="small"
                  autocomplete="new-password"
                  onKeyDown={(e) =>
                    checkChangeValue(e, field.name, remove)
                  }
                />
              </Form.Item>
            </Col>

            <ItemStoreSellPostcode
              hasBanArea={hasBanArea}
              form={form}
              index={index}
              fieldKey={field.fieldKey}
              field={field}
              itemStoreSell={itemStoreSell}
              phone={form.getFieldsValue()?.itemStoreSell[index]?.recipientInput}
              listProvince2={listProvince2}
              setListProvince2={setListProvince2}
              checkChangeValue={checkChangeValue}
              calTransItem={calTransItem}
              cachePostcode={cachePostcode}
              setCachePostcode={setCachePostcode}
              setForm={setForm}
              remove={remove}
            />
          </Row>

          <Row>
            <table
              style={{
                width: '100%',
              }}
            ><tr>
                <td style={{ minWidth: "120px" }}>
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      style={{ marginBottom: 1, flex: 1 }}
                      label={t('weight')}
                      wrap={false}
                      labelCol={{ flex: "60px" }}
                      name={[index, 'weight']}
                      validateTrigger={['onBlur', 'onChange']}
                      fieldKey={[field.fieldKey, 'weight']}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your weight!',
                        },
                      ]}
                    >
                      <InputNumber
                        size="small"
                        style={{ width: '100%' }}
                        onKeyPress={(event) => {
                          calTransItemPressEnter(event, field.name);
                        }}
                        onBlur={(event) => {
                        }}
                        onChange={(e) => {
                          chkChange.current = true
                          volumeWaitKeyIn(event, field.name);
                          calWeightItem(e, field.name);
                        }}
                      />
                    </Form.Item>
                  </div>
                </td>
                <td >
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      label={t('wide')}
                      wrap={false}
                      labelCol={{ flex: "60px" }}
                      name={[index, 'width']}
                      validateTrigger={['onBlur', 'onChange']}
                      fieldKey={[field.fieldKey, 'width']}

                      style={{ marginBottom: 1, flex: 1 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your wide!',
                        },
                      ]}
                    >
                      <InputNumber
                        size="small"
                        style={{ width: "100%" }}
                        onKeyPress={(event) => {
                          calTransItemPressEnter(event, field.name);
                        }}
                        onBlur={(event) => {
                        }}
                        onChange={(e) => {
                          chkChange.current = true
                          volumeWaitKeyIn(event, field.name);
                          calVolumeItem(e, field.name);
                        }}
                      />
                    </Form.Item>
                  </div>
                </td>
                <td >
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      label={t('long')}
                      name={[index, 'length']}
                      validateTrigger={['onBlur', 'onChange']}
                      fieldKey={[field.fieldKey, 'length']}
                      wrap={false}
                      labelCol={{ flex: "50px" }}
                      style={{ marginBottom: 1, flex: 1 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your first long!',
                        },
                      ]}
                    >
                      <InputNumber
                        size="small"
                        style={{ width: "100%" }}
                        onKeyPress={(event) => {
                          calTransItemPressEnter(event, field.name);
                        }}
                        onBlur={(event) => {
                        }}
                        onChange={(e) => {
                          chkChange.current = true
                          volumeWaitKeyIn(event, field.name);
                          calVolumeItem(e, field.name);
                        }}
                      />
                    </Form.Item>
                  </div>
                </td>
                <td >
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      label={t('high')}
                      name={[index, 'height']}
                      validateTrigger={['onBlur', 'onChange']}
                      fieldKey={[field.fieldKey, 'height']}
                      wrap={false}
                      labelCol={{ flex: "45px" }}
                      style={{ marginBottom: 1, flex: 1 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your high!',
                        },
                      ]}
                    >
                      <InputNumber
                        size="small"
                        style={{ width: "100%" }}
                        onKeyPress={(event) => {
                          calTransItemPressEnter(event, field.name);
                        }}
                        onBlur={(event) => {
                        }}
                        onChange={(e) => {
                          chkChange.current = true
                          // resetSumTran(field.name)
                          volumeWaitKeyIn(event, field.name);
                          calVolumeItem(e, field.name);
                        }}
                      />
                    </Form.Item>
                  </div></td>
                <td style={{ minWidth: "150px" }}>
                  <div style={{ display: 'flex', alignItems: "center" }}>
                    <Form.Item
                      label={t('type')}
                      name={[index, 'transportationTypeCode']}
                      validateTrigger={['onBlur', 'onChange']}
                      fieldKey={[
                        field.fieldKey,
                        'transportationTypeCode',
                      ]}
                      wrap={false}
                      labelCol={{ flex: "55px" }}
                      style={{ marginBottom: 1, flex: 1 }}
                      rules={[
                        {
                          required: true,
                          message:
                            'Please input your transportationTypeCode!',
                        },
                      ]}
                    >
                      <Select
                        size="small"
                        defaultValue={t('please-select')}
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          filterDataTransType(value, field.name);
                          checkTypeEx();
                        }}
                      >
                        {masterTransportationType &&
                          masterTransportationType.map((item) => (
                            <Option
                              value={item.transportationTypeCode}
                              key={item.transportationTypeCode}
                            >
                              <Text className="pos_select">
                                {item.transportationTypeName}
                              </Text>
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>
                </td>
                <td style={{ minWidth: "100px" }}>
                  <div style={{ display: 'flex', }}>
                    <Form.Item
                      label={t('cod')}
                      name={[index, 'cod']}
                      validateTrigger={['onBlur', 'onChange']}
                      fieldKey={[field.fieldKey, 'cod']}
                      wrap={false}
                      labelCol={{ flex: "65px" }}
                      style={{ marginBottom: 1, flex: 1 }}

                      rules={[
                        {
                          required: true,
                          message: 'Please input COD!',
                        },
                      ]}
                    >
                      <InputNumber
                        size="small"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          checkCOD(e, field.name);
                        }}
                        disabled={
                          form.getFieldValue().itemStoreSell[field.name]
                            .transportationTypeCode === 'EX'
                        }
                      />
                    </Form.Item>
                  </div></td>

                <td style={{ minWidth: "130px" }}>
                  <div style={{
                    display: 'flex', alignItems: "center"
                  }}>

                    <Form.Item
                      label={t('rate')}
                      name={[index, 'ratePercent']}
                      validateTrigger={['onBlur', 'onChange']}
                      fieldKey={[field.fieldKey, 'ratePercent']}
                      wrap={false}
                      labelCol={{ flex: "60px" }}
                      style={{ marginBottom: 1, flex: 1 }}
                      rules={[
                        {
                          required: true,
                          message: 'Please input COD Rate!',
                        },
                      ]}
                    >
                      <Select
                        size="small"
                        defaultValue={0}
                        className="pos_form"
                        onChange={(e) => {
                          checkCOD(e, field.name);
                          calChargeCod(field.name);
                        }}
                        disabled={
                          form.getFieldValue().itemStoreSell[field.name]
                            .transportationTypeCode === 'EX'
                        }
                      >
                        {agencyCodList &&
                          agencyCodList.map((item) => (
                            <Option value={item} key={item}>
                              <Text
                                className="pos_select"
                              // style={
                              //   !isMobile ? { width: 90 } : undefined
                              // }
                              // ellipsis={
                              //   !isMobile ? { tooltip: item } : false
                              // }
                              >
                                {item}
                              </Text>
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div></td>
              </tr>
            </table>
          </Row>
          <Row>
            <Col xs={24} md={9}>
              <Form.Item
                style={{ marginBottom: 1 }}
                label={t('remark')}
                labelCol={{ xs: 5 }}
                wrapperCol={{ xs: 24 }}
                name={[index, 'remark']}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'remark']}
              >
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                style={{ marginBottom: 1 }}
                label={t('shipping-cost')}
                labelCol={{ xs: 11 }}
                wrapperCol={{ xs: 24 }}
                hasFeedback={true}
                validateStatus={
                  caling == index ? 'validating' : ''
                }
                name={[index, 'transportationPrice']}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'transportationPrice']}
              >
                <Input
                  size="small"
                  disabled
                  style={{
                    backgroundColor: '#D5F3DB',
                    color: 'black',
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                style={{ marginBottom: 1 }}
                label={t('charge-cod-price')}
                labelCol={{ xs: 14 }}
                wrapperCol={{ xs: 24 }}
                hasFeedback={true}
                validateStatus={
                  caling == index ? 'validating' : ''
                }
                name={[index, 'chargeCodPrice']}
                validateTrigger={['onBlur', 'onChange']}
                fieldKey={[field.fieldKey, 'chargeCodPrice']}
              >
                <Input
                  size="small"
                  disabled
                  style={{
                    backgroundColor: '#D5F3DB',
                    color: 'black',
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={5}>
              <Form.Item
                style={{ marginBottom: 1 }}
                label={t('sum')}
                labelCol={{ xs: 10 }}
                wrapperCol={{ xs: 24 }}
                name={[index, 'transportationNetPrice']}
                validateTrigger={['onBlur', 'onChange']}
                hasFeedback={true}
                validateStatus={
                  caling == index ? 'validating' : ''
                }
                fieldKey={[
                  field.fieldKey,
                  'transportationNetPrice',
                ]}
              >
                <Input
                  size="small"
                  disabled
                  style={{
                    backgroundColor: '#7596DE',
                    color: '#ffff',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Card>
    )
  }


  useEffect(() => {
    dispatch(allAction.storeSellAction.setItemCount(form.getFieldsValue()?.itemStoreSell?.length))
  }, [form.getFieldsValue()?.itemStoreSell?.length])

//   const memoItemCard = useMemo(() => {
//     console.log("Render ItemCard2", itemStoreSell.doNo)
//     console.log("ItemCard2 Index ", index)
//     console.log("ItemCard2 recipientProvinceName,", itemStoreSell)
//     if (isEditing)
//       return ItemCardEdit()
//     else {
//       return ItemCardView()
//     }
//   }, [
//     isEditing,
//     caling,
//     form.getFieldsValue().totalPrice,
//     itemStoreSell.doNo,
//     itemStoreSell.recipientInput,
//     itemStoreSell.recipientPostcode,
//     itemStoreSell.recipientProvinceId,
//     itemStoreSell.recipientSubdistrictId,
//     itemStoreSell.recipientDistrictId,
//     itemStoreSell.recipientProvinceName,
//     itemStoreSell.ratePercent,
//   ]);

  return ItemCardEditRender()
};


export default ItemCardEdit;


const r2 = (num) => {
  if (num === null) {
    num = 0.0
  }
  return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100
}