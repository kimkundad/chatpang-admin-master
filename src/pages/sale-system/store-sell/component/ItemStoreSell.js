/* eslint-disable */
import React, { useEffect, useState, useRef, useMemo } from 'react';
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
} from 'antd';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import {
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  NumberOutlined,
  UserOutlined,
  HomeOutlined,
  ConsoleSqlOutlined,
} from '@ant-design/icons';
import THBText from 'thai-baht-text';
import FileSaver from 'file-saver';
import MpayIcon from '../../../../assets/mPay.png';
import styled from '../StoreSell.module.css';
import { fetch } from '../../../../utils/fetch';
import allAction from '../../../../app/actions';
import ModalComponent from './Modal';
import ButtonPrint from './Printing/ButtonPrint';
import ItemCard from "./ItemStoreSell/ItemCard"

const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const ItemStoreSell = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCode, setShowCode] = useState('');
  // const {
  //   masterTransportationType,
  //   draftData,
  //   orderDetail,
  //   orderDetail,
  //   agencyCodList,
  //   parcelTypeData,
  // } = useSelector((state) => state.storeSellReducer);

  // const masterTransportationType = useSelector((state) => state.storeSellReducer.masterTransportationType);
  const draftData = useSelector((state) => state.storeSellReducer.draftData);
  // const actionModal = useSelector((state) => state.storeSellReducer.actionModal);
  // const orderDetail = useSelector((state) => state.storeSellReducer.orderDetail);
  // const agencyCodList = useSelector((state) => state.storeSellReducer.agencyCodList);
  const parcelTypeData = useSelector((state) => state.storeSellReducer.parcelTypeData);


  const { agencyWallet } = useSelector((state) => state.storeWalletReducer);

  const { isMobile, isLoading } = useSelector((state) => state.mainReducer);
  const { calculatePrice } = useSelector(
    (state) => state.settingTransportReducer
  );
  // const { companyId, hubId, agencyId, userLevel, isCustomer } = useSelector(
  //   (state) => state.authenReducer
  // );

  const companyId = useSelector((state) => state.authenReducer.companyId);
  const hubId = useSelector((state) => state.authenReducer.hubId);
  const agencyId = useSelector((state) => state.authenReducer.agencyId);
  const userLevel = useSelector((state) => state.authenReducer.userLevel);
  const isCustomer = useSelector((state) => state.authenReducer.isCustomer);


  const { socket } = useSelector((state) => state.mainReducer);

  const [caling, setCaling] = useState(-1);

  const scrollToRef = () => myRef.current.scrollIntoView();
  const myRef = useRef(null);
  const chkChange = useRef(true)
  const keyinTimeout = useRef(null);



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

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };
  const showModal = (value, key) => {
    setIsModalVisible(!isModalVisible);
    setShowCode({ value, key });
  };

  const handleOk = () => {
    dispatch(allAction.storeSellAction.setActionModal('view'));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // dispatch(allAction.storeSellAction.setActionModal(''));
  };
  const formItemStyle = { marginBottom: 12 };
  const {
    form,
    showHeader,
    setShowHeader,
    shortSender,
    setKeying,
    hasBanArea,
    setOrderTotalPrice,
    checkAllItem,
    match: {
      params: { orderId },
    },
  } = props;

  const formX = useRef(form)

  const [listData, setListData] = useState();

  const [loading, setLoadIng] = useState(false);
  const [typeEx, setTypeEx] = useState(false);

  const [listProvince2, setListProvince2] = useState([]);
  const [listDistrict2, setListDistrict2] = useState([]);
  const [listSubDistrict2, setListSubDistrict2] = useState([]);
  const [cachePostcode, setCachePostcode] = useState({ subdistrict: {}, district: {}, province: {} });

  // const [cacheSpecialPrice, setCacheSpecialPrice] = useState({})

  const [province, setProviceID] = useState(0);
  const [district, setDistrictID] = useState(0);

  const [isSelectProvince, setIsSelectProvince] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isCheckPostCode, setIsCheckPostCode2] = useState(false);

  const cacheCalRef = useRef({})
  const cacheSpecialPriceRef = useRef({})

  // console.log("render1")

  useEffect(() => {
    const messageListener = (msg) => {
      // console.log('messageListener', msg);
      if (msg) {
        if (agencyId && !isCustomer) {
          setTimeout(() => {
            dispatch(allAction.storeWallet.getAgencyWallet(agencyId))
              .then()
              .catch((e) => message.error(e.message));
          }, 2000);
        }
      }
    };

    if (agencyId) {
      const channel = `wallet_update_${agencyId}`;
      socket?.on(channel, messageListener);
    }

    return () => {
      if (agencyId) {
        const channel = `wallet_update_${agencyId}`;
        socket?.off(channel, messageListener);
      }
    };
  }, [socket]);

  useEffect(() => {
    // console.log('company', companyId)
    dispatch(allAction.storeSellAction.getMasterTransportationType())
      .then()
      .catch((e) => console.log('err', e));
    // callProvince();
    const keys = form.getFieldsValue();
    if (keys.itemStoreSell) {
      keys.itemStoreSell.map((val, i) => {
        // callProvince();
        callDistrict(val.recipientProvinceId);
        callSubDistrict(val.recipientDistrictId);
      });
      setListData(keys.itemStoreSell);
    }
  }, []);

  useEffect(() => {
    if (agencyId && !isCustomer) {
      dispatch(allAction.storeWallet.getAgencyWallet(agencyId))
        .then()
        .catch((e) => message.error(e.message));
    }
  }, [agencyId]);

  useEffect(() => {
    if (companyId) {
      dispatch(allAction.storeSellAction.getParcelTypeData(companyId))
        .then()
        .catch((e) => console.log('err', e));
    }
  }, [companyId]);

  useEffect(() => {
    // console.log('key');
    const keys = form.getFieldsValue();
    dispatch(allAction.storeSellAction.getMasterTransportationType())
      .then()
      .catch((e) => console.log('err', e));
    if (keys.companyId) {
      dispatch(allAction.storeSellAction.getParcelTypeData(keys.companyId))
        .then()
        .catch((e) => console.log('err', e));
    }
    // callProvince();
    if (keys.itemStoreSell) {
      keys.itemStoreSell.map((val, i) => {
        // callProvince();
        callDistrict(val.recipientProvinceId);
        callSubDistrict(val.recipientDistrictId);
      });
      setListData(keys.itemStoreSell);
    }
  }, [form.getFieldValue('companyId')]);

  useEffect(() => {
    if (!isModalVisible) {
      console.log('close modal');
      const keys = form.getFieldsValue();

      if (keys.itemStoreSell) {
        keys.itemStoreSell.map((val, i) => {
          // callProvince();
          callDistrict(val.recipientProvinceId);
          callSubDistrict(val.recipientDistrictId);
          if (listData?.[i]?.recipientSubdistrictId !== val?.recipientSubdistrictId) {
            calTransItem(_, i);
          }
        });
        setListData(keys.itemStoreSell);
      }
    }
  }, [isModalVisible]);


  const setForm = (index, addCus) => {

    const keys = form.getFieldsValue();
    var itemSs = keys.itemStoreSell[index];

    for (const [key, value] of Object.entries(addCus)) {
      // console.log(`${key}: ${value}`);
      itemSs[key] = addCus[key]
    }

    form.setFieldsValue({
      ...keys,
      [keys.itemStoreSell[index]]: itemSs,
    });
  }

  const toRemoveAddress = (remove, id, field) => {
    const keys = form.getFieldsValue();
    const itemSs = keys.itemStoreSell[id];
    // console.log('eee', itemSs, keys);
    const itemNewValue = {};
    // itemNewValue.items =
    // console.log('orderId', orderId)
    const transportationPriceAfterDiscount =
      form.getFieldValue('totalTransportationPrice') -
      (itemSs?.transportationPrice || 0) -
      Number(form.getFieldValue('discountAmount') || 0);
    const totalPrice =
      Number(form.getFieldValue('etcAmount') || 0) +
      Number(form.getFieldValue('morePriceAmount') || 0) +
      (Number(form.getFieldValue('totalChargeCodPrice') || 0) -
        Number(itemSs?.chargeCodPrice || 0)) +
      transportationPriceAfterDiscount;

    const totalChargeCodPrice = form.getFieldValue('totalChargeCodPrice')
      ? Number(form.getFieldValue('totalChargeCodPrice') || 0) -
      Number(itemSs?.chargeCodPrice || 0)
      : 0

    console.log('sssss', Number(form.getFieldValue('totalChargeCodPrice')), Number(itemSs?.chargeCodPrice), itemSs)
    itemNewValue.footer = {
      totalItem: form.getFieldValue('totalItem')
        ? form.getFieldValue('totalItem') - 1
        : 0,
      totalWeight: form.getFieldValue('totalWeight')
        ? form.getFieldValue('totalWeight') - (itemSs?.weight || 0)
        : 0,
      totalVolume: form.getFieldValue('totalVolume')
        ? form.getFieldValue('totalVolume') -
        (itemSs?.width || 0) * (itemSs?.height || 0) * (itemSs?.length || 0)
        : 0,
      totalDimension: form.getFieldValue('totalDimension')
        ? form.getFieldValue('totalDimension') - (itemSs?.dimension || 0)
        : 0,
      totalCod: form.getFieldValue('totalCod')
        ? form.getFieldValue('totalCod') - (itemSs?.cod || 0)
        : 0,
      totalTransportationPrice: form.getFieldValue('totalTransportationPrice')
        ? form.getFieldValue('totalTransportationPrice') -
        (itemSs?.transportationPrice || 0)
        : 0,
      totalChargeCodPrice,
      totalNettransportationPrice: form.getFieldValue(
        'totalNettransportationPrice'
      )
        ? form.getFieldValue('totalNettransportationPrice') -
        (itemSs?.transportationNetPrice || 0)
        : 0,
      remark: form.getFieldValue('remark') || '',
      discountText: form.getFieldValue('discountText') || '',
      discountPercent: form.getFieldValue('discountPercent') || 0,
      discountAmount: form.getFieldValue('discountAmount') || 0,
      transportationPriceAfterDiscount: transportationPriceAfterDiscount,
      morePriceText: form.getFieldValue('morePriceText') || '',
      morePriceAmount: form.getFieldValue('morePriceAmount') || 0,
      etc: form.getFieldValue('etc') || '',
      etcAmount: form.getFieldValue('etcAmount') || 0,
      totalPrice: totalPrice,
    };

    const item = form
      .getFieldValue('itemStoreSell')
      .filter((val) => val.doNo !== itemSs.doNo);
    // console.log('item', item, keys.itemStoreSell)

    const resItem = item.filter((val) => val.doNo && val.recipientName);
    // console.log('resItem', resItem)
    itemNewValue.items = resItem.map((val) => {
      // delete val.recipientDistrictName;
      // delete val.recipientProvinceName;
      // delete val.recipientSubdistrictName;
      if (val.chargeCodPrice === '') {
        delete val.chargeCodPrice
      }
      delete val.parcelTypeCat;
      delete val.customerId;
      return val;
    });

    // console.log('itemNewValue', itemNewValue)

    Modal.confirm({
      title: 'Do you want to delete?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          allAction.storeSellAction.deleteItem(
            draftData.orderId || orderId,
            itemSs.orderItemId,
            itemNewValue
          )
        )
          .then(async(e) => {
            form.setFieldsValue({
              totalItem: field.length - 1 || 0,
            });
            remove(id);
            calVolumeItem(null, 0);
            calTransItem(null, 0);
            calWeightItem();
            calDiscount(keys?.discountPercent||0)
            const resDelete = keys.itemStoreSell.filter(
              (val) => val.doNo !== itemSs.doNo
            );
            setListData(resDelete);
          })
          .catch((e) => message.error(e.message));
        },
        
      onCancel() {
        console.log('Cancel');
      },
    });
    // }
  };

  // const onChange = (e, key) => {
  //   const keys = form.getFieldsValue()
  //   const addCus = keys.itemStoreSell[key]

  //   if (e.target.value === '') {
  //     setListDistrict2([]);
  //     setListSubDistrict2([]);
  //     (addCus.recipientProvinceId = ''),
  //       (addCus.recipientProvinceName =
  //         ''),
  //       (addCus.recipientDistrictId = ''),
  //       (addCus.recipientDistrictName =
  //         ''),
  //       (addCus.recipientSubdistrictId = ''),
  //       (addCus.recipientSubdistrictName = ''),
  //       form.setFieldsValue({
  //         ...keys,
  //         [keys.itemStoreSell[key]]: addCus,
  //       });
  //     setIsCheckPostCode2(false);
  //     return false;
  //   }

  //   if (e.target.value.length === 5) {
  //     setLoadIng(true);
  //     fetch({
  //       method: 'get',
  //       url: `/master/postcode/?postcode=${e.target.value}`,
  //     })
  //       .then((res) => {
  //         setLoadIng(false);
  //         if (res.data.success) {
  //           setIsCheckPostCode2(true);
  //           setProviceID(res.data.data.province.provinceId);
  //           if (res.data.data.district.length === 1) {
  //             setDistrictID(res.data.data.district[0].districtId);
  //           }

  //           setListSubDistrict2(res.data.data.subdistrict);

  //           if (companyId === 0) {
  //             callProvince(0, 'new');
  //           } else {
  //             callProvince(companyId, 'filter');
  //           }
  //           // callDistrict(res.data.data.province.provinceId);
  //           setListDistrict2(res.data.data.district);
  //           // callSubDistrict(res.data.data.district[0].districtId);
  //           // setListDistrict2([])
  //           // setListSubDistrict2([])
  //           const keys = form.getFieldsValue();
  //           const addCus = keys.itemStoreSell[key];
  //           // console.log(key, addCus);

  //           (addCus.recipientProvinceId = res.data.data.province.provinceId),
  //             (addCus.recipientProvinceName =
  //               res.data.data.province.provinceName),
  //             (addCus.recipientDistrictId = res.data.data.district.length === 1
  //               ? res.data.data.district[0].districtId : ''),
  //             (addCus.recipientDistrictName = res.data.data.district.length === 1
  //               ? res.data.data.district[0].districtName : ''),
  //             (addCus.recipientSubdistrictId = res.data.data.subdistrict.length === 1
  //               ? res.data.data.subdistrict[0].subdistrictId : ''),
  //             (addCus.recipientSubdistrictName = res.data.data.subdistrict.length === 1
  //               ? res.data.data.subdistrict[0].subdistrictName : ''),
  //             form.setFieldsValue({
  //               ...keys,
  //               [keys.itemStoreSell[key]]: addCus,
  //             });
  //         } else {
  //           setListDistrict2([]);
  //           setListSubDistrict2([]);
  //           const keys = form.getFieldsValue();
  //           const addCus = keys.itemStoreSell[key];
  //           (addCus.recipientProvinceId = ''),
  //             (addCus.recipientDistrictId = ''),
  //             (addCus.recipientSubdistrictId = ''),
  //             (addCus.recipientProvinceName = ''),
  //             (addCus.recipientDistrictName = ''),
  //             (addCus.recipientSubdistrictName = ''),
  //             form.setFieldsValue({
  //               ...keys,
  //               [keys.itemStoreSell[key]]: addCus,
  //             });
  //           setIsCheckPostCode2(false);
  //         }
  //       })
  //       .catch((error) => {
  //         setListDistrict2([]);
  //         setListSubDistrict2([]);
  //         const keys = form.getFieldsValue();
  //         const addCus = keys.itemStoreSell[key];
  //         (addCus.recipientProvinceId = ''),
  //           (addCus.recipientDistrictId = ''),
  //           (addCus.recipientSubdistrictId = ''),
  //           (addCus.recipientProvinceName = ''),
  //           (addCus.recipientDistrictName = ''),
  //           (addCus.recipientSubdistrictName = ''),
  //           form.setFieldsValue({
  //             ...keys,
  //             [keys.itemStoreSell[key]]: addCus,
  //           });
  //         setIsCheckPostCode2(false);
  //         setLoadIng(false);
  //         console.log(error);
  //       });
  //   }
  // };

  // const callProvince = async () => {
  //   setLoadIng(true);
  //   fetch({
  //     method: 'get',
  //     url: '/master/province',
  //   })
  //     .then((res) => {
  //       setLoadIng(false);
  //       if (res.data.success) {
  //         let i = 0;
  //         const list = [];
  //         for (i = 0; i < res.data.data.length; i++) {
  //           list.push(res.data.data[i]);
  //         }
  //         setListProvince2(list);
  //       }
  //     })
  //     .catch((error) => {
  //       setLoadIng(false);
  //       console.log(error);
  //     });
  // };

  const callSubDistrict = async (districtId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/subdistrict/?districtId=${districtId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListSubDistrict2(list);
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const callDistrict = async (provinceId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/district/?provinceId=${provinceId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          // console.log(list);
          setListDistrict2(list);
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }
  const calVolumeItem = (e, key) => {
    // console.log(e, form.getFieldsValue());
    let totalVolume = 0;
    let totalDimension = 0;
    const keys = form.getFieldsValue();
    const itemSs = keys.itemStoreSell[key];
    const comId = companyId || keys.companyId;

    // console.log('ee', keys.itemStoreSell);
    for (const data of keys.itemStoreSell) {
      const volume =
        Number(data.height || 0) *
        Number(data.length || 0) *
        Number(data.width || 0);
      const dimension =
        Number(data.height || 0) +
        Number(data.length || 0) +
        Number(data.width || 0);
      totalVolume += volume;
      totalDimension += dimension;
    }
    itemSs.dimension =
      Number(itemSs.height || 0) +
      Number(itemSs.length || 0) +
      Number(itemSs.width || 0);
    itemSs.volume =
      Number(itemSs.height || 0) *
      Number(itemSs.length || 0) *
      Number(itemSs.width || 0);

    form.setFieldsValue({
      ...keys,
      [keys.itemStoreSell[key]]: itemSs,
      totalVolume,
      totalDimension,
    });
  };

  const calTransItemPressEnter = (e, key) => {
    if (e.code === 'Enter') {
      calTransItem(e, key);
    }
  };
  const calTransItem = (e, key) => {
    // console.log('key', key, form.getFieldsValue());
    console.time("step1");
    const keys = form.getFieldsValue();
    const itemSs = keys.itemStoreSell[key];


    if (!(itemSs?.recipientProvinceId &&
      itemSs?.recipientDistrictId &&
      itemSs?.recipientSubdistrictId && itemSs?.recipientPostcode)) return false;

    console.timeEnd("step1");

    console.log("step2")
    if (itemSs.recipientPostcode.length != 5) return false;
    console.time("step3");

    if (
      Number(itemSs.weight || 0) &&
      Number(itemSs.height || 0) &&
      Number(itemSs.length || 0) &&
      Number(itemSs.width || 0)
    ) {
      chkChange.current = false

      let totalTransportationPrice = 0;
      let totalNettransportationPrice = 0;
      let totalChargeCodPrice = 0;
      let totalCod = 0;

      // const itemSs = keys.itemStoreSell[key];
      const comId = companyId || keys.companyId;
      const weight = Number(itemSs.weight || 0);
      const dimension =
        Number(itemSs.height || 0) +
        Number(itemSs.length || 0) +
        Number(itemSs.width || 0);
      const body = {
        companyId: comId,
        province: itemSs.recipientProvinceName || null,
        district: itemSs.recipientDistrictName || null,
        subDistrict: itemSs.recipientSubdistrictName || null,
      };
      console.timeEnd("step3");
      console.time("step4");

      dispatch(
        allAction.settingTransportAction.calculate(
          comId,
          weight || 0,
          dimension,
          cacheCalRef
        )
      )
        .then((res) => {
          console.timeEnd("step4");
          console.time("step5");
          dispatch(allAction.storeSellAction.getPriceSpecialArea(
            body,
            cacheSpecialPriceRef)).then(
              (data) => {

                console.timeEnd("step5");
                console.time("step6");
                let transP = 0
                if (Number(res) > Number(data)) {
                  transP = Number(res)
                } else {
                  transP = Number(data)

                }
                // const adding =
                //   (Number(keys.etcAmount || 0) +
                //     Number(keys.morePriceAmount || 0)) /
                //   keys.itemStoreSell.length;
                // const dis =
                //   Number(
                //     keys?.discountPercent ? keys?.discountPercent / 100 : 0
                //   ) *
                //   (transP);

                itemSs.transportationPrice = (transP).toFixed(2);
                // itemSs.transportationNetPrice = (
                //   transP +
                //   Number(itemSs.chargeCodPrice || 0) +
                //   adding -
                //   dis).toFixed(2);
                console.timeEnd("step6");
                console.time("step7");
                const adding =
                  (Number(keys.etcAmount || 0) +
                    Number(keys.morePriceAmount || 0)) /
                  keys.itemStoreSell.length;

                for (const item of keys.itemStoreSell) {
                
                  const dis =
                  Number(
                    keys?.discountPercent ? keys?.discountPercent / 100 : 0
                  ) *
                  (Number(item?.transportationPrice));

                  item.transportationNetPrice =(Number(item?.transportationPrice)+Number(item.chargeCodPrice || 0) +
                  adding -
                  dis).toFixed(2)
                  item.chargeCodPrice =Number(item.chargeCodPrice || 0).toFixed(2)
                  item.cod =Number(item.cod || 0).toFixed(2)
                  const transportationPrice = Number(
                    item.transportationPrice || 0
                  )
                  const chargeCodPrice = Number(
                    item?.chargeCodPrice || 0
                  )
                  const cod = Number(
                      item?.cod || 0
                  )
                  const transportationNetPrice = Number(
                    item.transportationNetPrice || 0
                  )
                  totalTransportationPrice += transportationPrice;
                  totalCod += cod;
                  totalChargeCodPrice += chargeCodPrice
                  totalNettransportationPrice += transportationNetPrice;
                  
                }
                console.timeEnd("step7");
                console.time("step8");
                form.setFieldsValue({
                  ...keys,
                  [keys.itemStoreSell[key]]: itemSs,
                  totalTransportationPrice,
                  totalNettransportationPrice,
                  totalChargeCodPrice,
                  totalCod
                });
                console.timeEnd("step8");
                console.time("step9");
                calDiscount(keys.discountPercent || 0);
                setCaling(-1);
                console.timeEnd("step9");


              }
            );
        })
        .catch((e) => {
          itemSs.transportationPrice = 0;
          // setOrderTotalPrice(0)
          form.setFieldsValue({
            ...keys,
            [keys.itemStoreSell[key]]: itemSs,
            // totalTransportationPrice : 0,
            // totalNettransportationPrice : 0,
            // totalChargeCodPrice : 0,
            // totalCod : 0,
            // totalPrice: 0
          });
          message.error(e.message);
          setCaling(-1);
        });
    }
  };

  const calChargeCod = (key) => {
    let totalChargeCodPrice = 0;
    let totalNettransportationPrice = 0;
    const keys = form.getFieldsValue();
    console.log('ee', keys.itemStoreSell);
    const itemSs = keys.itemStoreSell[key];
    const cod = Number(itemSs.cod || 0);
    const rate = Number(itemSs.ratePercent || 0);
    const chargeCodPrice = Number(cod * (rate / 100)).toFixed(2);
    const adding =
      (Number(keys.etcAmount || 0) + Number(keys.morePriceAmount || 0)) /
      keys.itemStoreSell.length;
    const dis =
      Number(keys?.discountPercent ? keys?.discountPercent / 100 : 0) *
      Number(itemSs?.transportationPrice || 0);
    itemSs.chargeCodPrice = chargeCodPrice;
    itemSs.transportationNetPrice =
      (Number(itemSs.transportationPrice || 0) + Number(chargeCodPrice) + adding - dis).toFixed(2);
    for (const data of keys.itemStoreSell) {
      const chargeCod = Number(data.chargeCodPrice || 0);
      const transportationNetPrice = Number(data.transportationNetPrice || 0);

      totalChargeCodPrice += chargeCod;
      totalNettransportationPrice += transportationNetPrice;
    }
    form.setFieldsValue({
      ...keys,
      [keys.itemStoreSell[key]]: itemSs,
      totalChargeCodPrice: totalChargeCodPrice.toFixed(2),
      totalNettransportationPrice: totalNettransportationPrice.toFixed(2),
    });
    calDiscount(keys.discountPercent || 0);
  };

  const calDiscount = (value) => {
    const keys = form.getFieldsValue();
    const disPer = Number(value || 0) / 100;
    const totalTransportationPrice = Number(keys.totalTransportationPrice || 0);
    const discountAmount = totalTransportationPrice * disPer || 0;
    const transportationPriceAfterDiscount =
      totalTransportationPrice - discountAmount;
    form.setFieldsValue({
      ...keys,
      discountAmount: discountAmount.toFixed(2),
      transportationPriceAfterDiscount:
        transportationPriceAfterDiscount.toFixed(2),
    });
    calTotalPrice();
    // console.log(
    //   'value',
    //   value,
    //   totalTransportationPrice,
    //   discountAmount,
    //   transportationPriceAfterDiscount
    // );
  };

  const calTotalPrice = () => {
    const keys = form.getFieldsValue();
    const etcAmount = Number(keys.etcAmount || 0);
    const morePriceAmount = Number(keys.morePriceAmount || 0);
    const totalChargeCodPrice = Number(keys.totalChargeCodPrice || 0);
    const transportationPriceAfterDiscount = Number(
      keys.transportationPriceAfterDiscount || 0
    );
    const totalPrice =
      etcAmount +
      morePriceAmount +
      totalChargeCodPrice +
      transportationPriceAfterDiscount;
    
    setOrderTotalPrice(totalPrice)
    form.setFieldsValue({
      ...keys,
      totalPrice: totalPrice.toFixed(2),
      totalPriceText: THBText(totalPrice),
    });
  };

  const calWeightItem = (e, key) => {
    // console.log(e, form.getFieldsValue());
    let totalWeight = 0;
    const keys = form.getFieldsValue();
    // console.log('ee', keys.itemStoreSell);
    for (const data of keys.itemStoreSell) {
      const weight = Number(data.weight || 0);
      totalWeight += weight;
    }
    form.setFieldsValue({
      ...keys,
      totalWeight,
    });
    // console.log(itemSs);
  };

  const checkCOD = (e, key) => {
    const keys = form.getFieldsValue();
    const itemSs = keys.itemStoreSell[key];

    if (itemSs.transportationTypeCode === 'EX') {
      itemSs.cod = 0;
      itemSs.ratePercent = 0;
      itemSs.chargeCodPrice = 0.00;
    } else {
      itemSs.cod = Number(itemSs.cod) > 0 ? itemSs.cod : '';
    }
    form.setFieldsValue({
      ...keys,
      [keys.itemStoreSell[key]]: itemSs,
    });
    calCOD();
    calChargeCod(key);
  };

  const calCOD = (e, key) => {
    let totalCod = 0;
    const keys = form.getFieldsValue();
    // console.log('ee', keys.itemStoreSell);

    for (const data of keys.itemStoreSell) {
      const cod = Number(data.cod || 0);
      totalCod += cod;
    }
    form.setFieldsValue({
      ...keys,
      totalCod,
    });
  };

  const filterDataTransType = (value, key) => {
    const keys = form.getFieldsValue();
    const itemSs = keys.itemStoreSell[key];
    if (value === 'EX') {
      setTypeEx(true);
      itemSs.cod = 0;
      itemSs.ratePercent = 0;
      itemSs.chargeCodPrice = 0.00;
      form.setFieldsValue({
        ...keys,
        [keys.itemStoreSell[key]]: itemSs,
      });
    } else {
      itemSs.cod = '';
      itemSs.ratePercent = '';
      form.setFieldsValue({
        ...keys,
        [keys.itemStoreSell[key]]: itemSs,
      });
      setTypeEx(false);
    }
    calCOD();
    calChargeCod(key);
  };

  //To do new features 
  // const resetSumTran = (key) => {
  //   const keys = form.getFieldsValue();
  //   const itemSs = keys.itemStoreSell[key];

  //   itemSs.transportationPrice = '';
  //   itemSs.transportationNetPrice = '';
  //   form.setFieldsValue({
  //     ...keys,
  //     [keys.itemStoreSell[key]]: itemSs,
  //   })
  // };

  const addItem = async (add, key, remove) => {
    const field = form.getFieldsValue();
    console.log('parcel', parcelTypeData);
    if (agencyId || field.agencyId || field.receiptNo || field.soNo) {
      scrollToRef();
      add(
        {
          doNo: '',
          recipientProvinceId: '',
          recipientDistrictId: '',
          recipientSubdistrictId: '',
          transportationTypeCode: 'EX',
          cod: 0,
          ratePercent: 0,
          chargeCodPrice: 0.00
        },
        0
      );
    }
    const keys = form.getFieldsValue();
    const newValue = {};
    newValue.header = {
      agencyId: agencyId || form.getFieldValue('agencyId'),
      date: format(new Date(form.getFieldValue('date')), 'yyyy-MM-dd'),
      paymentDate: form.getFieldValue('paymentDate')
        ? format(new Date(form.getFieldValue('paymentDate')), 'yyyy-MM-dd')
        : null,
      paymentTypeCode: form.getFieldValue('paymentTypeCode'),
      customerId: form.getFieldValue('customerId'),
      customerInput: form.getFieldValue('customerInput'),
      customerAddressId: form.getFieldValue('customerAddressId'),
      customerName: form.getFieldValue('customerName'),
      customerLastName: form.getFieldValue('customerLastName') || '',
      customerNo: form.getFieldValue('customerNo'),
      customerMoo: form.getFieldValue('customerMoo'),
      customerAlley: form.getFieldValue('customerAlley'),
      customerRoad: form.getFieldValue('customerRoad'),
      customerDistrictId: form.getFieldValue('customerDistrictId'),
      customerSubdistrictId: form.getFieldValue('customerSubdistrictId'),
      customerProvinceId: form.getFieldValue('customerProvinceId'),
      customerPostcode: form.getFieldValue('customerPostcode'),
      customerAddressOther: form.getFieldValue('customerAddressOther'),
      customerBankAccountNo:
        form.getFieldValue('customerBankAccountNo') || null,
      customerBankAccountName:
        form.getFieldValue('customerBankAccountName') || null,
      customerBankId: form.getFieldValue('customerBankId') || null,
      senderId: form.getFieldValue('senderId'),
      senderInput: form.getFieldValue('senderInput'),
      senderAddressId: form.getFieldValue('senderAddressId'),
      senderName: form.getFieldValue('senderName'),
      senderLastName: form.getFieldValue('senderLastName'),
      senderNo: form.getFieldValue('senderNo'),
      senderMoo: form.getFieldValue('senderMoo'),
      senderAlley: form.getFieldValue('senderAlley'),
      senderRoad: form.getFieldValue('senderRoad'),
      senderDistrictId: form.getFieldValue('senderDistrictId'),
      senderSubdistrictId: form.getFieldValue('senderSubdistrictId'),
      senderProvinceId: form.getFieldValue('senderProvinceId'),
      senderPostcode: form.getFieldValue('senderPostcode'),
      senderAddressOther: form.getFieldValue('senderAddressOther'),
      recommenderId: form.getFieldValue('recommenderId'),
      recommenderInput: form.getFieldValue('recommenderInput'),
      recommenderName: form.getFieldValue('recommenderName'),
      recommenderLastName: form.getFieldValue('recommenderLastName'),
    };
    const noCheck = isCustomer || keys.soNo ? keys.soNo : keys.receiptNo;

    if (!noCheck) {
      dispatch(allAction.storeSellAction.createDraftOrder(newValue)).then(
        (data) => {
          dispatch(
            allAction.storeSellAction.getParcelTypeData(
              keys?.companyId || companyId
            )
          )
            .then()
            .catch((e) => console.log('err', e));
          const itemSs = keys.itemStoreSell[0];
          itemSs.doNo = data.doNo;
          itemSs.orderItemId = data.orderItemId;
          if (isCustomer) {
            form.setFieldsValue({
              ...keys,
              [keys.itemStoreSell[0]]: itemSs,
              receiptNo: null,
              soNo: data?.soNo,
              orderId: data?.orderId,
              totalItem: keys.itemStoreSell.length || 0,
            });
          } else {
            form.setFieldsValue({
              ...keys,
              [keys.itemStoreSell[0]]: itemSs,
              receiptNo: data?.receiptNo,
              soNo: null,
              orderId: data?.orderId,
              totalItem: keys.itemStoreSell.length || 0,
            });
          }
        }
      );
    } else {
      const itemNewValue = {};
      // itemNewValue.items =
      console.log('orderId', orderId);
      itemNewValue.footer = {
        totalItem: form.getFieldValue('totalItem') ? Number(form.getFieldValue('totalItem')) + 1 : 0,
        totalWeight: form.getFieldValue('totalWeight') || 0,
        totalVolume: form.getFieldValue('totalVolume') || 0,
        totalDimension: form.getFieldValue('totalDimension') || 0,
        totalCod: form.getFieldValue('totalCod') || 0,
        totalTransportationPrice:
          form.getFieldValue('totalTransportationPrice') || 0,
        totalChargeCodPrice: form.getFieldValue('totalChargeCodPrice') || 0,
        totalNettransportationPrice:
          form.getFieldValue('totalNettransportationPrice') || 0,
        remark: form.getFieldValue('remark') || '',
        discountText: form.getFieldValue('discountText') || '',
        discountPercent: form.getFieldValue('discountPercent') || 0,
        discountAmount: form.getFieldValue('discountAmount') || 0,
        transportationPriceAfterDiscount:
          form.getFieldValue('transportationPriceAfterDiscount') || 0,
        morePriceText: form.getFieldValue('morePriceText') || '',
        morePriceAmount: form.getFieldValue('morePriceAmount') || 0,
        etc: form.getFieldValue('etc') || '',
        etcAmount: form.getFieldValue('etcAmount') || 0,
        totalPrice: form.getFieldValue('totalPrice') || 0,
      };

      // setOrderTotalPrice(totalPrice)
      const item = form.getFieldValue('itemStoreSell');
      console.log('item', item, keys.itemStoreSell);

      const resItem = item.filter((val) => val.doNo && val.recipientName);
      console.log('resItem', resItem);
      itemNewValue.items = resItem.map((val, idx) => {
        console.log("delete", val, idx)
        // delete val.recipientDistrictName;
        // delete val.recipientProvinceName;
        // delete val.recipientSubdistrictName;
        delete val.parcelTypeCat;
        delete val.customerId;
        if (val.chargeCodPrice === '') {
          delete val.chargeCodPrice
        }
        return val;
      });

      const id = draftData?.orderId || orderId;
      dispatch(allAction.storeSellAction.addDraftOrder(id, itemNewValue)).then(
        (data) => {
          console.log("addDraftOrder")

          dispatch(allAction.storeSellAction.getOrderDetail(orderId)).then(
            (data) => {
              // items
              const itemList = [];
              if (data) {
                data.items.map((item) => {
                  const obj = {};
                  obj.orderItemId = item?.orderItemId || '';
                  obj.doNo = item?.doNo || '';
                  obj.recipientId = item?.recipientId || null;
                  obj.recipientAddressId = item?.recipientAddressId || null;
                  obj.recipientInput = item?.recipientInput || '';
                  obj.recipientName = item?.recipientName || '';
                  obj.recipientLastName = item?.recipientLastName || '';
                  obj.recipientNo = item?.recipientNo || '';
                  obj.recipientMoo = item?.recipientMoo || '';
                  obj.recipientAlley = item?.recipientAlley || '';
                  obj.recipientRoad = item?.recipientRoad || '';
                  obj.recipientDistrictId = item?.recipientDistrictData?.districtId || '';
                  obj.recipientDistrictName = item?.recipientDistrictData?.districtName || '';
                  obj.recipientSubdistrictId = item?.recipientSubdistrictData?.subdistrictId || '';
                  obj.recipientSubdistrictName = item?.recipientSubdistrictData?.subdistrictName || '';
                  obj.recipientProvinceId = item?.recipientProvinceData?.provinceId || '';
                  obj.recipientProvinceName = item?.recipientProvinceData?.provinceName || '';
                  obj.recipientPostcode = item?.recipientPostcode || '';
                  obj.recipientOther = item?.recipientOther || '';
                  obj.parcelTypeId = item?.parcelTypeId || '';
                  obj.parcelTypeCat = item?.parcelTypeData?.category || '';
                  obj.transportationTypeCode = item?.transportationTypeCode || 'EX';
                  obj.remark = item?.remark || '';
                  obj.weight = item?.weight || '';
                  obj.width = item?.width || '';
                  obj.height = item?.height || '';
                  obj.length = item?.length || '';
                  obj.dimension = item?.dimension || '';
                  obj.volume = item?.volume || '';
                  obj.cod = item?.cod || 0;
                  obj.ratePercent = item?.ratePercent || 0;
                  obj.transportationPrice = item?.transportationPrice || 0.00;
                  obj.chargeCodPrice = item?.chargeCodPrice || 0.00;
                  obj.transportationNetPrice = item?.transportationNetPrice || 0.00;
                  itemList.push(obj);
                });
                // dispatch(allAction.storeSellAction.setDraftData({
                //   orderId:data.header.orderId
                // }))

                form.setFieldsValue({


                  itemStoreSell: itemList,
                  // footer
                  totalItem: data.footer.totalItem || 1,
                  totalWeight: data.footer.totalWeight || '',
                  totalVolume: data.footer.totalVolume || '',
                  totalDimension: data.footer.totalDimension || '',
                  totalCod: data.footer.totalCod || '',
                  totalTransportationPrice:
                    data.footer.totalTransportationPrice || '',
                  totalChargeCodPrice: data.footer.totalChargeCodPrice || '',
                  totalNettransportationPrice:
                    data.footer.totalNettransportationPrice || '',
                  remark: data.footer.remark || '',
                  discountText: data.footer.discountText || '',
                  discountPercent: data.footer.discountPercent ? Number(data?.footer?.discountPercent) : '',
                  discountAmount: data.footer.discountAmount || '',
                  transportationPriceAfterDiscount:
                    data.footer.transportationPriceAfterDiscount || '',
                  morePriceText: data.footer.morePriceText || '',
                  morePriceAmount: data.footer.morePriceAmount || '',
                  etc: data.footer.etc || '',
                  etcAmount: data.footer.etcAmount || '',
                  totalPrice: data.footer.totalPrice || '',
                  totalPriceText: data?.footer?.totalPrice ? THBText(data?.footer?.totalPrice) : '-',
                });
                dispatch(allAction.storeSellAction.setButtonFlagHeader(true));
              }
            },
          )
          const itemSs = keys.itemStoreSell[0];

          itemSs.doNo = data.doNo;
          itemSs.orderItemId = data.orderItemId;
          form.setFieldsValue({
            ...keys,
            [keys.itemStoreSell[0]]: itemSs,
            orderId: data?.orderId,
            totalItem: keys.itemStoreSell.length || 0,
          });

        }
      )
        .catch((e) => {
          remove(0)
          message.error(e.message)
        })
    }
    // console.log(keys);
  };



  const onSearchCustomer_WaitKeyIn = (e, key) => {
    clearTimeout(keyinTimeout.current);

    keyinTimeout.current = setTimeout(() => {
      try {
        onSearchCustomer(e, key);
      } catch (e) {
        console.log("ERROR onSearchCustomer(e, key);")
      }
    }, 500);
  };

  const onSearchCustomer = (e, key) => {
    // form.resetFields(['customerName', 'addressCustomer']);
    if (e.length > 8 || e.length === 0) {
      // console.log('search', e, key, form.getFieldValue());
      const keys = form.getFieldValue();
      const itemSs = keys.itemStoreSell[key];

      const objSearch = {};
      objSearch.search = e;
      if (userLevel === 'SAD') objSearch.companyId = keys.companyId;
      dispatch(allAction.storeSellAction.getCustomerDetail(objSearch)).then(
        (data) => {
          if (data) {
            // console.log('recipientName', itemSs)
            itemSs.recipientName = data?.customerName || '';
            itemSs.recipientLastName = data?.customerLastName || '';
            data?.customerAddressData.filter((val) => {
              if (val?.defaultAddress) {
                itemSs.customerId = data?.customerId;
                itemSs.recipientId = data?.customerId||null;
                itemSs.recipientAddressId = val?.customerAddressId||null;
                itemSs.recipientNo = val?.no;
                itemSs.recipientMoo = val?.moo || null;
                itemSs.recipientAlley = val?.alley || null;
                itemSs.recipientRoad = val?.road || null;
                itemSs.recipientDistrictId =
                  val?.districtData?.districtId || null;
                itemSs.recipientDistrictName =
                  val?.districtData?.districtName || null;
                itemSs.recipientSubdistrictId =
                  val?.subdistrictData?.subdistrictId || null;
                itemSs.recipientSubdistrictName =
                  val?.subdistrictData?.subdistrictName || null;
                itemSs.recipientProvinceName =
                  val?.provinceData?.provinceName || null;
                itemSs.recipientProvinceId =
                  val?.provinceData?.provinceId || null;
                itemSs.recipientPostcode = val?.postcode || null;
                itemSs.recipientOther = val?.other || null;
                // callProvince();
                // callDistrict(val?.provinceData?.provinceId);
                // callSubDistrict(val?.districtData?.districtId);
              }
            });
            form.setFieldsValue({
              [keys.itemStoreSell[key]]: itemSs,
            });
          } else {
            itemSs.recipientId = null;
            itemSs.recipientName = '';
            itemSs.recipientLastName = '';
            itemSs.recipientAddressId = null;
            itemSs.recipientNo = '';
            itemSs.recipientMoo = '';
            itemSs.recipientAlley = '';
            itemSs.recipientRoad = '';
            itemSs.recipientDistrictId = '';
            itemSs.recipientDistrictName = '';
            itemSs.recipientSubdistrictId = '';
            itemSs.recipientSubdistrictName = '';
            itemSs.recipientProvinceId = '';
            itemSs.recipientProvinceName = '';
            itemSs.recipientPostcode = '';
            form.setFieldsValue({
              ...keys,
              [keys.itemStoreSell[key]]: itemSs,
            });
          }
          setListData(keys.itemStoreSell);
        }
      );

      // console.log('listttt', listData);
    }
  };

  const checkChangeValue = (value, key, add, remove) => {
    console.log("key", key)
    const keys = form.getFieldsValue();
    const itemSs = keys.itemStoreSell[key];

    if (value.key === 'Enter' || value === 'add') {
      if (listData?.[key]?.recipientId) {
        let edit = false;
        if (listData?.[key].recipientNo !== itemSs.recipientNo) edit = true;
        if (listData?.[key].recipientMoo !== itemSs.recipientMoo) edit = true;
        if (listData?.[key].recipientAlley !== itemSs.recipientAlley) edit = true;
        if (listData?.[key].recipientRoad !== itemSs.recipientRoad) edit = true;
        if (listData?.[key].recipientDistrictId !== itemSs.recipientDistrictId)
          edit = true;
        if (listData?.[key].recipientProvinceId !== itemSs.recipientProvinceId)
          edit = true;
        if (
          listData?.[key].recipientSubdistrictId !== itemSs.recipientSubdistrictId
        )
          edit = true;
        if (listData?.[key].recipientSOther !== itemSs.recipientSOther)
          edit = true;
        if (edit) {
          console.log('itemSs', itemSs)
          if (
            itemSs.recipientNo &&
            itemSs.recipientPostcode &&
            itemSs.recipientProvinceId &&
            itemSs.recipientSubdistrictId &&
            itemSs.recipientDistrictId &&
            itemSs.recipientId
          ) {
            const data = {
              no: itemSs.recipientNo,
              moo: itemSs.recipientMoo,
              alley: itemSs.recipientAlley,
              road: itemSs.recipientRoad,
              districtId: itemSs.recipientDistrictId,
              subdistrictId: itemSs.recipientSubdistrictId,
              provinceId: itemSs.recipientProvinceId,
              postcode: itemSs.recipientPostcode,
              other: itemSs.recipientSOther || '',
            };
            Modal.confirm({
              title: 'Do you want to create new address?',
              icon: <ExclamationCircleOutlined />,
              onOk() {
                dispatch(
                  allAction.storeSellAction.createAddress(
                    data,
                    itemSs.recipientId
                  )
                ).then(() => {
                  onSearchCustomer_WaitKeyIn(
                    itemSs.recipientInput,
                    value === 'add' ? key : key
                  );
                  if (value === 'add') addItem(add, key, remove);
                  message.success('Create success!');
                });
                itemSs.recipientId = listData?.[key]?.recipientId||null;
                itemSs.recipientAddressId = listData?.[key].recipientAddressId||null;
                form.setFieldsValue({
                  [keys.itemStoreSell[key]]: itemSs,
                });
              },
              onCancel() {
                // onSearchCustomer(itemSs.recipientInput, key);
                if (value === 'add') addItem(add, key, remove);
              },
            });
          }
        } else if (value === 'add') addItem(add, key, remove);
      } else if (
        value === 'add' &&
        listData?.[key]?.recipientInput === itemSs.recipientInput &&
        listData?.[key]?.recipientName === itemSs.recipientName
      ) {
        addItem(add, key, remove);
      } else if (
        itemSs.recipientInput &&
        itemSs.recipientName &&
        // && itemSs.recipientLastName
        itemSs.recipientNo &&
        itemSs.recipientPostcode &&
        itemSs.recipientProvinceId &&
        itemSs.recipientSubdistrictId &&
        itemSs.recipientDistrictId &&
        (companyId || keys.companyId)
      ) {
        // console.log('create', listData[key], itemSs);

        const objRes = {
          customer: {
            companyId: companyId || keys.companyId,
            customerClassId: 1,
            customerCategoryId: 1,
            customerName: itemSs.recipientName,
            customerLastName: itemSs.recipientLastName,
            phoneNumber: itemSs.recipientInput,
          },
          address: [
            {
              no: itemSs.recipientNo || '',
              moo: itemSs.recipientMoo || '',
              alley: itemSs.recipientAlley || '',
              road: itemSs.recipientRoad || '',
              districtId: itemSs.recipientDistrictId || '',
              subdistrictId: itemSs.recipientSubdistrictId || '',
              provinceId: itemSs.recipientProvinceId || '',
              postcode: itemSs.recipientPostcode || '',
              other: itemSs.recipientOther || '',
              defaultAddress: true,
              addressType: 'CUR',
            },
          ],
        };
        Modal.confirm({
          title: 'Do you want to create new customer?',
          icon: <ExclamationCircleOutlined />,
          onOk() {
            dispatch(
              allAction.storeCustomeAction.createStoreCustome(objRes)
            ).then(() => {
              if (value === 'add') addItem(add, key, remove);

              onSearchCustomer_WaitKeyIn(
                itemSs.recipientInput,
                value === 'add' ? key + 1 : key
              );
              message.success('Create success!');
            });
          },
          onCancel() {
            // onSearchCustomer(itemSs.recipientInput, key);
            if (value === 'add') addItem(add, key, remove);
          },
        });
      } else if (value === 'add') {
        // console.log('item', itemSs, listData[key], value);

        addItem(add, key, remove);
      } else {
        message.error('Please check field!');
      }
    }
    // else {
    //   if (value === 'add') addItem(add, key);

    // }
  };

  const checkTypeEx = () => {
    const keys = form.getFieldsValue();
    let Ex = false;
    keys.itemStoreSell.filter((val) => {
      if (val.transportationTypeCode !== 'EX') {
        Ex = true;
      }
      dispatch(allAction.storeSellAction.checkTypeTrans(Ex));
    });
  };

  const getSticker = (key) => {
    const value = form.getFieldValue();
    const newValue = {};
    newValue.header = {
      agencyId: agencyId || value.agencyId,
      receiptNo: value.receiptNo || null,
      soNo: value.soNo || null,
      date: format(new Date(value.date), 'yyyy-MM-dd'),
      paymentDate: value.paymentDate
        ? format(new Date(value.paymentDate), 'yyyy-MM-dd')
        : null,
      paymentTypeCode: value.paymentTypeCode,
      customerId: value.customerId,
      customerAddressId: value.customerAddressId,
      customerName: value.customerName,
      customerLastName: value.customerLastName,
      customerNo: value.customerNo,
      customerMoo: value.customerMoo,
      customerAlley: value.customerAlley,
      customerRoad: value.customerRoad,
      customerDistrictId: value.customerDistrictId,
      customerSubdistrictId: value.customerSubdistrictId,
      customerProvinceId: value.customerProvinceId,
      customerPostcode: value.customerPostcode,
      customerBankAccountNo: value.customerBankAccountNo,
      customerBankAccountName: value.customerBankAccountName,
      customerBankId: value.customerBankId,
      senderId: value.senderId,
      senderAddressId: value.senderAddressId,
      senderName: value.senderName,
      senderLastName: value.senderLastName,
      senderNo: value.senderNo,
      senderMoo: value.senderMoo,
      senderAlley: value.senderAlley,
      senderRoad: value.senderRoad,
      senderDistrictId: value.senderDistrictId,
      senderSubdistrictId: value.senderSubdistrictId,
      senderProvinceId: value.senderProvinceId,
      senderPostcode: value.senderPostcode,
      recommenderId: value.recommenderId,
      recommenderName: value.recommenderName,
      recommenderLastName: value.recommenderLastName,
    };
    const obj = {};
    obj.orderItemId = value.itemStoreSell[key].orderItemId;
    obj.doNo = value.itemStoreSell[key].doNo;
    obj.recipientId =
      value.itemStoreSell[key].recipientId ||
      value.itemStoreSell[key].customerId;
    obj.recipientAddressId = value.itemStoreSell[key].recipientAddressId||null;
    obj.recipientName = value.itemStoreSell[key].recipientName;
    obj.recipientLastName = value.itemStoreSell[key].recipientLastName || '';
    obj.recipientNo = value.itemStoreSell[key].recipientNo;
    obj.recipientMoo = value.itemStoreSell[key].recipientMoo;
    obj.recipientAlley = value.itemStoreSell[key].recipientAlley;
    obj.recipientRoad = value.itemStoreSell[key].recipientRoad;
    obj.recipientDistrictId = value.itemStoreSell[key].recipientDistrictId;
    obj.recipientSubdistrictId =
      value.itemStoreSell[key].recipientSubdistrictId;
    obj.recipientProvinceId = value.itemStoreSell[key].recipientProvinceId;
    obj.recipientPostcode = value.itemStoreSell[key].recipientPostcode;
    obj.parcelTypeId = value.itemStoreSell[key].parcelTypeId;
    obj.transportationTypeCode =
      value.itemStoreSell[key].transportationTypeCode;
    obj.remark = value.itemStoreSell[key].remark;
    obj.weight = value.itemStoreSell[key].weight;
    obj.width = value.itemStoreSell[key].width;
    obj.height = value.itemStoreSell[key].height;
    obj.length = value.itemStoreSell[key].length;
    obj.dimension = value.itemStoreSell[key].dimension;
    obj.volume = value.itemStoreSell[key].volume;
    obj.cod = value.itemStoreSell[key].cod;
    obj.ratePercent = value.itemStoreSell[key].ratePercent;
    obj.transportationPrice = value.itemStoreSell[key].transportationPrice;
    obj.chargeCodPrice = value.itemStoreSell[key].chargeCodPrice;
    obj.transportationNetPrice =
      value.itemStoreSell[key].transportationNetPrice;
    newValue.item = obj;
    console.log(key, newValue);

    dispatch(
      allAction.storeSellAction.getStickerItem(
        draftData.orderId || orderId,
        value.itemStoreSell[key].orderItemId,
        newValue
      )
    )
      .then()
      .catch((e) => message.error(e.message));
  };

  const validateFieldsAndShowHeader = async () => {
    let validateError = null;
    await form
      .validateFields()
      .then((response) => {
        validateError = null;
      })
      .catch((e) => {
        validateError = e;
        // console.log("validateError", validateError);
      });

    const headerValidates = [
      'date',
      'paymentTypeCode',
      'customerInput',
      'customerName',
      'addressCustomer',
      'customerBankName',
      'customerBankAccountNo',
      'senderInput',
      'senderName',
      'addressSender',
    ];

    var header_errs = [];
    if (validateError?.errorFields?.length > 0) {
      header_errs = validateError.errorFields.filter((err) => {
        // console.log(err.name[0])
        return headerValidates.indexOf(err?.name[0]) > -1;
      });
    }

    // console.log("header_errs", header_errs)

    if (header_errs?.length > 0) {
      setShowHeader(true);
    } else {
      setKeying(true);
      setShowHeader(false);
    }

    return validateError;
  };

  const onClickItem = async () => {
    console.log('itemClick');

    const validatesError = await validateFieldsAndShowHeader();
    console.log('validatesError', validatesError);
    if (validatesError) {
      console.log('validatesError!!');
      return false;
    }

    const itemNewValue = {};
    // itemNewValue.items =
    console.log('orderId', orderId);
    itemNewValue.footer = {
      totalItem: form.getFieldValue('totalItem') || 0,
      totalWeight: form.getFieldValue('totalWeight') || 0,
      totalVolume: form.getFieldValue('totalVolume') || 0,
      totalDimension: form.getFieldValue('totalDimension') || 0,
      totalCod: form.getFieldValue('totalCod') || 0,
      totalTransportationPrice:
        form.getFieldValue('totalTransportationPrice') || 0,
      totalChargeCodPrice: form.getFieldValue('totalChargeCodPrice') || 0,
      totalNettransportationPrice:
        form.getFieldValue('totalNettransportationPrice') || 0,
      remark: form.getFieldValue('remark') || '',
      discountText: form.getFieldValue('discountText') || '',
      discountPercent: form.getFieldValue('discountPercent') || 0,
      discountAmount: form.getFieldValue('discountAmount') || 0,
      transportationPriceAfterDiscount:
        form.getFieldValue('transportationPriceAfterDiscount') || 0,
      morePriceText: form.getFieldValue('morePriceText') || '',
      morePriceAmount: form.getFieldValue('morePriceAmount') || 0,
      etc: form.getFieldValue('etc') || '',
      etcAmount: form.getFieldValue('etcAmount') || 0,
      totalPrice: form.getFieldValue('totalPrice') || 0,
    };
    const item = form.getFieldValue('itemStoreSell');
    // console.log('item', item)

    const resItem = item.filter((val) => val.doNo && val.recipientName);
    // console.log('resItem', resItem)
    itemNewValue.items = resItem.map((val) => {
      // delete val.recipientDistrictName
      // delete val.recipientProvinceName
      // delete val.recipientSubdistrictName
      delete val.parcelTypeCat;
      delete val.customerId;
      return val;
    });
    // itemNewValue.items = resItem
    // console.log('itemNewValue', itemNewValue)
    const id = draftData?.orderId || orderId;
    dispatch(allAction.storeSellAction.updateDraftOrder(id, itemNewValue))
      .then(() => {
        const data = { ...draftData, orderId: draftData.orderId || orderId };
        dispatch(allAction.storeSellAction.setDraftData(data));
      })
      .catch((e) => message.error(e.message));

    return true;
  };

  return (
    <>
      <Form.List name="itemStoreSell">
        {/* {console.log("<Form.List", form)} */}
        {(fields, { add, remove }) => (
          <div style={{ marginBottom: 8 }}>
            {console.log("(fields", fields)}
            <Row>
              <Col
                flex="50px"
                style={{
                  marginBottom: 0,
                  flexDirection: 'column',
                  // float: 'right',
                }}
              >
                <Button
                  // disabled={!flagHeader}
                  size="small"
                  type="primary"
                  style={{
                    marginTop: 8,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 8,
                    width: '50px',
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    setShowHeader(!showHeader);
                  }}
                >
                  {showHeader ? 'ย่อ' : 'แก้ไข'}
                </Button>
              </Col>
              <Col
                flex="auto"
                style={{
                  marginBottom: 0,
                  flexDirection: 'column',
                  // float: 'right',
                }}
              >
                {/* {!showHeader && shortSender?.customerName &&  */}
                <div
                  style={{
                    width: 'calc(100vw - 680px)',
                    // border: "red 1px solid",
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    padding: 0,
                    margin: 0,
                    marginTop: 9,
                  }}
                >
                  <span style={{ fontFamily: 'sans-serif' }}>
                    <UserOutlined style={{ color: '#294C94' }} /> ผู้ส่ง(ลูกค้า)
                    : {shortSender?.customerName}{' '}
                    {shortSender?.customerLastName}{' '}
                    <HomeOutlined style={{ color: '#294C94' }} /> ที่อยู่ :{' '}
                    {shortSender?.addressCustomer}
                  </span>
                </div>
                {/* } */}
              </Col>
              {/* {(FilterUserLevel(['AGN']) && !isCustomer) && ( */}
              {/* {!showHeader && (FilterUserLevel(['AGN']) && !isCustomer) && ( */}
              {/* {FilterUserLevel(['AGN']) && !isCustomer && (
                <Col flex="auto">
                  <Row align="middle" style={{ float: 'right' }}>
                    <Col flex="auto" style={{ paddingLeft: 10 }}>
                      <Image
                        preview={false}
                        src={MpayIcon}
                        width={28}
                        onClick={() =>
                          window.open('/#/store-wallet/', '_blank')
                        }
                        style={{ cursor: 'pointer', marginTop: 5 }}
                      />
                    </Col>
                    <Col flex="auto" style={{ paddingLeft: 10 }}>
                      <div
                        style={{
                          fontFamily: 'sans-serif',
                          fontSize: '1.2em',
                          display: 'flex',
                          flexDirection: 'row',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (!isCustomer) {
                            dispatch(
                              allAction.storeWallet.getAgencyWallet(agencyId)
                            );
                          }
                        }}
                      >
                        <div
                          style={{
                            border: '1px #DEDDDD solid',
                            backgroundColor: '#F3F1F1',
                            paddingLeft: 5,
                            paddingRight: 5,
                            marginRight: 3,
                          }}
                        >
                          {agencyWallet?.wallet
                            ? ((agencyWallet?.wallet || 0) - (agencyWallet?.reservePrice || 0)).toFixed(2)
                            : 0}
                        </div>{' '}
                        <div> {t('thb')}</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              )} */}
              {/* )} */}

              {/* TODO: ปุ่มเพิ่มพัสดุ */}
              <Col flex="110px">
                <Button
                  disabled={caling > -1}
                  type="primary"
                  style={{
                    float: 'right',
                    marginRight: 10,
                    marginTop: 3,
                    width: '80px',
                    fontSize: '12px',
                  }}
                  // disabled={form.getFieldsValue()?.itemStoreSell?.some(val => !val.transportationNetPrice)}
                  onClick={async () => {
                    if(!checkAllItem()) return false;

                    if(hasBanArea.current) {
                      message.error(hasBanArea.current);
                      return false;
                    }
                    const validates = await validateFieldsAndShowHeader();
                    console.log('validates', validates, fields.length);
                    if (!validates) {
                      fields.length === 0
                        ? addItem(add, 0, remove)
                        : checkChangeValue('add', 0, add, remove);
                      // addItem(add, fields?.length + 1);
                    }
                  }}
                >
                  {t('add-parcel')}
                </Button>
              </Col>
            </Row>
            <div>
              <Card
                className={styled.scroll}
                style={{
                  padding: '0px',
                  height: showHeader
                    ? 'calc(100vh - 650px + 22px + 42px)'
                    : 'calc(100vh - 336px + 22px + 42px)',
                  overflowY: 'scroll',
                  backgroundColor: '#A4A4A4',
                }}
                bodyStyle={{ padding: '0px', margin: 0 }}
              >
                <div ref={myRef}>
                  {fields.map((field, index) => {
                    console.log("field index error", field, form.getFieldsValue())
                    return <ItemCard
                      hasBanArea={hasBanArea}
                      caling={caling}
                      setCaling={setCaling}
                      showModal={showModal}
                      itemStoreSell={form.getFieldsValue().itemStoreSell[index]}
                      field={field}
                      index={index}
                      fields={fields}
                      form={form}
                      setForm={setForm}
                      checkTypeEx={checkTypeEx}
                      onSearchCustomer={onSearchCustomer_WaitKeyIn}
                      toRemoveAddress={toRemoveAddress}
                      callSubDistrict={callSubDistrict}
                      callDistrict={callDistrict}
                      isInputNumber={isInputNumber}
                      calVolumeItem={calVolumeItem}
                      calTransItemPressEnter={calTransItemPressEnter}
                      calTransItem={calTransItem}
                      calChargeCod={calChargeCod}
                      calDiscount={calDiscount}
                      calTotalPric={calTotalPrice}
                      calWeightItem={calWeightItem}
                      checkCOD={checkCOD}
                      calCOD={calCOD}
                      filterDataTransType={filterDataTransType}
                      getSticker={getSticker}
                      onClickItem={onClickItem}
                      checkChangeValue={checkChangeValue}
                      listProvince2={listProvince2}
                      setListProvince2={setListProvince2}
                      cachePostcode={cachePostcode}
                      setCachePostcode={setCachePostcode}
                      remove={remove}
                      add={add}
                      chkChange={chkChange}
                      formX={formX}
                      length={form.getFieldsValue().itemStoreSell?.length}
                    // resetSumTran={resetSumTran}
                    />
                  })}
                </div>
              </Card>
            </div>
          </div>
        )
        }
      </Form.List >
      {/* <br /> */}
      {/* <Row>
        <Col flex="120px">
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
        <Col xs={12} md={3}>
          <Form.Item
            labelCol={{ flex: '60px' }}
            // wrapperCol={{ xs: 24 }}
            label={t('weight')}
            name="totalWeight"
            style={{ marginBottom: 8 }}
          // rules={[{ required: true, message: 'Please input your weight!' }]}
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
        <Col flex="200px">
          <Form.Item
            labelCol={{ flex: '80px' }}
            // wrapperCol={{ xs: 24 }}
            label={t('volume')}
            name="totalVolume"
            style={{ marginBottom: 8 }}
            extra={<div style={{ fontSize: '12px' }}>กxยxส</div>}
          // rules={[{ required: true, message: 'Please input your volume!' }]}
          >
            <Input
              size="small"
              disabled
              style={{
                width: 80,
                backgroundColor: '#D5F3DB',
                color: '#535353',
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={3}>
          <Form.Item
            labelCol={{ xs: 8 }}
            wrapperCol={{ xs: 24 }}
            label={t('cod')}
            name="totalCod"
            style={{ marginBottom: 8 }}
          // rules={[{ required: true, message: 'Please input your COD!' }]}
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

        <Col xs={12} md={3}>
          <Form.Item
            labelCol={{ xs: 10 }}
            wrapperCol={{ xs: 24 }}
            label={t('shipping-cost')}
            name="totalTransportationPrice"
            style={{ marginBottom: 8 }}
          // rules={[{ required: true, message: 'Please input your shipping cost!' }]}
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
        <Col xs={12} md={4}>
          <Form.Item
            labelCol={{ xs: 14 }}
            wrapperCol={{ xs: 24 }}
            label={t('charge-cod-price')}
            name="totalChargeCodPrice"
            style={{ marginBottom: 8 }}
          // rules={[{ required: true, message: 'Please input your shipping cost!' }]}
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
        <Col flex="auto">
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
        </Col>
      </Row>
       */}
      <ModalComponent
        formBig={form}
        showModal={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        showCode={showCode}
      />
    </>
  );



};





export default ItemStoreSell;
