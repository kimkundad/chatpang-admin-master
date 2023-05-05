/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-multi-str

import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import Barcode from 'react-barcode';
import QRCode from 'react-qr-code';
import { useSelector, useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

import { Button } from 'antd';

import "./Printing.css"

const ComponentToPrint = ({
  index,
  form,
  refPropWithAnotherName,
  toPrint,
  setPrintReady,
}) => {
  const { date, senderName, senderLastName, senderInput, addressSender } =
    form.getFieldValue();

  const detailPrintOrder = useSelector(
    (state) => state.storeSellReducer.detailPrintOrder
  );

  const {
    doNo,
    recipientName,
    recipientLastName,
    recipientNo,
    recipientInput,
    recipientMoo,
    recipientAlley,
    recipientRoad,
    recipientSubdistrictName,
    recipientDistrictName,
    recipientProvinceName,
    recipientPostcode,
    recipientOther,
    dimension,
    weight,
    cod,
    remark,
    transportationTypeCode,
  } = form.getFieldValue().itemStoreSell[index];

  // const months_th = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const months_th_mini = [
    '',
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];

  useEffect(() => {
    console.log('useEffect', form.getFieldValue().itemStoreSell[index]);
    if (toPrint) {
      setPrintReady(new Date());
    }
  }, [toPrint]);

  useEffect(() => {
    // console.log('detailPrintOrder', detailPrintOrder);
    if (detailPrintOrder) console.log('detailPrintOrder', detailPrintOrder);
  }, [detailPrintOrder]);

  return (
    <div class="printing" ref={refPropWithAnotherName}>
      <div
        id="print_area"
        style={{
          width: 470,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 440,
            marginBottom: 10,
            paddingRight: 15,
          }}
        >
          <div style={{ flex: 1 }}>
            <Barcode
              value={doNo}
              height={50}
              options={
                {
                  // width: 2,
                  // height: 20,
                  // format: 'CODE128',
                  // displayValue: true,
                  // fontOptions: '',
                  // font: 'monospace',
                  // textAlign: 'center',
                  // textPosition: 'bottom',
                  // textMargin: 2,
                  // fontSize: 20,
                  // background: '#ffffff',
                  // lineColor: '#000000',
                  // margin: 10,
                  // marginTop: undefined,
                  // marginBottom: undefined,
                  // marginLeft: undefined,
                  // marginRight: undefined,
                }
              }
            />
            {/* <img width="280" src="https://wanpra.com/tmp/barcode.png" /> */}
            {/* <br />
            <span style={{ fontSize: '20px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>{doNo}</span> */}
          </div>
          <div style={{ alignItems: 'end' }}>
            {/* cod-ex,customerid , do */}
            <QRCode
              value={`${transportationTypeCode}|${senderInput}|${doNo}`}
              size={100}
            />
            {/* <img
              width="80"
              src="https://boofcv.org/images/3/35/Example_rendered_qrcode.png"
            /> */}
          </div>
        </div>

        <table
          style={{
            width: '100%',
            textAlign: 'left',
            fontSize: '18px',
            fontFamily: 'sans-serif',
            borderCollapse: 'collapse',
            border: '1px solid black',
          }}
        >
          <tr>
            <td colSpan="3">
              ผู้ส่ง {senderName}{' '}
              {senderLastName === '-' ? '' : `${senderLastName} `}
              {/* {senderInput} */}
            </td>
          </tr>
          <tr>
            <td colSpan="3">เลขที่ {addressSender}</td>
          </tr>
          <tr
            style={{
              textAlign: 'center',
              borderCollapse: 'collapse',
              border: '1px solid black',
            }}
            // style="text-align:center; border-collapse: collapse; border: 1px solid black;"
          >
            <td
              style={{ borderCollapse: 'collapse', border: '1px solid black' }}
              // style="border-collapse: collapse; border: 1px solid black;"
            >
              {detailPrintOrder?.agencyData?.agencyCode}
            </td>
            <td
              style={{
                textAlign: 'left',
                borderCollapse: 'collapse',
                border: '1px solid black',
              }}
              // style="text-align:left; border-collapse: collapse; border: 1px solid black;"
            >
              Weight : {weight}
            </td>
            <td
              style={{
                borderCollapse: 'collapse',
                border: '1px solid black',
                fontWeight: 'bold',
              }}
              // style="border-collapse: collapse; border: 1px solid black; font-weight:bold;"
            >
              {parseFloat(cod) > 0.0 ? 'COD' : ' '}
            </td>
          </tr>
          <tr
            style={{
              textAlign: 'center',
              borderCollapse: 'collapse',
              border: '1px solid black',
            }}
            // style="text-align:center; border-collapse: collapse; border: 1px solid black;"
          >
            <td
              style={{
                width: '33%',
                borderCollapse: 'collapse',
                border: '1px solid black',
              }}
              // style="border-collapse: collapse; border: 1px solid black;"
            >
              {detailPrintOrder?.agencyData?.hubData?.hubCode}
            </td>
            <td
              style={{
                width: '33%',
                textAlign: 'left',
                borderCollapse: 'collapse',
                border: '1px solid black',
              }}
              // style="text-align:left; border-collapse: collapse; border: 1px solid black;"
            >
              LWH : {dimension}
            </td>
            <td
              style={{
                width: '33%',
                borderCollapse: 'collapse',
                border: '1px solid black',
                fontWeight: 'bold',
              }}
              // style="border-collapse: collapse; border: 1px solid black; font-weight:bold;"
            >
              {parseFloat(cod) > 0.0 ? cod : ' '}
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              ผู้รับ {recipientName} {recipientLastName} {recipientInput}
            </td>
          </tr>
          <tr>
            {/* doNo, recipientName, recipientLastName,
    recipientNo, recipientInput,
    recipientMoo, recipientAlley, recipientRoad,
    recipientSubdistrictName, recipientDistrictName, recipientProvinceName, recipientPostcode,
    recipientOther, */}
            <td colSpan="3">
              {`เลขที่ ${recipientNo}`}
              {recipientMoo !== '-' && recipientMoo && ` หมู่ ${recipientMoo}`}
              {recipientAlley !== '-' &&
                recipientAlley &&
                ` ซ.${recipientAlley}`}
              {recipientRoad !== '-' && recipientRoad && ` ถ.${recipientRoad}`}
              {recipientSubdistrictName && ` ต.${recipientSubdistrictName}`}
              {recipientDistrictName && ` อ.${recipientDistrictName}`}
              {recipientProvinceName && ` จ.${recipientProvinceName}`}
              {recipientPostcode && ` ${recipientPostcode}`}
              {recipientOther && ` ${recipientOther}`}
            </td>
          </tr>
          <tr
            style={{
              textAlign: 'center',
              borderCollapse: 'collapse',
              border: '1px solid black',
            }}
          >
            <td
              style={{ borderCollapse: 'collapse', border: '1px solid black' }}
            >
              {recipientProvinceName}
            </td>
            <td
              style={{ borderCollapse: 'collapse', border: '1px solid black' }}
            >
              {recipientDistrictName}
            </td>
            <td
              style={{ borderCollapse: 'collapse', border: '1px solid black' }}
            >
              {recipientSubdistrictName}
            </td>
          </tr>
          <tr>
            <td colSpan="3">หมายเหตุ : {remark || '-'}</td>
          </tr>
        </table>
        <table border="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tr>
            <td
              style={{
                verticalAlign: 'top',
                textAlign: 'left',
                fontSize: '18px',
                fontFamily: 'sans-serif',
              }}
            >
              ติดต่อลูกค้าสัมพันธ์{' '}
              {detailPrintOrder?.agencyData?.hubData?.phoneNo}
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: 'top',
                textAlign: 'right',
                fontSize: '18px',
                fontFamily: 'sans-serif',
              }}
            >
              {moment(date).format('D')}-
              {months_th_mini[parseInt(moment(date).format('M'))]}-
              {parseInt(moment(date).format('YYYY')) + 543}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default ComponentToPrint;
