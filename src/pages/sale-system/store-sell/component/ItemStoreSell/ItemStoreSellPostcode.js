/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from 'react';
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

} from '@ant-design/icons';

import { fetch } from '../../../../../utils/fetch';
// import allAction from '../../../../app/actions';
// import ItemStoreSell from './ItemStoreSell';


const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const ItemStoreSellPostCode = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // const {
  //   draftData,
  //   parcelTypeData,
  // } = useSelector((state) => state.storeSellReducer);

  // const { isMobile, isLoading } = useSelector((state) => state.mainReducer);

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
  const {
    index, field, phone,
    fieldKey, checkChangeValue, calTransItem,
    listProvince2, setListProvince2,
    cachePostcode, setCachePostcode, itemStoreSell,
    setForm,remove,hasBanArea
  } = props;

  const [listData, setListData] = useState();

  const [loading, setLoadIng] = useState(false);
  const [banArea, setBanArea] = useState(false);

  // const { recipientPostcode,
  //   recipientSubdistrictId,
  //   recipientDistrictId,
  //   recipientProvinceId,
  //   recipientSubdistrictName,
  //   recipientDistrictName,
  //   recipientProvinceName,
  //   recipientInput } = itemStoreSell

  // const [listProvince2, setListProvince2] = useState([]);
  const [listDistrict2, setListDistrict2] = useState(cachePostcode?.district.hasOwnProperty(itemStoreSell.recipientProvinceId)
    ? cachePostcode.district[itemStoreSell.recipientProvinceId] : []);

  const [listSubDistrict2, setListSubDistrict2] = useState([]);
  const [listProvince3, setListProvince3] = useState([]);
  const [firstInit, setFirstInit] = useState(true)

  const [province, setProviceID] = useState(0);
  const [district, setDistrictID] = useState(0);

  const [isSelectProvince, setIsSelectProvince] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isCheckPostCode, setIsCheckPostCode2] = useState(false);

  // console.log("render2")

  useEffect(() => {
    // setListProvince2([])
    // setListDistrict2([])
    // setListSubDistrict2([])
    // callProvince();
    const thisItem = itemStoreSell

    console.log("phone", phone)

    // if (thisItem?.recipientProvinceId && thisItem?.recipientDistrictId) {
    //   callProvince();
    //   callDistrict(thisItem.recipientProvinceId);
    //   callSubDistrict(thisItem.recipientDistrictId);
    // }
  }, [phone])

  useEffect(() => {
    // console.log('listProvince2', listProvince3)

    callProvince(0, 'new');
    // console.log('setListProvince2', listProvince3)

  }, [])


  const foundBan = { banArea : ""}
  var array1 = cachePostcode.subdistrict[itemStoreSell.recipientDistrictId]
  if(array1){
     var found = array1.find(element => element.subdistrictId == itemStoreSell.recipientSubdistrictId);
     
    if(found){
      // alert("1")
      if(found?.banArea){
        foundBan.banArea = "1"
        hasBanArea.current = found?.banArea
      } else {
        foundBan.banArea = ""
        hasBanArea.current = ""
      }
    }
    else {
      foundBan.banArea = ""
      hasBanArea.current = ""
    }
  } else {
    foundBan.banArea = ""
    hasBanArea.current = ""
  }


  // const {
  //   recipientSubdistrictId,
  //   recipientDistrictId,
  //   recipientProvinceId,
  //   recipientSubdistrictName,
  //   recipientDistrictName,
  //   recipientProvinceName, } = form.getFieldsValue().itemStoreSell[fieldKey]

  useEffect(() => {
    console.log("recipientInput", itemStoreSell.recipientInput)
  }, [itemStoreSell.recipientInput])

  useEffect(() => {
    if (itemStoreSell.recipientDistrictId) {
      callSubDistrict(itemStoreSell.recipientDistrictId);
      console.log("callSubDistrict")
    }
  }, [itemStoreSell.recipientDistrictId])

  useEffect(() => {
    // console.log(listDistrict2)
    setTimeout(() => {
      if (itemStoreSell.recipientProvinceId && itemStoreSell.recipientDistrictId) {
        const ld = listDistrict2.find(o => o.districtId === itemStoreSell.recipientDistrictId)
        if (!ld)
          callDistrict(itemStoreSell.recipientProvinceId);
      }
    }, 1);
  }, [itemStoreSell.recipientDistrictId])
  
  // const checkBanArea = (subdistrictId) => {
    
  //   var array1 = cachePostcode.subdistrict[itemStoreSell.recipientDistrictId]
  //   if(array1){
  //     const found = array1.find(element => element.subdistrictId == subdistrictId);
      
  //     if(found){
  //       // alert("a")
  //       hasBanArea.current = true
  //     }
  //     else {
  //       // alert("b")
  //       hasBanArea.current = false
  //     }
        

  //     return found?.banArea
  //   } 
  //   alert("x")
  //   hasBanArea.current = false
  //   return ""
  //  }

  // const { recipientPostcode,
  //   recipientSubdistrictId,
  //   recipientDistrictId,
  //   recipientProvinceId } = form.getFieldsValue().itemStoreSell[index]

  // ****
  useEffect(() => {
    console.log("recipientSubdistrictName", index, itemStoreSell.recipientSubdistrictName)
    if (itemStoreSell.recipientPostcode && !firstInit) console.log("ABX")
    console.log("ALL", itemStoreSell.recipientPostcode, itemStoreSell.recipientSubdistrictName, itemStoreSell.recipientDistrictName, itemStoreSell.recipientProvinceName)

    if (itemStoreSell.recipientPostcode && !firstInit)
      if (itemStoreSell.recipientPostcode.length == 5 && itemStoreSell.recipientSubdistrictName && itemStoreSell.recipientDistrictName && itemStoreSell.recipientProvinceName) {
        calTransItem(null, index)
        console.log("recipientSubdistrictName", index, itemStoreSell.recipientSubdistrictName)
      }
  }, [itemStoreSell.recipientSubdistrictName])
  // ****

  useEffect(() => {
    console.log("create", index, fieldKey, itemStoreSell.recipientSubdistrictName, listDistrict2)
    setTimeout(() => {
      setFirstInit(false)
    }, 100);
  }, [])

  // useEffect(() => {
  //   console.log("listDistrict2", listDistrict2)
  // }, [listDistrict2])

  // useEffect(() => {
  //   callProvince();
  //   const keys = form.getFieldsValue();
  //   if (keys?.itemStoreSell) {
  //     keys.itemStoreSell.map((val, i) => {
  //       callProvince();
  //       callDistrict(val.recipientProvinceId);
  //       callSubDistrict(val.recipientDistrictId);
  //     });
  //     setListData(keys.itemStoreSell);
  //   }
  // }, [phone]);

  //*** */
  // useEffect(() => {
  //   console.log('key');
  //   const keys = form.getFieldsValue();

  //   callProvince();
  //   if (keys?.itemStoreSell) {
  //     keys.itemStoreSell.map((val, i) => {
  //       callProvince();
  //       callDistrict(val.recipientProvinceId);
  //       callSubDistrict(val.recipientDistrictId);
  //     });
  //     setListData(keys.itemStoreSell);
  //   }
  // }, [form.getFieldValue('companyId')]);

  // useEffect(() => {
  //   if (!isModalVisible) {
  //     console.log('close modal');
  //     const keys = form.getFieldsValue();

  //     if (keys?.itemStoreSell) {
  //       keys.itemStoreSell.map((val, i) => {
  //         callProvince();
  //         callDistrict(val.recipientProvinceId);
  //         callSubDistrict(val.recipientDistrictId);
  //         if (listData?.[i]?.recipientSubdistrictId !== val?.recipientSubdistrictId) {
  //           calTransItem(_, i);
  //         }
  //       });
  //       setListData(keys.itemStoreSell);
  //     }
  //   }
  // }, [isModalVisible]);

  const onChangePostcode = (e, key) => {
    console.log("onChangePostcode")
    const addCus = {}

    if (e.target.value === '') {
      setListDistrict2([]);
      setListSubDistrict2([]);
      (addCus.recipientProvinceId = ''),
        (addCus.recipientProvinceName =
          ''),
        (addCus.recipientDistrictId = ''),
        (addCus.recipientDistrictName =
          ''),
        (addCus.recipientSubdistrictId = ''),
        (addCus.recipientSubdistrictName = '')

      setForm(index, addCus);
      // form.setFieldsValue({
      //   ...keys,
      //   [keys.itemStoreSell[key]]: addCus,
      // });
      setIsCheckPostCode2(false);
      return false;
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
              setIsCheckPostCode2(true);
              setProviceID(res.data.data.province.provinceId);
              if (res.data.data.district.length === 1) {
                setDistrictID(res.data.data.district[0].districtId);
              }

              setListSubDistrict2(res.data.data.subdistrict);

              // if (companyId === 0) {
              //   callProvince(0, 'new');
              // } else {
              //   callProvince(companyId, 'filter');
              // }
              // callDistrict(res.data.data.province.provinceId);
              setListDistrict2(res.data.data.district);
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

              setForm(index, addCus);
              // form.setFieldsValue({
              //   ...keys,
              //   [keys.itemStoreSell[key]]: addCus,
              // });


              // calTransItem(e, key)
            } else {
              setListDistrict2([]);
              setListSubDistrict2([]);

              const addCus = {};

              (addCus.recipientProvinceId = ''),
                (addCus.recipientDistrictId = ''),
                (addCus.recipientSubdistrictId = ''),
                (addCus.recipientProvinceName = ''),
                (addCus.recipientDistrictName = ''),
                (addCus.recipientSubdistrictName = '');
              setForm(index, addCus)
              setIsCheckPostCode2(false);
            }
        })
        .catch((error) => {
          setListDistrict2([]);
          setListSubDistrict2([]);

          const addCus = {};

          (addCus.recipientProvinceId = ''),
            (addCus.recipientDistrictId = ''),
            (addCus.recipientSubdistrictId = ''),
            (addCus.recipientProvinceName = ''),
            (addCus.recipientDistrictName = ''),
            (addCus.recipientSubdistrictName = '');
          setForm(index, addCus)
          setIsCheckPostCode2(false);
          setLoadIng(false);
          console.log(error);
        });
    }
  };
  const callProvince = async () => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: '/master/province',
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListProvince3(list);
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const callSubDistrict = async (districtId) => {

    const addCus = {}
    const pc = itemStoreSell?.recipientPostcode;
    let chkHasPostcode = false;

    if (cachePostcode?.subdistrict?.hasOwnProperty(districtId)) {
      setListSubDistrict2(cachePostcode.subdistrict[districtId]);

      for (var i = 0; i < cachePostcode.subdistrict[districtId].length; i++) {
        if (pc && cachePostcode.subdistrict[districtId][i].postcode === pc) chkHasPostcode = true;
      }

      if (!chkHasPostcode) {
        addCus.recipientPostcode = ''
        setForm(index, addCus)
      }
      return false
    }

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
            if (pc && res.data.data[i].postcode === pc) chkHasPostcode = true;
            list.push(res.data.data[i]);
          }
          if (!chkHasPostcode) {
            addCus.recipientPostcode = ''
            setForm(index, addCus)
          }
          console.log(list)

          setListSubDistrict2(list);

          let tmp = cachePostcode
          tmp.subdistrict[districtId] = list

          setCachePostcode(tmp)
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const handleFilterSubdistrict = (value, key) => {
    if (value === '') return null;

    const subDisFound = listSubDistrict2.filter(
      (val) => val.subdistrictId === value
    );
    const addCus = {}

    addCus.recipientPostcode = subDisFound[0]?.postcode;
    addCus.recipientSubdistrictName = subDisFound[0]?.subdistrictName;

    const disFound = listDistrict2.filter(
      (val) => val.districtId === subDisFound[0]?.districtId
    );
    addCus.recipientDistrictId = disFound[0]?.districtId;
    addCus.recipientDistrictName = disFound[0]?.districtName;

    setForm(index, addCus);

    // if (recipientPostcode)
    // if (recipientPostcode.length == 5 && recipientSubdistrictName && recipientDistrictName && recipientProvinceName) {

    // calTransItem(null, index)
    // }

    // console.log("handleFilterSubdistrict", form.getFieldsValue().itemStoreSell[index]);

  };
  const handleFilterDistrict = (value, key) => {

    const addCus = {}

    if (value === '') {
      callDistrict(itemStoreSell?.recipientProvinceId);

      addCus.recipientPostcode = '';
      addCus.recipientDistrictId = '';
      setForm(index, addCus)
    }

    callSubDistrict(value);
    const disaName = listDistrict2.filter((val) => val.districtId === value);
    console.log("disaName", disaName)

    addCus.recipientSubdistrictId = '';
    addCus.recipientSubdistrictName = '';
    addCus.recipientDistrictName = disaName[0]?.districtName;
    console.log("addCus.recipientDistrictName", addCus.recipientDistrictName)

    setIsSelectDistrict(true);

    setForm(index, addCus)

  };
  const handleFilterProvice = (value, key) => {

    const addCus = {}
    const disaName = listProvince3.filter((val) => val.provinceId === value);

    // setListDistrict2([]);
    setListSubDistrict2([]);

    callDistrict(value);
    setIsSelectProvince(true);
    // setIsFirst(true);


    addCus.recipientSubdistrictId = '';
    addCus.recipientDistrictId = '';

    addCus.recipientPostcode = '';

    addCus.recipientSubdistrictName = '';
    addCus.recipientDistrictName = '';
    addCus.recipientProvinceName = disaName[0]?.provinceName;
    setForm(index, addCus)
  };

  const callDistrict = useCallback(async (provinceId) => {
    if (cachePostcode?.district?.hasOwnProperty(provinceId)) {
      console.log("yes", cachePostcode.district[provinceId])
      setListDistrict2(cachePostcode.district[provinceId])

    } else
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
            console.log("list", list)
            setListDistrict2(list);

            let tmp = cachePostcode
            tmp.district[provinceId] = list
            setCachePostcode((prevState) => ({
              ...prevState,
              [provinceId]: list,
            }))
          }
        })
        .catch((error) => {
          setLoadIng(false);
          console.log(error);
        });
  }, [listProvince3.length]);

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
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
          name={[index, 'recipientPostcode']}
          validateTrigger={['onBlur', 'onChange']}
          fieldKey={[field.fieldKey, 'recipientPostcode']}
        >
          <Input
            size="small"
            // autocomplete="new-password"
            onChange={(e) => onChangePostcode(e, index)}
            onKeyPress={(event) => {
              isInputNumber(event);
              checkChangeValue(event, field.name,remove);
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
          name={[index, 'recipientSubdistrictId']}
          rules={[
            {
              required: true,
              message: 'Please input Sub District!',
            },
          ]}
          validateTrigger={['onBlur', 'onChange']}
          fieldKey={[
            field.fieldKey,
            'recipientSubdistrictId',
          ]}
        >
          <Select
            size="small"
            style={{
              border: foundBan?.banArea ? "3px red solid" : "" ,
              color : foundBan?.banArea ? "red" : "black"
            }}
            defaultValue={t('please-select')}
            // style={{backgroundColor: "red"}}
            onChange={(e) =>
              handleFilterSubdistrict(e, field.name)
            }
            showSearch
            filterOption={(input, option) =>
              option.children?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">{t('please-select')}</Option>
            {listSubDistrict2.map((item) => {

              // const addCus = {}

              if (itemStoreSell?.recipientPostcode) {
                if (item?.postcode !== itemStoreSell?.recipientPostcode) { return null; }
              }
              return (
                <Option
                  value={item.subdistrictId}
                  key={item.subdistrictId}
                >
                  <Text
                    className="pos_select"
                    // style={
                    //   !isMobile ? { width: 90 } : undefined
                    // }
                    ellipsis={
                      !isMobile
                        ? { tooltip: item.subdistrictName }
                        : false
                    }
                    // style={{color : checkBanArea(itemStoreSell.recipientSubdistrictId) ? "red" : "black"}}
                  >
                    {item.subdistrictName}
                  </Text>
                </Option>
              )
            }
            )}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={12} lg={6}>
        <Form.Item
          style={{ ...formItemStyle, marginBottom: 1 }}
          label={t('address-district')}
          name={[index, 'recipientDistrictId']}
          rules={[
            {
              required: true,
              message: 'Please input District!',
            },
          ]}
          validateTrigger={['onBlur', 'onChange']}
          fieldKey={[field.fieldKey, 'recipientDistrictId']}
        >
          <Select
            size="small"
            defaultValue={t('please-select')}
            onChange={(e) => {
              handleFilterDistrict(e, field.name);
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
            {listDistrict2.map((item) => (
              <Option
                value={item.districtId}
              // key={item.districtId}
              >
                <Text
                  className="pos_select"
                  // style={
                  //   !isMobile ? { width: 90 } : undefined
                  // }
                  ellipsis={
                    !isMobile
                      ? { tooltip: item.districtName }
                      : false
                  }
                >
                  {item.districtName}
                </Text>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={12} lg={6}>
        <Form.Item
          style={{ ...formItemStyle, marginBottom: 1 }}
          label={t('address-provice')}
          name={[index, 'recipientProvinceId']}
          rules={[
            {
              required: true,
              message: 'Please input Provice!',
            },
          ]}
          validateTrigger={['onBlur', 'onChange']}
          fieldKey={[field.fieldKey, 'recipientProvinceId']}
        >
          <Select
            size="small"
            defaultValue={t('please-select')}
            onChange={(e) =>
              handleFilterProvice(e, field.name)
            }
            showSearch
            filterOption={(input, option) =>
              option.children?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">{t('please-select')}</Option>
            {listProvince3.map((item) => (
              <Option
                value={item.provinceId}
              // key={item.provinceId}
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
      </Col>
    </>
  );
};

export default ItemStoreSellPostCode;

