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
  Descriptions
} from 'antd';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import {
  NumberOutlined, QrcodeOutlined,
} from '@ant-design/icons';

// import ShowNo from "./showNO"

import allAction from '../../../../../app/actions';

// import ButtonPrint from '../Printing/ButtonPrint';
import ButtonPrinting from '../Printing/ButtonPrinting';
// import ItemStoreSellPostcode from "./ItemStoreSellPostcode"
import PrintSticker2 from "../Printing/PrintSticker2"



const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const ItemCardView = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const parcelTypeData = useSelector((state) => state.storeSellReducer.parcelTypeData);



  const myRef = useRef(null);

  const {

    // form,
    // toRemoveAddress,
    // cachePostcode, 
    itemStoreSell,
    form,
    params,
    setShowDoForm,
    setEditingDoNo

  } = props;

  const printSticker = useRef();

  const ItemCardViewRender = () => {
    return (
      <Card
        style={{
          margin: '2px',
          padding: 0,
          // backgroundColor: '#F1F1F1',
        }}
        bodyStyle={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingRight: 20,
          paddingLeft: 20,
        }}
      >
        {memoNotSum()}
        {memoSum()}

      </Card>

    )
  }

  //display field
  const df = (label, txt, type, postfix) => {
    const typeEnum = {
      green: "#d5f3db",
      blue: "#7596de",
    }

    // var bgcolor = "#F5F5F5"
    // if(type) {
    //   bgcolor = typeEnum[type]
    // }

    return <span style={{ display: "flex", }}>{label} :
      <span
        style={{
          flex: 1,
          border: "1px solid #eaeaea",
          backgroundColor: !type ? "#F5F5F5" : typeEnum[type],
          color: type === "blue" ? "white" : null,
          paddingLeft: 5,
          paddingRight: 5,
          marginLeft: 5,
          marginRight: postfix === "" ? 0 : postfix === "%" ? 5 : 10
        }}>{txt || "-"}
      </span>
      {postfix && <span >{postfix}</span>}
    </span>
  }

  const memoNotSum = () => {
    // console.log("Render memoNotSum")
    return <>
      <div
        style={{
          // marginBottom: 20,
          // border: "1px solid red",
          // backgroundColor: "yellow"
        }}
      >
        {/* <ShowNo form={form} index={index} /> */}
        {itemStoreSell?.rowNo}# &nbsp;
        เลขพัสดุ : <span
        style={{
          flex: 1,
          // border: "1px solid #eaeaea",
          backgroundColor:  "#ffe5b4",
          paddingLeft: 5,
          paddingRight: 5,
          marginLeft: 5,
          // marginRight: postfix === "" ? 0 : postfix === "%" ? 5 : 10
        }}>{itemStoreSell?.doNo || '-'}</span>
        {/* <Button
          size="small"
          type="primary"
          danger
          style={{
            float: 'right',
            width: '80px',
            fontSize: '12px',
          }}
          onClick={() => {
            console.log("params",params)
            // toRemoveAddress(remove, index, fields);
          }}
        >
          {t('delete')}
        </Button> */}
        <Button
          size="small"
          type="primary"
          // danger
          style={{
            width: '80px',
            fontSize: '12px',
            float: 'right',
            marginRight: 10,
          }}
          onClick={() => {
            setShowDoForm(true)
            setEditingDoNo(itemStoreSell?.doNo)
            console.log("itemStoreSell?.rowNo",itemStoreSell)
            // setRowNo(params.node.rowIndex + 1)
            // setIsEditing(true)
          }}
        >
          {t('edit')}
        </Button>
        <PrintSticker2
          componentRef={printSticker}
          itemStoreSell={itemStoreSell}
          form={form}>
        </PrintSticker2>

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
        >{t('sticker')}</ButtonPrinting>

      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingTop: 5
          // backgroundColor: "yellow"
        }}>
        <div
          style={{
            flex: 1
          }}>
          {df("เบอร์ผู้รับ", itemStoreSell?.recipientInput)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df("ประเภทพัสดุ",
            itemStoreSell?.parcelTypeId
            &&
            parcelTypeData.find(o =>
              o.parcelTypeId == itemStoreSell?.parcelTypeId)?.category)
          }
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df("ชื่อ", itemStoreSell?.recipientName)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df("นามสกุล", itemStoreSell?.recipientLastName, "", "")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          paddingTop: 5
          // backgroundColor: "yellow"
        }}>
        <div
          style={{
            flex: 1
          }}>
          {df(t('no'), itemStoreSell?.recipientNo)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('address-village'), itemStoreSell?.recipientMoo)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('address-lane'), itemStoreSell?.recipientAlley)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('address-road'), itemStoreSell?.recipientRoad)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('address-other'), itemStoreSell?.recipientOther, "", "")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          paddingTop: 5
          // backgroundColor: "yellow"
        }}>
        <div
          style={{
            flex: 1
          }}>
          {df(t('postcode'), itemStoreSell?.recipientPostcode)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('subdistrict'), itemStoreSell?.recipientSubdistrictData?.subdistrictName)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('district'), itemStoreSell?.recipientDistrictData?.districtName)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('province'), itemStoreSell?.recipientProvinceData?.provinceName, "", "")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          paddingTop: 5
          // backgroundColor: "yellow"
        }}>
        <div
          style={{
            flex: 1
          }}>
          {df(t('weight'), itemStoreSell?.weight)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('wide'), itemStoreSell?.width)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('long'), itemStoreSell?.length)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('high'), itemStoreSell?.height)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('type'), itemStoreSell?.transportationTypeCode)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('cod'), itemStoreSell?.cod)}
        </div>
        <div
          style={{
            flex: 1
          }}>
          {df(t('rate'), itemStoreSell?.ratePercent, "", '%')}
        </div>
      </div>
    </>
  }
  // , [itemStoreSell.doNo])

  const memoSum = () => {
    // console.log("Render memoSum")
    return <>
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingTop: 5
          // backgroundColor: "yellow"
        }}>
        <div
          style={{
            flex: 1
          }}>
          {df(t('remark'), itemStoreSell?.remark)}
        </div>
        <div
          style={{
            width: "170px"
          }}>
          {df(t('shipping-cost'), itemStoreSell?.transportationPrice, "green")}
        </div>
        <div
          style={{
            width: "200px"
          }}>
          {df(t('charge-cod-price'), itemStoreSell?.chargeCodPrice, "green")}
        </div>
        <div
          style={{
            width: "150px"
          }}>
          {df(t('sum'), itemStoreSell?.transportationNetPrice, "blue", "")}
        </div>
      </div>
    </>
  }
  // , [
  //   // caling,
  //   // form.getFieldsValue().totalPrice,
  //   itemStoreSell.doNo,
  //   itemStoreSell.ratePercent
  // ])

  return ItemCardViewRender()
};


export default ItemCardView;


const r2 = (num) => {
  if (num === null) {
    num = 0.0
  }
  return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100
}