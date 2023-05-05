import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ChangeAddress from '../modal/change-address/ChangeAddress';
import ChangeAddressInput from '../modal/change-address/ChangeAddressInput';
import allAction from '../../../../../app/actions';
import { Modal, Typography, Card, Form, Button, Spin } from 'antd';
import {
  PlusOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const ChangeAddressMain = (props) => {
  const [listAddress, setListAddress] = useState([]);
  const [customerId, setCustomerId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState(true)

  const { isMobile } = useSelector((state) => state.mainReducer);
  const { companyId, userLevel } = useSelector((state) => state.authenReducer);
  // const { actionModal } = useSelector((state) => state.storeSellReducer);

  const actionModal = "view";

  const {
    formBig,
    formDo,
    setShowChangeAddress,
    showChangeAddress,
    refreshPhoneNo,
    setIsNewCustomer,
    setIsNewAddress

  } = props;

  useEffect(() => {
    const keys = formBig.getFieldValue();
    setIsLoading(true);
    const objSearch = {};
    setListAddress([]);

    const phone = formDo.getFieldsValue().recipientInput
    console.log("ChangeAddressMain", phone)
    // formBig.getFieldsValue().itemStoreSell[showCode.key].recipientInput;
    objSearch.search = phone;


    if (userLevel === 'SAD') objSearch.companyId = keys.companyId;
    dispatch(allAction.storeSellAction.getCustomerDetail(objSearch))
      .then(async (data) => {
        const listRes = [];
        if (data) {
          setCustomerId(data.customerId);
          data.customerAddressData.filter((val) => {
            let addressRes = '';
            const moo = val.moo ? `${t('address-village')}${val.moo}` : '';
            const alley = val.alley ? `${t('address-lane')}${val.alley}` : '';
            const road = val.road ? `${t('address-road')}${val.road}` : '';
            const subdistrict = val.subdistrictData?.subdistrictName ? `${t('address-sub-district2')}${val.subdistrictData.subdistrictName}` : '';
            const district = val.districtData?.districtName ? `${t('address-district2')}${val.districtData.districtName}` : '';
            const provice = val.provinceData?.provinceName ? `${t('address-provice2')}${val.provinceData.provinceName}` : '';
            const postcode = val.postcode ? `${val.postcode}` : '';
            addressRes = `${val.no} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;
            listRes.push({
              ...val,
              all: addressRes,
            });
          });

          setIsNewCustomer(false)
          // setIsNewAddress(false)
        } else {
          setIsNewCustomer(true)
          // setIsNewAddress(true)
          console.log("ChangeAddressMain no data", data)
        }
        
        await setListAddress(listRes);
        setIsLoading(false);
      }).catch(async (error) => {
        console.log("ChangeAddressMain error", error)
        await setListAddress([]);
        setIsLoading(false);
      });
  }, [refreshPhoneNo]);

  const selectNewAddress = (value) => {
    const itemSs = formDo.getFieldsValue();

    itemSs.recipientNo = value.no;
    itemSs.recipientMoo = value.moo;
    itemSs.recipientAlley = value.alley;
    itemSs.recipientRoad = value.road;
    itemSs.recipientDistrictId = value.districtData?.districtId;
    itemSs.recipientDistrictName = value.districtData?.districtName;
    itemSs.recipientSubdistrictId = value.subdistrictData?.subdistrictId;
    itemSs.recipientSubdistrictName = value.subdistrictData?.subdistrictName;
    itemSs.recipientProvinceId = value.provinceData?.provinceId;
    itemSs.recipientProvinceName = value.provinceData?.provinceName;
    itemSs.recipientPostcode = value.postcode;
    itemSs.recipientOther = value.other;

    formDo.setFieldsValue({
      ...itemSs
    });

    setIsShowModal(false)
    // setTimeout(() => {
      setShowChangeAddress(false)
    // }, 500);

    dispatch(allAction.orderItemImportAction.setPostcodeRefresh(new Date()))
  }

  // if (isLoading) {
  //   return (


  //   );
  // }
  return <Modal
    title={<Typography.Title level={3} style={{ color: '#264B9B' }}>{t('change-address') || '-'}</Typography.Title>}
    visible={showChangeAddress}
    footer={null}
    onCancel={() => {
      setIsShowModal(false)
      // setTimeout(() => {
        setShowChangeAddress(false)
      // }, 500);

    }}
    maskClosable={false}
    width={1000}
  >
    {isLoading ? <div
      style={{
        textAlign: 'center', height: '100px',
      }}
    >
      <Spin
        spinning={isLoading}
        tip="Loading ..."
      />
    </div> :
      <div>
        {listAddress && listAddress.length > 0
          ? listAddress.map((val) => <Card style={{ cursor: 'pointer' }} onClick={() => selectNewAddress(val)}>{val.all}</Card>)
          : (
            <Card>
              <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '20px' }}>ไม่พบข้อมูล</div>
            </Card>
          )}
        <Form>
          <Form.Item
            style={{ margin: '20px 0 8px 0' }}
          >
            <Button
              type="default"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setIsShowModal(false)
                // setTimeout(() => {
                  setShowChangeAddress(false)
                // }, 500);
              }}
              style={{ width: '100px', float: 'right', marginLeft: 15 }}
            >
              {t('cancel-modal')}
            </Button>
            {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: '100px', float: 'right' }}
            // onClick={() => dispatch(allAction.storeSellAction.setActionModal('create'))}
          >
            {t('setting-agency-degree-add')}
          </Button> */}
          </Form.Item>
        </Form>

      </div>
    }
  </Modal >
};

export default ChangeAddressMain;
