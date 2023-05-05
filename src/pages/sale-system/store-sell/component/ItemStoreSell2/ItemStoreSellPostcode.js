/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Input,
    Form,
    Col,
    Typography,
    Select,
    message,
    Tooltip
} from 'antd';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import {
    ExclamationCircleOutlined,

} from '@ant-design/icons';

import { fetch } from '../../../../../utils/fetch';
// import allAction from '../../../../app/actions';
// import ItemStoreSell from './ItemStoreSell';

import {
    orderItemsApi,
    useGetProvinceQuery,
    useGetDistrictQuery,
    useGetSubDistrictQuery
} from '../../../../../app/api/orderItemsApi';

const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const ItemStoreSellPostCode = (props) => {
    const {
        calTransItem,
        editingDo,
        formDo,
        // dateRefresh,
        setFormDoFields,
        hasBanArea,
        setIsNewAddress
    } = props;
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // const {
    //   draftData,
    //   parcelTypeData,
    // } = useSelector((state) => state.storeSellReducer);

    // const { isMobile, isLoading } = useSelector((state) => state.mainReducer);

    const postcodeRefresh = useSelector((state) => state.orderItemImportReducer.postcodeRefresh);
    const [distrctOnPostcode, setDistrctOnPostcode] = useState([]);

    const [isMobile, setIsMobile] = useState(false)


    // const { companyId, hubId, agencyId, userLevel, isCustomer } = useSelector(
    //   (state) => state.authenReducer
    // );


    const scrollToRef = () => myRef.current.scrollIntoView();
    const myRef = useRef(null);

    const itemLayout = {
        xs: 24,
        sm: 12,
        lg: 3,
    };


    const formItemStyle = { marginBottom: 12 };


    const [listData, setListData] = useState();

    const [loading, setLoadIng] = useState(false);
    const [banArea, setBanArea] = useState(false);

    const [foundBan, setFoundBan] = useState({ banArea: "" })


    // const { recipientPostcode,
    //   recipientSubdistrictId,
    //   recipientDistrictId,
    //   recipientProvinceId,
    //   recipientSubdistrictName,
    //   recipientDistrictName,
    //   recipientProvinceName,
    //   recipientInput } = itemStoreSell

    // const [listProvince2, setListProvince2] = useState([]);
    // const [listDistrict, setListDistrict] = useState([]);

    // const [listSubDistrict, setListSubDistrict] = useState([]);
    // const [listProvince, setListProvince] = useState([]);
    const [firstInit, setFirstInit] = useState(true)

    const [province, setProvinceID] = useState(0);
    const [district, setDistrictID] = useState(0);

    const [reload, setReload] = useState(new Date())

    const [isSelectProvince, setIsSelectProvince] = useState(false);
    const [isSelectDistrict, setIsSelectDistrict] = useState(false);
    const [isCheckPostCode, setIsCheckPostCode2] = useState(false);

    //----------- RTK QUERY ---------------
    const [selectProvince, setSelectProvince] = useState()
    const [selectDistrict, setSelectDistrict] = useState()

    const {
        data: listProvince,
        // isFetching,
        // isLoading,
        // isSuccess, /* */
        // isError,
        // error,
        // refetch,
    } = useGetProvinceQuery();

    const {
        data: listDistrict,
        // isFetching,
        // isLoading,
        // isSuccess, /* */
        // isError,
        // error,
        // refetch,
    } = useGetDistrictQuery(province);

    const {
        data: listSubDistrict,
        // isFetching,
        // isLoading,
        // isSuccess, /* */
        // isError,
        // error,
        // refetch,
    } = useGetSubDistrictQuery(district);

    useEffect(() => {
        const postcode = formDo.getFieldValue("recipientPostcode")

        if (listSubDistrict && postcode && postcode.length == 5) {

            var foundPostcode = listSubDistrict.find((item) => {
                return item.postcode === postcode
            })

            if (!foundPostcode) {
                setFormDoFields({ recipientPostcode: "" })
                setReload(new Date())
            }
        }
    }, [listSubDistrict])


    const recipientSubdistrictId = formDo.getFieldValue("recipientSubdistrictId")

    useEffect(() => {
        console.log("recipientSubdistrictId", recipientSubdistrictId)
        console.log("recipientSubdistrictId2", listSubDistrict)
        if (hasBanArea)
            if (recipientSubdistrictId && listSubDistrict && listSubDistrict.length > 0) {

                console.log("recipientSubdistrictId3",)
                var array1 = listSubDistrict

                var found = array1.find(element => element.subdistrictId == recipientSubdistrictId);

                if (found) {

                    if (found?.banArea) {
                        setFoundBan({ banArea: found?.banArea })
                        // alert(found?.banArea)
                        hasBanArea.current = found?.banArea
                        message.error(found?.banArea);
                    } else {
                        setFoundBan({ banArea: "" })
                        hasBanArea.current = ""
                    }
                }
                else {
                    setFoundBan({ banArea: "" })
                    hasBanArea.current = ""
                }
            } else {
                setFoundBan({ banArea: "" })
                hasBanArea.current = ""
            }
        calTransItem();
    }, [recipientSubdistrictId, listSubDistrict])

    //------------------------------------

    useEffect(() => {
        // console.log("dateRefresh", dateRefresh)
        calTransItem();

        const pvid = formDo.getFieldValue("recipientProvinceId")
        if (province != pvid)
            setProvinceID(pvid);

        const did = formDo.getFieldValue("recipientDistrictId")
        if (district != did)
            setDistrictID(did);
    }, [postcodeRefresh])



    // useEffect(() => {

    //     const pvid = formDo.getFieldValue("recipientProvinceId")
    //     console.log("dateRefresh pvid",pvid)

    //     if (province != pvid)
    //         setProvinceID(pvid);
    // }, [formDo.getFieldValue("recipientProvinceId")])

    // useEffect(() => {
    //     
    //     console.log("dateRefresh pvid",did)

    //     if (district != did)
    //         setDistrictID(did);
    // }, [formDo.getFieldValue("recipientDistrictId")])

    // useEffect(() => {
    //     const did = formDo.getFieldValue("recipientDistrictId")
    //     if (district != did)
    //         setDistrictID(did);
    // }, [formDo.getFieldValue("recipientDistrictId")])

    // useEffect(() => {
    //     console.log("recipientSubdistrictName",formDo.getFieldValue("recipientSubdistrictName"))
    //     if (formDo.getFieldValue("recipientSubdistrictId"))
    //         calTransItem()
    // }, [formDo.getFieldValue("recipientSubdistrictId")]);

    useEffect(() => {
        if (editingDo) {
            setProvinceID(editingDo.recipientProvinceId);
            setDistrictID(editingDo.recipientDistrictId)
        }
    }, [editingDo])

    const handleFilterProvice = (value, key) => {

        const addCus = {}
        const disaName = listProvince.filter((val) => val.provinceId === value);

        // setListDistrict([]);
        // setListSubDistrict([]);

        setProvinceID(value);
        setIsSelectProvince(true);
        // setIsFirst(true);


        addCus.recipientSubdistrictId = '';
        addCus.recipientDistrictId = '';

        addCus.recipientPostcode = '';

        addCus.recipientSubdistrictName = '';
        addCus.recipientDistrictName = '';
        addCus.recipientProvinceName = disaName[0]?.provinceName;
        setFormDoFields(addCus);

    }

    const handleFilterDistrict = (value, key) => {
        setDistrctOnPostcode([])

        const addCus = {}

        // if (value === '') {
        //   callDistrict(itemStoreSell?.recipientProvinceId);

        //   addCus.recipientPostcode = '';
        //   addCus.recipientDistrictId = '';
        //   setForm(index, addCus)
        // }

        setDistrictID(value);
        // callSubDistrict(value);

        console.log("listDistrict", listDistrict)

        const disaName = listDistrict.filter((val) => val.districtId === value);
        console.log("disaName", disaName)

        addCus.recipientSubdistrictId = '';
        addCus.recipientSubdistrictName = '';
        addCus.recipientDistrictName = disaName[0]?.districtName;
        console.log("addCus.recipientDistrictName", addCus.recipientDistrictName)

        setIsSelectDistrict(true);

        setFormDoFields(addCus)

    };

    const handleFilterSubdistrict = (value, key) => {

        console.log("handleFilterSubdistrict", value)

        if (value === '') return null;

        const subDisFound = listSubDistrict.filter(
            (val) => val.subdistrictId === value
        );
        const addCus = {}

        addCus.recipientPostcode = subDisFound[0]?.postcode;
        addCus.recipientSubdistrictName = subDisFound[0]?.subdistrictName;

        const disFound = listDistrict.filter(
            (val) => val.districtId === subDisFound[0]?.districtId
        );
        addCus.recipientDistrictId = disFound[0]?.districtId;
        addCus.recipientDistrictName = disFound[0]?.districtName;

        setFormDoFields(addCus);

        calTransItem()
        setReload(new Date())

    };

    const onChangePostcode = (e, key) => {
        console.log("onChangePostcode")
        const addCus = {}

        if (e.target.value.length < 5) {
            // setSelectProvince(null);
            setProvinceID(null);
            setDistrictID(null);

            (addCus.recipientProvinceId = ''),
                (addCus.recipientProvinceName = ''),
                (addCus.recipientDistrictId = ''),
                (addCus.recipientDistrictName = ''),
                (addCus.recipientSubdistrictId = ''),
                (addCus.recipientSubdistrictName = '')

            setFormDoFields(addCus)
        } else {

        }

        if (e.target.value.length === 5) {
            setLoadIng(true);
            fetch({
                method: 'get',
                url: `/master/postcode/?postcode=${e.target.value}`,
            })
                .then((res) => {
                    setLoadIng(false);
                    if (res.data.success)
                        if (res.data?.data?.province?.provinceId) {
                            console.log("postcode", res.data?.data)

                            const distrctOnPostcodeGet = res.data?.data?.district.map((dt) => {
                                return dt.districtId
                            })

                            setDistrctOnPostcode(distrctOnPostcodeGet)

                            setIsCheckPostCode2(true);
                            setProvinceID(res.data.data.province.provinceId);

                            if (res.data.data.district.length === 1) {
                                setDistrictID(res.data.data.district[0].districtId);
                            }

                            // setListSubDistrict2(res.data.data.subdistrict);

                            // if (companyId === 0) {
                            //   callProvince(0, 'new');
                            // } else {
                            //   callProvince(companyId, 'filter');
                            // }
                            // callDistrict(res.data.data.province.provinceId);

                            // setListDistrict2(res.data.data.district);

                            // callSubDistrict(res.data.data.district[0].districtId);
                            // setListDistrict2([])
                            // setListSubDistrict2([])
                            const addCus = {};
                            // console.log(key, addCus);

                            // const keys = form.getFieldsValue();
                            // const addCus = keys.itemStoreSell[key];
                            // console.log(key, addCus);

                            addCus.recipientProvinceId = res.data.data.province.provinceId;
                            addCus.recipientProvinceName = res.data.data.province.provinceName;

                            (addCus.recipientDistrictId = res.data.data.district.length === 1
                                ? res.data.data.district[0].districtId : ''),
                                (addCus.recipientDistrictName = res.data.data.district.length === 1
                                    ? res.data.data.district[0].districtName : ''),

                                (addCus.recipientSubdistrictId = res.data.data.subdistrict.length === 1
                                    ? res.data.data.subdistrict[0].subdistrictId : ''),
                                (addCus.recipientSubdistrictName = res.data.data.subdistrict.length === 1
                                    ? res.data.data.subdistrict[0].subdistrictName : '');

                            console.log("onChangePostcode addCus", addCus)

                            setFormDoFields(addCus);
                            // form.setFieldsValue({
                            //   ...keys,
                            //   [keys.itemStoreSell[key]]: addCus,
                            // });


                            // calTransItem(e, key)
                        } else {
                            // setListDistrict2([]);
                            // setListSubDistrict2([]);

                            const addCus = {};

                            (addCus.recipientProvinceId = ''),
                                (addCus.recipientDistrictId = ''),
                                (addCus.recipientSubdistrictId = ''),
                                (addCus.recipientProvinceName = ''),
                                (addCus.recipientDistrictName = ''),
                                (addCus.recipientSubdistrictName = '');
                            setFormDoFields(addCus)
                            setIsCheckPostCode2(false);
                        }
                })
                .catch((error) => {
                    // setListDistrict2([]);
                    // setListSubDistrict2([]);

                    // const addCus = {};

                    // (addCus.recipientProvinceId = ''),
                    //     (addCus.recipientDistrictId = ''),
                    //     (addCus.recipientSubdistrictId = ''),
                    //     (addCus.recipientProvinceName = ''),
                    //     (addCus.recipientDistrictName = ''),
                    //     (addCus.recipientSubdistrictName = '');
                    // setForm(index, addCus)
                    // setIsCheckPostCode2(false);
                    // setLoadIng(false);
                    console.log(error);
                });
        }
    }

    return (
        <>
            <Col xs={12} lg={6} >
                <Form.Item
                    style={{ ...formItemStyle, marginBottom: 1 }}
                    labelCol={{ flex: "100px" }}
                    // wrapperCol={{ xs: 24 }}
                    wrap={false}
                    label={t('address-postal')}
                    rules={[
                        {
                            required: true,
                            message: 'Please input Postal!',
                        },
                    ]}
                    name={'recipientPostcode'}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Input
                        allowClear
                        size="small"
                        onChange={(e) => {
                            onChangePostcode(e)
                            setIsNewAddress(true)
                        }}
                        onKeyPress={(event) => {
                            // isInputNumber(event);
                            // (event, field.name, remove);
                        }}
                        maxLength={5}
                    />
                </Form.Item>

            </Col>
            <Col xs={12} lg={6}>

                <Form.Item
                    // style={{}}
                    style={{ ...formItemStyle, marginBottom: 1 }}
                    label={t('address-sub-district')}
                    // label={itemStoreSell.recipientSubdistrictId}
                    name={'recipientSubdistrictId'}
                    rules={[
                        {
                            required: true,
                            message: 'Please input Sub District!',
                        },
                    ]}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Select
                        size="small"
                        style={{
                            border: foundBan.banArea ? "2px red solid" : "",
                            color: foundBan?.banArea ? "red" : "black"
                        }}
                        defaultValue={t('please-select')}
                        // style={{backgroundColor: "red"}}
                        onChange={(e) => {
                            handleFilterSubdistrict(e, "recipientSubdistrictId")
                            setIsNewAddress(true)
                        }
                        }
                        showSearch
                        filterOption={(input, option) =>
                            option.children?.props?.children?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                        }
                        // ** double children?.children? 
                    >
                        <Option value="">{t('please-select')}</Option>
                        {listSubDistrict && reload && listSubDistrict.map((item) => {

                            var bgcolor = "black";
                            if (formDo.getFieldValue("recipientPostcode")) {
                                if (item?.postcode !== formDo.getFieldValue("recipientPostcode")) {
                                    bgcolor = "#C6C6C6"
                                    // return null; 
                                }

                            }
                            return (
                                <Option
                                    value={item.subdistrictId}
                                    key={item.subdistrictId}
                                // style={{  }}
                                >
                                    <Tooltip overlayInnerStyle={{ fontFamily: "sans-serif" }} placement="left" title={item?.postcode}>
                                        <Text
                                            className="pos_select"
                                            style={{
                                                width: "100%",
                                                color: bgcolor,
                                            }}
                                            ellipsis={
                                                !isMobile
                                                    ? { tooltip: item.subdistrictName }
                                                    : false
                                            }
                                        // style={{color : checkBanArea(itemStoreSell.recipientSubdistrictId) ? "red" : "black"}}
                                        >
                                            {item.subdistrictName}
                                        </Text>
                                    </Tooltip>
                                </Option>
                            )
                        }
                        )}
                    </Select>
                </Form.Item>
                <Form.Item
                    style={{ ...formItemStyle, marginBottom: 1, display: "none" }}
                    labelCol={{ flex: "100px" }}
                    // wrapperCol={{ xs: 24 }}
                    wrap={false}
                    // label={t('address-postal')}
                    rules={[
                        {
                            required: true,
                            message: 'Please select subdistrict',
                        },
                    ]}
                    name={'recipientSubdistrictName'}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Input
                        size="small"
                        maxLength={5}
                    />
                </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
                <Form.Item
                    style={{ ...formItemStyle, marginBottom: 1 }}
                    label={t('address-district')}
                    name={'recipientDistrictId'}
                    rules={[
                        {
                            required: true,
                            message: 'Please input District!',
                        },
                    ]}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Select
                        size="small"
                        defaultValue={t('please-select')}
                        onChange={(e) => {
                            handleFilterDistrict(e, "recipientDistrictId");
                            setIsNewAddress(true)
                        }}
                        showSearch
                        filterOption={(input, option) =>
                            option.children?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                        }
                    // filterOption={(input, option) => option.children
                    //   ?.toLowerCase()
                    //   ?.indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option value="">{t('please-select')}</Option>
                        {listDistrict && listDistrict.map((item) => {
                            // console.log("listDistrict item",item)
                            var bgcolor = null;
                            if (formDo.getFieldValue("recipientPostcode")) {
                                if (distrctOnPostcode.length > 0 && distrctOnPostcode.indexOf(item.districtId) < 0) {
                                    bgcolor = "#C6C6C6"
                                    // return null; 
                                }

                            }
                            return <Option
                                value={item.districtId}
                            // key={item.districtId}
                            >
                                <Text
                                    className="pos_select"
                                    style={{
                                        color: bgcolor
                                    }}
                                    ellipsis={
                                        !isMobile
                                            ? { tooltip: item.districtName }
                                            : false
                                    }
                                >
                                    {item.districtName}
                                </Text>
                            </Option>
                        }
                        )}
                    </Select>
                </Form.Item>
                <Form.Item
                    style={{ ...formItemStyle, marginBottom: 1, display: "none" }}
                    labelCol={{ flex: "100px" }}
                    // wrapperCol={{ xs: 24 }}
                    wrap={false}
                    // label={t('address-postal')}
                    rules={[
                        {
                            required: true,
                            message: 'Please input district!',
                        },
                    ]}
                    name={'recipientDistrictName'}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Input
                        size="small"
                        maxLength={5}
                    />
                </Form.Item>
            </Col>
            <Col xs={12} lg={6}>
                <Form.Item
                    style={{ ...formItemStyle, marginBottom: 1, }}
                    label={t('address-provice')}
                    name={'recipientProvinceId'}
                    rules={[
                        {
                            required: true,
                            message: 'Please input Provice!',
                        },
                    ]}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Select
                        size="small"
                        defaultValue={t('please-select')}
                        onChange={(e) => {
                            handleFilterProvice(e, 'recipientProvinceId')
                            setIsNewAddress(true)
                        }
                        }
                        showSearch
                        filterOption={(input, option) =>
                            option.children?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value="">{t('please-select')}</Option>
                        {listProvince && listProvince.map((item) => (
                            <Option
                                value={item.provinceId}
                            >
                                <Text
                                    className="pos_select"
                                    // style={
                                    //   !isMobile ? { width: 90 } : undefined
                                    // }
                                    ellipsis={
                                        !isMobile
                                            ? { tooltip: item.provinceName }
                                            : false
                                    }
                                >
                                    {item.provinceName}
                                </Text>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    style={{ ...formItemStyle, marginBottom: 1, display: "none" }}
                    labelCol={{ flex: "100px" }}
                    // wrapperCol={{ xs: 24 }}
                    wrap={false}
                    // label={t('address-postal')}
                    rules={[
                        {
                            required: true,
                            message: 'Please input Postal!',
                        },
                    ]}
                    name={'recipientProvinceName'}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Input
                        size="small"
                        maxLength={5}
                    />
                </Form.Item>
            </Col>
        </>
    );
};

export default ItemStoreSellPostCode;

