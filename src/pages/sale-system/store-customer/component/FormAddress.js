import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Card,
  Select,
  message,
  Modal,
  Radio,
} from 'antd';
import {
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,

} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
const { Text } = Typography;

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../../app/actions/index';
import { fetch } from '../../../../utils/fetch';

const { Option } = Select;

const FormAddress = (props) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile, isLoading } = useSelector((state) => state.mainReducer);
  const [loading, setLoadIng] = useState(false);
  // const [comId, setComID] = useState(0);

  const [listProvince2, setListProvince2] = useState([]);
  const [listDistrict2, setListDistrict2] = useState([]);
  const [listSubDistrict2, setListSubDistrict2] = useState([]);

  const [province, setProviceID] = useState(0);
  const [district, setDistrictID] = useState(0);

  const [isSelectProvince, setIsSelectProvince] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isCheckPostCode, setIsCheckPostCode2] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const formItemStyle = { marginBottom: 12 };
  const cardStyle = { padding: 12 };
  const cardBodyStyle = { padding: 0 };
  const {
    match: {
      params: { storeCustomerId },
    },
    // field,
    // index,
    // remove,
    addressCUR,
    checked,
    handleButtonStateChange,
    comId,
    form
  } = props;

  useEffect(() => {

    addressCUR.map((val, i) => {
      val.districtId = val.districtData.districtId;
      val.provinceId = val.provinceData.provinceId;
      val.subdistrictId = val.subdistrictData.subdistrictId;
      callProvince();
      callDistrict(val.provinceData.provinceId);
      callSubDistrict(val.districtData.districtId);
    })

  }, [addressCUR])

  // console.log(form.getFieldsValue('customerClassId'))

  const onChange = (e, key) => {
    const keys = form.getFieldsValue()
    const addCus = keys.addressCUR[key]
    

    if (e.target.value === '') {
      setListDistrict2([]);
      setListSubDistrict2([]);
      addCus.provinceId = '',
        addCus.districtId = '',
        addCus.subdistrictId = '',

        form.setFieldsValue({
          ...keys,
          [keys.addressCUR[key]]: addCus
        });
      setIsCheckPostCode2(false);
      return false;
    }

    if (e.target.value.length == 5) {

      setLoadIng(true);
      fetch({
        method: 'get',
        url: `/master/postcode/?postcode=${e.target.value}`,
      })
        .then((res) => {
          setLoadIng(false);
          if (res.data.success) {
            setIsCheckPostCode2(true);
            setProviceID(res.data.data.province.provinceId);
            if (res.data.data.district.length === 1) {
              setDistrictID(res.data.data.district[0].districtId);
            }

            setListSubDistrict2(res.data.data.subdistrict);

            if (comId == 0) {
              callProvince(0, 'new');
            } else {
              callProvince(comId, 'filter');
            }
            // callDistrict(res.data.data.province.provinceId);
            setListDistrict2(res.data.data.district);

            // callSubDistrict(res.data.data.district[0].districtId);
            // setListDistrict2([])
            // setListSubDistrict2([])

              addCus.provinceId = res.data.data.province.provinceId,
              addCus.districtId = res.data.data.district.length === 1
                ? res.data.data.district[0].districtId : '',
              addCus.subdistrictId = res.data.data.subdistrict.length === 1
                ? res.data.data.subdistrict[0].subdistrictId : '',

              form.setFieldsValue({
                ...keys,
                [keys.addressCUR[key]]: addCus
              });
            // console.log(keys)

          } else {
            setListDistrict2([]);
            setListSubDistrict2([]);
            const keys = form.getFieldsValue()
            const addCus = keys.addressCUR[key]
            addCus.provinceId = '',
            addCus.districtId = '',
            addCus.subdistrictId = '',

            form.setFieldsValue({
              ...keys,
              [keys.addressCUR[key]]: addCus
            });
            setIsCheckPostCode2(false);
          }
        })
        .catch((error) => {
          setListDistrict2([]);
          setListSubDistrict2([]);
          const keys = form.getFieldsValue()
          const addCus = keys.addressCUR[key]
           addCus.provinceId = '',
           addCus.districtId = '',
           addCus.subdistrictId = '',

           form.setFieldsValue({
              ...keys,
              [keys.addressCUR[key]]: addCus
           });
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
          setListProvince2(list);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };


  const callSubDistrict = async (districtId) => {
    // setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/subdistrict/?districtId=${districtId}`,
    })
      .then((res) => {
        // setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          let chkHasPostcode = false;
          const pc = form.getFieldValue('postcode');
          for (i = 0; i < res.data.data.length; i++) {
            if (pc && res.data.data[i].postcode === pc) chkHasPostcode = true;
            console.log('res.data.data[i]', res.data.data[i]);
            list.push(res.data.data[i]);
          }
          // if (!chkHasPostcode) {
          //   form.setFieldsValue({
          //     postcode: '',
          //   });
          // }
          setListSubDistrict2(list);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };
  const toRemoveAddress = (remove, id) => {
    // console.log(addressCUR[id])
    if (addressCUR[id]?.customerAddressId) {
      Modal.confirm({
        title: 'Do you want to delete?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(allAction.storeCustomeAction.deleteStoreCustomeAddress(storeCustomerId, addressCUR[id]?.customerAddressId))
            .then(() => {
              message.success('Delete Success!');
              remove(id)
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      Modal.confirm({
        title: 'Do you want to delete?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          remove(id)
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    }
  }

  const handleFilterDistrict = (value, key) => {
    const keys = form.getFieldsValue()
    const addCus = keys.addressCUR[key]

    if (value === '') {
      callDistrict(province);
      addCus.postcode = '';
      addCus.districtId = '';
      form.setFieldsValue({
        ...keys,
        [keys.addressCUR[key]]: addCus
      });
    }

    callSubDistrict(value);

    addCus.subdistrictId = '';
    setIsSelectDistrict(true);
    form.setFieldsValue({
      ...keys,
      [keys.addressCUR[key]]: addCus
    });

  };

  const handleFilterSubDistrict = (value, key) => {
    if (value === '') return null;
    const keys = form.getFieldsValue()
    const addCus = keys.addressCUR[key]

    const found = listSubDistrict2.find((item) => {
      console.log(value, item);
      if (item?.subdistrictId === value) return true;
    });

    if (found) {
      addCus.districtId = found.districtId,
        addCus.postcode = found.postcode,
        form.setFieldsValue({
          ...keys,
          [keys.addressCUR[key]]: addCus
        });
    }
  };

  const handleFilterProvice = (value, key) => {
    const keys = form.getFieldsValue()
    const addCus = keys.addressCUR[key]

    callDistrict(value);
    setIsSelectProvince(true);
    setIsFirst(true);
    setListDistrict2([]);
    setListSubDistrict2([]);

    addCus.subdistrictId = '',
      addCus.districtId = '',
      addCus.postcode = '',
      form.setFieldsValue({
        ...keys,
        [keys.addressCUR[key]]: addCus
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
          setListDistrict2(list);
        } else {
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
  return (
    <>
      <Form.List
        name="addressCUR"
        initialValue={storeCustomerId === 'create' ? [{}] : (addressCUR.length > 0 ? addressCUR : [{}])}
      >
        {(fields, { add, remove }) => (
          <>
            <Row>
              <Col xs={12}>
                <span>{t('current-address')}</span>
              </Col>
              <Col
                xs={12}
                style={{
                  marginBottom: '10px',
                }}
              >
                <Button
                  size="small"
                  type="primary"
                  style={{
                    float: 'right',
                    marginRight: 10,
                    marginBottom: '10px',
                    width: '80px',
                  }}
                  onClick={() => add()}
                >
                  {t('add-address')}
                </Button>
              </Col>
            </Row>
            {fields.map((field, index) => (
              <Card key={field.key} style={cardStyle} bodyStyle={cardBodyStyle}>
                <Row>
                  <Col xs={fields.length > 1 ? 20 : 24}>
                    <Form.Item
                      style={formItemStyle}
                      name={[index, 'defaultAddress']}
                    >
                      <Radio checked={checked.[`checked${index}`]}
                        onClick={() => handleButtonStateChange(`checked${index}`)}
                      >
                        :
                        {' '}
                        {t('set-default')}
                      </Radio>
                    </Form.Item>
                  </Col>
                  {fields.length > 1 && (<Col
                    xs={4}

                    style={{
                      // marginTop: '10px',
                    }}
                  >
                    <Button
                      size="small"
                      type="primary"
                      danger
                      style={{
                        float: 'right',
                        width: '80px',
                      }}
                      onClick={() => { toRemoveAddress(remove, index); }}
                    >
                      {t('delete')}
                    </Button>
                  </Col>)}
                  <Col xs={6} lg={3}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-number')}
                      name={[index, 'no']}
                      rules={[
                        { required: form.getFieldValue('customerClassId') !== 1, message: 'Please input Address Number!' }]}
                      validateTrigger="onBlur"
                      fieldKey={[field.fieldKey, 'no']}

                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('address-number')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={6} lg={3}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-village')}
                      name={[index, 'moo']}
                      fieldKey={[field.fieldKey, 'moo']}

                      // rules={[
                      //   { required: true, message: 'Please input Address Village!' }]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('address-village')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-lane')}
                      name={[index, 'alley']}
                      fieldKey={[field.fieldKey, 'alley']}

                      // rules={[
                      //   { required: true, message: 'Please input Address Lane!' }]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('address-lane')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-road')}
                      name={[index, 'road']}
                      fieldKey={[field.fieldKey, 'road']}

                      // rules={[
                      //   { required: true, message: 'Please input Address Road!' }]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('address-road')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-other')}
                      name={[index, 'other']}
                      fieldKey={[field.fieldKey, 'other']}

                      // rules={[
                      //   { required: true, message: 'Please input Other!' }]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('address-other')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-postal')}
                      name={[index, 'postcode']}
                      rules={[
                        {
                          required: form.getFieldValue('customerClassId') !== 1,
                          message: 'Please input Postal!'
                        }]}
                      validateTrigger="onBlur"
                      fieldKey={[field.fieldKey, 'postcode']}
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('address-postal')}
                        onChange={(e) => {
                          onChange(e, index) 
                        }
                        
                        }
                        onKeyPress={(event) => {
                          isInputNumber(event);
                        }}
                        maxLength={5}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-sub-district')}
                      name={[index, 'subdistrictId']}
                      rules={[
                        { required: form.getFieldValue('customerClassId') !== 1, message: 'Please input Sub District!' }]}
                      validateTrigger="onBlur"
                      fieldKey={[field.fieldKey, 'subdistrictId']}


                    // {...formItemDistrict}
                    >
                      <Select
                        defaultValue={t('all-select')}
                        onChange={(e) => handleFilterSubDistrict(e, field.key)}
                        showSearch
                        filterOption={(input, option) => option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="">{t('all-select')}</Option>
                        {listSubDistrict2.map((item) => {
                          // console.log(form.getFieldValue())
                          const keys = form.getFieldsValue()
                          console.log('keys : ' , keys)
                          console.log('field.fieldKey : ' , field.fieldKey)
                          const addCus = keys.addressCUR[field.fieldKey]

                          console.log('addCus 1234 : ' , addCus)

                          if (addCus !== undefined){
                            if (addCus.postcode) {
                              if (item.postcode !== addCus.postcode) { return null; }
                            }
                          }
                          
                          return (
                            <Option
                              value={item.subdistrictId}
                              key={item.subdistrictId}
                            >
                              {item.subdistrictName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-district')}
                      name={[index, 'districtId']}
                      rules={[
                        { required: form.getFieldValue('customerClassId') !== 1, message: 'Please input District!' }]}
                      validateTrigger="onBlur"
                      fieldKey={[field.fieldKey, 'districtId']}

                    >
                      <Select
                        defaultValue={t('all-select')}
                        onChange={(e) => handleFilterDistrict(e, field.key)}
                        showSearch
                        filterOption={(input, option) => option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="">{t('all-select')}</Option>
                        {listDistrict2.map((item) => (
                          <Option
                            value={item.districtId}
                            key={item.districtId}
                          >
                            <Text
                              style={!isMobile ? { width: 90 } : undefined}
                              ellipsis={!isMobile ? { tooltip: item.districtName } : false}
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
                      style={formItemStyle}
                      label={t('address-provice')}
                      name={[index, 'provinceId']}
                      rules={[
                        { required: form.getFieldValue('customerClassId') !== 1, message: 'Please input Provice!' }]}
                      validateTrigger="onBlur"
                      fieldKey={[field.fieldKey, 'provinceId']}

                    >
                      <Select
                        defaultValue={t('all-select')}
                        onChange={(e) => handleFilterProvice(e, field.key)}
                        showSearch
                        filterOption={(input, option) => option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="">{t('all-select')}</Option>
                        {listProvince2.map((item) => (
                          <Option
                            value={item.provinceId}
                            key={item.provinceId}
                          >
                            <Text
                              style={!isMobile ? { width: 90 } : undefined}
                              ellipsis={!isMobile ? { tooltip: item.provinceName } : false}
                            >
                              {item.provinceName}
                            </Text>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}

          </>
        )}
      </Form.List>
    </>
  )
}

export default FormAddress
