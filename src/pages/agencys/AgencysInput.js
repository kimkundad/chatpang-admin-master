import {
  Form,
  Input,
  Button,
  message,
  Layout,
  Col,
  Row,
  Spin,
  Select,
  Typography,
  Tag,
  Card,
  Checkbox,
  Radio,
  Tabs,
  Modal,
  Image,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {
  RollbackOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { fetch } from '../../utils/fetch';
import allAction from '../../app/actions/index';
import AgencysDetail from './AgencysDetail';

import Map from './component/Map';
import gMapicon from '../../assets/gmap_icon.png';

const { TabPane } = Tabs;

const { Option } = Select;

const AgencysInput = (props) => {
  const { isMobile } = useSelector((state) => state.mainReducer);
  const { actionPage, companyData } = useSelector(
    (state) => state.agencyReducer,
  );
  const { roleLevel } = useSelector((state) => state.authenReducer);

  const dispatch = useDispatch();

  const [value, setValue] = useState(1);

  const history = useHistory();
  const { t } = useTranslation();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [codeIdentity, setCode] = useState('');

  const [lastnameValue, setLastNameValue] = useState('');
  const [contactnameValue, setContactNameValue] = useState('');

  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listSubDistrict, setListSubDistrict] = useState([]);
  const [listAgencyType, setListAgencyType] = useState([]);
  const [listAgencyLevel, setListAgencyLevel] = useState([]);
  const [listAgencyBank, setListAgencyBank] = useState([]);
  const [listHub, setListHub] = useState([]);
  const [loading, setLoadIng] = useState(false);
  const [list_cod, setListCOD] = useState([]);
  const [list_discount, setListDiscount] = useState([]);
  const [list_bank, setListBank] = useState([]);
  const [list_bank_show, setListBankShow] = useState([]);
  const [list_cod_default, setListCODDefault] = useState([]);
  const [list_discount_default, setListDiscountDefault] = useState([]);
  const [isDiscount, setIsDiscount] = useState(true);
  const [isCOD, setIsCOD] = useState(true);
  const [text_discount, setTextDiscount] = useState(0);
  const [text_cod, setTextCOD] = useState(0);

  const [isSelectProvince, setIsSelectProvince] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isSelectSubDistrict, setIsSelectSubDistrict] = useState(false);
  const [isSelectCompany, setIsSelectCompany] = useState(false);
  const [isSelectAgencyLevel, setIsSelectAgencyLevel] = useState(false);
  const [isSelectAgencyType, setIsSelectAgencyType] = useState(false);
  const [isSelectHub, setIsSelectHub] = useState(false);
  const [province, setProviceID] = useState(0);
  const [district, setDistrictID] = useState(0);
  const [subDistrict, setSubDistrictID] = useState(0);
  const [agencyTypeID, setAgencyTypeID] = useState(0);
  const [agencyLevelID, setAgencyLevelID] = useState(0);
  const [hubID, setHubID] = useState(0);
  // const [adminId, setAdminID] = useState(0);
  const [comId, setComID] = useState(0);
  const [isCheckPostCode, setIsCheckPostCode] = useState(false);

  // const [adminName, setAdminName] = useState('');
  // const [adminPhone, setAdminPhone] = useState('');
  // const [adminEmail, setAdminEmail] = useState('');

  const [isCodDefault, setIsCODDefault] = useState(true);
  const [isDiscountDefault, setIsDiscountDefault] = useState(true);

  const [LatLng, setLatLng] = useState({ lat: 13.0, lng: 100.0 });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [tabSelect, setTabSelect] = useState('1');

  const [form] = Form.useForm();
  const {
    match: {
      params: { agencyId },
    },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 8 },
      lg: { span: 8 },
    },
  };

  const itemLayout = { xs: 24, sm: { span: 20 } };
  const formItemStyle = { marginBottom: 12 };
  const cardStyle = { padding: 12 };
  const cardStyleBank = { padding: '12px 12px 12px 0px' };
  const cardBodyStyle = { padding: 0 };

  useEffect(() => {
    console.log('comId', comId);
    if (comId) getAgencyBankData(comId, '');
  }, [comId]);

  useEffect(() => {
    if (value == 1) {
      setFirstName(t('agency-fistname'));
      setLastName(t('agency-lastname'));
      setCode(t('store-customer-id-card'));
    } else {
      setFirstName(t('agency-name-company'));
      setLastName(t('agency-name-contact'));
      setCode(t('agency-tag-no'));
    }
  }, [t]);

  useEffect(() => {
    setTextDiscount('');
  }, [list_discount]);

  useEffect(() => {
    setTextCOD('');
  }, [list_cod]);

  const onChangeDiscount = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // const fvalue = value ? parseFloat(value) : 0.0;
      if (value.length > 1) {
        if (value.substring(0, 1) == '0' && value.substring(1, 2) != '.') {
          setTextDiscount(value.substring(1, value.length));
        } else setTextDiscount(value);
      } else {
        setTextDiscount(value);
      }
    }
  };

  const onChangeCOD = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // const fvalue = value ? parseFloat(value) : 0.0;
      if (value.length > 1) {
        if (value.substring(0, 1) == '0' && value.substring(1, 2) != '.') {
          setTextCOD(value.substring(1, value.length));
        } else setTextCOD(value);
      } else {
        setTextCOD(value);
      }
    }
  };

  useEffect(() => {
    console.log('agencyId', agencyId);
    if (agencyId != 'create') {
      callInformation(agencyId, null);
    }
    console.log('agencyId', agencyId);
    if (agencyId == 'create') {
      const initFormData = {
        isActive: true,
        provinceId: '',
        districtId: '',
        subdistrictId: '',
        postcode: '',
        addressNo: '',
        addressSoi: '',
        addressMoo: '',
        addressRoad: '',
        addressOther: '',
        lat: '',
        lng: '',
        companyName: '',
        hubName: '',
        // adminName: '',
        // adminEmail: '',
        // adminPhone: '',
        // adminId: '',

        agencyCode: '',
        agencyName: '',

        firstName: '',
        lastName: '',
        contactName: '',
        taxNumber: '',
        phoneNo: '',
        type: 1,

        agencyTypeId: '',
        agencyLevelId: '',
        hubId: '',

        agencyDiscount: '',
        agencyCOD: '',

        //  bankAgency: ""

        agencyBanks: [{ bankId: '', bankAccountNo: '', bankAccountName: '' }],
      };
      form.setFieldsValue(initFormData);
      callProvince();
      if (roleLevel != 'SAD') getAgencyTypeData(0, 'new');
      if (roleLevel != 'SAD') getAgencyBankData(0, 'new');
    } else {
      getAgencyBankData(0, 'new');
    }
  }, [actionPage]);

  //  callInformation
  const callInformation = async (agencyId, list_bank) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: `/agency/${agencyId}`,
    })
      .then((res) => {
        setLoadIng(false);
        if (res.data.success) {
          if (res.data.data.type == 1) {
            setFirstName(t('agency-fistname'));
            setLastName(t('agency-lastname'));
            setCode(t('store-customer-id-card'));
          } else {
            setFirstName(t('agency-name-company'));
            setLastName(t('agency-name-contact'));
            setCode(t('agency-tag-no'));
          }

          console.log('res.data.data', res.data.data);

          setLastNameValue(res.data.data.lastName);
          setContactNameValue(res.data.data.contactName);
          const initFormData = {
            hubId: res.data.data?.hubData?.hubName,
            agencyTypeId: res.data.data.agencyTypeData.agencyTypeName,
            agencyLevelId: res.data.data.agencyLevelData.agencyLevelName,
            isActive: res.data.data.isActive,
            provinceId: res.data.data.provinceId,
            districtId: res.data.data.districtId,
            subdistrictId: res.data.data.subdistrictId,
            postcode: res.data.data.postcode,
            firstName: res.data.data.firstName,
            agencyCode: res.data.data.agencyCode,
            taxNumber: res.data.data.taxNumber,
            lastName: res.data.data.lastName,
            contactName: res.data.data.contactName,
            commission: res.data.data.commission,
            addressNo: res.data.data.addressNo,
            addressSoi: res.data.data.addressSoi,
            addressMoo: res.data.data.addressMoo,
            addressRoad: res.data.data.addressRoad,
            addressOther: res.data.data.addressOther,
            lat: res.data.data.lat,
            lng: res.data.data.lng,
            companyName:
              res.data.data.companyData == null
                ? ''
                : res.data.data.companyData.companyName,
            phoneNo: res.data.data.phoneNo,
            contactName: res.data.data.contactName,
            hubName:
              res.data.data.hubData == null
                ? ''
                : res.data.data.hubData.hubName,
            // adminName: res.data.data.admin.name,
            // adminEmail: res.data.data.admin.email,
            // adminPhone: res.data.data.admin.phoneNo,
            // adminId: res.data.data.admin.userId,
            agencyBanks: res.data.data.agencyBanks,
          };

          setComID(res.data.data.companyId);

          form.setFieldsValue(initFormData);

          if (res.data.data?.lat && res.data.data?.lng) {
            setLatLng({
              lat: parseFloat(res.data.data?.lat),
              lng: parseFloat(res.data.data?.lng),
            });
          }

          setProviceID(res.data.data.provinceId);
          setDistrictID(res.data.data.districtId);
          setSubDistrictID(res.data.data.subdistrictId);
          setComID(res.data.data.companyId);
          setAgencyTypeID(res.data.data.agencyTypeId);
          setAgencyLevelID(res.data.data.agencyLevelId);
          setHubID(res.data.data.hubId);
          // setAdminID(res.data.data.admin.userId);
          // setAdminName(res.data.data.admin.name);
          // setAdminPhone(res.data.data.admin.phoneNo);
          // setAdminEmail(res.data.data.admin.email);
          setValue(res.data.data.type);
          const arrayCOD = JSON.parse(`[${res.data.data?.agencyCOD}]`);
          const arrayDiscount = JSON.parse(
            `[${res.data.data?.agencyDiscount}]`,
          );

          const discount = arrayDiscount.map((i) => `${i}%`);
          const cod = arrayCOD.map((i) => `${i}%`);
          setListDiscountDefault(discount);
          setListCODDefault(cod);

          let i = 0;
          const listD = [];
          for (i = 0; i < discount.length; i++) {
            const objDiscount = {
              value: discount[i],
              sort: arrayDiscount[i],
            };
            listD.push(objDiscount);
            setListDiscount(listD);
          }

          let j = 0;
          const listC = [];
          for (j = 0; j < cod.length; j++) {
            const objCod = {
              value: cod[j],
              sort: arrayCOD[j],
            };
            listC.push(objCod);
            setListCOD(listC);
          }

          setListBank(res.data.data.agencyBanks);
          getAgencyTypeData(res.data.data.companyData.companyId, 'filter');
          callDistrict(res.data.data.provinceId);
          callSubDistrict(res.data.data.districtId);
        } else {
        }
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const onChange = (e) => {
    if (e.target.value == 1) {
      setFirstName(t('agency-fistname'));
      setLastName(t('agency-lastname'));
      setCode(t('store-customer-id-card'));
    } else {
      setFirstName(t('agency-name-company'));
      setLastName(t('agency-name-contact'));
      setCode(t('agency-tag-no'));
    }
    setValue(e.target.value);
  };

  /// handle

  const handleSubmit = (values) => {
    // if (agencyId == 'create'
    //   //  && !values.adminName
    // ) {
    //   console.log('here2', values);
    //   setTabSelect('2');
    //   window.scrollTo(0, 0);
    //   return message.error('Please fill out the information completely.');
    // }

    const companyId = companyData.filter(
      (item) => item.companyName == values.companyName,
    );
    let provinceId = 0;
    let districtId = 0;
    let subDistrictId = 0;
    let compId = 0;
    let hubId = 0;
    let agencyTypeId = 0;
    let agencyLevelId = 0;

    if (agencyId == 'create') {
      if (typeof values.provinceId === 'string') {
        provinceId = province;
      } else {
        provinceId = Number(values.provinceId);
      }

      if (typeof values.districtId === 'string') {
        districtId = district;
      } else {
        districtId = Number(values.districtId);
      }

      subDistrictId = Number(values.subdistrictId);
      (agencyTypeId = Number(values.agencyTypeId)),
        (agencyLevelId = Number(values.agencyLevelId)),
        (hubId = Number(values.hubId)),
        (compId = companyId[0]?.companyId);
    } else {
      if (isSelectProvince) {
        provinceId = Number(values.provinceId);
      } else {
        provinceId = province;
      }

      if (isSelectDistrict) {
        districtId = Number(values.districtId);
      } else {
        districtId = district;
      }

      if (isSelectSubDistrict) {
        subDistrictId = Number(values.subdistrictId);
      } else {
        subDistrictId = subDistrict;
      }

      if (isSelectCompany) {
        compId = companyId[0]?.companyId;
      } else {
        compId = comId;
      }

      if (isSelectAgencyLevel) {
        agencyLevelId = Number(values.agencyLevelId);
      } else {
        agencyLevelId = agencyLevelID;
      }

      if (isSelectAgencyType) {
        agencyTypeId = Number(values.agencyTypeId);
      } else {
        agencyTypeId = agencyTypeID;
      }

      if (isSelectHub) {
        hubId = Number(values.hubId);
      } else {
        hubId = hubID;
      }
    }

    let i = 0;
    let cod = '';
    let discount = '';
    for (i = 0; i < list_cod.length; i++) {
      if (i == list_cod.length - 1) {
        cod += list_cod[i].sort;
      } else {
        cod += `${list_cod[i].sort},`;
      }
    }

    for (i = 0; i < list_discount.length; i++) {
      if (i == list_discount.length - 1) {
        discount += list_discount[i].sort;
      } else {
        discount += `${list_discount[i].sort},`;
      }
    }

    let dataSubmit = {};
    if (agencyId == 'create') {
      dataSubmit = {
        agency: {
          agencyCode: values.agencyCode,
          agencyName: '',
          firstName: values.firstName,
          lastName: value == 1 ? values.lastName : lastnameValue,
          contactName: value == 2 ? values.contactName : contactnameValue,
          taxNumber: values.taxNumber,
          type: value,
          agencyTypeId,
          agencyLevelId,
          hubId,
          phoneNo: values.phoneNo,
          commission: values.commission,
          isActive: values.isActive,
          companyId: roleLevel == 'SAD' ? compId : null,
          lat: parseFloat(values.lat),
          lng: parseFloat(values.lng),
          provinceId,
          districtId,
          subdistrictId: subDistrictId,
          postcode: values.postcode,
          addressNo: values.addressNo,
          addressSoi: values.addressSoi,
          addressMoo: values.addressMoo,
          addressRoad: values.addressRoad,
          addressOther: values.addressOther,
          agencyDiscount: discount,
          agencyCOD: cod,
          agencyBanks: values.agencyBanks,
        },
        // admin: {
        //   name: values.adminName,
        //   phoneNo: values.adminPhone,
        //   email: values.adminEmail,
        //   password: values.password,
        // },
      };
    } else {
      let z = 0;
      let obj = {};
      const list = [];
      for (z = 0; z < values.agencyBanks.length; z++) {
        if (values.agencyBanks[z].bankId.length < 3) {
          if (values.agencyBanks[z].agencyBankId === undefined) {
            obj = {
              bankId,
              bankAccountNo: values.agencyBanks[z].bankAccountNo,
              bankAccountName: values.agencyBanks[z].bankAccountName,
            };
            list.push(obj);
          } else {
            obj = {
              bankId: Number(values.agencyBanks[z].bankId),
              agencyBankId: values.agencyBanks[z].agencyBankId,
              bankAccountNo: values.agencyBanks[z].bankAccountNo,
              bankAccountName: values.agencyBanks[z].bankAccountName,
            };
            list.push(obj);
          }
        } else {
          var { bankId } = values.agencyBanks[z];

          obj = {
            bankId,
            agencyBankId: values.agencyBanks[z].agencyBankId,
            bankAccountNo: values.agencyBanks[z].bankAccountNo,
            bankAccountName: values.agencyBanks[z].bankAccountName,
          };
          list.push(obj);
          // }
        }
      }

      dataSubmit = {
        agency: {
          agencyCode: values.agencyCode,
          agencyName: '',
          firstName: values.firstName,
          lastName: value == 1 ? values.lastName : lastnameValue,
          contactName: value == 2 ? values.contactName : contactnameValue,
          taxNumber: values.taxNumber,
          type: value,
          agencyTypeId,
          agencyLevelId,
          hubId,
          phoneNo: values.phoneNo,
          commission: values.commission,
          isActive: values.isActive,
          companyId: roleLevel == 'SAD' ? compId : null,
          lat: parseFloat(values.lat),
          lng: parseFloat(values.lng),
          provinceId,
          districtId,
          subdistrictId: subDistrictId,
          postcode: values.postcode,
          addressNo: values.addressNo,
          addressSoi: values.addressSoi,
          addressMoo: values.addressMoo,
          addressRoad: values.addressRoad,
          addressOther: values.addressOther,
          agencyDiscount: discount,
          agencyCOD: cod,
          agencyBanks: list,
        },
        // admin: {
        //   name: values.adminName || adminName,
        //   phoneNo: values.adminPhone || adminPhone,
        //   email: values.adminEmail || adminEmail,
        //   userId: adminId,
        // },
      };
    }

    console.log('dataSubmit : ', dataSubmit);

    Modal.confirm({
      title:
        agencyId === 'create'
          ? 'Do you want to create Agencys ?'
          : 'Do you want to update Agencys ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        window.scrollTo(0, 0);
        if (agencyId === 'create') {
          // if (!values.adminName) {
          //   console.log('here3');
          //   return message.error('Please fill out the information completely.');
          // }
          dispatch(allAction.agencyAction.createAgencyDetail(dataSubmit))
            .then(() => {
              message.success('Create Success!');
              history.push('../agency-management');
            })
            .catch((e) => message.error(e.message));
        } else {
          dispatch(
            allAction.agencyAction.updateAgencyDetail(agencyId, dataSubmit),
          )
            .then(() => {
              message.success('Update Success!');
              dispatch(allAction.agencyAction.setActionPage('view'));
            })
            .catch((e) => message.error(e.message));
        }
      },
      onCancel() { },
    });
  };

  const handleFilterProvice = (value) => {
    callDistrict(value);
    setIsSelectProvince(true);
    setListDistrict([]);
    setListSubDistrict([]);
    form.setFieldsValue({
      districtId: '',
      subdistrictId: '',
      postcode: '',
    });
  };

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
    // if (isSelectProvince || isSelectDistrict) {
    //   form.setFieldsValue({
    //     postcode: '',
    //   });
    // } else {
    //   if (isCheckPostCode) {
    //   } else {
    //     form.setFieldsValue({
    //       postcode: '',
    //     });
    //   }
    // }
  };

  const handleFilterCompany = (value) => {
    console.log('handleFilterCompany', value);

    if (value.length == 0) {
      getAgencyTypeData(0, 'new');
      setComID(0);
    } else {
      var { companyId } = companyData.filter(
        (item) => item.companyName == value,
      )[0];
      form.setFieldsValue({
        agencyTypeId: '',
        agencyLevelId: '',
        hubId: '',
        agencyBanks: [{ bankId: '', bankAccountNo: '', bankAccountName: '' }],
      });
      setComID(companyId);
      getAgencyTypeData(companyId, 'filter');
    }

    setComID(companyId);
    setIsSelectCompany(true);
  };

  const handleFilterAgencyType = (value) => {
    setIsSelectAgencyType(true);
  };

  const handleFilterHub = (value) => {
    setIsSelectHub(true);
  };

  const handleFilterAgencyLevel = (value) => {
    setIsSelectAgencyLevel(true);
    const objectResult = listAgencyLevel.filter(
      (item) => item.agencyLevelId == value,
    );

    const arrayCOD = JSON.parse(`[${objectResult[0]?.agencyLevelCOD}]`);
    const arrayDiscount = JSON.parse(
      `[${objectResult[0]?.agencyLevelDiscount}]`,
    );

    const discount = arrayDiscount.map((i) => `${i}%`);
    const cod = arrayCOD.map((i) => `${i}%`);
    setListDiscountDefault(discount);
    setListCODDefault(cod);

    let i = 0;
    const listD = [];
    for (i = 0; i < discount.length; i++) {
      const objDiscount = {
        value: discount[i],
        sort: arrayDiscount[i],
      };
      listD.push(objDiscount);
      setListDiscount(listD);
    }

    let j = 0;
    const listC = [];
    for (j = 0; j < cod.length; j++) {
      const objCod = {
        value: cod[j],
        sort: arrayCOD[j],
      };
      listC.push(objCod);
      setListCOD(listC);
    }
  };

  function onHandleSaveDiscount(value) {
    if (!value || value == '0') {
      setTextDiscount('');
      return false;
    }

    value = parseFloat(value);

    if (list_discount.length == 0) {
      const list = [];
      const obj = { value: `${value}%`, sort: value };
      list.push(obj);
      setListDiscount(list);
    } else {
      const newArr = [...list_discount];
      const check = newArr.filter((item) => item.value == `${value}%`);
      if (check.length == 0) {
        newArr[list_discount.length] = { value: `${value}%`, sort: value };
        newArr.sort((a, b) => a.sort - b.sort);
        setListDiscount(newArr);
      } else setTextDiscount('');
    }
  }

  function onHandleSaveCOD(value) {
    if (!value || value == '0') {
      setTextCOD('');
      return false;
    }
    value = parseFloat(value);

    if (list_cod.length == 0) {
      const list = [];
      const obj = { value: `${value}%`, sort: value };
      list.push(obj);
      setListCOD(list);
    } else {
      const newArr = [...list_cod];
      const check = newArr.filter((item) => item.value == `${value}%`);
      if (check.length == 0) {
        newArr[list_cod.length] = { value: `${value}%`, sort: value };
        newArr.sort((a, b) => a.sort - b.sort);
        setListCOD(newArr);
      } else setTextCOD('');
    }
  }

  const onChangeTagCod = (removedTag) => {
    const cod_default = list_cod_default.filter((tag) => tag !== removedTag);
    const cod = list_cod.filter((tag) => tag.value !== removedTag);
    setListCOD(cod);
    setListCODDefault(cod_default);
  };

  const onChangeTagDiscount = (removedTag) => {
    const discount_default = list_discount_default.filter(
      (tag) => tag !== removedTag,
    );
    const discount = list_discount.filter((tag) => tag.value !== removedTag);
    setListDiscount(discount);
    setListDiscountDefault(discount_default);
  };

  /// // service

  const getAgencyTypeData = async (compId, type) => {
    // setLoadIng(true);
    //  console.log('getAgencyTypeData');

    let url_result = '';
    if (type == 'new') {
      url_result = '/agency-type';
    } else {
      url_result = `/agency-type?search=&companyId=${compId}`;
    }
    fetch({
      method: 'get',
      url: url_result,
    })
      .then((res) => {
        // setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            const obj = {
              key: res.data.data[i].agencyTypeId,
              agencyTypeName: res.data.data[i].agencyTypeName,
            };
            list.push(obj);
          }
          setListAgencyType(list);
          if (type == 'new') {
            getAgencyLevelData(0, 'new');
          } else {
            getAgencyLevelData(compId, type);
          }
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  const getAgencyLevelData = (compId, type) => {
    // setLoadIng(true)
    let url_result = '';
    if (type == 'new') {
      url_result = '/agency-level';
    } else {
      url_result = `/agency-level?search=&companyId=${compId}`;
    }
    fetch({
      method: 'get',
      url: url_result,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          setListAgencyLevel(resData);
          if (type == 'new') {
            getHubMasterList(0, 'new');
          } else {
            getHubMasterList(compId, type);
          }
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  const getAgencyBankData = (compId, type) => {
    // setLoadIng(true)
    // console.log('getAgencyBankData', compId, type);
    // if (!compId) return true;

    let url_result = '';
    if (type == 'new') {
      url_result = '/bank';
    } else {
      url_result = `/bank?search=&companyId=${compId}`;
    }
    fetch({
      method: 'get',
      url: url_result,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          let i = 0;
          const list = [];
          for (i = 0; i < resData.length; i++) {
            if (resData[i].companyData != null) {
              const obj = {
                key: resData[i].bankId,
                agencyBankId: resData[i].agencyBankId,
                bankName: resData[i].bankName,
                bankCode: resData[i].bankCode,
                companyName: resData[i].companyData.companyName,
              };
              list.push(obj);
            }
          }
          setListAgencyBank(resData);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  const getAgencyBankFilterData = (compId, type) => {
    fetch({
      method: 'get',
      url: `/bank?search=&companyId=${compId}`,
    })
      .then((res) => {
        if (res.data.success) {
          const { data } = res.data;
          const resData = data.map((val, i) => {
            val.key = i + 1;
            return val;
          });
          let i = 0;
          const list = [];
          for (i = 0; i < resData.length; i++) {
            if (resData[i].companyData != null) {
              const obj = {
                key: resData[i].bankId,
                agencyBankId: resData[i].agencyBankId,
                bankName: resData[i].bankName,
                bankCode: resData[i].bankCode,
                companyName: resData[i].companyData.companyName,
              };
              list.push(obj);
            }
          }
          console.log('1234 : ', resData);
          setListAgencyBank(resData);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  const getHubMasterList = (compId, type) => {
    let url_result = '';
    if (type == 'new') {
      url_result = '/hub/dropdown';
    } else {
      url_result = `/hub/dropdown?search=&companyId=${compId}`;
    }
    fetch({
      method: 'get',
      url: url_result,
    })
      .then((res) => {
        if (res.data.success) {
          setListHub(res.data.data);
          if (type == 'new') {
            callProvince(0, 'new');
          } else {
            callProvince(compId, 'filter');
          }
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  // service location

  const callProvince = async (compId, type) => {
    console.log('hello', type);
    //  setLoadIng(true)
    fetch({
      method: 'get',
      url: '/master/province',
    })
      .then((res) => {
        // setLoadIng(false);
        if (res.data.success) {
          let i = 0;
          const list = [];
          for (i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          setListProvince(list);
          console.log('type : ', type);
          // if (type == 'filter') {
          //   getAgencyBankFilterData(compId, type);
          // } else {
          //   getAgencyBankData(0, 'new');
          // }
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  //  callDistrict
  const callDistrict = async (provinceId) => {
    // setLoadIng(true);
    fetch({
      method: 'get',
      url: `/master/district/?provinceId=${provinceId}`,
    })
      .then((res) => {
        // setLoadIng(false);
        if (res.data.success) {
          if (res.data.success) {
            let i = 0;
            const list = [];
            for (i = 0; i < res.data.data.length; i++) {
              list.push(res.data.data[i]);
            }
            console.log('list', list);
            setListDistrict(list);
          } else {
          }
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
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
          if (!chkHasPostcode) {
            form.setFieldsValue({
              postcode: '',
            });
          }
          setListSubDistrict(list);
        } else {
        }
      })
      .catch((error) => {
        // setLoadIng(false);
        console.log(error);
      });
  };

  //  onChangePostCode
  const onChangePostcode = (e) => {
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
              districtId:
                res.data.data.district.length === 1
                  ? res.data.data.district[0].districtId
                  : '',
              subdistrictId:
                res.data.data.subdistrict.length === 1
                  ? res.data.data.subdistrict[0].subdistrictId
                  : '',
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

  function isInputNumber(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9]/.test(ch)) {
      evt.preventDefault();
    }
  }

  function isInputDouble(evt) {
    const ch = String.fromCharCode(evt.which);

    if (!/[0-9.]/.test(ch)) {
      evt.preventDefault();
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function changeLatLng() {
    const lat = form.getFieldValue('lat');
    const lng = form.getFieldValue('lng');

    let new_latlng;

    if (!lat || !lng) {
      new_latlng = {
        lat: 13.0,
        lng: 100.0,
      };
    } else {
      new_latlng = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
    }

    setLatLng(new_latlng);
  }

  const onSearchMap = (value) => {
    form.setFieldsValue({
      lat: value?.lat.toFixed(6),
      lng: value?.lng.toFixed(6),
    });

    console.log(value);
  };

  const onChangeEmail = (e) => {
    const { value } = e.target;

    form.setFieldsValue({
      adminEmail: value.replace(
        /[^\S]|<|>|\(|\)|`|\$|%|\^|\&|\*|\+|=|"|:|;|\?|,/g,
        '',
      ),
    });
  };

  if (agencyId !== 'create' && actionPage === 'view') {
    return <AgencysDetail {...props} />;
  }

  const toRemoveBank = (remove, id) => {
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
    // }
  };

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Layout style={{ minHeight: '100vh' }}>
          <Card
            title={(
              <Typography.Title level={3}>
                <span className="text-primary">
                  {agencyId === 'create'
                    ? t('agency-head-create')
                    : t('agency-head-edit')}
                </span>
              </Typography.Title>
            )}
          >
            <Form
              layout="horizontal"
              name="search"
              form={form}
              {...formItemLayout}
              onFinish={handleSubmit}
            // onFinishFailed={(values) => {
            //   console.log('here1');
            //   // if (!values.adminName) {
            //   //   setTabSelect('2');
            //   //   window.scrollTo(0, 0);
            //   // }
            //   message.error('Please fill out the information completely.');
            // }}
            >
              <Tabs
                type="card"
                activeKey={tabSelect}
                onTabClick={(key) => {
                  setTabSelect(key);
                }}
              >
                <TabPane tab={t('agency-tabs')} key="1">
                  {roleLevel == 'SAD' ? (
                    <Row
                      gutter={[8, 8]}
                      align="middle"
                      style={{ marginBottom: -14 }}
                    >
                      {/* <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                        <Form.Item style={{ textAlign: 'right' }}>
                          <Typography.Text>{t('company')}</Typography.Text>
                        </Form.Item>
                      </Col> */}

                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          name="companyName"
                          label={t('company')}
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Company Name!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            defaultValue={t('all-select')}
                            onChange={handleFilterCompany}
                            disabled={agencyId != 'create'}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {companyData.map((item) => (
                              <Option key={item.companyName}>
                                {item.companyName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : (
                    <></>
                  )}

                  <Row gutter={[8, 8]} align="middle">
                    {/* <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                      <Form.Item style={{ textAlign: 'right' }}>
                        <Typography.Text style={{ fontFamily: 'KanitRegular' }}>
                          {t('agency-code')}
                        </Typography.Text>
                      </Form.Item>
                    </Col> */}

                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                      <Form.Item
                        label={t('agency-code')}
                        name="agencyCode"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Agency Code!',
                          },
                        ]}
                      >
                        <Input style={{ fontFamily: 'KanitRegular' }} />
                      </Form.Item>
                    </Col>

                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 3, offset: 1 }}
                      xxl={{ span: 3, offset: 1 }}
                    >
                      <Form.Item name="isActive" valuePropName="checked">
                        <Checkbox style={{ fontFamily: 'KanitRegular' }}>
                          {t('hubs-close')}
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                      {/* <Form.Item>
                        <Typography.Text style={{ fontFamily: 'KanitRegular' }}>
                          {t('agency-balance')}
                        </Typography.Text>
                      </Form.Item> */}
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                      {/* <Form.Item
                        style={{
                          backgroundColor: '#96d976',
                          textAlign: 'center',
                        }}
                      >
                        <Typography.Text style={{ fontFamily: 'KanitRegular' }}>
                          0
                        </Typography.Text>
                      </Form.Item> */}
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                      {/* <Form.Item>
                        <Typography.Text
                          style={{
                            fontFamily: 'KanitRegular',
                            paddingLeft: 34,
                          }}
                        >
                          {t('agency-bath')}
                        </Typography.Text>
                      </Form.Item> */}
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 1 }}>
                      {/* <Form.Item>
                        <Image
                          style={{ marginTop: 4 }}
                          width={40}
                          src="https://ucarecdn.com/03fcaf34-3028-4332-ab54-53fc8afc5eba/about_icon_mpaystation.png"
                        />
                      </Form.Item> */}
                    </Col>
                  </Row>

                  <Card
                    style={{ fontFamily: 'KanitRegular' }}
                    title={t('agency-detail')}
                  >
                    <Row align="middle" style={{ marginBottom: -10 }}>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <Form.Item>
                          <Radio.Group onChange={onChange} value={value}>
                            <Radio value={1}>{t('agency-person')}</Radio>
                            <Radio value={2} style={{ marginLeft: 20 }}>
                              {t('agency-company')}
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row align="middle" style={{ marginBottom: -10 }}>
                      {/* <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                        <Form.Item
                          style={{ textAlign: 'right', marginRight: 12 }}
                        >
                          <Typography.Text>{firstname}</Typography.Text>
                        </Form.Item>
                      </Col> */}

                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          label={firstname}
                          name="firstName"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your First Name!',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      {/* <Col xs={{ span: 24 }} lg={{ span: 3, offset: 1 }}>
                        <Form.Item
                          style={{ textAlign: 'right', marginRight: 12 }}
                        >
                          <Typography.Text>{lastname}</Typography.Text>
                        </Form.Item>
                      </Col> */}

                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        {value == 1 ? (
                          <Form.Item
                            label={lastname}
                            name="lastName"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Last Name!',
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            label={lastname}
                            name="contactName"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Contact Name!',
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        )}
                      </Col>
                    </Row>

                    <Row align="middle" style={{ marginBottom: -10 }}>
                      {/* <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                        <Form.Item
                          style={{ textAlign: 'right', marginRight: 12 }}
                        >
                          <Typography.Text>
                            {t('agency-tag-no')}
                          </Typography.Text>
                        </Form.Item>
                      </Col> */}

                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          label={codeIdentity}
                          name="taxNumber"
                          rules={[
                            {
                              required: t('store-customer-id-card') === codeIdentity ? false : true,
                              message: 'Please input your Tax Number!',
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (
                                  !value
                                  || getFieldValue('taxNumber').length === 13
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  'Please Input Tax Number Correct Format!',
                                );
                              },
                            }),
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputNumber(event);
                            }}
                            maxLength={13}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          label={t('setting-agency-category')}
                          name="agencyTypeId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your Agency Type!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            defaultValue={t('all-select')}
                            onChange={handleFilterAgencyType}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listAgencyType.map((item) => (
                              <Option key={item.key}>
                                {item.agencyTypeName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row align="middle" style={{ marginBottom: -10 }}>
                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          label={t('information-phone')}
                          name="phoneNo"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Phone no!',
                            },
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputNumber(event);
                            }}
                            maxLength={10}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          label={t('setting-agency-degree')}
                          name="agencyLevelId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your Agency Level!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            defaultValue={t('all-select')}
                            onChange={handleFilterAgencyLevel}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listAgencyLevel.map((item) => (
                              <Option key={item.agencyLevelId}>
                                {item.agencyLevelName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item name="hubId" label={t('hub-name')}>
                          <Select
                            showSearch
                            defaultValue={t('all-select')}
                            onChange={handleFilterHub}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listHub.map((item) => (
                              <Option key={item.hubId}>{item.hubName}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item
                          label={t('commission')}
                          name="commission"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Commission!',
                            },
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputDouble(event);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{ fontFamily: 'KanitRegular', marginTop: 24 }}
                    title={t('setting-agency-degree-discount')}
                  >
                    <Row align="middle">
                      <Col
                        // xs={{ span: 24 }}
                        // lg={{ span: isDiscount ? 18 : 21 }}
                        flex="auto"
                      >
                        <Form.Item
                          name="agencyDiscount"
                          rules={[
                            {
                              required: list_discount_default.length == 0,
                              message: 'Please input your Level Discount!',
                            },
                          ]}
                        >
                          {isDiscountDefault
                            ? list_discount.map((item, index) => (
                              <Tag
                                style={{
                                  marginLeft: 8,
                                  marginRight: 8,
                                  marginTop: 4,
                                }}
                                closable
                                color="blue"
                                onClose={(e) => {
                                  e.preventDefault();
                                  onChangeTagDiscount(item.value);
                                }}
                              >
                                {item.value}
                              </Tag>
                            ))
                            : list_discount_default.map((item, index) => (
                              <Tag
                                style={{
                                  marginLeft: 8,
                                  marginRight: 8,
                                  marginTop: 4,
                                }}
                                closable
                                color="blue"
                                onClose={(e) => {
                                  e.preventDefault();
                                  onChangeTagDiscount(item);
                                }}
                              >
                                {item}
                              </Tag>
                            ))}
                        </Form.Item>
                      </Col>

                      <Col
                        xs={{ span: 24 }}
                        lg={{ span: isDiscount ? 3 : 2, offset: 1 }}
                      // flex="100px"
                      >
                        <Form.Item>
                          {isDiscount ? (
                            <Input
                              value={text_discount}
                              onChange={onChangeDiscount}
                              placeholder="0"
                              onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                  onHandleSaveDiscount(text_discount);
                                } else {
                                  isInputDouble(event);
                                }
                              }}
                            />
                          ) : list_discount.length == 0 ? (
                            <></>
                          ) : (
                            <Button
                              type="primary"
                              style={{
                                width: isMobile ? '100%' : '80px',
                                background: 'grey',
                                borderColor: 'grey',
                              }}
                              onClick={() => {
                                setIsDiscount(true);
                                setIsDiscountDefault(true);
                              }}
                            >
                              {t('edit')}
                            </Button>
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: isDiscount ? 2 : 0 }}>
                        <Form.Item>
                          <Button
                            type="primary"
                            style={{
                              width: isMobile ? '100%' : '80px',
                              fontFamily: 'KanitRegular',
                              float: 'Right',
                            }}
                            onClick={() => {
                              onHandleSaveDiscount(text_discount);
                            }}
                          >
                            {t('setting-agency-degree-add')}
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{ fontFamily: 'KanitRegular', marginTop: 24 }}
                    title={t('setting-agency-degree-cod')}
                  >
                    <Row align="middle">
                      <Col flex="auto">
                        <Form.Item
                          name="agencyCOD"
                          rules={[
                            {
                              required: list_cod_default.length == 0,
                              message: 'Please input your Level COD!',
                            },
                          ]}
                        >
                          {isCodDefault ? (
                            <ScrollMenu
                              data={list_cod.map((item, index) => (
                                <Tag
                                  style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                    marginTop: 4,
                                  }}
                                  closable
                                  color="blue"
                                  onClose={(e) => {
                                    e.preventDefault();
                                    onChangeTagCod(item.value);
                                  }}
                                >
                                  {item.value}
                                </Tag>
                              ))}
                            />
                          ) : (
                            <ScrollMenu
                              data={list_cod_default.map((item, index) => (
                                <Tag
                                  style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                    marginTop: 4,
                                  }}
                                  closable
                                  color="blue"
                                  onClose={(e) => {
                                    e.preventDefault();
                                    onChangeTagCod(item);
                                  }}
                                >
                                  {item}
                                </Tag>
                              ))}
                            />
                          )}
                        </Form.Item>
                      </Col>

                      <Col
                        xs={{ span: 24 }}
                        lg={{ span: isCOD ? 3 : 2, offset: 1 }}
                      >
                        <Form.Item>
                          {isCOD ? (
                            <Input
                              value={text_cod}
                              placeholder="0"
                              onChange={onChangeCOD}
                              onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                  onHandleSaveCOD(text_cod);
                                } else {
                                  isInputDouble(event);
                                }
                              }}
                            />
                          ) : list_cod.length == 0 ? (
                            <></>
                          ) : (
                            <Button
                              type="primary"
                              style={{
                                width: isMobile ? '100%' : '80px',
                                background: 'grey',
                                borderColor: 'grey',
                              }}
                              onClick={() => {
                                setIsCOD(true);
                                setIsCODDefault(true);
                              }}
                            >
                              {t('edit')}
                            </Button>
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: isCOD ? 2 : 0 }}>
                        <Form.Item>
                          <Button
                            type="primary"
                            style={{
                              width: isMobile ? '100%' : '80px',
                              fontFamily: 'KanitRegular',
                              float: 'Right',
                            }}
                            onClick={() => {
                              onHandleSaveCOD(text_cod);
                            }}
                          >
                            {t('setting-agency-degree-add')}
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card
                    style={{
                      fontFamily: 'KanitRegular',
                      marginTop: 32,
                      marginBottom: 24,
                    }}
                    bodyStyle={{ padding: 0 }}
                    title={t('address-location')}
                  >
                    <Row
                      align="middle"
                      style={{
                        marginTop: 16,
                        marginBottom: -10,
                        paddingLeft: 12,
                        paddingRight: 12,
                      }}
                    >
                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          name="lat"
                          label={t('lat')}
                          rules={[
                            {
                              required: true,
                              message: 'Please input your lat!',
                            },
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputDouble(event);
                            }}
                            onChange={changeLatLng}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item
                          label={t('lng')}
                          name="lng"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your lng!',
                            },
                          ]}
                        >
                          <Input
                            onKeyPress={(event) => {
                              isInputDouble(event);
                            }}
                            onChange={changeLatLng}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                        <Form.Item>
                          <Typography.Text>
                            <Image
                              height={32}
                              width={52}
                              style={{
                                marginLeft: 20,
                                paddingLeft: '20px',
                                cursor: 'pointer',
                              }}
                              src={gMapicon}
                              preview={false}
                              onClick={() => {
                                showModal();
                              }}
                            />
                          </Typography.Text>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row
                      style={{
                        paddingLeft: 12,
                        paddingRight: 12,
                      }}
                    >
                      <Col xs={6} lg={3}>
                        <Form.Item
                          style={formItemStyle}
                          label={t('address-number')}
                          name="addressNo"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your No!',
                            },
                          ]}
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
                          name="addressMoo"
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
                          name="addressSoi"
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
                          name="addressRoad"
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
                          name="addressOther"
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
                            {
                              required: true,
                              message: 'Please input your postcode!',
                            },
                          ]}
                        >
                          <Input
                            autocomplete="new-password"
                            placeholder={t('address-postal')}
                            onChange={onChangePostcode}
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
                              message: 'Please select your Sub District!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            defaultValue={t('all-select')}
                            onChange={handleFilterSubDistrict}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listSubDistrict.map((item) => {
                              if (form.getFieldValue('postcode')) {
                                if (
                                  item.postcode
                                  !== form.getFieldValue('postcode')
                                ) {
                                  return null;
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
                          name="districtId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your District!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            defaultValue={t('all-select')}
                            onChange={handleFilterDistrict}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listDistrict.map((item) => (
                              <Option
                                value={item.districtId}
                                key={item.districtId}
                              >
                                {item.districtName}
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
                            {
                              required: true,
                              message: 'Please select your Province!',
                            },
                          ]}
                          defaultValue={t('all-select')}
                        >
                          <Select
                            showSearch
                            onChange={handleFilterProvice}
                            filterOption={(input, option) => option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="">{t('all-select')}</Option>
                            {listProvince.map((item) => (
                              <Option
                                value={item.provinceId}
                              // key={item.provinceId}
                              >
                                {item.provinceName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Form.List name="agencyBanks">
                    {(fields, { add, remove }) => (
                      <>
                        <Row
                          style={{
                            borderRight: '1px solid #F0F0F0',
                            borderLeft: '1px solid #F0F0F0',
                            borderTop: '1px solid #F0F0F0',
                          }}
                          align="middle"
                        >
                          <Col xs={12}>
                            <span
                              style={{
                                marginLeft: 24,
                                marginTop: 22,
                                fontSize: 17,
                              }}
                            >
                              {t('menu-setting-bank')}
                            </span>
                          </Col>
                          <Col
                            xs={12}
                            style={{
                              marginBottom: 12,
                            }}
                          >
                            <Button
                              size="small"
                              type="primary"
                              style={{
                                float: 'right',
                                marginRight: 12,
                                marginTop: 14,

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
                              <Col
                                xs={24}
                                sm={12}
                                lg={fields.length > 1 ? 5 : 8}
                              >
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
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please input Bank!',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    defaultValue={t('all-select')}
                                    filterOption={(input, option) => option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0}
                                  >
                                    <Option value="">{t('all-select')}</Option>
                                    {listAgencyBank.map((item) => (
                                      <Option
                                        key={item.bankId}
                                        value={item.bankId}
                                      >
                                        {item.bankName}
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
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please input Bank No!',
                                    },
                                  ]}
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
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please input Bank Name!',
                                    },
                                  ]}
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
                                      fields.length > 1 && isMobile
                                        ? '10px'
                                        : '0px',
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
                  {/* </Card> */}
                </TabPane>
                {/* <TabPane tab={t('admin')} key="2">
                  <>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('username')}
                        name="adminName"
                        rules={[
                          { required: true, message: 'Please input Name!' },
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('username')}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('phone')}
                        name="adminPhone"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Phone No!',
                          },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              if (
                                !value
                                || getFieldValue('adminPhone').length === 10
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                'Please Input Phone Number Correct Format!',
                              );
                            },
                          }),
                        ]}
                      >
                        <Input
                          autocomplete="new-password"
                          placeholder={t('phone')}
                          onKeyPress={(event) => {
                            isInputNumber(event);
                          }}
                          maxLength={10}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...itemLayout}>
                      <Form.Item
                        label={t('email')}
                        name="adminEmail"
                        rules={[
                          {
                            required: true,
                            message: 'Please input E-mail!',
                            type: 'email',
                          },
                        ]}
                      >
                        <Input
                          onChange={onChangeEmail}
                          autocomplete="new-password"
                          placeholder={t('email')}
                        />
                      </Form.Item>
                    </Col>
                    {agencyId === 'create' && (
                      <>
                        <Col {...itemLayout}>
                          <Form.Item
                            label={t('first-password')}
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: 'Please input First Login Password!',
                              },
                            ]}
                          >
                            <Input.Password
                              autocomplete="new-password"
                              placeholder={t('first-password')}
                            />
                          </Form.Item>
                        </Col>
                        <Col {...itemLayout}>
                          <Form.Item
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
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </>
                </TabPane> */}
              </Tabs>

              <Form.Item style={{ marginTop: '50px' }}>
                {isMobile ? (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Button
                          type="primary"
                          onClick={form.submit}
                          icon={<SaveOutlined />}
                          block
                        >
                          {t('save')}
                        </Button>
                      </Col>
                      <Col xs={24}>
                        <Button
                          type="default"
                          icon={<RollbackOutlined />}
                          onClick={() => history.push('../agency-management')}
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
                      onClick={() => handleCancel()}
                      style={{ width: '100px', float: 'Right', marginLeft: 15 }}
                      onClick={() => history.push('../agency-management')}
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="primary"
                      onClick={form.submit}
                      icon={<SaveOutlined />}
                      style={{ width: '100px', float: 'Right' }}
                    >
                      {t('save')}
                    </Button>
                  </>
                )}
              </Form.Item>
            </Form>
          </Card>
          <Modal
            title={t('show-map')}
            visible={isModalVisible}
            width={1000}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {isModalVisible && (
              <Map {...props} onSearchMap={onSearchMap} LatLng={LatLng} />
            )}
          </Modal>
        </Layout>
      </Spin>
    </>
  );
};

export default AgencysInput;
