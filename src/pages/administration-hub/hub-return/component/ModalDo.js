import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  message,
  Form,
  Input,
  Card,
  InputNumber,
  Modal,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../../app/actions';

const ModalDo = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [doNo, setDoNo] = useState('');
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

  const itemLayout = {
    xs: 24,
    sm: 12,
    md: 8,
  };

  const {
    data, showModal, onOk, onCancel,
  } = props;

  useEffect(() => {
    form.resetFields();
    if (showModal) {
      if (data?.orderData) {
        setDoNo(data?.doNo);
        const newValue = {
          customerName: data?.orderData?.customerName
            ? `${data?.orderData?.customerName} ${data?.orderData?.customerLastName || ''
            }`
            : '',
          customerAddress: renderAddressCustomer(data?.orderData),
          customerInput: data?.orderData?.customerInput || '',
          senderName: data?.orderData?.senderName
            ? `${data?.orderData?.senderName} ${data?.orderData?.senderLastName || ''
            }`
            : '',
          senderAddress: renderAddressSender(data?.orderData),
          senderInput: data?.orderData?.senderInput || '',
          recipientName: data?.orderData?.senderName
            ? `${data?.orderData?.senderName} ${data?.orderData?.senderLastName || ''
            }`
            : '',
          recipientAddress: renderAddressSender(data?.orderData),
          recipientInput: data?.orderData?.senderInput || '',
          parcelTypeId: data?.parcelTypeData?.category || '-',
          cod: data?.cod || '',
          ratePercent: data?.ratePercent ? `${data.ratePercent} %` : '0.00 %',
          transportationTypeCode:
            data?.transportationType?.transportationTypeName || '',
          weight: data?.weight || '0.00',
          width: data?.width || '0.00',
          height: data?.height || '0.00',
          length: data?.length || '0.00',
          transportationPrice: data?.transportationPrice,
          transportationPrice2: data?.transportationPrice
            ? (Number(data?.transportationPrice) / 2).toFixed(2)
            : '0.00',
          doNo: data?.doNo,
          orderItemId: data?.orderItemId,
          companyId: data?.orderData?.agencyData?.companyId,
        };
        dispatch(
          allAction.storeCustomeAction.getStoreCustomerDetail(
            data?.orderData?.customerId,
          ),
        )
          .then((val) => {
            newValue.customerRete = val?.discountRate || '0.00';
            (newValue.transportationNetPrice = data?.transportationPrice
              ? (
                Number(data?.transportationPrice / 2)
                - ((val?.discountRate || 0) / 100) * Number(data?.transportationPrice / 2)
              ).toFixed(2)
              : '0.00'),
              form.setFieldsValue(newValue);
          })
          .catch((e) => message.error(e.message));
      }
    }
    return () => {
      dispatch(allAction.hubListSellAction.clearData())
        .then()
        .catch((e) => message.error(e.message));
    };
  }, [showModal]);

  const renderAddressCustomer = (val) => {
    let addressRes = '';
    const moo = val?.customerMoo
      ? `${t('address-village')}${val.customerMoo}`
      : '';
    const alley = val?.customerAlley
      ? `${t('address-lane')}${val.customerAlley}`
      : '';
    const road = val?.customerRoad
      ? `${t('address-road')}${val.customerRoad}`
      : '';
    const subdistrict = val?.customerSubdistrictData?.subdistrictName
      ? `${t('address-sub-district2')}${val.customerSubdistrictData?.subdistrictName
      }`
      : '';
    const district = val?.customerDistrictData?.districtName
      ? `${t('address-district2')}${val.customerDistrictData?.districtName}`
      : '';
    const provice = val?.customerProvinceData?.provinceName
      ? `${t('address-provice2')}${val.customerProvinceData?.provinceName}`
      : '';
    const postcode = val?.customerPostcode ? `${val.customerPostcode}` : '';
    addressRes = `${val?.customerNo} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;
    return addressRes;
  };

  const renderAddressSender = (val) => {
    let addressRes = '';
    const moo = val?.senderMoo ? `${t('address-village')}${val.senderMoo}` : '';
    const alley = val?.senderAlley
      ? `${t('address-lane')}${val.senderAlley}`
      : '';
    const road = val?.senderRoad ? `${t('address-road')}${val.senderRoad}` : '';
    const subdistrict = val?.senderSubdistrictData?.subdistrictName
      ? `${t('address-sub-district2')}${val.senderSubdistrictData?.subdistrictName
      }`
      : '';
    const district = val?.senderDistrictData?.districtName
      ? `${t('address-district2')}${val.senderDistrictData?.districtName}`
      : '';
    const provice = val?.senderProvinceData?.provinceName
      ? `${t('address-provice2')}${val.senderProvinceData?.provinceName}`
      : '';
    const postcode = val?.senderPostcode ? `${val.senderPostcode}` : '';
    addressRes = `${val?.senderNo} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;
    return addressRes;
  };

  const renderAddressRecipient = (val) => {
    let addressRes = '';
    const moo = val?.recipientMoo
      ? `${t('address-village')}${val.recipientMoo}`
      : '';
    const alley = val?.recipientAlley
      ? `${t('address-lane')}${val.recipientAlley}`
      : '';
    const road = val?.recipientRoad
      ? `${t('address-road')}${val.recipientRoad}`
      : '';
    const subdistrict = val?.recipientSubdistrictData?.subdistrictName
      ? `${t('address-sub-district2')}${val.recipientSubdistrictData?.subdistrictName
      }`
      : '';
    const district = val?.recipientDistrictData?.districtName
      ? `${t('address-district2')}${val.recipientDistrictData?.districtName}`
      : '';
    const provice = val?.recipientProvinceData?.provinceName
      ? `${t('address-provice2')}${val.recipientProvinceData?.provinceName}`
      : '';
    const postcode = val?.recipientPostcode ? `${val.recipientPostcode}` : '';
    addressRes = `${val?.recipientNo} ${moo} ${alley} ${road} ${subdistrict} ${district} ${provice} ${postcode}`;
    return addressRes;
  };

  const calTransItem = () => {
    const keys = form.getFieldsValue();

    if (
      Number(keys.weight || 0)
      && Number(keys.height || 0)
      && Number(keys.length || 0)
      && Number(keys.width || 0)
    ) {
      const totalTransportationPrice = 0;
      const totalNettransportationPrice = 0;

      // const itemSs = keys.itemStoreSell[key];
      const comId = data?.orderData?.agencyData?.companyId || keys.companyId;
      const weight = Number(keys.weight || 0);
      const dimension = Number(keys.height || 0)
        + Number(keys.length || 0)
        + Number(keys.width || 0);
      const body = {
        companyId: comId,
        province: data?.recipientProvinceData?.provinceName || null,
        district: data?.recipientDistrictData?.districtName || null,
        subDistrict: data?.recipientSubdistrictData?.subdistrictName || null,
      };
      dispatch(
        allAction.settingTransportAction.calculate(
          comId,
          weight || 0,
          dimension,
        ),
      )
        .then((res) => {
          dispatch(allAction.storeSellAction.getPriceSpecialArea(body)).then(
            (dataS) => {
              // keys.transportationPrice = Number(res) + Number(data);
              // keys.transportationNetPrice = Number(res) + Number(data) + Number(keys.chargeCodPrice || 0);
              let transP = 0;
              if (Number(res) > Number(dataS)) {
                transP = Number(res);
              } else {
                transP = Number(dataS);
              }
              form.setFieldsValue({
                ...keys,
                transportationPrice: transP,
                transportationNetPrice:
                  transP + Number(keys.chargeCodPrice || 0),
              });
            },
          );
        })
        .catch((e) => {
          message.error(e.message);
        });
    }
  };

  const updateDo = () => {
    const keys = form.getFieldValue();
    const { orderItemId } = keys;
    dispatch(allAction.hubReturn.createOrderHubReturn({ orderItemId }))
      .then(() => {
        dispatch(allAction.hubReturn.getOrderHubReturn())
          .then()
          .catch((e) => message.error(e.message));
        message.success('Create Return Order Success!');
      })
      .catch((e) => {
        message.error(e.message);
      });
    onCancel();
  };

  const renderContent = () => (
    <Form
      name="store-sell"
      form={form}
      {...formItemLayout}
      // onFinish={(e) => onFinish(e)}
      onSubmit={() => console.log('submit')}
    >
      <Card bodyStyle={{ padding: 5 }}>
        <Row>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('customer-name')}
              name="customerName"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('address')}
              name="customerAddress"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 10 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('phone')}
              name="customerInput"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('sender-name')}
              name="senderName"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('address')}
              name="senderAddress"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 10 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('phone')}
              name="senderInput"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('recipient-name')}
              name="recipientName"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('address')}
              name="recipientAddress"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 10 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('phone')}
              name="recipientInput"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col flex="1 1 100px">
            <Form.Item
              labelCol={{ xs: 8 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('package-type')}
              name="parcelTypeId"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('cod')}
              name="cod"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('rate')}
              name="ratePercent"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              style={{ marginBottom: 8 }}
              label={t('type')}
              name="transportationTypeCode"
            >
              <Input size="small" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col flex="1 1 100px">
            <Form.Item
              style={{ marginBottom: 1 }}
              label={t('weight')}
              labelCol={{ xs: 8 }}
              wrapperCol={{ xs: 24 }}
              name="weight"
              rules={[
                {
                  required: true,
                  message: 'Please input your weight!',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="small"
                onBlur={(event) => {
                  calTransItem();
                }}
                disabled
                precision={3}
                step="0.001"
                onChange={(e) => {
                  // calWeightItem(e);
                }}
              />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item
              style={{ marginBottom: 1 }}
              label={t('wide')}
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              name="width"
              rules={[
                {
                  required: true,
                  message: 'Please input your width!',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="small"
                disabled
                onBlur={(event) => {
                  calTransItem();
                }}
                precision={3}
                step="0.001"
                onChange={(e) => {
                  // calWeightItem(e);
                }}
              />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item
              style={{ marginBottom: 1 }}
              label={t('long')}
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              name="length"
              rules={[
                {
                  required: true,
                  message: 'Please input your length!',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="small"
                disabled
                onBlur={(event) => {
                  calTransItem();
                }}
                precision={3}
                step="0.001"
                onChange={(e) => {
                  // calWeightItem(e);
                }}
              />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item
              style={{ marginBottom: 1 }}
              label={t('high')}
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              name="height"
              rules={[
                {
                  required: true,
                  message: 'Please input your height!',
                },
              ]}
            >
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                disabled
                onBlur={(event) => {
                  calTransItem();
                }}
                precision={3}
                step="0.001"
                onChange={(e) => {
                  // calWeightItem(e);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 6 }}
              wrapperCol={{ xs: 24 }}
              label={t('shipping-cost')}
              name="transportationPrice"
              style={{ marginBottom: 8 }}
            // extra={<div style={{ fontSize: '12px' }}>กxยxส</div>}
            >
              <Input
                size="small"
                disabled
                style={{
                  backgroundColor: '#D5F3DB',
                  color: '#535353',
                }}
              />
            </Form.Item>
          </Col>
          <Col {...itemLayout}>
            {/* <Form.Item
              labelCol={{ xs: 10 }}
              wrapperCol={{ xs: 24 }}
              label={t('rate')}
              name="customerRete"
              style={{ marginBottom: 8 }}
            // extra={<div style={{ fontSize: '12px' }}>กxยxส</div>}
            >
              <Input
                size="small"
                disabled
                style={{
                  backgroundColor: '#D5F3DB',
                  color: '#535353',
                }}
              />
            </Form.Item> */}
          </Col>
          <Col {...itemLayout}>
            <Form.Item
              labelCol={{ xs: 10 }}
              wrapperCol={{ xs: 24 }}
              label={"ค่าขนส่งพัสดุคืน"}
              // name="transportationNetPrice"
              name="transportationPrice2"
              style={{ marginBottom: 8 }}
            // extra={<div style={{ fontSize: '12px' }}>กxยxส</div>}
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
      </Card>
    </Form>
  );

  const modalDo = () => (
    <Modal
      title={(
        <Typography.Title
          level={4}
          style={{
            color: '#264B9B',
            alignItems: 'center',
            margin: 'auto',
          }}
        >
          {console.log('dataDo', data)}
          {`DO: ${doNo}`}
        </Typography.Title>
      )}
      centered
      visible={showModal}
      onOk={updateDo}
      // okButtonProps={{
      //   disabled: !data?.isChecked,
      // }}
      okText={t('hub-return')}
      cancelText={t('cancel-modal')}
      onCancel={() => onCancel()}
      width={1000}
    >
      {renderContent()}
    </Modal>
  );

  return <div>{modalDo()}</div>;
};

export default ModalDo;
