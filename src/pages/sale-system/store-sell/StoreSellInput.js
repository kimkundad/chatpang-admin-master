import React, { useEffect, useState, useRef } from 'react';
import { Form, Spin, Layout, Modal, message, Card, Button } from 'antd';
import { useHistory, Prompt } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import THBText from 'thai-baht-text';
import moment from 'moment';
import allAction from '../../../app/actions/index';
import HeaderStoreSell from './component/HeaderStoreSell';
// import ItemStoreSell from './component/ItemStoreSell';
import ItemStoreSell2 from './component/ItemStoreSell2';
import FooterStoreSell from './component/FooterStoreSell';
import StoreSellDetail2 from './StoreSellDetail2';
import './Antd.css';

import {
  orderItemsApi,
  // useGetOrderItemsImportQuery,
  // useDeleteOrderItemsMutation,
  // useCreateOrderMutation,
  // useRemoveDOfromOrderMutation,
  // useAddOrderItemsMutation,
  useGetOrderWithDosQuery
} from '../../../app/api/orderItemsApi';

const StoreSell = (props) => {
  // const { isLoading, isMobile, selectedKey } = useSelector(
  //   (state) => state.mainReducer
  // );

  const isLoading = useSelector(
    (state) => state.mainReducer.isLoading
  );
  const selectedKey = useSelector(
    (state) => state.mainReducer.selectedKey
  );

  const { isCustomer, userId, agencyId, companyId, userLevel } = useSelector(
    (state) => state.authenReducer
  );
  // const draftData = useSelector((state) => state.storeSellReducer.draftData);

  const { dec2, Knumber } = useSelector((state) => state.kaiUtilsReducer);

  const dispatch = useDispatch();

  const {
    match: {
      params: { orderId },
    },
    pageCode,
  } = props;

  const [showHeader, setShowHeader] = useState(true);
  const [keying, setKeying] = useState(false);
  const [shortSender, setShortSender] = useState({});
  const [newPage, setNewPage] = useState(false);
  const [readyToSave, setReadyToSave] = useState(false);
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);

  const [itemListData, setItemListData] = useState([])

  const [orderIdGet, setOrderIdGet] = useState()

  const hasBanArea = useRef('');

  const history = useHistory();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const {
    data: orderAllData,
    isFetching : isFetchingDO,
    isLoading : isLoadingDO,
    // isSuccess, /* */
    // isError,
    // error,
    // refetch,
  } = useGetOrderWithDosQuery(orderIdGet,
    {
      // pollingInterval: 3000,
      refetchOnMountOrArgChange: true,
      skip: !orderIdGet || !Number(orderIdGet),
    });

  useEffect(() => {
    if (orderId) console.log('getDetailPrintOrder', orderId);

    if (orderId != 'create') {
      console.log("getOrderWithDos3")
      setOrderIdGet(orderId)

      dispatch(allAction.storeSellAction.getDetailPrintOrder(orderId))
        .then((res) => {
          // console.log('getDetailPrintOrder', res);
        })
        .catch((e) => console.log('err', e));
    }
  }, [orderId]);

  useEffect(() => {
    if (orderAllData) {

      // items
      const itemList = [];
      const data = orderAllData;
      if (data) {
        if (
          data.items?.some((val) => val.transportationTypeCode !== 'EX')
        ) {
          dispatch(allAction.storeSellAction.checkTypeTrans(true));
        }

        form.setFieldsValue({
          // header
          companyId: data.header.agencyData.companyData.companyId || '',
          hubId: data.header.agencyData.hubData.hubId || '',
          agencyId: data.header.agencyId || '',
          receiptNo: data.header.receiptNo || null,
          soNo: data.header.soNo || null,
          date: data.header.date
            ? moment(new Date(data.header.date), 'YYYY-MM-DD')
            : null,
          paymentDate: data.header.paymentDate
            ? moment(new Date(data.header.paymentDate), 'YYYY-MM-DD')
            : null,
          paymentTypeCode: data.header.paymentTypeCode || '',
          customerId: data.header.customerId || '',
          customerInput: data.header.customerInput || '',
          customerAddressId: data.header.customerAddressId || '',
          customerName: data.header.customerName || '',
          customerLastName: data.header.customerLastName || '',
          customerSumName: data.header.customerName
            ? `${data.header.customerName} ${data.header.customerLastName}`
            : '',
          addressCustomer: sumAddressCustomer(data.header) || '',
          addressSender: sumAddressSender(data.header) || '',
          customerNo: data.header.customerNo || '',
          customerMoo: data.header.customerMoo || '',
          customerAlley: data.header.customerAlley || '',
          customerRoad: data.header.customerRoad || '',
          customerDistrictId: data.header.customerDistrictId || '',
          customerSubdistrictId: data.header.customerSubdistrictId || '',
          customerProvinceId: data.header.customerProvinceId || '',
          customerPostcode: data.header.customerPostcode || '',
          customerAddressOther: data.header.customerAddressOther || '',
          customerTaxpayerNumber: data.header.customerTaxpayerNumber || '',
          customerBankAccountNo:
            data.header.customerBankAccountNo || null,
          customerBankAccountName:
            data.header.customerBankAccountName || null,
          customerBankName:
            data.header.customerBankData?.bankData?.bankName || null,
          customerBankId: data.header.customerBankId || null,
          senderId: data.header.senderId || '',
          senderInput: data.header.senderInput || '',
          senderAddressId: data.header.senderAddressId || '',
          senderName: data.header.senderName || '',
          senderLastName: data.header.senderLastName || '',
          senderSumName: data.header.senderName
            ? `${data.header.senderName} ${data.header.senderLastName}`
            : '',
          senderNo: data.header.senderNo || '',
          senderMoo: data.header.senderMoo || '',
          senderAlley: data.header.senderAlley || '',
          senderRoad: data.header.senderRoad || '',
          senderDistrictId: data.header.senderDistrictId || '',
          senderSubdistrictId: data.header.senderSubdistrictId || '',
          senderProvinceId: data.header.senderProvinceId || '',
          senderPostcode: data.header.senderPostcode || '',
          senderAddressOther: data.header.senderAddressOther || '',
          senderTaxpayerNumber: data.header.senderTaxpayerNumber || '',
          recommenderId: data.header.recommenderId || null,
          recommenderInput: data.header.recommenderInput || null,
          recommenderName: data.header.recommenderName || null,
          recommenderLastName: data.header.recommenderLastName || null,
          recommenderSumName: data.header.recommenderName
            ? `${data.header.recommenderName} ${data.header.recommenderLastName}`
            : '',

          // itemStoreSell: itemList,
          // footer
          totalItem: dec2(data.footer.totalItem) || 1,
          totalWeight: dec2(data.footer.totalWeight) || '',
          totalVolume: dec2(data.footer.totalVolume) || '',
          totalDimension: data.footer.totalDimension || '',
          totalCod: dec2(data.footer.totalCod) || '',
          totalTransportationPrice:
            dec2(data.footer.totalTransportationPrice) || '',
          totalChargeCodPrice: dec2(data.footer.totalChargeCodPrice) || '',
          totalNettransportationPrice:
            dec2(data.footer.totalNettransportationPrice) || '',
          remark: data.footer.remark || '',
          discountText: data.footer.discountText || '',
          discountPercent: data.footer.discountPercent
            ? Knumber(data?.footer?.discountPercent, "discountPercent")
            : '',
          discountAmount: dec2(data.footer.discountAmount) || '',
          transportationPriceAfterDiscount:
            dec2(data.footer.transportationPriceAfterDiscount) || '',
          morePriceText: data.footer.morePriceText || '',
          morePriceAmount: dec2(data.footer.morePriceAmount) || '',
          etc: data.footer.etc || '',
          etcAmount: dec2(data.footer.etcAmount),
          totalPrice: dec2(data.footer.totalPrice),
          totalPriceText: data?.footer?.totalPrice
            ? THBText(data?.footer?.totalPrice)
            : '-',
        });
        dispatch(allAction.storeSellAction.setButtonFlagHeader(true));
        setShortSender({
          senderSumName: data?.header?.customerName
            ? `${data.header.customerName} ${data.header.customerLastName}`
            : '',
          addressCustomer: sumAddressCustomer(data.header) || '',
        });

        dispatch(allAction.orderItemImportAction.setFormUpdate(form.getFieldsValue()))

        const query = {
          customerSearch: data?.header?.customerInput,
          companyId: companyId || data?.header?.agencyData?.companyData?.companyId,
        };

        dispatch(allAction.storeSellAction.getAgencyDiscount(agencyId, query))

      } else {
        message.error('data not found');
        window.location.hash.includes('/edit')
          ? history.push('../../store-sell/create')
          : history.push('./');
      }

    }
  }, [orderAllData])

  const openNewOrder = () => {
    setNewPage(true);
    history.push('../store-sell/create');
  };

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

  // useEffect(() => {
  //   window.onbeforeunload = confirmExit;
  //   function confirmExit() {
  //     return 'show warning';
  //   }
  // }, []);

  // useEffect(() => {
  //   alert(orderTotalPrice)
  // }, [orderTotalPrice])



  useEffect(() => {
    // console.log("form.getFieldsValue()",form.getFieldsValue())
    const vals = form.getFieldsValue()
    // console.log("vals",vals)
    if (!showHeader) {
      setShortSender({
        senderSumName: `${vals?.customerSumName || ''}`,
        addressCustomer: vals?.addressSender || '',
      });
    }
  }, [showHeader])

  useEffect(() => {
    if (setNewPage) {
      console.log('form error5', form);
      console.log('setNewPage(false)');
      dispatch(allAction.storeSellAction.setFlagHeader(false));
      if (window.location.hash.includes('/store-sell/create')) {
        form.resetFields();
        form.setFieldsValue({
          paymentTypeCode: 'CAS',
          date: moment(moment(), 'YYYY-MM-DD'),
        });

        setShowHeader(true);
        setShortSender({});
        setNewPage(false);

        if (isCustomer) {
          dispatch(
            allAction.storeSellAction.getStoreCustomerDetailByUser(userId)
          )
            .then((data) => {
              const keys = form.getFieldValue();
              let addressRes = '';
              if (data) {
                console.log('isCus', data);
                const query = {
                  customerSearch: data.phoneNumber || data.taxpayerNumber,
                  companyId: companyId || keys.companyId,
                };
                dispatch(
                  allAction.storeSellAction.getAgencyDiscount(
                    agencyId || keys.agencyId,
                    query
                  )
                )
                  .then()
                  .catch((e) => message.error(e.message));
                data.customerAddressData.filter((val) => {
                  if (val.defaultAddress) {
                    const moo = val.moo
                      ? `${t('address-village')}${val.moo}`
                      : '';
                    const alley = val.alley
                      ? `${t('address-lane')}${val.alley}`
                      : '';
                    const road = val.road
                      ? `${t('address-road')}${val.road}`
                      : '';
                    const subdistrict = val.subdistrictData?.subdistrictName
                      ? `${t('address-sub-district')}${val.subdistrictData.subdistrictName
                      }`
                      : '';
                    const district = val.districtData?.districtName
                      ? `${t('address-district')}${val.districtData.districtName
                      }`
                      : '';
                    const provice = val.provinceData?.provinceName
                      ? `${t('address-provice')}${val.provinceData.provinceName
                      }`
                      : '';
                    const postcode = val.postcode ? `${val.postcode}` : '';
                    addressRes = `${val.no} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;
                    form.setFieldsValue({
                      ...keys,
                      customerAddressId: val.customerAddressId,
                      customerNo: val.no,
                      customerMoo: val.moo || null,
                      customerAlley: val.alley || null,
                      customerRoad: val.road || null,
                      customerDistrictId: val.districtData?.districtId || null,
                      customerSubdistrictId:
                        val.subdistrictData?.subdistrictId || null,
                      customerProvinceId: val.provinceData?.provinceId || null,
                      customerPostcode: val.postcode || null,
                      customerAddressOther: val.other || null,
                      customerTaxpayerNumber: data?.taxpayerNumber || null,
                      senderAddressId: val.customerAddressId,
                      senderNo: val.no,
                      senderMoo: val.moo || null,
                      senderAlley: val.alley || null,
                      senderRoad: val.road || null,
                      senderDistrictId: val.districtData?.districtId || null,
                      senderSubdistrictId:
                        val.subdistrictData?.subdistrictId || null,
                      senderProvinceId: val.provinceData?.provinceId || null,
                      senderPostcode: val.postcode || null,
                      senderAddressOther: val.other || null,
                      senderTaxpayerNumber: data?.taxpayerNumber || null,
                      discountPercent: data?.discountRate || null,
                    });
                  }
                });

                form.setFieldsValue({
                  ...keys,
                  customerId: data.customerId,
                  customerInput: data.phoneNumber || data.taxpayerNumber,
                  customerName: data.customerName || '',
                  customerLastName: data.customerLastName || '',
                  customerSumName: data.customerName
                    ? `${data.customerName} ${data.customerLastName || ''}`
                    : '-',
                  addressCustomer: addressRes,
                  customerBankName:
                    data.customerBankData[0]?.bankData?.bankName || '',
                  customerBankAccountNo:
                    data.customerBankData[0]?.bankAccountNo || '',
                  customerBankAccountName:
                    data.customerBankData[0]?.bankAccountName || '',
                  customerBankId:
                    data.customerBankData[0]?.customerBankId || '',
                  senderId: data.customerId,
                  senderInput: data.phoneNumber || data.taxpayerNumber,
                  senderName: data.customerName || '',
                  senderLastName: data.customerLastName || '',
                  senderSumName: data.customerName
                    ? `${data.customerName} ${data.customerLastName || ''}`
                    : '-',
                  addressSender: addressRes,
                });

                console.log("senderSumName")
                // setShortSender({
                //   senderSumName: `${data?.customerName} ${data?.customerLastName}` ,
                //   customerName: data?.customerName || '',
                //   customerLastName: data?.customerLastName || '',
                //   // addressCustomer: data?.addressRes || '',
                // });
              }
            })
            .catch((e) => message.error(e.message));
        }
      } 
    }
    return () => {
      dispatch(allAction.storeSellAction.checkTypeTrans(false));
    };
  }, [window.location.hash, newPage]);

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
    const road = val.senderRoad ? `${t('address-road')}${val.senderRoad}` : '';
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

  const validateFinish = (value) => {
    if (
      (agencyId || value.agencyId) &&
      (value.receiptNo || value.soNo) &&
      value.date &&
      value.paymentTypeCode &&
      value.customerId &&
      value.customerInput &&
      value.customerAddressId &&
      value.customerName &&
      value.customerNo &&
      value.customerDistrictId &&
      value.customerSubdistrictId &&
      value.customerProvinceId &&
      value.customerPostcode &&
      value.senderId &&
      value.senderInput &&
      value.senderAddressId &&
      value.senderName &&
      value.senderNo &&
      value.senderDistrictId &&
      value.senderSubdistrictId &&
      value.senderProvinceId &&
      value.senderPostcode
    ) {
      return true;
    }
    return false;
  };

  const onFinish = async () => {
    // if (!checkAllItem()) {
    //   return false;
    // }

    if (hasBanArea.current) {
      message.error(hasBanArea.current);
      return false;
    }
    setKeying(false);
    const value = form.getFieldValue();
    const newValue = {};

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

    let header_errs = [];
    if (validateError?.errorFields?.length > 0) {
      header_errs = validateError.errorFields.filter(
        (err) =>
          // console.log(err.name[0])
          headerValidates.indexOf(err?.name[0]) > -1
      );
    }

    // console.log("header_errs", header_errs)

    if (header_errs?.length > 0) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }

    if (validateError) {
      return false;
    }

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
      customerInput: value.customerInput,
      customerAddressId: value.customerAddressId,
      customerName: value.customerName,
      customerLastName: value.customerLastName || '',
      customerNo: value.customerNo,
      customerMoo: value.customerMoo,
      customerAlley: value.customerAlley,
      customerRoad: value.customerRoad,
      customerDistrictId: value.customerDistrictId,
      customerSubdistrictId: value.customerSubdistrictId,
      customerProvinceId: value.customerProvinceId,
      customerPostcode: value.customerPostcode,
      customerBankAccountNo: value.customerBankAccountNo || null,
      customerBankAccountName: value.customerBankAccountName || null,
      customerBankId: value.customerBankId || null,
      senderId: value.senderId,
      senderInput: value.senderInput,
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
      recommenderInput: value.recommenderInput,
      recommenderName: value.recommenderName,
      recommenderLastName: value.recommenderLastName,
    };


    newValue.footer = {
      totalItem: Knumber(value?.totalItem) || 0,
      totalWeight: Knumber(value?.totalWeight) || 0,
      totalVolume: Knumber(value?.totalVolume) || 0,
      totalDimension: Knumber(value?.totalDimension) || 0,
      totalCod: Knumber(value?.totalCod) || 0,
      totalTransportationPrice: Knumber(value?.totalTransportationPrice) || 0,
      totalChargeCodPrice: Knumber(value?.totalChargeCodPrice) || 0,
      totalNettransportationPrice: Knumber(value?.totalNettransportationPrice) || 0,
      remark: value?.remark || '',
      discountText: value?.discountText || '',
      discountPercent: value?.discountPercent || 0,
      discountAmount: Knumber(value?.discountAmount || 0),
      transportationPriceAfterDiscount:
        Knumber(value?.transportationPriceAfterDiscount) || 0,
      morePriceText: value?.morePriceText || '',
      morePriceAmount: Knumber(value?.morePriceAmount) || 0,
      etc: value?.etc || '',
      etcAmount: Knumber(value?.etcAmount) || 0,
      totalPrice: Knumber(value?.totalPrice) || 0,
    };
    // console.log('newValue', newValue);
    if (validateFinish(value)) {
      // console.log(draftData?.orderId, orderId);
      // if (orderId === 'create') {
      Modal.confirm({
        title: 'คุณต้องการจะบันทึกใช่ไหม?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          // const id = draftData?.orderId || orderId;
          const id = orderId;
          dispatch(allAction.storeSellAction.updateDraft(id, newValue))
            .then(() => {
              // history.push(
              //   orderId === 'create'
              //     ? `./${draftData?.orderId}`
              //     : `../../store-sell/${orderId}`
              // );
              history.push(`../../store-sell/${orderId}`);
              message.success('Update Success!');
            })
            .catch((e) => {
              if (e.statusCode === 402) {
                if (!isCustomer) {
                  dispatch(
                    allAction.storeWallet.getAgencyWallet({
                      agencyId: agencyId || value.agencyId,
                    })
                  )
                    .then()
                    .catch((e) => message.error(e.message));
                  message.error(e.message);
                }
              }
              console.log(e);
              message.error(e.message);
            });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
      // } else {
      //   Modal.confirm({
      //     title: 'Do you want to update order?',
      //     icon: <ExclamationCircleOutlined />,
      //     onOk() {
      //       dispatch(allAction.storeSellAction.updateOrder(orderId, newValue))
      //         .then(() => {
      //           history.push(`./${orderId}`);
      //           message.success('Update Success!');
      //         })
      //         .catch((e) => message.error(e.message));
      //     },
      //     onCancel() {
      //       console.log('Cancel');
      //     },
      //   });
      // }
    }
  };

  const onCancelOrder = () => {
    // console.log(draftData, orderId);
    Modal.confirm({
      title: 'Do you want to cancel draft order?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(
          // allAction.storeSellAction.cancelDraft(draftData.orderId || orderId)
          allAction.storeSellAction.cancelDraft(orderId)
        )
          .then(() => {
            if (agencyId) {
              dispatch(allAction.storeWallet.getAgencyWallet(agencyId));
            }
            dispatch(orderItemsApi.util.invalidateTags(['OrderItems', 'Recipient', 'Orders']))
            message.success('Cancel Success!');
            // history.push(orderId === 'create' ? './' : `${selectedKey}`);
            history.push('../create')
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };
  // console.log(window.location.hash.includes('/edit'));

  if (orderId !== 'create' && !window.location.hash.includes('/edit')) {
    return <StoreSellDetail2 itemListData={itemListData} openNewOrder={openNewOrder} {...props} />;
  }

  if (newPage) return <></>;
  return (
    <>
      <Prompt
        when={keying}
        message={(location) =>
          '! ยังไม่ได้บันทึกข้อมูล คุณต้องการออกจากหน้าเปิดการขายใช่หรือไม่'
        }
      />
      <Spin spinning={isLoading || isLoadingDO || isFetchingDO } tip="Loading...">
        <Layout className="pos_form">
          {/* <Row align="middle" headStyle={{ padding: 0 }}>
            <Col xs={24} md={12}>
              <Typography.Title level={3}>
                <span className="text-primary">{t('store-sell')}</span>
              </Typography.Title>
            </Col>
            {(FilterUserLevel(['AGN']) && !isCustomer) && (
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
                    <Input disabled value="3000" />
                  </Col>
                  <Col flex="auto" style={{ paddingLeft: 5 }}>
                    {t('thb')}
                  </Col>
                  <Col flex="auto" style={{ paddingLeft: 10 }}>
                    <Image src={MpayIcon} width={40} />
                  </Col>
                </Row>

              </Col>
            )}
          </Row> */}
          <Card headStyle={{ padding: '0px 16px', }} bodyStyle={{ padding: 6 }}>
            <Form
              name="store-sell"
              form={form}
              {...formItemLayout}
              scrollToFirstError="auto"
              onValuesChange={(v) => {
                console.log("Form Update 1!", form.getFieldsValue());
                dispatch(allAction.orderItemImportAction.setFormUpdate(form.getFieldsValue()))

              }}
              onFinish={(e) => onFinish(e)}
            >
              <div style={{ display: showHeader ? 'initial' : 'none' }}>
                <HeaderStoreSell
                  form={form}
                  {...props}
                  setShortSender={setShortSender}
                />
              </div>
              {/* <ItemStoreSell
                {...props}
                hasBanArea={hasBanArea}
                form={form}
                showHeader={showHeader}
                setShowHeader={setShowHeader}
                shortSender={shortSender}
                setKeying={setKeying}
                setOrderTotalPrice={setOrderTotalPrice}
                checkAllItem={checkAllItem}
              /> */}
              <ItemStoreSell2
                hasBanArea={hasBanArea}
                showHeader={showHeader}
                shortSender={shortSender}
                setShowHeader={setShowHeader}
                itemListData={itemListData}
                orderId={orderId}
                form={form}
              //  {...props}
              />
              {/* <br /> */}
              <Card bodyStyle={{ padding: 0 }}>
                <FooterStoreSell
                  hasBanArea={hasBanArea}
                  form={form}
                  {...props}
                  onCancelOrder={onCancelOrder}
                  onFinish={onFinish}
                />
              </Card>

            </Form>
          </Card>
        </Layout>
      </Spin>
    </>
  );
};

export default StoreSell;


// function dec2(x) {
//   console.log("nc-1", x)
//   var ret = KNumberK(x)

//   // var ret = "0"
//   if (!x) ret = "0"
//   else ret = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   console.log("nc-2", ret)

//   return ret

// }
