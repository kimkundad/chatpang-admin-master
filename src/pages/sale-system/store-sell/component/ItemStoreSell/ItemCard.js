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
import ItemCardEdit from "./ItemCardEdit"
import ItemCardView from "./ItemCardView"


const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const ItemCard = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCode, setShowCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
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

  // const chkChange = useRef(true)

  // const comId = companyId || keys.companyId;
  //     const weight = Number(itemSs.weight || 0);
  //     const dimension =
  //       Number(itemSs.height || 0) +
  //       Number(itemSs.length || 0) +
  //       Number(itemSs.width || 0);

  const itemLayout = {
    xs: 24,
    sm: 12,
    lg: 3,
  };


  // const showModal = (value, key) => {
  //   setIsModalVisible(!isModalVisible);
  //   setShowCode({ value, key });
  // };


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
    hasBanArea
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

  useEffect(() => {
    index == 0 ? setIsEditing(true) : setIsEditing(false)
  }, [index, itemStoreSell.doNo]);

  useEffect(() => {
    dispatch(allAction.storeSellAction.setItemCount(form.getFieldsValue()?.itemStoreSell?.length))
  }, [form.getFieldsValue()?.itemStoreSell?.length])

  // const memoItemCard = useMemo(() => {
  //   if (isEditing)
  //     return <ItemCardEdit {...props} />
  //   else {
  //     return <ItemCardView {...props} />
  //   }
  // }, [
  //   isEditing,
  //   caling,
  //   form.getFieldsValue().totalPrice,
  //   itemStoreSell.doNo,
  //   itemStoreSell.recipientInput,
  //   itemStoreSell.recipientPostcode,
  //   itemStoreSell.recipientProvinceId,
  //   itemStoreSell.recipientSubdistrictId,
  //   itemStoreSell.recipientDistrictId,
  //   itemStoreSell.recipientProvinceName,
  //   itemStoreSell.ratePercent,
  // ]);

  // if (isEditing)
  //   return <ItemCardEdit {...props} />
  // else {
  //   return <ItemCardView {...props} />
  // }
  return <>{
    isEditing? 
      <ItemCardEdit {...props} /> :
      <ItemCardView {...props} setIsEditing={setIsEditing}/> 
    }</>
};


export default ItemCard;


const r2 = (num) => {
  if (num === null) {
    num = 0.0
  }
  return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100
}