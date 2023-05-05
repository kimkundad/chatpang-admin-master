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

import { useHistory } from 'react-router-dom';

import allAction from '../../../../app/actions';

import ItemStoreSellBody from './ItemStoreSell2/ItemStoreSellBody';

const ItemStoreSell2 = (props) => {
    const {
        form,
        showHeader,
        setShowHeader,
        shortSender,
        itemListData,
        orderId,
        viewOnly,
        // setKeying,
        hasBanArea,
        // setOrderTotalPrice,
        // checkAllItem,
        // match: {
        //   params: { orderId },
        // },
    } = props;

    const history = useHistory();

    const companyId = useSelector((state) => state.authenReducer.companyId);
    // const hubId = useSelector((state) => state.authenReducer.hubId);
    const agencyId = useSelector((state) => state.authenReducer.agencyId);
    // const userLevel = useSelector((state) => state.authenReducer.userLevel);
    const isCustomer = useSelector((state) => state.authenReducer.isCustomer);

    const showDoForm = useSelector((state) => state.orderItemImportReducer.showDoForm);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [caling, setCaling] = useState(-1);
    // const [showDoForm, setShowDoForm] = useState(false)

    const [editingDo, setEditingDo] = useState(null)

    useEffect(() => {
        console.log("orderId", orderId)
        if (orderId == 'create') {
            setShowHeader(true);
            setShowDoForm(false);
        } else {
            setShowHeader(false);
            setShowDoForm(true);
        }
    }, [])

    // useEffect(() => {
    //     setShowHeader(false);
    // }, [showDoForm])

    useEffect(() => {
        return () => {
            dispatch(allAction.orderItemImportAction.setEditingDo(null))
        }
    }, [])

    const setShowDoForm = (val) => {
        dispatch(allAction.orderItemImportAction.setShowDoForm(val))
    }

    // --------- editingDo
    // useEffect(() => {
    //     if (editingDo) {
    //         form.setFieldsValue({
    //             doNo: editingDo,
    //         });
    //         // form.setFieldValue("doNo",editingDo)
    //     } else {
    //         form.setFieldsValue({
    //             doNo: "(เพิ่มพัสดุ)",
    //         });
    //     }
    // }, [editingDo])
    // --------- editingDo

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
            // setKeying(true);
            setShowHeader(false);
        }

        return validateError;
    };

    // สร้างใบเสร็จ Draft
    const genOrderId = async () => {
        // const field = form.getFieldsValue();
        // console.log('parcel', parcelTypeData);

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
            customerTaxpayerNumber: form.getFieldValue('customerTaxpayerNumber'),
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
            senderTaxpayerNumber: form.getFieldValue('senderTaxpayerNumber'),
            recommenderId: form.getFieldValue('recommenderId'),
            recommenderInput: form.getFieldValue('recommenderInput'),
            recommenderName: form.getFieldValue('recommenderName'),
            recommenderLastName: form.getFieldValue('recommenderLastName'),
        };

        newValue.footer = {
            totalItem:  0,
            totalWeight: 0,
            totalVolume: 0,
            totalDimension:0,
            totalCod:  0,
            totalTransportationPrice: 0,
            totalChargeCodPrice:  0,
            totalNettransportationPrice: 0,
            remark: form.getFieldValue('remark') || '',
            discountText: form.getFieldValue('discountText') || '',
            discountPercent: form.getFieldValue('discountPercent') || 0,
            discountAmount: form.getFieldValue('discountAmount') || 0,
            transportationPriceAfterDiscount: 0,
            morePriceText: form.getFieldValue('morePriceText') || '',
            morePriceAmount: form.getFieldValue('morePriceAmount') || 0,
            etc: form.getFieldValue('etc') || '',
            etcAmount: form.getFieldValue('etcAmount') || 0,
            totalPrice: 0,
          };
        // const noCheck = isCustomer || keys.soNo ? keys.soNo : keys.receiptNo;

        console.log("newValue", newValue);

        dispatch(allAction.storeSellAction.createDraftOrder(newValue)).then(
            (data) => {
                dispatch(
                    allAction.storeSellAction.getParcelTypeData(
                        keys?.companyId || companyId
                    )
                )
                    .then()
                    .catch((e) => console.log('err', e));
                //   const itemSs = keys.itemStoreSell[0];
                //   itemSs.doNo = data.doNo;
                //   itemSs.orderItemId = data.orderItemId;

                if (isCustomer) {

                    console.log("iscustomer keys", keys)
                    console.log("iscustomer", data)

                    form.setFieldsValue({
                        ...keys,
                        //   [keys.itemStoreSell[0]]: itemSs,
                        receiptNo: null,
                        soNo: data?.soNo,
                        orderId: data?.orderId,
                        totalItem: 0,
                    });

                    console.log("iscustomer keys", keys)
                } else {

                    console.log("!iscustomer keys", keys)
                    console.log("!iscustomer", data)

                    form.setFieldsValue({
                        ...keys,
                        //   [keys.itemStoreSell[0]]: itemSs,
                        receiptNo: data?.receiptNo,
                        soNo: null,
                        orderId: data?.orderId,
                        totalItem: 0,
                    });

                    console.log("iscustomer keys", keys)
                }

                dispatch(onLoading(true))
                history.push(`/store-sell/${data.orderId}/edit`);
            }
        );
    };



    return (
        <>{console.log("viewOnly",viewOnly)}
            {!viewOnly && <Row>
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
                            width: '70px',
                            fontSize: '12px',
                        }}
                        onClick={() => {
                            setShowHeader(!showHeader);
                        }}
                    >
                        {showHeader ? 'ย่อ' : 'แก้ไขผู้ส่ง'}
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
                            width: 'calc(100vw - 530px)',
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
                            <UserOutlined style={{ color: '#294C94' }} /> ลูกค้า
                            :  {shortSender?.senderSumName ? shortSender?.senderSumName : ''}
                            {' '}
                            &nbsp;
                            <HomeOutlined style={{ color: '#294C94' }} /> ที่อยู่ :{' '}
                            {shortSender?.addressCustomer}
                        </span>
                    </div>
                    {/* } */}
                </Col>

                {/* TODO: ปุ่มเพิ่มพัสดุ */}
                <Col flex="110px">
                    {!showDoForm ?
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
                                setEditingDo(null)

                                const field = form.getFieldsValue();
                                const keys = form.getFieldsValue();

                                const validates = await validateFieldsAndShowHeader();
                                console.log('validates', validates);
                                if (!validates) {
                                    // fields.length === 0
                                    //     ? addItem(add, 0, remove)
                                    //     : checkChangeValue('add', 0, add, remove);
                                    // addItem(add, fields?.length + 1);
                                    console.log("isCustomer", isCustomer, keys.soNo, keys.receiptNo)

                                    if ((isCustomer && !keys.soNo) || (!isCustomer && !keys.receiptNo))
                                        genOrderId()

                                    setShowDoForm(true)
                                }

                                // genOrderId();
                            }}
                        >
                            {t('add-parcel')}
                        </Button>
                        :
                        <Button
                            // danger
                            disabled={caling > -1}
                            // type="primary"
                            style={{
                                float: 'right',
                                marginRight: 10,
                                marginTop: 3,
                                // width: '80px',
                                fontSize: '12px',
                            }}
                            // disabled={form.getFieldsValue()?.itemStoreSell?.some(val => !val.transportationNetPrice)}
                            onClick={async () => {
                                setEditingDo(null)
                                setShowDoForm(false)
                            }}
                        >
                            {"ซ่อนฟอร์ม"}
                        </Button>
                    }
                </Col>

            </Row>}
            <div style={{
                flex: 1, height: showHeader
                    ? 'calc(100vh - 645px + 22px + 42px)'
                    : 'calc(100vh - 331px + 22px + 42px)',
            }}>
                <ItemStoreSellBody
                    hasBanArea={hasBanArea}
                    setShowDoForm={setShowDoForm}
                    showDoForm={showDoForm}
                    itemListData={itemListData}
                    form={form}
                    orderId={orderId}
                    setEditingDo={setEditingDo}
                    editingDo={editingDo}
                    viewOnly={viewOnly}
                />
            </div>
        </>
    );
};





export default ItemStoreSell2;


const onLoading = (action) => ({
    type: 'LOADING',
    isLoading: action,
});

function nc(x) {
  if(!x) x = "0"
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}