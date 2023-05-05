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
    Descriptions,
    Tag,
    Tooltip
} from 'antd';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import {
    KnumberOutlined, QrcodeOutlined, SaveOutlined,
    UserAddOutlined, HomeOutlined
} from '@ant-design/icons';

import ChangeAddressMain from './ChangeAddressMain';

// import ShowNo from "./showNO"

import allAction from '../../../../../app/actions';

// import ButtonPrint from '../Printing/ButtonPrint';
// import ButtonPrinting from '../Printing/ButtonPrinting';
import ItemStoreSellPostcode from "./ItemStoreSellPostcode"
// import PrintSticker from "../Printing/PrintSticker"

import {
    useUpsertOrderItemMutation
} from '../../../../../app/api/orderItemsApi';


const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const fk = 0;

const enumCaling = ['', 'validating', 'error', 'success']

const ItemCardEdit = (props) => {
    const {
        form,
        editingDoNo,
        // calTransItemPressEnter,
        calWeightItem,
        chkChange,
        hasBanArea

    } = props;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCode, setShowCode] = useState('');

    const { dec2, Knumber } = useSelector((state) => state.kaiUtilsReducer);

    // const hubId = useSelector((state) => state.authenReducer.hubId);
    const agencyId = useSelector((state) => state.authenReducer.agencyId);
    const userLevel = useSelector((state) => state.authenReducer.userLevel);
    // const isCustomer = useSelector((state) => state.authenReducer.isCustomer);
    const companyId = useSelector(
        (state) => state.authenReducer.companyId
    );

    const editingDo = useSelector((state) => state.orderItemImportReducer.editingDo);
    const discountPercent = useSelector((state) => state.orderItemImportReducer.discountPercent);
    const morePriceAmount = useSelector((state) => state.orderItemImportReducer.morePriceAmount);
    const etcAmount = useSelector((state) => state.orderItemImportReducer.etcAmount);
    const showDoForm = useSelector((state) => state.orderItemImportReducer.showDoForm);

    const masterTransportationType = useSelector((state) => state.storeSellReducer.masterTransportationType);

    const agencyCodList = useSelector((state) => state.storeSellReducer.agencyCodList);
    const parcelTypeData = useSelector((state) => state.storeSellReducer.parcelTypeData);

    const [showChangeAddress, setShowChangeAddress] = useState(false)

    const [billType, setBillType] = useState("EX")

    const cacheCalRef = useRef({})
    const cacheSpecialPriceRef = useRef({})

    const [caling, setCaling] = useState(0);

    // const { isMobile, isLoading } = useSelector((state) => state.mainReducer);

    const [isMobile, setIsMobile] = useState(false)
    const [whvKeying, setSetWhvKeying] = useState(false)

    const [transPriceBox, setTransPriceBox] = useState(0)
    const [codChargedBox, setCodChargedBox] = useState(0)

    const [isDataLoading, setIsDataLoading] = useState(false);

    const scrollToRef = () => myRef.current.scrollIntoView();
    const myRef = useRef(null);
    const keyinTimeout1 = useRef(null);
    const keyinTimeout2 = useRef(null);

    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [isNewAddress, setIsNewAddress] = useState(false);

    const [refreshPhoneNo, setRefreshPhoneNo] = useState();


    const [formDo] = Form.useForm();

    const itemLayout = {
        xs: 24,
        sm: 12,
        lg: 3,
    };

    const formItemStyle = { marginBottom: 12 };


    useEffect(() => {
        console.log("discountPercent", discountPercent)
    }, [discountPercent])

    const printSticker = useRef();


    // const {
    //     data: OrderItems,
    //     isFetching,
    //     isLoading,
    //     isSuccess, /* */
    //     isError,
    //     error,
    //     refetch,
    //   } = useGetOrderItemsImportQuery(filterState);

    //   const [deleteOrderItems] = useDeleteOrderItemsMutation();

    // ถ้า fetch ไม่ได้ให้เคลีย table ไปเลย
    // useEffect(() => {
    //   if (!isFetching && !isLoading) {
    //     if (isError) setRowData([])
    //   }
    // }, [isFetching, isLoading])

    //   const [createOrder] = useCreateOrderMutation();
    const [upsertOrderItem] = useUpsertOrderItemMutation();


    useEffect(() => {
        if (billType == 'COD' && !editingDo) {
            formDo.setFieldsValue({ ratePercent: agencyCodList.at(-1) })
        }
    }, [billType])


    useEffect(() => {
        console.log("editingDo", editingDo)
        if (!editingDo) {
            formDo.setFieldsValue({
                doNo: "(เพิ่มพัสดุ)",
            });
        } else {
            setBillType(editingDo.transportationTypeCode)
            setTransPriceBox(editingDo.transportationPrice)
            setCodChargedBox(editingDo.chargeCodPrice)

            formDo.setFieldsValue({ ...editingDo, chargeCodPrice : dec2(editingDo.chargeCodPrice) });
        }
    }, [editingDo])

    useEffect(() => {

        const keys = form.getFieldsValue();

        const itemSs = formDo.getFieldsValue();

        const totalItem = (showDoForm && !editingDo) ? Knumber(keys.totalItem) + 1 : Knumber(keys.totalItem);

        const adding =
            (Knumber(keys.etcAmount || 0) + Knumber(keys.morePriceAmount || 0)) / totalItem

        const dis =
            Knumber(keys?.discountPercent ? keys?.discountPercent / 100 : 0) *
            Knumber(itemSs?.transportationPrice || 0);

        itemSs.transportationNetPrice =
            (Knumber(transPriceBox || 0) + Knumber(codChargedBox) + adding - dis).toFixed(2);
        itemSs.transportationNetPrice = dec2(itemSs.transportationNetPrice)

        Knumber(itemSs?.transportationPrice) == 0 ? itemSs.transportationNetPrice = "0" : null

        formDo.setFieldsValue({ ...itemSs })

        console.log("useEffect1", itemSs.transportationNetPrice)

    }, [caling, showDoForm, editingDo, codChargedBox, transPriceBox, discountPercent, morePriceAmount, etcAmount])

    useEffect(() => {
        setIsNewAddress(false)
        setIsNewCustomer(false)

        setRefreshPhoneNo(new Date())

        console.log("useEffect2")
    }, [editingDo]);

    useEffect(() => {
        if (editingDo == null) {
            setBillType("EX")
            formDo.resetFields()
            setIsNewCustomer(false)
            setIsNewAddress(false)
            formDo.setFieldsValue({
                doNo: "(เพิ่มพัสดุ)",
            });
        }
    }, [editingDo]);

    useEffect(() => {
        console.log("useEffect3")
        return () => {
            resetDoForm()
            // dispatch(allAction.orderItemImportAction.setEditingDo(null))
            // setCodChargedBox(0)
        }
    }, [])

    const waitKeyIn1 = (e, key) => {
        // console.log("waitKeyIn1",e)

        clearTimeout(keyinTimeout1.current);
        setIsDataLoading(true)

        const val = e.replace(/[^0-9]|\s/g, '')

        // console.log("waitKeyIn1-val",val)

        formDo.setFieldsValue({ recipientInput: val })

        keyinTimeout1.current = setTimeout(() => {
            try {
                onSearchCustomer(val, key)
            } catch (e) {
                console.log("ERROR calTransItem(e, key)", e)
                setCaling(2)
                setIsDataLoading(false)
            }
        }, 1000);
    };

    const waitKeyIn2 = (func, e, key) => {
        setIsDataLoading(true)
        clearTimeout(keyinTimeout2.current);
        keyinTimeout2.current = setTimeout(() => {
            try {
                func(e, key)
            } catch (e) {
                console.log("ERROR calTransItem(e, key)", e)
                setCaling(2)
                setIsDataLoading(false)
            }
        }, 1000);
    };

    const setFormDoFields = (addCus) => {

        // const keys = formDo.getFieldsValue();

        formDo.setFieldsValue({
            // ...formDo.getFieldsValue(),
            ...addCus,
        });

        console.log("item", formDo.getFieldsValue())
    }

    const resetDoForm = () => {
        dispatch(allAction.orderItemImportAction.setEditingDo(null))
        setCodChargedBox(0)
        setBillType("EX")
        formDo.resetFields()

        setIsNewCustomer(false)
        setIsNewAddress(false)
        formDo.setFieldsValue({
            doNo: "(เพิ่มพัสดุ)",
        });
    }

    const onFinish = async () => {
        setIsDataLoading(true)

        let validateError = null;
        await formDo
            .validateFields()
            .then((response) => {
                validateError = null;
            })
            .catch((e) => {
                validateError = e;
                // console.log("validateError", validateError);
            });

        if (hasBanArea.current) {
            message.error(hasBanArea.current);
            setIsDataLoading(false)
            return false;
        }

        if (validateError) {
            setIsDataLoading(false)
            return;
        }

        const value = form.getFieldValue();

        console.log("header value",value)

        var header = {};
        header = {
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
            customerAddressOther: value.customerAddressOther,
            customerTaxpayerNumber: value.customerTaxpayerNumber,
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
            senderAddressOther: value.senderAddressOther,
            senderTaxpayerNumber: value.senderTaxpayerNumber,
            recommenderId: value.recommenderId,
            recommenderInput: value.recommenderInput,
            recommenderName: value.recommenderName,
            recommenderLastName: value.recommenderLastName,
        };


        const footer = {
            totalItem: form.getFieldValue('totalItem') ? Knumber(form.getFieldValue('totalItem')) + 1 : 0,
            totalWeight: Knumber(form.getFieldValue('totalWeight')),
            totalVolume: Knumber(form.getFieldValue('totalVolume')),
            totalDimension: Knumber(form.getFieldValue('totalDimension')),
            totalCod: Knumber(form.getFieldValue('totalCod')),
            totalTransportationPrice:
                Knumber(form.getFieldValue('totalTransportationPrice')),
            totalChargeCodPrice: Knumber(form.getFieldValue('totalChargeCodPrice')),
            totalNettransportationPrice:
                Knumber(form.getFieldValue('totalNettransportationPrice')),
            remark: form.getFieldValue('remark') || '',
            discountText: form.getFieldValue('discountText') || '',
            discountPercent: form.getFieldValue('discountPercent') || 0,
            discountAmount: Knumber(form.getFieldValue('discountAmount')),
            transportationPriceAfterDiscount:
                Knumber(form.getFieldValue('transportationPriceAfterDiscount')),
            morePriceText: form.getFieldValue('morePriceText') || '',
            morePriceAmount: Knumber(form.getFieldValue('morePriceAmount')),
            etc: form.getFieldValue('etc') || '',
            etcAmount: Knumber(form.getFieldValue('etcAmount')),
            totalPrice: Knumber(form.getFieldValue('totalPrice')),
        };

        const item = formDo.getFieldsValue();

        console.log("formDo.getFieldsValue()", formDo.getFieldsValue())
        console.log("form.getFieldsValue()", form.getFieldsValue())

        var prepareSend = {}

        prepareSend["header"] = header;
        prepareSend["footer"] = footer;
        prepareSend["item"] = item;
        prepareSend["item"]["dimension"] =
            Knumber(item.height) + Knumber(item.length) + Knumber(item.width)
        prepareSend["item"]["volume"] =
            Knumber(item.height) * Knumber(item.length) * Knumber(item.width)

        prepareSend["item"]["agencyId"] = agencyId || form.getFieldValue('agencyId')
        prepareSend["item"]["senderId"] = form.getFieldValue('senderId')
        prepareSend["item"]["senderInput"] = form.getFieldValue('senderInput')

        prepareSend["item"]["transportationNetPrice"] = Knumber(formDo.getFieldValue('transportationNetPrice'))
        prepareSend["item"]["transportationPrice"] = Knumber(formDo.getFieldValue('transportationPrice'))

        prepareSend["item"]["chargeCodPrice"] = Knumber(formDo.getFieldValue('chargeCodPrice'))

        prepareSend["item"]["height"] = Knumber(formDo.getFieldValue('height'))
        prepareSend["item"]["length"] = Knumber(formDo.getFieldValue('length'))

        // ***
        prepareSend["item"]["newAddress"] = isNewCustomer ? false : isNewAddress


        if (prepareSend["item"]?.doNo == "(เพิ่มพัสดุ)") {
            delete prepareSend["item"]?.doNo
        } else {
            prepareSend["item"]["orderItemId"] = editingDo?.orderItemId
        }
        console.log("orderId", form.getFieldValue("orderId"))

        upsertOrderItem({ orderId: props.orderId, patch: prepareSend })
            .unwrap()
            .then((data) => {
                console.log("upsertOrderItem", data)
                if (data?.success) {
                    message.success("บันทึกเรียบร้อย")

                    //****//
                    resetDoForm()
                    // dispatch(allAction.orderItemImportAction.setEditingDo(null))
                    // setCodChargedBox(0)
                    // setBillType("EX")
                    // formDo.resetFields()
                    //****//

                    formDo.setFieldsValue({
                        doNo: "(เพิ่มพัสดุ)",
                    });
                }
                setIsNewCustomer(false)
                setIsNewAddress(false)
                setIsDataLoading(false)
            }).catch((e) => {
                message.error("ERROR")
                setIsDataLoading(false)
            })

        console.log("prepareSend", prepareSend)
    }

    const calTransItemPressEnter = (e, key) => {
        if (e.code === 'Enter') {
            calTransItem();
        }
    };
    const calTransItem = () => {
        // console.log('key', key, form.getFieldsValue());

        console.time("step1");
        const keys = form.getFieldsValue();
        const itemSs = formDo.getFieldsValue();

        console.log("itemSs", itemSs)


        if (!(itemSs?.recipientProvinceId &&
            itemSs?.recipientDistrictId &&
            itemSs?.recipientSubdistrictId && itemSs?.recipientPostcode)) return false;

        console.timeEnd("step1");

        console.log("step2", itemSs)
        if (itemSs.recipientPostcode.length != 5) return false;
        console.time("step3");

        if (
            Knumber(itemSs.weight || 0) &&
            Knumber(itemSs.height || 0) &&
            Knumber(itemSs.length || 0) &&
            Knumber(itemSs.width || 0)
        ) {
            // chkChange.current = false
            setCaling(1);

            let totalTransportationPrice = 0;
            let totalNettransportationPrice = 0;
            let totalChargeCodPrice = 0;
            let totalCod = 0;

            // const itemSs = keys.itemStoreSell[key];
            const comId = companyId
            const weight = Knumber(itemSs.weight || 0);
            const dimension =
                Knumber(itemSs.height || 0) +
                Knumber(itemSs.length || 0) +
                Knumber(itemSs.width || 0);
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
                                if (Knumber(res) > Knumber(data)) {
                                    transP = Knumber(res)
                                } else {
                                    transP = Knumber(data)

                                }

                                console.log("transportationPrice", transP)

                                // const itemSs2 = formDo.getFieldsValue();

                                const itemSs2 = {}
                                itemSs2.transportationPrice = dec2(transP);
                                setTransPriceBox(dec2(transP))

                                formDo.setFieldsValue({ ...itemSs2 })
                                setCaling(3);
                                setIsDataLoading(false)
                                // console.timeEnd("step9");


                            }
                        );
                })
                .catch((e) => {
                    // const itemSs2 = formDo.getFieldsValue();

                    const itemSs2 = {}
                    itemSs2.transportationPrice = 0;
                    setTransPriceBox(0)
                    formDo.setFieldsValue({ ...itemSs2 })
                    // // setOrderTotalPrice(0)
                    // form.setFieldsValue({
                    //     ...keys,
                    //     [keys.itemStoreSell[key]]: itemSs,
                    //     // totalTransportationPrice : 0,
                    //     // totalNettransportationPrice : 0,
                    //     // totalChargeCodPrice : 0,
                    //     // totalCod : 0,
                    //     // totalPrice: 0
                    // });
                    message.error(e.message);
                    setCaling(2);
                    // setIsDataLoading(false)
                });
        }
    };

    const checkCOD = (e, key) => {
        // const keys = form.getFieldsValue();
        const itemSs = formDo.getFieldsValue();
        const newItemSs = {}

        if (itemSs.transportationTypeCode === 'EX') {
            newItemSs.cod = 0;
            newItemSs.ratePercent = 0;
            newItemSs.chargeCodPrice = 0.00;
            setCodChargedBox(0);
        } else {
            newItemSs.cod = Knumber(itemSs.cod) > 0 ? itemSs.cod : '';
        }

        formDo.setFieldsValue({ ...newItemSs })

        // calCOD();
        calChargeCod(key);
    };

    const calChargeCod = (key) => {
        let totalChargeCodPrice = 0;
        let totalNettransportationPrice = 0;
        const keys = form.getFieldsValue();

        const itemSs = formDo.getFieldsValue();
        const newItemSs = {}

        const cod = Knumber(itemSs.cod || 0);
        const rate = Knumber(itemSs.ratePercent || 0);
        const chargeCodPrice = dec2(Knumber(cod * (rate / 100)).toFixed(2));

        // const adding =
        //     (Knumber(keys.etcAmount || 0) + Knumber(keys.morePriceAmount || 0)) /
        //     keys.totalItem;
        // const dis =
        //     Knumber(keys?.discountPercent ? keys?.discountPercent / 100 : 0) *
        //     Knumber(itemSs?.transportationPrice || 0);

        newItemSs.chargeCodPrice = chargeCodPrice;

        // itemSs.transportationNetPrice =
        //     (Knumber(itemSs.transportationPrice || 0) + Knumber(chargeCodPrice) + adding - dis).toFixed(2);

        console.log("calChargeCod", newItemSs)
        formDo.setFieldsValue({ ...newItemSs })

        setCodChargedBox(newItemSs.chargeCodPrice)

        // calDiscount(keys.discountPercent || 0);
    };

    function isInputNumber(evt) {
        const ch = String.fromCharCode(evt.which);

        if (!/[0-9]/.test(ch)) {
            evt.preventDefault();
        }
    }

    const resetAddressForm = () => {
        const itemSs2 = {}
        itemSs2.recipientId = null;
        itemSs2.recipientName = '';
        itemSs2.recipientLastName = '';
        itemSs2.recipientAddressId = null;
        itemSs2.recipientNo = '';
        itemSs2.recipientMoo = '';
        itemSs2.recipientAlley = '';
        itemSs2.recipientRoad = '';
        itemSs2.recipientDistrictId = '';
        itemSs2.recipientDistrictName = '';
        itemSs2.recipientSubdistrictId = '';
        itemSs2.recipientSubdistrictName = '';
        itemSs2.recipientProvinceId = '';
        itemSs2.recipientProvinceName = '';
        itemSs2.recipientPostcode = '';
        itemSs2.recipientOther = '';

        // const itemSs1 = formDo.getFieldsValue();
        formDo.setFieldsValue({ ...itemSs2 });
    }

    const onSearchCustomer = (e, key) => {
        // form.resetFields(['customerName', 'addressCustomer']);

        console.log("onSearchCustomer1")
        if ((e.length > 8 && e.length < 11) || e.length === 0) {
            console.log('onSearchCustomer2', e, key, form.getFieldValue());

            const keys = form.getFieldValue();
            const itemSs = formDo.getFieldsValue();

            const objSearch = {};
            objSearch.search = e;

            if (userLevel === 'SAD') objSearch.companyId = keys.companyId;

            dispatch(allAction.storeSellAction.getCustomerDetail(objSearch)).then(
                (data) => {
                    const listRes = [];
                    if (data) {
                        // console.log('recipientName', itemSs)
                        const itemSs2 = {}
                        itemSs2.recipientName = data?.customerName || '';
                        itemSs2.recipientLastName = data?.customerLastName || '';
                        data?.customerAddressData.filter((val) => {
                            if (val?.defaultAddress) {
                                itemSs2.customerId = data?.customerId;
                                itemSs2.recipientId = data?.customerId || null;
                                itemSs2.recipientAddressId = val?.customerAddressId || null;
                                itemSs2.recipientNo = val?.no;
                                itemSs2.recipientMoo = val?.moo || null;
                                itemSs2.recipientAlley = val?.alley || null;
                                itemSs2.recipientRoad = val?.road || null;
                                itemSs2.recipientDistrictId =
                                    val?.districtData?.districtId || null;
                                itemSs2.recipientDistrictName =
                                    val?.districtData?.districtName || null;
                                itemSs2.recipientSubdistrictId =
                                    val?.subdistrictData?.subdistrictId || null;
                                itemSs2.recipientSubdistrictName =
                                    val?.subdistrictData?.subdistrictName || null;
                                itemSs2.recipientProvinceName =
                                    val?.provinceData?.provinceName || null;
                                itemSs2.recipientProvinceId =
                                    val?.provinceData?.provinceId || null;
                                itemSs2.recipientPostcode = val?.postcode || null;
                                itemSs2.recipientOther = val?.other || null;
                                // callProvince();
                                // callDistrict(val?.provinceData?.provinceId);
                                // callSubDistrict(val?.districtData?.districtId);
                            }
                        });

                        // const itemSs1 = formDo.getFieldsValue();
                        formDo.setFieldsValue({ ...itemSs2 });
                        dispatch(allAction.orderItemImportAction.setPostcodeRefresh(new Date()))

                        setIsNewCustomer(false)
                        // setIsNewAddress(false)
                        setRefreshPhoneNo(new Date())
                        console.log("onSearchCustomer", data)
                    } else {
                        setIsNewCustomer(true)
                        // setIsNewAddress(true)
                        resetAddressForm()
                        setRefreshPhoneNo(new Date())
                    }
                    //   setListData(keys.itemStoreSell);
                }
            );

            // console.log('listttt', listData);
        }
    };

    const ItemCardEditRender = () => {
        return (<>
            <Form
                name="store-sell"
                form={formDo}
                //   {...formItemLayout}
                scrollToFirstError="auto"
                onValuesChange={(v) => {
                    console.log("onValuesChange", v)
                }}
                onFinish={(e) => onFinish(e)}
            >
                <Card
                    style={{
                        margin: '2px',
                        padding: 0,
                        backgroundColor: '#E8E8F0',
                    }}
                    bodyStyle={{
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingRight: 20,
                        paddingLeft: 20,
                    }}
                >
                    <div key={1}>
                        {/* Row */}
                        <div style={{
                            display: "flex", flexDirection: "row",
                            // border: "1px solid red"
                        }}>
                            <div style={{
                                width: 200, display: "flex",
                                //  border: "1px solid yellow" 
                            }}>
                                <Form.Item
                                    style={{
                                        flex: 1,
                                        // border: "1px solid blue",
                                        height: 40, margin: 0, marginBottom: -8, padding: 0,
                                    }}
                                    label={'เลขพัสดุ'}
                                    labelCol={{ flex: "62px" }}
                                    wrapperCol={{ width: "100%" }}
                                    name={'doNo'}
                                    validateTrigger={['onBlur', 'onChange']}
                                    fieldKey={[fk, 'doNo']}
                                >
                                    <Input
                                        style={{ flex: 1 }}
                                        size="small"
                                        disabled
                                        className="field_id"
                                    />
                                </Form.Item>
                                {/* {editingDoNo} */}
                            </div>
                            <div style={{ flex: 1 }}>

                            </div>

                            <div >
                                {isNewCustomer &&
                                    <Tooltip title="เพิ่มข้อมูลลูกค้าโดยอัตโนมัติ" color="blue">
                                        <Tag color="blue" style={{ fontFamily: "sans-serif" }}><UserAddOutlined /> ลูกค้าใหม่</Tag>
                                    </Tooltip>}
                                {(!isNewCustomer && isNewAddress) &&
                                    <Tooltip title="เพิ่มที่อยู่โดยอัตโนมัติ" color="green">
                                        <Tag color="green" style={{ fontFamily: "sans-serif" }}><HomeOutlined /> ที่อยู่ใหม่</Tag>
                                    </Tooltip>
                                }

                                <Button
                                    size="small"
                                    // type="primary"
                                    style={{
                                        // float: 'right',
                                        marginRight: 10,
                                        // marginBottom: 6,
                                        width: '80px',
                                        fontSize: '12px',
                                    }}
                                    // disabled={isNewCustomer}
                                    // disabled={
                                    //   !formDo.getFieldValue('recipientInput') 
                                    //   || formDo?.getFieldValue('recipientInput')?.length < 10
                                    // }
                                    onClick={() => {
                                        resetDoForm()
                                        // dispatch(allAction.orderItemImportAction.setEditingDo(null))
                                        // setCodChargedBox(0)
                                        // setBillType("EX")
                                        // formDo.resetFields()

                                        // setIsNewCustomer(false)
                                        // setIsNewAddress(false)
                                        // formDo.setFieldsValue({
                                        //     doNo: "(เพิ่มพัสดุ)",
                                        // });
                                    }}
                                >
                                    {"ล้างฟอร์ม"}
                                </Button>

                                <Button
                                    size="small"
                                    type="primary"
                                    style={{
                                        // float: 'right',
                                        marginRight: 10,
                                        // marginBottom: 6,
                                        width: '80px',
                                        fontSize: '12px',
                                    }}
                                    disabled={isNewCustomer}
                                    // disabled={
                                    //   !formDo.getFieldValue('recipientInput') 
                                    //   || formDo?.getFieldValue('recipientInput')?.length < 10
                                    // }
                                    onClick={() => {
                                        setShowChangeAddress(true)
                                    }}
                                >
                                    {t('change-address')}
                                </Button>

                                <Button
                                    size="small"
                                    type="primary"
                                    style={{
                                        // float: 'right',
                                        // marginRight: 10,
                                        // marginBottom: 6,
                                        width: '80px',
                                        fontSize: '12px',
                                    }}
                                    disabled={caling == 1 || isDataLoading}
                                    icon={<SaveOutlined />}
                                    onClick={onFinish}
                                >
                                    {"บันทึก"}
                                </Button>
                                {/* <PrintSticker
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
                // disabled={
                //   !form.getFieldValue('itemStoreSell')[index]
                //     .recipientNo
                // }
                style={{
                  float: 'right',
                  marginRight: 10,
                  marginBottom: 6,
                  width: '110px',
                  fontSize: '12px',
                }}
                icon={<QrcodeOutlined />}
              >{t('sticker')}</ButtonPrinting> */}
                            </div>
                        </div>
                        <div
                            style={{
                                // border: "1px solid blue",
                                display: "grid",
                                gridTemplateColumns: "200px 320px auto auto",
                            }}
                        >
                            <Form.Item
                                style={{
                                    flex: 1,
                                    // border: "1px solid blue",
                                    height: 40, margin: 0, marginBottom: -8, padding: 0,
                                }}
                                labelCol={{ flex: "100px" }}
                                wrapperCol={{ width: "100%" }}

                                label={t('phone')}
                                name={'recipientInput'}
                                validateTrigger={['onBlur', 'onChange']}
                                // fieldKey={[fk, 'customerName']}
                                // style={{ marginBottom: 1 }}
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
                                                'Please Input Phone Knumber Length 9-10 Digits!'
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    size="small"
                                    style={{ flex: 1 }}
                                    onChange={(e) =>
                                        // onSearchCustomer(e.target.value, "recipientInput")
                                        waitKeyIn1(e.target.value, "recipientInput")
                                    }
                                    onKeyPress={(e) => {
                                        isInputNumber(e);
                                    }}
                                    maxLength={13}
                                />
                            </Form.Item>
                            <Form.Item
                                label={t('package-type')}
                                name={'parcelTypeId'}
                                validateTrigger={['onBlur', 'onChange']}
                                // fieldKey={[fk, 'parcelTypeId']}
                                style={{
                                    flex: 1,
                                    // border: "1px solid blue",
                                    height: 40, margin: 0, marginBottom: -8, padding: 0,
                                }}
                                labelCol={{ flex: "110px" }}
                                wrapperCol={{ width: "100%" }}
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Please input your package type!',
                            //     },
                            // ]}
                            >
                                <Select
                                    size="small"
                                    style={{ flex: 1 }}
                                    defaultValue={t('please-select')}
                                    onChange={(e) =>
                                        console.log('e', e, parcelTypeData)
                                    }
                                >
                                    <Option value={null}>
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
                            <Form.Item
                                label={t('agency-fistname')}
                                name={'recipientName'}
                                validateTrigger={['onBlur', 'onChange']}
                                fieldKey={[fk, 'recipientName']}
                                style={{
                                    flex: 1,
                                    // border: "1px solid blue",
                                    height: 40, margin: 0, marginBottom: -8, padding: 0,
                                }}
                                labelCol={{ flex: "60px" }}
                                wrapperCol={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <Input
                                    size="small"
                                    style={{ flex: 1 }}
                                //   onKeyDown={(e) =>
                                //     checkChangeValue(e, field.name, remove)
                                //   }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t('agency-lastname')}
                                name={'recipientLastName'}
                                fieldKey={[fk, 'recipientLastName']}
                                labelCol={{ flex: "80px" }}
                                wrapperCol={{ width: "100%" }}
                                style={{ marginBottom: 1 }}
                            >
                                <Input
                                    size="small"
                                    style={{ flex: 1 }}
                                //   onKeyDown={(e) =>
                                //     checkChangeValue(e, field.name, remove)
                                //   }
                                />
                            </Form.Item>
                        </div>

                        <Row>
                            <Col xs={6} lg={3}>
                                <Form.Item
                                    style={{ ...formItemStyle, marginBottom: 1 }}
                                    labelCol={{ xs: 10 }}
                                    wrapperCol={{ xs: 24 }}
                                    label={t('address-number')}
                                    name={'recipientNo'}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input Address Knumber!',
                                        },
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                    fieldKey={[fk, 'recipientNo']}
                                >
                                    <Input
                                        size="small"
                                        onChange={() => {
                                            if (!isNewAddress && !isNewCustomer)
                                                setIsNewAddress(true)
                                        }}
                                    //   onKeyDown={(e) =>
                                    //     checkChangeValue(e, field.name, remove)
                                    //   }
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={6} lg={3}>
                                <Form.Item
                                    style={{ ...formItemStyle, marginBottom: 1 }}
                                    labelCol={{ xs: 10 }}
                                    wrapperCol={{ xs: 24 }}
                                    label={t('address-village')}
                                    name={'recipientMoo'}
                                    fieldKey={[fk, 'recipientMoo']}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        size="small"
                                        onChange={() => {
                                            if (!isNewAddress && !isNewCustomer)
                                                setIsNewAddress(true)
                                        }}
                                    //   onKeyDown={(e) =>
                                    //     checkChangeValue(e, field.name, remove)
                                    //   }
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={12} lg={6}>
                                <Form.Item
                                    style={{ ...formItemStyle, marginBottom: 1 }}
                                    label={t('address-lane')}
                                    name={'recipientAlley'}
                                    fieldKey={[fk, 'recipientAlley']}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        size="small"
                                        onChange={() => {
                                            if (!isNewAddress && !isNewCustomer)
                                                setIsNewAddress(true)
                                        }}
                                    //   onKeyDown={(e) =>
                                    //     checkChangeValue(e, field.name, remove)
                                    //   }
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={12} lg={6}>
                                <Form.Item
                                    style={{ ...formItemStyle, marginBottom: 1 }}
                                    label={t('address-road')}
                                    name={'recipientRoad'}
                                    fieldKey={[fk, 'recipientRoad']}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        size="small"
                                        onChange={() => {
                                            if (!isNewAddress && !isNewCustomer)
                                                setIsNewAddress(true)
                                        }}
                                    // onKeyDown={(e) =>
                                    //     checkChangeValue(e, field.name, remove)
                                    // }
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={12} lg={6}>
                                <Form.Item
                                    style={{ ...formItemStyle, marginBottom: 1 }}
                                    label={t('address-other')}
                                    name={'recipientOther'}
                                    fieldKey={[fk, 'recipientOther']}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        size="small"
                                        onChange={() => {
                                            if (!isNewAddress && !isNewCustomer)
                                                setIsNewAddress(true)
                                        }}
                                    //   onKeyDown={(e) =>
                                    //     checkChangeValue(e, field.name, remove)
                                    //   }
                                    />
                                </Form.Item>
                            </Col>

                            <ItemStoreSellPostcode
                                hasBanArea={hasBanArea}
                                // dateRefresh={new Date()}
                                editingDo={editingDo}
                                formDo={formDo}
                                setFormDoFields={setFormDoFields}
                                setIsNewAddress={setIsNewAddress}
                                // index={index}
                                // fieldKey={fk}
                                // field={field}
                                // itemStoreSell={itemStoreSell}
                                // phone={form.getFieldsValue()?.itemStoreSell[index]?.recipientInput}
                                // listProvince2={listProvince2}
                                // setListProvince2={setListProvince2}
                                // checkChangeValue={checkChangeValue}
                                calTransItem={calTransItem}
                            // cachePostcode={cachePostcode}
                            // setCachePostcode={setCachePostcode}
                            // setForm={setForm}
                            // remove={remove}
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
                                                name={'weight'}
                                                validateTrigger={['onBlur', 'onChange']}
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
                                                        calTransItemPressEnter(event, "weight");
                                                    }}
                                                    onBlur={(event) => {
                                                    }}
                                                    onChange={(e) => {
                                                        // chkChange.current = true
                                                        waitKeyIn2(calTransItem, "weight");
                                                        //   calWeightItem(e, field.name);
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
                                                name={'width'}
                                                validateTrigger={['onBlur', 'onChange']}
                                                fieldKey={[fk, 'width']}

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
                                                        calTransItemPressEnter(event, "width");
                                                    }}
                                                    onBlur={(event) => {
                                                    }}
                                                    onChange={(e) => {
                                                        //   chkChange.current = true
                                                        waitKeyIn2(calTransItem, "width");
                                                        //   calVolumeItem(e, field.name);
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                    </td>
                                    <td >
                                        <div style={{ display: 'flex' }}>
                                            <Form.Item
                                                label={t('long')}
                                                name={'length'}
                                                validateTrigger={['onBlur', 'onChange']}
                                                fieldKey={[fk, 'length']}
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
                                                        calTransItemPressEnter(event, "length");
                                                    }}
                                                    onBlur={(event) => {
                                                    }}
                                                    onChange={(e) => {
                                                        //   chkChange.current = true
                                                        waitKeyIn2(calTransItem, "length");
                                                        //   calVolumeItem(e, field.name);
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                    </td>
                                    <td >
                                        <div style={{ display: 'flex' }}>
                                            <Form.Item
                                                label={t('high')}
                                                name={'height'}
                                                validateTrigger={['onBlur', 'onChange']}
                                                fieldKey={[fk, 'height']}
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
                                                        calTransItemPressEnter(event, "height");
                                                    }}
                                                    onBlur={(event) => {
                                                    }}
                                                    onChange={(e) => {
                                                        //   chkChange.current = true
                                                        //   // resetSumTran(height)
                                                        waitKeyIn2(calTransItem, "height");
                                                        //   calVolumeItem(e, height);
                                                    }}
                                                />
                                            </Form.Item>
                                        </div></td>
                                    <td style={{ minWidth: "150px" }}>
                                        <div style={{ display: 'flex', alignItems: "center" }}>
                                            <Form.Item
                                                label={t('type')}
                                                name={'transportationTypeCode'}
                                                validateTrigger={['onBlur', 'onChange']}
                                                initialValue="EX"
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
                                                    defaultValue="EX"
                                                    style={{ width: "100%" }}
                                                    // disabled={caling==1}
                                                    onChange={(value) => {
                                                        // filterDataTransType(value, field.name);
                                                        // checkTypeEx();
                                                        dispatch(allAction.storeSellAction.checkTypeTrans(value));
                                                        setBillType(value)
                                                        checkCOD()
                                                    }}
                                                >
                                                    <Option
                                                        value="EX"
                                                    >EX</Option>
                                                    <Option
                                                        value="COD"
                                                    >COD</Option>
                                                    {/* {masterTransportationType &&
                                                        [
                                                            {
                                                                transportationTypeCode: "EX",
                                                                transportationTypeName: "EX",
                                                            },
                                                            {
                                                                transportationTypeCode: "COD",
                                                                transportationTypeName: "COD",
                                                            }
                                                        ].map((item) => (
                                                            <Option
                                                                value={item.transportationTypeCode}
                                                                key={item.transportationTypeCode}
                                                            >
                                                                <Text className="pos_select">
                                                                    {item.transportationTypeName}
                                                                </Text>
                                                            </Option>
                                                        ))} */}
                                                </Select>
                                            </Form.Item>

                                        </div>
                                    </td>
                                    <td style={{ minWidth: "100px" }}>
                                        <div style={{ display: 'flex', }}>
                                            <Form.Item
                                                label={t('cod')}
                                                name={'cod'}
                                                validateTrigger={['onBlur', 'onChange']}
                                                fieldKey={[fk, 'cod']}
                                                wrap={false}
                                                labelCol={{ flex: "65px" }}
                                                style={{ marginBottom: 1, flex: 1 }}

                                                rules={[
                                                    {
                                                        required: billType === 'COD',
                                                        message: 'Please input COD!',
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    size="small"
                                                    style={{ width: "100%" }}
                                                    onChange={(e) => {
                                                        checkCOD(e, "cod");
                                                    }}
                                                    disabled={billType === 'EX'}
                                                />
                                            </Form.Item>
                                        </div></td>

                                    <td style={{ minWidth: "130px" }}>
                                        <div style={{
                                            display: 'flex', alignItems: "center"
                                        }}>

                                            <Form.Item
                                                label={t('rate')}
                                                name={'ratePercent'}
                                                validateTrigger={['onBlur', 'onChange']}
                                                wrap={false}
                                                labelCol={{ flex: "60px" }}
                                                style={{ marginBottom: 1, flex: 1 }}
                                                rules={[
                                                    {
                                                        required: billType === 'COD',
                                                        message: 'Please input COD Rate!',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    size="small"
                                                    defaultValue={0}
                                                    className="pos_form"
                                                    onChange={(e) => {
                                                        checkCOD(e, "ratePercent");
                                                        calChargeCod("ratePercent");
                                                    }}
                                                    disabled={billType === 'EX'}
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
                                            {/* 
                                            <Form.Item
                                                style={{ marginBottom: 1, flex: 1, display: "none" }}
                                                label={t('weight')}
                                                wrap={false}
                                                labelCol={{ flex: "60px" }}
                                                name={'newAddress'}
                                            >
                                                <Input
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    value={true}
                                                />
                                            </Form.Item> */}
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
                                    name={'remark'}
                                    validateTrigger={['onBlur', 'onChange']}
                                    fieldKey={[fk, 'remark']}
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
                                    validateStatus={formDo.getFieldValue("transportationPrice") && enumCaling[caling]}
                                    name={'transportationPrice'}
                                    validateTrigger={['onBlur', 'onChange']}
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
                                    // hasFeedback={billType == "COD"}
                                    // validateStatus={
                                    //   "success"
                                    // }
                                    name={'chargeCodPrice'}
                                    validateTrigger={['onBlur', 'onChange']}
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
                                    name={'transportationNetPrice'}
                                    validateTrigger={['onBlur', 'onChange']}
                                    hasFeedback={true}
                                    validateStatus={formDo.getFieldValue("transportationNetPrice") && enumCaling[caling]}
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
            </Form>
            <ChangeAddressMain
                formBig={form}
                formDo={formDo}
                showChangeAddress={showChangeAddress}
                setShowChangeAddress={setShowChangeAddress}
                refreshPhoneNo={refreshPhoneNo}
                setIsNewCustomer={setIsNewCustomer}
                setIsNewAddress={setIsNewAddress}
            />
        </>
        )
    }


    //   useEffect(() => {
    //     dispatch(allAction.storeSellAction.setItemCount(form.getFieldsValue()?.itemStoreSell?.length))
    //   }, [form.getFieldsValue()?.itemStoreSell?.length])

    return ItemCardEditRender()
};


export default ItemCardEdit;


const r2 = (num) => {
    if (num === null) {
        num = 0.0
    }
    return Math.round((parseFloat(num) + Knumber.EPSILON) * 100) / 100
}