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

const ItemCardView = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCode, setShowCode] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
  // const {
  //   masterTransportationType,
  //   draftData,
  //   orderDetail,
  //   orderDetail,
  //   agencyCodList,
  //   parcelTypeData,
  // } = useSelector((state) => state.storeSellReducer);

  const masterTransportationType = useSelector((state) => state.storeSellReducer.masterTransportationType);

  const agencyCodList = useSelector((state) => state.storeSellReducer.agencyCodList);
  const parcelTypeData = useSelector((state) => state.storeSellReducer.parcelTypeData);


  // const { isMobile, isLoading } = useSelector((state) => state.mainReducer);

  const [isMobile, setIsMobile] = useState(false)
  const [whvKeying, setSetWhvKeying] = useState(false)


  // const { companyId, hubId, agencyId, userLevel, isCustomer } = useSelector(
  //   (state) => state.authenReducer
  // );

  // const userLevel = useSelector((state) => state.authenReducer.userLevel);

  // const [caling, setCaling] = useState(-1);

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
    hasBanArea,
    setIsEditing
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



  const ItemCardViewRender = () => {
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
        {memoNotSum}
        {memoSum}
        
      </Card>
 
    )
  }

  const memoNotSum = useMemo(() => {
    console.log("Render memoNotSum")
      return <>
      <div
        style={{
          marginBottom: 20
        }}
      >
        <ShowNo form={form} index={index} />
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
        <Button
          size="small"
          type="primary"
          // danger
          style={{
            width: '80px',
            fontSize: '12px',
            float: 'right',
            marginRight: 10,
          }}
          onClick={() => {
            setIsEditing(true)
          }}
        >
          {t('edit')}
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

      </div>
      <Descriptions size="small" column={5}
        labelStyle={{ fontFamily: 'sans-serif' }}
        contentStyle={{
          fontFamily: 'sans-serif',
        }}
      >
        <Descriptions.Item label={t('no')}>
          <Input
            className="field_id"
            style={{
              paddingLeft: 10,
              paddingRight: 10
            }}
            size="small" disabled value={itemStoreSell?.doNo || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('phone')}>
          <Input size="small" disabled value={itemStoreSell?.recipientInput || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('package-type')}>
          {console.log("parcelTypeData", parcelTypeData)}
          {/* {parcelTypeData.find(o => o.parcelTypeId == itemStoreSell?.parcelTypeId)} */}
          <Input size="small" disabled value={itemStoreSell?.parcelTypeId && parcelTypeData.find(o => o.parcelTypeId == itemStoreSell?.parcelTypeId)?.category || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('agency-fistname')}>
          <Input size="small" disabled value={itemStoreSell?.recipientName || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('agency-lastname')}>
          <Input size="small" disabled value={itemStoreSell?.recipientLastName || '-'} />
        </Descriptions.Item>
      </Descriptions>
      <Descriptions size="small" column={5}
        labelStyle={{ fontFamily: 'sans-serif' }}
        contentStyle={{ fontFamily: 'sans-serif' }}
      >
        <Descriptions.Item label={t('no')}>
          <Input size="small" disabled value={itemStoreSell?.recipientNo || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('address-village')}>
          <Input size="small" disabled value={itemStoreSell?.recipientMoo || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('address-lane')}>
          <Input size="small" disabled value={itemStoreSell?.recipientAlley || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('address-road')}>
          <Input size="small" disabled value={itemStoreSell?.recipientRoad || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('address-other')}>
          <Input size="small" disabled value={itemStoreSell?.recipientOther || '-'} />
        </Descriptions.Item>
      </Descriptions>
      <Descriptions size="small" column={5}
        labelStyle={{ fontFamily: 'sans-serif' }}
        contentStyle={{ fontFamily: 'sans-serif' }}
      >
        <Descriptions.Item label={t('postcode')}>
          <Input size="small" disabled value={itemStoreSell?.recipientPostcode || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('subdistrict')}>
          <Input size="small" disabled value={itemStoreSell?.recipientSubdistrictName || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('district')}>
          <Input size="small" disabled value={itemStoreSell?.recipientDistrictName || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('province')}>
          <Input size="small" disabled value={itemStoreSell?.recipientProvinceName || '-'} />
        </Descriptions.Item>
      </Descriptions>
      <Descriptions size="small" column={7}
        labelStyle={{ fontFamily: 'sans-serif' }}
        contentStyle={{ fontFamily: 'sans-serif' }}
      >
        <Descriptions.Item label={t('weight')}>
          <Input size="small" disabled value={itemStoreSell?.weight || 0} />
        </Descriptions.Item>
        <Descriptions.Item label={t('wide')}>
          <Input size="small" disabled value={itemStoreSell?.width || 0} />
        </Descriptions.Item>
        <Descriptions.Item label={t('long')}>
          <Input size="small" disabled value={itemStoreSell?.length || 0} />
        </Descriptions.Item>
        <Descriptions.Item label={t('high')}>
          <Input size="small" disabled value={itemStoreSell?.height || 0} />
        </Descriptions.Item>
        <Descriptions.Item label={t('type')}>
          <Input size="small" disabled value={itemStoreSell?.transportationTypeCode || 'EX'} />
        </Descriptions.Item>
        <Descriptions.Item label={t('cod')}>
          <Input size="small" disabled value={itemStoreSell?.cod || 0} />
        </Descriptions.Item>
        <Descriptions.Item label={t('rate')}>
          <Input size="small" disabled value={itemStoreSell?.ratePercent || 0} />
          %</Descriptions.Item>
      </Descriptions>
      </>
  }, [itemStoreSell.doNo])

  const memoSum = useMemo(() => {
      console.log("Render memoSum")
      return <Descriptions size="small" column={5}
      labelStyle={{ fontFamily: 'sans-serif' }}
      contentStyle={{ fontFamily: 'sans-serif' }}
    >
      <Descriptions.Item label={t('remark')} span={2}>
        <Input size="small" disabled value={itemStoreSell?.remark || '-'} />
      </Descriptions.Item>
      <Descriptions.Item label={t('shipping-cost')}>

        <Input style={{
          backgroundColor: '#D5F3DB',
          color: 'black',
          paddingLeft: 10,
          paddingRight: 10
        }} size="small" disabled value={itemStoreSell?.transportationPrice || 0.00} />
      </Descriptions.Item>
      <Descriptions.Item label={t('charge-cod-price')}>
        <Input style={{
          backgroundColor: '#D5F3DB',
          color: 'black',
          paddingLeft: 10,
          paddingRight: 10
        }} size="small" disabled value={itemStoreSell?.chargeCodPrice || 0.00} />
      </Descriptions.Item>
      <Descriptions.Item label={t('sum')}>
        <Input style={{
          backgroundColor: '#7596DE',
          color: '#ffff',
          paddingLeft: 10,
          paddingRight: 10,
        }} size="small" disabled value={itemStoreSell?.transportationNetPrice || 0.00} />
      </Descriptions.Item>
    </Descriptions>
  }, [
    caling,
    form.getFieldsValue().totalPrice,
    itemStoreSell.doNo,
    itemStoreSell.ratePercent
    ])

  return ItemCardViewRender()
};


export default ItemCardView;


const r2 = (num) => {
  if (num === null) {
    num = 0.0
  }
  return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100
}