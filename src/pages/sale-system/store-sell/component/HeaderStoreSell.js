/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  Badge,
  message,
  Image,
  Card,
  DatePicker,
  Select,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
// import { format } from 'date-fns';
import ModalComponent from './Modal';
import allAction from '../../../../app/actions';
import '../StoreSell.module.css';
import { styles } from '../StoreSell.styles';
import moment from 'moment';
// import MpayIcon from '../../../../assets/mPay.png';

const { Text } = Typography;
const { Option } = Select;
const HeaderStoreSell = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const itemLayout = {
    xs: 24,
    sm: 12,
    lg: 6,
  };
  const {
    form,
    setShortSender,
    match: {
      params: { orderId },
    },
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCode, setShowCode] = useState('');

  // const {
  //   masterPaymentType,
  //   flagButtonHeader,
  //   itemTypeTrans,
  // } = useSelector((state) => state.storeSellReducer);

  const masterPaymentType = useSelector((state) => state.storeSellReducer.masterPaymentType);
  const flagButtonHeader = useSelector((state) => state.storeSellReducer.flagButtonHeader);
  const itemTypeTrans = useSelector((state) => state.storeSellReducer.itemTypeTrans);


  const isMobile = useSelector((state) => state.mainReducer.isMobile);

  // const { masterLevelList, masterHubList, masterAgencyList } = useSelector(
  //   (state) => state.userManagementReducer
  // );

  const masterLevelList = useSelector((state) => state.userManagementReducer.masterLevelList);
  const masterHubList = useSelector((state) => state.userManagementReducer.masterHubList);
  const masterAgencyList = useSelector((state) => state.userManagementReducer.masterAgencyList);

  // const { userLevel, companyId, hubId, agencyId, isCustomer } = useSelector(
  //   (state) => state.authenReducer
  // );

  const userLevel = useSelector((state) => state.authenReducer.userLevel);
  const companyId = useSelector((state) => state.authenReducer.companyId);
  const hubId = useSelector((state) => state.authenReducer.hubId);
  const agencyId = useSelector((state) => state.authenReducer.agencyId);
  const isCustomer = useSelector((state) => state.authenReducer.isCustomer);

  const companyData = useSelector((state) => state.companyReducer.companyData);

  const keyinTimeout1 = useRef(null);
  const keyinTimeout2 = useRef(null);
  const keyinTimeout3 = useRef(null);

  const [loadingFields, setLoadingFields] = useState(null);

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  useEffect(() => {

    console.log("userLevel", userLevel)

    dispatch(allAction.storeSellAction.getMasterPaymentType())
      .then()
      .catch((e) => console.log('err', e));

    if (userLevel !== "AGN") {
      dispatch(allAction.userManagementAction.getMasterLevel())
        .then()
        .catch((e) => message.error(e.message));
      dispatch(allAction.companyAction.getCompanyData())
        .then()
        .catch((e) => message.error(e.message));
      dispatch(allAction.userManagementAction.getHubList({ companyId }))
        .then()
        .catch((e) => message.error(e.message));
      dispatch(
        allAction.userManagementAction.getAgencyList({
          hubId,
          isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB']) ? 'ALL' : null,
        })
      )
        .then()
        .catch((e) => message.error(e.message));
    }


    if (agencyId) {

      const keys = form.getFieldValue();
      const query = {
        customerSearch: keys.customerInput,
        companyId: companyId || keys.companyId,
      };

      dispatch(allAction.storeSellAction.getAgencyCod(agencyId))
        .then()
        .catch((e) => message.error(e.message));

      // console.log("getAgencyDiscount 131");
      // dispatch(allAction.storeSellAction.getAgencyDiscount(agencyId, query))

    }

    masterLevelList.filter((val) => !['SAD'].includes(val.levelCode));
    onCheckbtnHeader();
    setTimeout(() => form.setFieldsValue({ date: moment() }), 3000);
  }, []);

  useEffect(() => {
    if (userLevel !== "AGN") {
      const keys = form.getFieldValue();
      dispatch(allAction.storeSellAction.getMasterPaymentType())
        .then()
        .catch((e) => console.log('err', e));
      dispatch(allAction.userManagementAction.getMasterLevel())
        .then()
        .catch((e) => message.error(e.message));
      dispatch(allAction.companyAction.getCompanyData())
        .then()
        .catch((e) => message.error(e.message));
      dispatch(
        allAction.userManagementAction.getHubList({ companyId: keys.companyId })
      )
        .then()
        .catch((e) => message.error(e.message));
      dispatch(
        allAction.userManagementAction.getAgencyList({
          hubId: keys.hubId,
          isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB']) ? 'ALL' : null,
        })
      )
        .then()
        .catch((e) => message.error(e.message));
      if (keys.agencyId) {
        const query = {
          customerSearch: keys.customerInput,
          companyId: companyId || keys.companyId,
        };
        dispatch(allAction.storeSellAction.getAgencyCod(keys.agencyId))
          .then()
          .catch((e) => message.error(e.message));
        dispatch(
          allAction.storeSellAction.getAgencyDiscount(keys.agencyId, query)
        )
          .then()
          .catch((e) => message.error(e.message));
      }
      if (companyId) {
        dispatch(allAction.storeSellAction.getParcelTypeData(companyId))
          .then()
          .catch((e) => console.log('err', e));
      }
      masterLevelList.filter((val) => !['SAD'].includes(val.levelCode));
      onCheckbtnHeader();
      setTimeout(() => form.setFieldsValue({ date: moment() }), 3000);
    }
  }, [form.getFieldValue('agencyId')]);

  const showModal = (value) => {
    setIsModalVisible(!isModalVisible);
    setShowCode(value);
  };

  const handleOk = () => {
    dispatch(allAction.storeSellAction.setActionModal('view'));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // dispatch(allAction.storeSellAction.setActionModal(''));
  };

  const handleSearchHub = (value) => {
    const objSearch = {
      search: value,
    };
    if (form.getFieldValue('companyId')) {
      objSearch.companyId = form.getFieldValue('companyId');
    }
    dispatch(allAction.userManagementAction.getHubList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };

  const handleSearchAgency = (value) => {
    const objSearch = {
      search: value,
      isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB']) ? 'ALL' : null,
    };
    if (form.getFieldValue('companyId')) {
      objSearch.companyId = form.getFieldValue('companyId');
    }
    if (form.getFieldValue('hubId')) {
      objSearch.hubId = form.getFieldValue('hubId');
    }
    dispatch(allAction.userManagementAction.getAgencyList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };

  const onSearchCustomer_WaitKeyIn = (v) => {
    clearTimeout(keyinTimeout1.current);

    const val = v.replace(/[^0-9]|\s/g, '')
    form.setFieldsValue({ customerInput: val })

    keyinTimeout1.current = setTimeout(() => {
      try {
        onSearchCustomer(val);
      } catch (e) {
        console.log("ERROR onSearchCustomer(e);")
      }
    }, 500);
  };

  //  onSearchCustomer
  const onSearchCustomer = (v) => {
    form.resetFields([
      'customerSumName',
      'customerName',
      'customerLastName',
      'addressCustomer',
      'customerBankName',
      'customerBankAccountNo',
    ]);
    setShortSender({});

    if (!v || v.length > 8) {
      setLoadingFields('customer');

      const keys = form.getFieldValue();

      const objSearch = {};
      objSearch.search = v;
      if (userLevel === 'SAD') objSearch.companyId = keys.companyId;
      dispatch(allAction.storeSellAction.getCustomerDetail(objSearch))
        .then((data) => {

          let addressRes = '';
          if (data) {
            const query = {
              customerSearch: v,
              companyId: companyId || keys.companyId,
            };
            dispatch(
              allAction.storeSellAction.getAgencyDiscount(
                agencyId || keys.agencyId,
                query
              )
            )
              .then()
              .catch((e) => {
                message.error(e.message);
                setLoadingFields(null);
              });

            data.customerAddressData.filter((val) => {
              if (val.defaultAddress) {
                const moo = val.moo ? `${t('address-village')}${val.moo}` : '';
                const alley = val.alley
                  ? `${t('address-lane')}${val.alley}`
                  : '';
                const road = val.road ? `${t('address-road')}${val.road}` : '';
                const subdistrict = val.subdistrictData?.subdistrictName
                  ? `${t('address-sub-district2')}${val.subdistrictData.subdistrictName
                  }`
                  : '';
                const district = val.districtData?.districtName
                  ? `${t('address-district2')}${val.districtData.districtName}`
                  : '';
                const provice = val.provinceData?.provinceName
                  ? `${t('address-provice2')}${val.provinceData.provinceName}`
                  : '';
                const postcode = val.postcode ? `${val.postcode}` : '';
                addressRes = `${val.no} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;

                form.setFieldsValue({
                  // ...form.getFieldValue(),
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
                });
              }
            });
            console.log("data.customerBankData[0]", data.customerBankData[0])

            form.setFieldsValue({
              // ...form.getFieldValue(),
              customerId: data.customerId,
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
              customerBankId: data.customerBankData[0]?.customerBankId || null,
              discountPercent: data?.discountRate ? parseFloat(data?.discountRate) : 0,
              customerTaxpayerNumber: data?.taxpayerNumber || null,
            });
            dispatch(allAction.storeSellAction.setActionModal(''));
            dispatch(allAction.orderItemImportAction.setFormUpdate(form.getFieldsValue()))
            // setShortSender({
            //   customerName: data.customerName || '',
            //   customerLastName: data.customerLastName || '',
            //   addressCustomer: addressRes,
            // });

            setLoadingFields(null);
          } else {
            dispatch(
              allAction.storeSellAction.getAgencyDiscount(
                keys?.agencyId || agencyId
              )
            )
              .then()
              .catch((e) => message.error(e.message));
            setLoadingFields(null);
          }
          // console.log('gettt', form.getFieldValue());
        })
        .catch((e) => {
          message.error(e.message);
          setLoadingFields(null);
        });
    }
  };

  const onSearchSender_WaitKeyIn = (v) => {
    clearTimeout(keyinTimeout2.current);

    const val = v.replace(/[^0-9]|\s/g, '')
    form.setFieldsValue({ senderInput: val })

    keyinTimeout2.current = setTimeout(() => {
      try {
        onSearchSender(val);
      } catch (e) {
        console.log("ERROR onSearchCustomer(e);")
      }
    }, 500);
  };

  //  onSearchSender
  const onSearchSender = (v) => {
    form.resetFields([
      'senderSumName',
      'senderName',
      'senderLastName',
      'addressSender',
    ]);
    if (!v || v.length > 8) {
      setLoadingFields('sender');

      const keys = form.getFieldValue();
      const objSearch = {};
      objSearch.search = v;
      if (userLevel === 'SAD') objSearch.companyId = keys.companyId;
      dispatch(allAction.storeSellAction.getCustomerDetail(objSearch))
        .then((data) => {
          let addressRes = '';
          if (data) {
            data.customerAddressData.filter((val) => {
              if (val.defaultAddress) {
                const moo = val.moo ? `${t('address-village')}${val.moo}` : '';
                const alley = val.alley
                  ? `${t('address-lane')}${val.alley}`
                  : '';
                const road = val.road ? `${t('address-road')}${val.road}` : '';
                const subdistrict = val.subdistrictData?.subdistrictName
                  ? `${t('address-sub-district2')}${val.subdistrictData.subdistrictName
                  }`
                  : '';
                const district = val.districtData?.districtName
                  ? `${t('address-district2')}${val.districtData.districtName}`
                  : '';
                const provice = val.provinceData?.provinceName
                  ? `${t('address-provice2')}${val.provinceData.provinceName}`
                  : '';
                const postcode = val.postcode ? `${val.postcode}` : '';
                addressRes = `${val.no} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;

                form.setFieldsValue({
                  // ...form.getFieldValue(),
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
                  senderTaxpayerNumber: val.taxpayerNumber || null,
                });
              }
            });
            dispatch(allAction.storeSellAction.setActionModal(''));
            form.setFieldsValue({
              // ...form.getFieldValue(),
              senderId: data.customerId,
              senderName: data.customerName || '',
              senderLastName: data.customerLastName || '',
              senderSumName: data.customerName
                ? `${data.customerName} ${data.customerLastName || ''}`
                : '-',
              addressSender: addressRes,
              senderTaxpayerNumber: data.taxpayerNumber || '',
            });
          }
          setLoadingFields(null);
        })
        .catch((e) => {
          setLoadingFields(null);
          message.error(e.message);
        });
    }
  };

  const onSearchRecommender_WaitKeyIn = (v) => {
    clearTimeout(keyinTimeout3.current);

    const val = v.replace(/[^0-9]|\s/g, '')
    form.setFieldsValue({ recommenderInput: val })

    keyinTimeout3.current = setTimeout(() => {
      try {
        onSearchRecommender(val);
      } catch (e) {
        console.log("ERROR onSearchCustomer(e);")
      }
    }, 500);
  };

  const onSearchRecommender = (v) => {
    form.resetFields([
      'recommenderName',
      'recommenderLastName',
      'recommenderSumName',
    ]);

    if (!v || v.length > 8) {
      const keys = form.getFieldValue();
      const objSearch = {};
      objSearch.search = v;
      // if (v !== keys.customerInput && v !== keys.senderInput) {
      if (userLevel === 'SAD') objSearch.companyId = keys.companyId;
      dispatch(allAction.storeSellAction.getCustomerDetail(objSearch))
        .then((data) => {
          if (data) {
            form.setFieldsValue({
              // ...form.getFieldValue(),
              recommenderId: data.customerId,
              recommenderName: data.customerName,
              recommenderLastName: data.customerLastName,
              recommenderSumName: data.customerName
                ? `${data.customerName} ${data.customerLastName || ''}`
                : '-',
            });
          }
        })
        .catch((e) => message.error(e.message));
      // } else {
      //   message.error('Recommender Duplicate with Customer or Sender!')
      //   // form.resetFields([
      //   //   'recommenderInput',
      //   // ]);
      // }
    }
  };
  const onCheckbtnHeader = () => {
    const keys = form.getFieldValue();

    if (
      (companyId || keys.companyId) &&
      (hubId || keys.hubId) &&
      (agencyId || keys.agencyId)
    ) {
      dispatch(allAction.storeSellAction.setButtonFlagHeader(true));
    } else {
      dispatch(allAction.storeSellAction.setButtonFlagHeader(false));
    }
  };

  const onCheckHeader = (value) => {
    const keys = form.getFieldValue();
    // console.log('keyPress', keys);
    if (isCustomer) {
      if (keys.date && keys.paymentTypeCode) {
        const check =
          (!!companyId || !!keys.companyId) &&
          (!!hubId || !!keys.hubId) &&
          (!!agencyId || !!keys.agencyId) &&
          !!keys.date &&
          !!keys.paymentTypeCode &&
          !!keys.customerInput &&
          !!keys.customerName &&
          !!keys.customerNo &&
          !!keys.customerPostcode &&
          !!keys.customerProvinceId &&
          !!keys.customerSubdistrictId &&
          !!keys.customerDistrictId &&
          !!keys.addressCustomer &&
          !!keys.senderInput &&
          !!keys.senderName &&
          !!keys.senderNo &&
          !!keys.senderPostcode &&
          !!keys.senderProvinceId &&
          !!keys.senderSubdistrictId &&
          !!keys.senderDistrictId &&
          !!keys.addressSender;
        if (check) {
          dispatch(allAction.storeSellAction.setFlagHeader(true));
        } else {
          message.error('Please check required fields!');
          dispatch(allAction.storeSellAction.setFlagHeader(false));
        }
      } else {
        dispatch(allAction.storeSellAction.setFlagHeader(false));
      }
    } else if (value?.key === 'Enter') {
      const check =
        (!!companyId || !!keys.companyId) &&
        (!!hubId || !!keys.hubId) &&
        (!!agencyId || !!keys.agencyId) &&
        !!keys.date &&
        !!keys.paymentTypeCode &&
        !!keys.customerInput &&
        !!keys.customerName &&
        !!keys.customerNo &&
        !!keys.customerPostcode &&
        !!keys.customerProvinceId &&
        !!keys.customerSubdistrictId &&
        !!keys.customerDistrictId &&
        !!keys.addressCustomer &&
        !!keys.senderInput &&
        !!keys.senderName &&
        !!keys.senderNo &&
        !!keys.senderPostcode &&
        !!keys.senderProvinceId &&
        !!keys.senderSubdistrictId &&
        !!keys.senderDistrictId &&
        !!keys.addressSender;
      if (check) {
        dispatch(allAction.storeSellAction.setFlagHeader(true));
      } else {
        message.error('Please check required fields!');
        dispatch(allAction.storeSellAction.setFlagHeader(false));
      }
    }
  };
  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }

  const getAgencyList = (value) => {

    if (value) {
      dispatch(allAction.storeSellAction.getAgencyCod(value))
        .then()
        .catch((e) => message.error(e.message));
      dispatch(allAction.storeSellAction.getAgencyDiscount(value))
        .then()
        .catch((e) => message.error(e.message));
    }
  };
  return (
    <>

      {FilterUserLevel(['SAD', 'COM', 'HUB', 'AGN']) && (
        <Row>

          {FilterUserLevel(['SAD']) && (
            <Col flex="1 1 100px">
              <Form.Item
                labelCol={{ xs: 6 }}
                wrapperCol={{ xs: 20 }}
                style={{ marginBottom: 0 }}
                label={t('company-select')}
                name="companyId"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  size="small"
                  // allowClear
                  showSearch
                  optionFilterProp="children"
                  defaultValue=""
                  onChange={(e) => {
                    form.resetFields(['hubId', 'agencyId']);
                    // onCheckHeader(e);
                    onCheckbtnHeader(e);
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={(e) => {
                    dispatch(
                      allAction.userManagementAction.getHubList({
                        companyId: e,
                      })
                    );
                    dispatch(
                      allAction.userManagementAction.getAgencyList({
                        companyId: e,
                        isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB'])
                          ? 'ALL'
                          : null,
                      })
                    );
                    dispatch(
                      allAction.storeSellAction.getParcelTypeData(e)
                    );
                  }}
                >
                  <Option value="">{t('please-select')}</Option>
                  {companyData &&
                    companyData.map((val) => (
                      <Option value={val.companyId}>{val.companyName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {FilterUserLevel(['SAD', 'COM']) && (
            <Col flex="1 1 100px">
              <Form.Item
                labelCol={{ xs: userLevel === 'SAD' ? 6 : 4 }}
                wrapperCol={{ xs: 20 }}
                style={{ marginBottom: 8 }}
                label={t('hub')}
                name="hubId"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  size="small"
                  // allowClear
                  showSearch
                  defaultValue=""
                  onSearch={handleSearchHub}
                  onChange={(e) => {
                    form.resetFields(['agencyId']);
                    // onCheckHeader(e);
                    onCheckbtnHeader(e);
                  }}
                  onSelect={(e) =>
                    dispatch(
                      allAction.userManagementAction.getAgencyList({
                        hubId: e,
                        isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB'])
                          ? 'ALL'
                          : null,
                      })
                    )
                  }
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">{t('please-select')}</Option>

                  {masterHubList &&
                    masterHubList.map((val) => (
                      <Option value={val.hubId}>{val.hubName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
            <Col flex="1 1 100px">
              <Form.Item
                labelCol={{
                  xs: userLevel === 'SAD' ? 8 : userLevel === 'COM' ? 6 : 2,
                }}
                wrapperCol={{ xs: 20 }}
                style={{ marginBottom: 8 }}
                label={t('agency')}
                name="agencyId"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  size="small"
                  // allowClear
                  showSearch
                  defaultValue=""
                  onChange={(e) => {
                    // onCheckHeader(e);
                    onCheckbtnHeader(e);
                  }}
                  onSearch={handleSearchAgency}
                  onSelect={getAgencyList}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">{t('please-select')}</Option>

                  {masterAgencyList &&
                    masterAgencyList.map((val) => (
                      <Option value={val.agencyId}>
                        {val.agencyCode}
                        {/* {val.isCustomer
                          ? `${val?.customerData?.customerName || ''} ${val?.customerData?.customerLastName || ''
                          }`
                          : val?.agencyCode || ''} */}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>
        // </Card>
      )}
      {/* <br /> */}
      <Card bodyStyle={{ padding: 12 }} style={{ marginBottom: 8 }}>
        <Row>
          <Col {...itemLayout}>
            <Form.Item
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              label={t('billing-no')}
              name={
                isCustomer || form.getFieldValue('soNo') ? 'soNo' : 'receiptNo'
              }
            >
              <Input
                size="small"
                disabled
                className="field_id"
              // style={{ backgroundColor: '#FFE5B4' }}
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout} xs={12}>
            <Form.Item
              label={t('date')}
              name="date"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: true, message: '' }]}
            // defaultValue={moment("2015-01-01", "YYYY-MM-DD")}
            // value={moment()}
            >
              <DatePicker
                defaultValue={moment(moment(), 'YYYY-MM-DD')}
                size="small"
                onChange={onCheckHeader}
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout} xs={12}>
            <Form.Item
              label={t('payment-date')}
              name="paymentDate"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
            // rules={[{ required: true, message: '' }]}
            >
              <DatePicker size="small" onChange={onCheckHeader} />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              label={t('payment')}
              name="paymentTypeCode"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: true, message: '' }]}
            >
              <Select
                size="small"
                defaultValue={'CAS'}
                onChange={onCheckHeader}
              >
                <Option value="">
                  <Text
                    style={
                      !isMobile
                        ? { width: 80, ...styles.pos_field_label }
                        : { ...styles.pos_field_label }
                    }
                    ellipsis={
                      !isMobile ? { tooltip: t('please-select') } : false
                    }
                  >
                    {t('please-select')}
                  </Text>
                </Option>
                {masterPaymentType &&
                  masterPaymentType.map((item) => (
                    <Option
                      value={item.paymentTypeCode}
                      key={item.paymentTypeCode}
                    >
                      <Text
                        style={
                          !isMobile
                            ? { width: 80, ...styles.pos_field_label }
                            : { ...styles.pos_field_label }
                        }
                        ellipsis={
                          !isMobile ? { tooltip: item.paymentTypeName } : false
                        }
                      >
                        {item.paymentTypeName}
                      </Text>
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...itemLayout}>
            {/*  รหัสลูกค้า */}
            <Form.Item
              label={t('customer-id')}
              name="customerInput"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[
                { required: true, message: '' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const keys = form.getFieldsValue()
                    if (!value || !isNaN(value)) {
                      if (value?.length > 8 && value?.length < 14) {
                        if (value !== keys.recommenderInput) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Recommender');
                      }
                      return Promise.reject('Only Length 9 - 13 Digits!');
                    }
                    return Promise.reject('Incorrect Format!');
                  },
                }),
              ]}
            >
              <Input
                size="small"
                onChange={(e) => {
                  onSearchCustomer_WaitKeyIn(e.target.value);
                  // onCheckHeader(e);
                  // console.log('this', e.target.style.backgroundColor);
                  // e.target.style.backgroundColor = "red"
                }}
                onKeyDown={onCheckHeader}
                onKeyPress={(e) => {
                  isInputNumber(e);
                }}
                maxLength={13}
                disabled={!flagButtonHeader || isCustomer}
                style={{ ...styles.pos_field_enabled }}
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            {/*  customerName */}
            <Form.Item
              label={t('customer-name')}
              name="customerSumName"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: true, message: '' }]}
            // hasFeedback={true}
            // validateStatus={loadingFields == "customer" ? "validating" : ""}
            >
              <Input
                size="small"
                onKeyPress={(e) => {
                  isInputNumber(e);
                }}
                style={{ ...styles.pos_field_disabled }}
                onKeyDown={onCheckHeader}
                disabled
              />
            </Form.Item>
          </Col>

          <Col {...itemLayout}>
            {!isCustomer && (
              <Form.Item style={{ marginBottom: 8, marginLeft: 10 }}>
                <Button
                  size="small"
                  type="primary"
                  style={{
                    width: '80px',
                    alignItems: 'center',
                    margin: 'auto',
                    fontSize: '12px',
                  }}
                  disabled={
                    !flagButtonHeader ||
                    !form.getFieldValue('customerInput') ||
                    form.getFieldValue('customerName')
                  }
                  onClick={() => {
                    dispatch(allAction.storeSellAction.setActionModal('view'));
                    showModal('add-customer');
                  }}
                >
                  {t('add-customer')}
                </Button>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row>
          {/*  addressCustomer */}
          <Col xs={21}>
            <Form.Item
              labelCol={{ xs: 2 }}
              wrapperCol={{ xs: 24 }}
              // {...formItemLayout}
              label={t('address')}
              name="addressCustomer"
              style={{ ...styles.pos_field_label, marginBottom: 8 }}
              rules={[{ required: true, message: '' }]}
            // hasFeedback={true}
            // validateStatus={loadingFields == "customer" ? "validating" : ""}
            >
              <Input
                size="small"
                onKeyDown={onCheckHeader}
                style={{ ...styles.pos_field_disabled }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={3}>
            {!isCustomer && (
              <Form.Item style={{ marginBottom: 8, float: 'right' }}>
                <Button
                  size="small"
                  type="primary"
                  // disabled={customerId}
                  style={{
                    ...styles.pos_button,
                    width: '80px',
                    alignItems: 'center',
                    margin: 'auto',
                    fontSize: '12px',
                  }}
                  disabled={
                    !flagButtonHeader ||
                    !form.getFieldValue('customerInput') ||
                    !form.getFieldValue('customerName')
                  }
                  onClick={() => {
                    dispatch(allAction.storeSellAction.setActionModal('view'));
                    showModal('change-address-customer');
                  }}
                >
                  {t('change-address')}
                </Button>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row>
          <Col {...itemLayout}>
            <Form.Item
              label={t('bank')}
              name="customerBankName"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: itemTypeTrans, message: '' }]}
            >
              <Input
                size="small"
                onKeyDown={onCheckHeader}
                style={{ ...styles.pos_field_disabled }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              label={t('bank-no')}
              name="customerBankAccountNo"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: itemTypeTrans, message: '' }]}
            >
              <Input
                size="small"
                onKeyDown={onCheckHeader}
                onKeyPress={(e) => {
                  isInputNumber(e);
                  // onCheckHeader(e);
                }}
                style={{ ...styles.pos_field_disabled }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              label={t('bank-name')}
              name="customerBankAccountName"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: itemTypeTrans, message: '' }]}
            >
              <Input
                size="small"
                onKeyDown={onCheckHeader}
                onKeyPress={(e) => {
                  isInputNumber(e);
                  // onCheckHeader(e);
                }}
                style={{ ...styles.pos_field_disabled }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            {/* {!isCustomer && ( */}
            <Form.Item style={{ marginBottom: 8, marginLeft: 10 }}>
              <Button
                size="small"
                type="primary"
                style={{
                  width: '85px',
                  alignItems: 'center',
                  margin: 'auto',
                  fontSize: '12px',
                }}
                disabled={
                  !flagButtonHeader ||
                  !form.getFieldValue('customerInput') ||
                  !form.getFieldValue('customerName')
                }
                onClick={() => {
                  dispatch(allAction.storeSellAction.setActionModal('view'));
                  showModal('change-bank');
                }}
              >
                {t('change-bank')}
              </Button>
            </Form.Item>
            {/* )} */}
          </Col>
        </Row>
        <Row>
          {/*  sender code */}
          <Col {...itemLayout}>
            <Form.Item
              label={t('sender-code')}
              name="senderInput"
              style={{
                marginBottom: 8,
                ...styles.pos_field_label,
                height: '10px',
              }}
              rules={[
                { required: true, message: '' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const keys = form.getFieldsValue()
                    if (!value || !isNaN(value)) {
                      if (value?.length > 8 && value?.length < 14) {
                        if (value !== keys.recommenderInput) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Recommender');
                      }
                      return Promise.reject('Only Length 9 - 13 Digits!');
                    }
                    return Promise.reject('Incorrect Format!');
                  },
                }),
              ]}
            >
              <Input
                size="small"
                onKeyPress={isInputNumber}
                onChange={(e) => {
                  onSearchSender_WaitKeyIn(e.target.value);
                  // onCheckHeader(e);
                }}
                onKeyDown={onCheckHeader}
                maxLength={13}
                disabled={!flagButtonHeader || isCustomer}
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              label={t('sender-name')}
              name="senderSumName"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: true, message: '' }]}
            // hasFeedback={true}
            // validateStatus={loadingFields == "sender" ? "validating" : ""}
            >
              <Input
                size="small"
                onKeyDown={onCheckHeader}
                disabled
                style={{ ...styles.pos_field_disabled }}
              />
            </Form.Item>
          </Col>

          <Col {...itemLayout}>
            {!isCustomer && (
              <Form.Item style={{ marginBottom: 8, marginLeft: 10 }}>
                <Button
                  size="small"
                  type="primary"
                  style={{
                    width: '80px',
                    alignItems: 'center',
                    margin: 'auto',
                    fontSize: '12px',
                  }}
                  disabled={
                    !flagButtonHeader ||
                    !form.getFieldValue('senderInput') ||
                    form.getFieldValue('senderName')
                  }
                  onClick={() => {
                    dispatch(allAction.storeSellAction.setActionModal('view'));
                    showModal('add-sender');
                  }}
                >
                  {t('add-sender')}
                </Button>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={21}>
            <Form.Item
              labelCol={{ xs: 2 }}
              wrapperCol={{ xs: 24 }}
              // {...formItemLayout}
              label={t('address')}
              name="addressSender"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[{ required: true, message: '' }]}
            // hasFeedback={true}
            // validateStatus={loadingFields == "sender" ? "validating" : ""}
            >
              <Input
                size="small"
                disabled
                style={{ ...styles.pos_field_disabled }}
              />
            </Form.Item>
          </Col>
          <Col xs={3}>
            {!isCustomer && (
              <Form.Item style={{ marginBottom: 8, float: 'right' }}>
                <Button
                  size="small"
                  type="primary"
                  style={{
                    width: '80px',
                    alignItems: 'center',
                    margin: 'auto',
                    fontSize: '12px',
                  }}
                  disabled={
                    !flagButtonHeader ||
                    !form.getFieldValue('senderInput') ||
                    !form.getFieldValue('senderName')
                  }
                  onClick={() => {
                    dispatch(allAction.storeSellAction.setActionModal('view'));
                    showModal('change-address-sender');
                  }}
                >
                  {t('change-address')}
                </Button>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row>
          <Col {...itemLayout}>
            <Form.Item
              label={t('referral-code')}
              name="recommenderInput"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
              rules={[
                { required: false, message: '' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const keys = form.getFieldsValue()
                    if (value) {
                      if (value?.length > 8 && value?.length < 14) {
                        if (value !== keys.customerInput && value !== keys.senderInput) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Recommender');
                      }
                      return Promise.reject('Only Length 9 - 13 Digits!');
                    }
                    return Promise.resolve();
                  }
                }),
              ]}
            >
              <Input
                size="small"
                onChange={(e) => {
                  onSearchRecommender_WaitKeyIn(e.target.value);
                }}
                onKeyPress={(e) => {
                  isInputNumber(e);
                }}
                onKeyDown={onCheckHeader}
                maxLength={13}
                disabled={!flagButtonHeader}
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              label={t('referral-name')}
              name="recommenderSumName"
              style={{ marginBottom: 8, ...styles.pos_field_label }}
            >
              <Input
                size="small"
                disabled
                style={{ ...styles.pos_field_disabled }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <ModalComponent
        formBig={form}
        showModal={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        showCode={showCode}
        setShortSender={setShortSender}
      />
    </>
  );
};

export default HeaderStoreSell;
