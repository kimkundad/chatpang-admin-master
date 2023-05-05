/* eslint-disable no-const-assign */
/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
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
  InputNumber,
  Modal,
  Radio,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import StoreCustomeDetailPage from './StoreCustomeDetail';
import { fetch } from '../../../utils/fetch';

import FormAddress from './component/FormAddress';

const { Text } = Typography;

const { Option } = Select;

const StoreCustomeInput = (props) => {
  const [flagRadio, setFlagRadio] = useState(false);
  const [radioCustomer, setRadioCustomer] = useState(true);

  // const { actionPage } = useSelector(
  //   (state) => state.settingMorePriceReducer,
  // );

  const { customerType, StoreCustomeDetail, actionPage } = useSelector(
    (state) => state.storeCustomeReducer,
  );
  const { agencyBankData } = useSelector((state) => state.settingBankReducer);
  const { companyData } = useSelector((state) => state.companyReducer);
  const { userLevel, companyId, permission } = useSelector(
    (state) => state.authenReducer,
  );

  const { masterHubList } = useSelector((state) => state.userManagementReducer);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile, isLoading } = useSelector((state) => state.mainReducer);
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoadIng] = useState(false);
  const [checked, setChecked] = useState({ checkedD: true, checked0: false });
  const [comId, setComID] = useState(0);

  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listSubDistrict, setListSubDistrict] = useState([]);

  const [province, setProviceID] = useState(0);
  const [district, setDistrictID] = useState(0);
  const [subDistrict, setSubDistrictID] = useState(0);

  const [isSelectProvince, setIsSelectProvince] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isSelectSubDistrict, setIsSelectSubDistrict] = useState(false);
  const [isCheckPostCode, setIsCheckPostCode] = useState(false);
  const [isFirst, setIsFirst] = useState(false);

  const [addressIDC, setAddressIDC] = useState([]);
  const [addressCUR, setAddressCUR] = useState([]);
  const [bank, setBank] = useState([]);
  const {
    match: {
      params: { storeCustomerId },
    },
    pageCode,
  } = props;

  const formItemLayout = {
    labelCol: {
      // xs: { span: 24 },
      xs: { span: 4 },
      sm: { span: 8 },
      lg: { span: 8 },
    },
  };

  const itemLayout = {
    xs: 24,
    sm: 20,
    lg: 8,
  };

  const formItemStyle = { marginBottom: 12 };
  const cardStyle = { padding: 12 };
  const cardStyleBank = { padding: '12px 12px 12px 0px' };
  const cardBodyStyle = { padding: 0 };
  // const itemLayout = { xs: 24, sm: { span: 20 } };
  const onChange = (e) => {
    if (e.target.value === '') {
      setListDistrict([]);
      setListSubDistrict([]);
      form.setFieldsValue({
        provinceId: '',
        districtId: '',
        subdistrictId: '',
      });
      setIsCheckPostCode(false);
      return false;
    }
    if (e.target.value.length === 5) {
      // setLoadIng(true);
      fetch({
        method: 'get',
        url: `/master/postcode/?postcode=${e.target.value}`,
      })
        .then((res) => {
          // setLoadIng(false);
          if (res.data.success) {
            // if(!res?.data?.data?.province?.provinceId) return f

            setIsCheckPostCode(true);
            setProviceID(res.data.data.province.provinceId);
            console.log('res.data.data.district', res.data.data.district);

            if (res.data.data.district.length === 1) {
              setDistrictID(res.data.data.district[0].districtId);
            }

            //* ****/
            setListSubDistrict(res.data.data.subdistrict);

            if (comId === 0) {
              callProvince(0, 'new');
            } else {
              callProvince(comId, 'filter');
            }
            // callDistrict(res.data.data.province.provinceId);
            setListDistrict(res.data.data.district);
            // if (res.data.data.district.length === 1) {
            // callSubDistrict(res.data.data.district[0].districtId);
            // }
            // setListDistrict([])
            // setListSubDistrict([])

            form.setFieldsValue({
              provinceId: res.data.data.province.provinceId,
              districtId: res.data.data.district.length === 1
                ? res.data.data.district[0].districtId : '',
              subdistrictId: res.data.data.subdistrict.length === 1
                ? res.data.data.subdistrict[0].subdistrictId : '',
            });
            // form.setFieldsValue({
            //   provinceId: res.data.data.province.provinceId,
            //   districtId: res.data.data.district[0].districtId,
            //   subdistrictId: '',
            // });
          } else {
            setListDistrict([]);
            setListSubDistrict([]);
            form.setFieldsValue({
              provinceId: '',
              districtId: '',
              subdistrictId: '',
            });
            setIsCheckPostCode(false);
          }
        })
        .catch((error) => {
          setListDistrict([]);
          setListSubDistrict([]);
          form.setFieldsValue({
            provinceId: '',
            districtId: '',
            subdistrictId: '',
          });
          setIsCheckPostCode(false);
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
          setListProvince(list);
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
          setListSubDistrict(list);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  const handleSearchHub = (value) => {
    const objSearch = {
      search: value,
    };
    if (form.getFieldValue('companyId')) {
      objSearch.companyId = companyId;
    }
    dispatch(allAction.userManagementAction.getHubList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };
  const toFilterDis = (e) => {
    customerType.filter((val, i) => {
      if (val.customerTypeId === e) {
        console.log('cucu', customerType);
        form.setFieldsValue({
          discountRate: customerType[i].discount,
        });
      }
    });
  };

  const formatData = (value) => {
    const listAdd = [];
    const listBank = [];
    const newData = {};
    console.log(checked);
    if (storeCustomerId === 'create') {
      if (value.addressCUR.length > 0) {
        value.addressCUR.map((val, i) => {
          if (val.no) {
            val.addressType = 'CUR';
            val.defaultAddress = checked[`checked${i}`];
            listAdd.push(val);
          }
        });
      }
      if (value.bank.length > 0) {
        value?.bank?.map((val, i) => {
          if (val?.bankAccountName && val?.bankAccountNo && val?.bankId) {
            listBank.push(val);
          }
        });
      }

      // check is customer
      if (value.customerClassId === 1) {
        listAdd.push({
          addressType: 'IDC',
          alley: value.addressLane,
          districtId: value.districtId,
          moo: value.addressVillage,
          no: value.addressNumber,
          other: value.other,
          postcode: value.postcode,
          provinceId: value.provinceId,
          road: value.road,
          subdistrictId: value.subdistrictId,
          defaultAddress: checked.checkedD,
        });
      }
      newData.address = listAdd;
      newData.bank = listBank;

      newData.customer = {
        // customerId,
        companyId: value.companyId || companyId,
        customerTypeId: value.customerTypeId,
        customerClassId: value.customerClassId,
        customerCategoryId: value.customerCategoryId,
        customerName: value.customerName,
        taxpayerNumber: value.taxpayerNumber,
        discountRate: value.discountRate,
        phoneNumber: value.phoneNumber,

        // userId: value.userId,
      };
      if (value.customerClassId === 1) {
        newData.customer.customerLastName = value?.customerLastName;
      }
      if (value.customerCategoryId === 3) {
        newData.customer.username = value?.userName;
        newData.customer.password = value?.password;
        newData.customer.hubId = value?.hubId;
        newData.customer.agencyCode = value?.agencyCode;
        newData.customer.agencyCOD = value?.agencyCOD;
      }
      console.log('create', newData);
      Modal.confirm({
        title: 'Do you want to create?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(allAction.storeCustomeAction.createStoreCustome(newData))
            .then(() => {
              message.success('Create Success!');
              history.push('../store-customer');
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      value.addressCUR.map((val, i) => {
        if (val.no) {
          val.addressType = 'CUR';
          val.defaultAddress = checked[`checked${i}`];
          if (addressCUR[i]?.customerAddressId) {
            val.customerAddressId = addressCUR[i].customerAddressId;
          }
          listAdd.push(val);
        }
      });
      console.log('IDCC', value);
      if (addressIDC.length > 0 || value?.addressNumber) {
        listAdd.push({
          customerAddressId: addressIDC[0]?.customerAddressId || null,
          addressType: 'IDC',
          alley: value.addressLane,
          districtId: value.districtId,
          moo: value.addressVillage,
          no: value.addressNumber,
          other: value.other,
          postcode: value.postcode,
          provinceId: value.provinceId,
          road: value.road,
          subdistrictId: value.subdistrictId,
          defaultAddress: checked.checkedD,
        });
      }
      listAdd.filter((val) => {
        delete val.provinceData;
        delete val.subdistrictData;
        delete val.districtData;
      });
      newData.address = listAdd;
      const newBank = value.bank.map((val, i) => {
        const obj = {};
        if (bank[i]?.customerBankId) {
          obj.customerBankId = bank[i]?.customerBankId;
        }
        obj.bankAccountName = value.bank[i].bankAccountName;
        obj.bankAccountNo = value.bank[i].bankAccountNo;
        obj.bankId = value?.bank[i]?.bankId;
        return obj;
      });
      newData.bank = newBank;
      newData.customer = {
        // customerId,
        customerTypeId: value.customerTypeId,
        customerName: value.customerName,
        customerLastName: value.customerLastName,
        taxpayerNumber: value.taxpayerNumber,
        discountRate: value.discountRate,
        phoneNumber: value.phoneNumber,
        agencyCOD: value.agencyCOD,
        password: value.firstPassword,

        // userId: value.userId,
      };
      Modal.confirm({
        title: 'Do you want to update?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.storeCustomeAction.updateStoreCustomeDetail(
              storeCustomerId,
              newData,
            ),
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.storeCustomeAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  const toRemoveBank = (remove, id) => {
    // console.log(bank[id])
    if (bank[id]?.customerBankId) {
      Modal.confirm({
        title: 'Do you want to delete?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch(
            allAction.storeCustomeAction.deleteStoreCustomeBank(
              storeCustomerId,
              bank[id]?.customerBankId,
            ),
          )
            .then(() => {
              message.success('Delete Success!');
              remove(id);
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
          remove(id);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  useEffect(() => {
    dispatch(allAction.companyAction.getCompanyData())
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.settingBankAction.getAgencyBankData({ companyId }))
      .then()
      .catch((e) => message.error(e.message));
    dispatch(
      allAction.userManagementAction.getHubList({
        companyId,
      }),
    )
      .then()
      .catch((e) => message.error(e.message));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    form.resetFields();

    if (storeCustomerId === 'create') {
      setComID(companyId);
      callProvince();
      form.setFieldsValue({
        customerClassId: 1,
        customerCategoryId: 1,
      });
      if (companyId) {
        dispatch(
          allAction.storeCustomeAction.getCustomerType({
            companyId,
          }),
        );
      }
      setFlagRadio(false);
    } else if (actionPage === 'edit') {
      dispatch(
        allAction.storeCustomeAction.getStoreCustomerDetail(storeCustomerId),
      )
        .then(async (data) => {
          console.log('data', data);
          if (data) {
            const idc = data.customerAddressData.filter(
              (val) => val.addressType === 'IDC',
            );
            setAddressIDC(idc);
            data.customerBankData.map((val) => {
              val.bankId = val?.bankData?.bankId;
            });
            setBank(data.customerBankData);

            const cur = data.customerAddressData.filter(
              (val) => val.addressType === 'CUR',
            );
            dispatch(
              allAction.storeCustomeAction.getCustomerType({
                companyId: data.companyData.companyId,
              }),
            );
            dispatch(
              allAction.settingBankAction.getAgencyBankData({
                companyId: data.companyData.companyId,
              }),
            )
              .then()
              .catch((e) => message.error(e.message));

            dispatch(
              allAction.userManagementAction.getHubList({
                companyId: data.companyData.companyId,
              }),
            );
            cur.map((val, i) => {
              callProvince();
              callDistrict(val.provinceData.provinceId);
              callSubDistrict(val.districtData.districtId);
              val.districtId = val.districtData.districtId;
              val.provinceId = val.provinceData.provinceId;
              val.subdistrictId = val.subdistrictData.subdistrictId;
              setChecked({
                ...checked,
                [`checked${i}`]: val?.defaultAddress || false,
                checkedD: idc[0]?.defaultAddress || false,
              });
            });
            console.log('idc', idc[0]);
            setAddressCUR(cur);
            const formData = {
              bank: data?.customerBankData,
              addressCUR: cur,
              companyId: data?.companyData?.companyId,
              customerClassId: data?.customerClassId,
              customerCategoryId: data?.customerCategoryId,
              customerName: data?.customerName,
              customerLastName: data?.customerLastName || '',
              taxpayerNumber: data?.taxpayerNumber,
              phoneNumber: data?.phoneNumber,
              discountRate: data?.discountRate,
              agencyCOD:
                data?.userData?.userData?.agencyData?.agencyCOD || null,
              customerTypeId: data?.customerTypeData?.customerTypeId || null,

              // userData: idc[0].userData.provinceId,
            };
            if (idc.length > 0) {
              (formData.defaultAddress = idc[0]?.defaultAddress || false),
                (formData.addressNumber = idc[0].no || ''),
                (formData.addressVillage = idc[0].moo || ''),
                (formData.addressLane = idc[0].alley || ''),
                (formData.road = idc[0].road || ''),
                (formData.other = idc[0].other || ''),
                (formData.postcode = idc[0].postcode || ''),
                (formData.subdistrictId = idc[0].subdistrictData.subdistrictId || ''),
                (formData.districtId = idc[0].districtData.districtId || ''),
                (formData.provinceId = idc[0].provinceData.provinceId || ''),
                setChecked({
                  ...checked,
                  checkedD: idc[0]?.defaultAddress || false,
                });
              callDistrict(idc[0].provinceData.provinceId);
              callSubDistrict(idc[0].districtData.districtId);
            }

            if (data?.customerCategoryId === 3) {
              formData.userName = data?.userData?.email || '';
              formData.hubId = data?.userData?.userData?.hubData?.hubId || '';
              formData.agencyCode = data?.userData?.userData?.agencyData?.agencyCode || '';
              setFlagRadio(true);
            }
            form.setFieldsValue(formData);
            setComID(data.companyData.companyId);
            callProvince();

            console.log('checked', checked);
            if (data?.customerClassId === 2) {
              setRadioCustomer(false);
            } else {
              setRadioCustomer(true);
            }
          }
          console.log('aaa', radioCustomer);
        })
        .catch((e) => message.error(e));
    }
  }, [actionPage]);

  const handleFilterDistrict = (value) => {
    if (value === '') {
      callDistrict(province);
      form.setFieldsValue({
        postcode: '',
        districtId: '',
      });
      // return null;
    }
    callSubDistrict(value);
    setIsSelectDistrict(true);
    if (isCheckPostCode) {
      form.setFieldsValue({
        subdistrictId: '',
      });
    } else {
      form.setFieldsValue({
        subdistrictId: '',
        // postcode: '',
      });
    }
  };

  const handleFilterSubDistrict = (value) => {
    if (value === '') return null;
    console.log(value);
    console.log(listSubDistrict);
    const found = listSubDistrict.find((item) => {
      console.log(value, item);
      if (item?.subdistrictId === value) return true;
    });

    if (found) {
      form.setFieldsValue({
        postcode: found.postcode,
        districtId: found.districtId,
      });
    }

    console.log(found);
  };

  const handleFilterProvice = (value) => {
    callDistrict(value);
    setIsSelectProvince(true);
    setIsFirst(true);
    setListDistrict([]);
    setListSubDistrict([]);
    form.setFieldsValue({
      districtId: '',
      subdistrictId: '',
      postcode: '',
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
          setListDistrict(list);
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
  const handleButtonStateChange = (toggleKey) => {
    const stateCopy = { ...checked };
    // console.log(stateCopy)
    const nextValue = !stateCopy[toggleKey];
    Object.keys(stateCopy).forEach((key) => (stateCopy[key] = false));
    stateCopy[toggleKey] = nextValue;
    setChecked(stateCopy);
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  const FilterPermission = (value) => {
    const resPer = permission.filter((page) => page.pageCode === pageCode)[0][
      value
    ];
    return resPer;
  };
  const toFilterSaveBtn = () => {
    if (storeCustomerId === 'create') {
      return FilterPermission('isCreate');
    }
    return FilterPermission('isUpdate');
  };

  if (storeCustomerId !== 'create' && actionPage === 'view') {
    return <StoreCustomeDetailPage {...props} />;
  }
  return (
    <Spin spinning={isLoading} tip="Loading...">
      <Card
        title={(
          <Typography.Title level={3}>
            <span className="text-primary">
              {storeCustomerId === 'create'
                ? t('store-customer-create')
                : t('store-customer-edit')}
            </span>
          </Typography.Title>
        )}
      >
        <Form
          layout="horizontal"
          form={form}
          name="userInput"
          {...formItemLayout}
          onFinish={formatData}
        >
          {FilterUserLevel(['SAD']) && (
            <Col sm={6}>
              <Form.Item
                style={formItemStyle}
                label={t('company')}
                name="companyId"
                rules={[{ required: true, message: 'Please select Company!' }]}
                labelCol={24}
              >
                <Select
                  disabled={storeCustomerId !== 'create'}
                  defaultValue=""
                  onChange={(e) => {
                    form.resetFields([
                      'hubId',
                      'customerTypeId',
                      'discountRate',
                    ]);
                    dispatch(
                      allAction.storeCustomeAction.getCustomerType({
                        companyId: e,
                      }),
                    );

                    dispatch(
                      allAction.userManagementAction.getHubList({
                        companyId: e,
                      }),
                    );
                    dispatch(
                      allAction.settingBankAction.getAgencyBankData({
                        companyId: e,
                      }),
                    );
                  }}
                >
                  <Option value="">{t('select-company')}</Option>
                  {companyData
                    && companyData.map((item) => (
                      <Option key={item.companyId} value={item.companyId}>
                        {item.companyName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Card style={cardStyle} bodyStyle={cardBodyStyle}>
            <Row>
              <Col xs={24} lg={16}>
                <Row>
                  <Col xs={24} lg={12} style={{ textAlign: 'center' }}>
                    <Form.Item
                      style={formItemStyle}
                      name="customerClassId"
                      // label="Radio.Button"
                      rules={[
                        { required: true, message: 'Please pick an item!' },
                      ]}
                    >
                      <Radio.Group
                        disabled={storeCustomerId !== 'create'}
                        onChange={(e) => {
                          e.target.value === 1
                            ? setRadioCustomer(true)
                            : setRadioCustomer(false);
                          e.target.value === 1
                            ? setChecked({ checkedD: true, checked0: false })
                            : setChecked({ checkedD: false, checked0: true });
                        }}
                      >
                        <Radio value={1}>{t('person')}</Radio>
                        <Radio value={2}>{t('company')}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12} style={{ textAlign: 'center' }}>
                    <Form.Item
                      style={formItemStyle}
                      name="customerCategoryId"
                      // label="Radio.Button"
                      rules={[
                        { required: true, message: 'Please pick an item!' },
                      ]}
                    >
                      <Radio.Group
                        disabled={storeCustomerId !== 'create'}
                        onChange={(e) => (e.target.value === 3
                          ? setFlagRadio(true)
                          : setFlagRadio(false))}
                      >
                        <Radio value={1}>{t('customer')}</Radio>
                        {FilterUserLevel(['SAD', 'COM']) && (
                          <>
                            <Radio value={2}>{t('recommender')}</Radio>
                            <Radio value={3}>{t('big-sender')}</Radio>
                          </>
                        )}
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      style={formItemStyle}
                      label={
                        radioCustomer
                          ? t('agency-fistname')
                          : t('store-customer-name-company')
                      }
                      name="customerName"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name or Customer!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={
                          radioCustomer
                            ? t('agency-fistname')
                            : t('store-customer-name-company')
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    {radioCustomer ? (
                      <Form.Item
                        style={formItemStyle}
                        label={t('manage-driver-last-name')}
                        name="customerLastName"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Last Name!',
                          },
                        ]}
                        validateTrigger="onBlur"
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('manage-driver-last-name')}
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item style={formItemStyle} />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      style={formItemStyle}
                      label={
                        radioCustomer
                          ? t('store-customer-id-card')
                          : t('store-customer-tax-number')
                      }
                      name="taxpayerNumber"
                      rules={[
                        {
                          required: false,
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (value) {
                              if (!isNaN(value)) {
                                if (value.length === 13) {
                                  return Promise.resolve();
                                }
                                return Promise.reject('Only Length 13 Digits!');
                              }
                              return Promise.reject('Incorrect Format!');
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={
                          radioCustomer
                            ? t('store-customer-id-card')
                            : t('store-customer-tax-number')
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('manage-driver-phone-number')}
                      name="phoneNumber"
                      rules={[
                        { required: true, message: 'Please input Phone No!' },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || !isNaN(value)) {
                              if (value.length === 9 || value.length === 10) {
                                if (/[^\d]/g.test(value)) {
                                  return Promise.reject(
                                    new Error(
                                      'Incorrect characters.'
                                    )
                                  );
                                }
      
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                'Phone Number Length 9-10 Digits!',
                              );
                            }
                            
                            return Promise.reject('Phone Number Incorrect Format!');
                          },
                        }),
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('manage-driver-phone-number')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  {flagRadio && (
                    <Col xs={12} lg={6}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('cod-rate')}
                        name="agencyCOD"
                        labelCol={{ xs: 16 }}
                        wrapperCol={{ xs: 24 }}
                        rules={[
                          {
                            required: true,
                            message: 'Please input COD Discount Rate!',
                          },
                        ]}
                        validateTrigger="onBlur"
                      >
                        <InputNumber
                          // size="small"
                          placeholder={t('discount-rate')}
                          precision={3}
                          step="0.001"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  {!FilterUserLevel(['AGN']) && (
                    <Col xs={12} lg={flagRadio ? 6 : 12}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('discount-rate')}
                        name="discountRate"
                        labelCol={{ xs: flagRadio ? 16 : 8 }}
                        wrapperCol={{ xs: 24 }}
                        // rules={[
                        //   { required: true, message: 'Please input Discount Rate!' }]}
                        validateTrigger="onBlur"
                      >
                        <InputNumber
                          // size="small"
                          placeholder={t('discount-rate')}
                          precision={3}
                          step="0.001"
                          disabled={FilterUserLevel(['HUB'])}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  {!FilterUserLevel(['AGN']) && (
                    <Col xs={12} lg={12}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('customer-type')}
                        name="customerTypeId"
                        // rules={[
                        //   { required: true, message: 'Please input Customer Type!' }]}
                        validateTrigger="onBlur"
                      >
                        <Select
                          defaultValue=""
                          disabled={
                            !(companyId || form.getFieldValue('companyId'))
                          }
                          onChange={(e) => {
                            form.resetFields(['discountRate']);
                            toFilterDis(e);
                          }}
                        >
                          <Option value={null}>เลือก</Option>
                          {customerType.map((val) => (
                            <Option value={val.customerTypeId}>
                              {val.description}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col xs={24} lg={8}>
                {flagRadio && (
                  <Row>
                    <Col xs={24}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('hub')}
                        name="hubId"
                        rules={[
                          { required: true, message: 'Please input Hub!' },
                        ]}
                      >
                        <Select
                          allowClear
                          showSearch
                          onSearch={handleSearchHub}
                          // showArrow={false}
                          filterOption={false}
                          disabled={storeCustomerId !== 'create' && !FilterUserLevel(['COM', 'SAD'])}
                        >
                          {masterHubList.map((val) => (
                            <Option value={val.hubId}>{val.hubName}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('customer-code')}
                        name="agencyCode"
                        rules={[
                        { required: true, message: 'Please input CustomerCode!' },
                      ]}
                      >
                        <Input
                          disabled={storeCustomerId !== 'create'}
                          autocomplete="new-password"
                          placeholder={t('customer-code')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        style={formItemStyle}
                        label={t('email')}
                        name="userName"
                        rules={[
                          {
                            required: true,
                            message: 'Please input E-mail!',
                            type: 'email'
                          },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              if (/[^A-Za-z\d|^@+_.\-]/g.test(value)
                              ) {
                                return Promise.reject(
                                  new Error(
                                    'Incorrect characters.'
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <Input
                          disabled={storeCustomerId !== 'create' && !FilterUserLevel(['COM', 'SAD'])}
                          autocomplete="new-password"
                          placeholder={t('email')}
                        />
                      </Form.Item>
                    </Col>
                    {storeCustomerId === 'create' ? (
                      <>
                        <Col xs={24}>
                          <Form.Item
                            style={formItemStyle}
                            label={t('password')}
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: 'Please input first login password!',
                              },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (/[^A-Za-z\d|^~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.?/]/g.test(value)
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        'Incorrect characters.'
                                      )
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              autocomplete="new-password"
                              placeholder={t('first-password')}
                              disabled={storeCustomerId !== 'create'}
                              onChange={() => {
                                form.validateFields(['confirmPassword']);
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item
                            style={formItemStyle}
                            label={t('confirm-password')}
                            name="confirmPassword"
                            rules={[
                              {
                                required: true,
                                message: 'Please input Confirm Login Password!',
                              },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (
                                    !value
                                    || getFieldValue('password') === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    'The two passwords that you entered do not match!',
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              autocomplete="new-password"
                              placeholder={t('confirm-password')}
                              disabled={storeCustomerId !== 'create'}
                              onChange={() => {
                                form.validateFields(['password']);
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col xs={24}>
                          <Form.Item
                            style={formItemStyle}
                            label={t('new-password')}
                            name="firstPassword"
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (/[^A-Za-z\d|^~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.?/]/g.test(value)
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        'Incorrect characters.'
                                      )
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            validateTrigger="onBlur"
                          >
                            <Input.Password
                              autocomplete="new-password"
                              placeholder={t('first-password')}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item
                            style={formItemStyle}
                            label={t('confirm-password')}
                            name="confirmPassword"
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (value) {
                                    if (getFieldValue('firstPassword') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      'The two passwords that you entered do not match!',
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            validateTrigger="onBlur"
                          >
                            <Input.Password
                              autocomplete="new-password"
                              placeholder={t('confirm-password')}
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </Row>
                )}
              </Col>
            </Row>
          </Card>
          {radioCustomer && (
            <>
              <br />
              <span>{t('address-according-to-id-card')}</span>
              <Card style={cardStyle} bodyStyle={cardBodyStyle}>
                <Row>
                  <Col xs={{ span: 24 }}>
                    <Form.Item style={formItemStyle} name="defaultAddress">
                      <Radio
                        checked={checked.checkedD}
                        onClick={() => handleButtonStateChange('checkedD')}
                      >
                        :
                        {' '}
                        {t('set-default')}
                      </Radio>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} lg={3}>
                    <Form.Item
                      style={formItemStyle}
                      label={t('address-number')}
                      name="addressNumber"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Address Number!',
                        },
                      ]}
                      validateTrigger="onBlur"
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
                      name="addressVillage"
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
                      name="addressLane"
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
                      name="road"
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
                      name="other"
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
                      name="postcode"
                      rules={[
                        { required: true, message: 'Please input Postal!' },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        autocomplete="new-password"
                        placeholder={t('address-postal')}
                        onChange={onChange}
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
                      name="subdistrictId"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Sub District!',
                        },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Select
                        defaultValue={t('all-select')}
                        onChange={handleFilterSubDistrict}
                        showSearch
                        filterOption={(input, option) => option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="">{t('all-select')}</Option>
                        {listSubDistrict.map((item) => {
                          if (form.getFieldValue('postcode')) {
                            if (item.postcode !== form.getFieldValue('postcode')) { return null; }
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
                      name="districtId"
                      rules={[
                        { required: true, message: 'Please input District!' },
                      ]}
                      validateTrigger="onBlur"

                    >
                      <Select
                        defaultValue={t('all-select')}
                        onChange={handleFilterDistrict}
                        showSearch
                        filterOption={(input, option) => option.children?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="">{t('all-select')}</Option>
                        {listDistrict.map((item) => (
                          <Option value={item.districtId} key={item.districtId}>
                            <Text
                              style={!isMobile ? { width: 90 } : undefined}
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
                      style={formItemStyle}
                      label={t('address-provice')}
                      name="provinceId"
                      rules={[
                        { required: true, message: 'Please input Provice!' },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Select
                        defaultValue={t('all-select')}
                        onChange={handleFilterProvice}
                        showSearch
                        filterOption={(input, option) => option.children?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="">{t('all-select')}</Option>
                        {listProvince.map((item) => (
                          <Option value={item.provinceId} key={item.provinceId}>
                            <Text
                              style={!isMobile ? { width: 90 } : undefined}
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
                </Row>
              </Card>
            </>
          )}
          {' '}
          <br />
          <FormAddress
            {...props}
            addressCUR={addressCUR}
            checked={checked}
            handleButtonStateChange={handleButtonStateChange}
            comId={comId}
            form={form}
          />
          <br />
          <Form.List
            name="bank"
            initialValue={storeCustomerId === 'create' ? [{}] : bank}
          >
            {(fields, { add, remove }) => (
              <>
                <Row align="middle">
                  <Col xs={12}>
                    <span>{t('menu-setting-bank')}</span>
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
                      {t('add-bank')}
                    </Button>
                  </Col>
                </Row>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    style={!isMobile ? cardStyleBank : cardStyle}
                    bodyStyle={cardBodyStyle}
                  >
                    <Row>
                      <Col xs={24} sm={12} lg={fields.length > 1 ? 5 : 8}>
                        <Form.Item
                          style={
                            !isMobile
                              ? { marginBottom: 0 }
                              : { marginBottom: 10 }
                          }
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          label={t('menu-setting-bank')}
                          name={[index, 'bankId']}
                        >
                          <Select defaultValue="">
                            <Option value="">เลือกธนาคาร</Option>
                            )
                            {agencyBankData
                              && agencyBankData.map((val) => (
                                <Option value={val.key}>
                                  <Text
                                    style={
                                      !isMobile ? { width: 90 } : undefined
                                    }
                                    ellipsis={
                                      !isMobile
                                        ? { tooltip: val.bankName }
                                        : false
                                    }
                                  >
                                    {val.bankName}
                                  </Text>
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                          style={
                            !isMobile
                              ? { marginBottom: 0 }
                              : { marginBottom: 10 }
                          }
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          label={t('bank-no')}
                          name={[index, 'bankAccountNo']}
                        >
                          <Input
                            autocomplete="new-password"
                            placeholder={t('bank-no')}
                            onKeyPress={(event) => {
                              isInputNumber(event);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          label={t('bank-name')}
                          name={[index, 'bankAccountName']}
                        >
                          <Input
                            autocomplete="new-password"
                            placeholder={t('bank-name')}
                          />
                        </Form.Item>
                      </Col>
                      {fields.length > 1 ? (
                        <Col
                          xs={24}
                          sm={12}
                          // sm={8}
                          lg={3}
                          style={{
                            marginTop:
                              fields.length > 1 && isMobile ? '10px' : '0px',
                            alignItems: 'center',
                            margin: 'auto',
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
                            onClick={() => {
                              toRemoveBank(remove, index);
                            }}
                          >
                            {t('delete')}
                          </Button>
                        </Col>
                      ) : null}
                    </Row>
                  </Card>
                ))}
              </>
            )}
          </Form.List>
          <Form.Item style={{ marginTop: '50px' }}>
            {isMobile ? (
              <>
                <Row gutter={[16, 16]}>
                  {toFilterSaveBtn() && (
                    <Col xs={24}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        block
                      >
                        {t('save')}
                      </Button>
                    </Col>
                  )}
                  <Col xs={24}>
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      onClick={() => (storeCustomerId === 'create'
                        ? history.push('../store-customer')
                        : dispatch(
                          allAction.storeCustomeAction.setActionPage('view'),
                        ))}
                      block
                    >
                      {t('cancel')}
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Button
                  type="default"
                  icon={<RollbackOutlined />}
                  onClick={() => (storeCustomerId === 'create'
                    ? history.push('../store-customer')
                    : dispatch(
                      allAction.storeCustomeAction.setActionPage('view'),
                    ))}
                  style={{ width: '100px', float: 'right', marginLeft: 15 }}
                >
                  {t('cancel')}
                </Button>
                {toFilterSaveBtn() && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    style={{ width: '100px', float: 'right' }}
                  >
                    {t('save')}
                  </Button>
                )}
              </>
            )}
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default StoreCustomeInput;
