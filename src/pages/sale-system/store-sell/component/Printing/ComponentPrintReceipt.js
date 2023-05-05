/* eslint-disable */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-multi-str

import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import Barcode from 'react-barcode';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
} from 'antd';

const ComponentPrintReceipt = ({
  form, refPropWithAnotherName,
  toPrint, setPrintReady,
}) => {
  const {
    date, senderName, senderLastName, senderInput, addressSender,
  } = form.getFieldValue();

  const [itemStoreSell, setItemStoreSell] = useState(null);
  const [formData, setFormData] = useState(form);

  // const months_th = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const months_th_mini = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  const detailPrintOrder = useSelector(
    (state) => state.storeSellReducer.detailPrintOrder
  );

  useEffect(() => {
    if (itemStoreSell) {
      console.log("formData", formData)
      console.log("itemStoreSell", itemStoreSell)
      setPrintReady(new Date());
    }
  }, [itemStoreSell, toPrint])

  useEffect(() => {
    console.log('toPrint');



    // recipientName = form.getFieldValue()?.itemStoreSell[0];

    if (toPrint) {
      if (form.getFieldValue()?.itemStoreSell.length > 0) {
        setFormData(form.getFieldValue())
        setItemStoreSell(form.getFieldValue()?.itemStoreSell)
      }
    }
  }, [toPrint]);

  const recieptHead = (fData) => {
    const billingNo = fData?.billingNo
    const date = fData?.date
    const senderName = fData?.senderName
    const senderLastName = fData?.senderLastName
    const senderInput = fData?.senderInput
    const addressSender = fData?.addressSender
    const amountItems = fData?.itemStoreSell?.length
    const totalPrice = fData?.totalPrice
    const discountAmount = fData?.discountAmount
    const morePriceAmount = fData?.morePriceAmount
    const etcAmount = fData?.etcAmount
    const totalPriceText = fData?.totalPriceText
    const totalTransportationPrice = fData?.totalTransportationPrice
    const totalChargeCodPrice = fData?.totalChargeCodPrice
    const paymentTypeCode = fData?.paymentTypeCode

    return <>
      <table
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '12px',
          fontFamily: 'Verdana,Sans-Serif',
          borderCollapse: 'collapse',
          border: '0px solid black'
        }}
      >
        <tr>
          <td>บริษัท รวมถาวรขนส่ง จำกัด</td>
        </tr>
        <tr>
          <td>2/4 หมูที่ 10 ถนนเทพารักษ์ ตําบลบางปลา</td>
        </tr>
        <tr>
          <td>อําเภอบางพลี จังหวัดสมุทรปราการ 10540</td>
        </tr>
        <tr>
          <td>โทร 0-2312-2929 แฟกซ์0-2312-1190-8</td>
        </tr>
        <tr>
          <td>เลขประจําตัวผู้เสียภาษี 0105545005195</td>
        </tr>
        <tr>
          <td>สํานักงานใหญ่</td>
        </tr>
        <tr
          style={{
            fontSize: '18px'
          }}
        >
          <td>ต้นฉบับใบเสร็จรับเงิน</td>
        </tr>
      </table>

      {/* <!-- Sender --> */}
      <table
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '12px',
          fontFamily: 'Verdana,Sans-Serif',
          borderCollapse: 'collapse',
          border: '0px solid black'
        }}
      >
        <tr>
          <td align="left">เลขที่:</td>
          <td align="left">{billingNo}</td>
          <td align="left">วันที่:</td>
          <td>{date}</td>
        </tr>
        <tr>
          <td align="left">ผู้ส่ง</td>
          <td colspan="3" align="left">
            {' '}
            {senderName}
            {' '}
            {senderLastName === "-" ? "" : `${senderLastName} `}
            {detailPrintOrder?.senderInput && detailPrintOrder?.senderInput}
          </td>
        </tr>
        <tr>
          <td colspan="4" align="left">
            เลขที่
            {' '}
            {addressSender}
          </td>
        </tr>
        <tr>
          <td colspan="4" align="left">
            เลขประจําตัวผู้เสียภาษี : {detailPrintOrder?.taxpayerNumber}
          </td>
        </tr>
      </table>

      {/* <!-- Table Sum Order --> */}
      <table
        style={{
          width: '97%',
          textAlign: 'center',
          fontSize: '12px',
          fontFamily: 'Verdana,Sans-Serif',
          borderCollapse: 'collapse',
          border: '1px solid black'
        }}
      >
        <tr
          style={{
            borderCollapse: 'collapse',
            border: '1px solid black'
          }}
        >
          <td
            style={{
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            รายการ
          </td>

          <td
            style={{
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            จำนวนชิ้น
          </td>

          <td
            style={{
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            จำนวนเงิน
          </td>
        </tr>

        <tr
          style={{
            borderCollapse: 'collapse',
            border: '1px solid black'
          }}
        >
          <td
            style={{
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {amountItems}
          </td>

          <td
            style={{
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {amountItems}
          </td>

          <td
            style={{
              textAlign: 'right',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {parseFloat(parseFloat(totalTransportationPrice) + parseFloat(totalChargeCodPrice)).toFixed(2)}
          </td>
        </tr>

        <tr
          style={{
            borderCollapse: 'collapse',
            border: '1px solid black'
          }}
        >
          <td
            colSpan="2"
            style={{
              textAlign: 'left',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            ส่วนลด
          </td>
          <td
            colSpan="2"
            style={{
              textAlign: 'right',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {discountAmount}
          </td>
        </tr>

        <tr
          style={{
            borderCollapse: 'collapse',
            border: '1px solid black'
          }}
        >
          <td
            colSpan="2"
            style={{
              textAlign: 'left',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            ส่วนเพิ่ม
          </td>
          <td
            colSpan="2"
            style={{
              textAlign: 'right',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {morePriceAmount}
          </td>
        </tr>

        <tr
          style={{
            borderCollapse: 'collapse',
            border: '1px solid black'
          }}
        >
          <td
            colSpan="2"
            style={{
              textAlign: 'left',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            เงินอื่นๆ
          </td>
          <td
            colSpan="2"
            style={{
              textAlign: 'right',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {etcAmount}
          </td>
        </tr>

        <tr
          style={{
            borderCollapse: 'collapse',
            border: '1px solid black'
          }}
        >
          <td
            colSpan="2"
            style={{
              textAlign: 'center',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {totalPriceText}
          </td>
          <td
            colSpan="2"
            style={{
              textAlign: 'right',
              borderCollapse: 'collapse',
              border: '1px solid black'
            }}
          >
            {totalPrice}
          </td>
        </tr>
      </table>

      <table
        style={{
          width: '97%',
          textAlign: 'left',
          fontSize: '12px',
          fontFamily: 'Verdana,Sans-Serif',
          borderCollapse: 'collapse',
          border: '0px solid black'
        }}
      >
        <tr>
          <td>
            หมายเหตุ :
          </td>
        </tr>
      </table>

      <br />

      <table
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: '12px',
          fontFamily: 'Verdana,Sans-Serif',
          borderCollapse: 'collapse',
          border: '0px solid black'
        }}
      >
        <tr>
          <td>ชำระโดย</td>
          <td>{paymentTypeCode}</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td colspan="3">บัตรเครดิต................................</td>
        </tr>
        <tr>
          <td>ผู้บันทึกรายการ</td>
          <td>{detailPrintOrder?.name}</td>
        </tr>
        <tr>
          <td colspan="3">
            กรุณาตรวจสอบความถูกต้องทุกครั้ง เอกสารฉบับนี้จะสมบูรณ์ต่อเมื่อ
            บริษัทฯเรียกเก็บเงินตามรายการดังกล่าวได้เรียบร้อยแล้ว
          </td>
        </tr>
        <tr>
          <td colspan="2">ติดต่อลูกค้าสัมพันธ์ โทร {detailPrintOrder?.agencyData?.hubData?.phoneNo}</td>
        </tr>
        <tr>
          <td colspan="3">
            <hr color="black" size="1" />
          </td>
        </tr>
      </table>

      <br />
      {/* <!-- Header --> */}
    </>
  }

  return (
    <div ref={refPropWithAnotherName}>
      <div
        style={{
          width: 300,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10
        }}
      >
        {recieptHead(formData)}
        {itemStoreSell && itemStoreSell.map((item) => {
          const {
            doNo, recipientName, recipientLastName,
            recipientNo, recipientInput,
            recipientMoo, recipientAlley, recipientRoad,
            recipientSubdistrictName, recipientDistrictName, recipientProvinceName, recipientPostcode,
            recipientOther,
            dimension, weight, cod, remark, transportationTypeCode, transportationNetPrice
          } = item;


          return <
            >
            {/* <!-- Track No. --> */}
            <table
              style={{
                width: '100%',
                textAlign: 'left',
                fontSize: '12px',
                fontFamily: 'Verdana,Sans-Serif',
                borderCollapse: 'collapse',
                border: '0px solid black'
              }}
            >
              <tr
                style={{
                  textAlign: 'left',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  fontFamily: 'Verdana,Sans-Serif',
                  borderCollapse: 'collapse',
                  border: '0px solid black'
                }}
              >
                <td>Track No.</td>
                <td>{doNo}</td>
              </tr>
              <tr>
                <td colspan="2">
                  ผู้รับ
                  {' '}
                  {recipientName}
                  {' '}
                  {recipientLastName}
                  {' '}
                  {recipientInput}
                </td>
              </tr>
              <tr>
                <td>Weight : {weight} , LWH : {dimension}</td>
                <td
                  rowspan="6"
                  style={{
                    textAlign: 'center'
                  }}
                >
                  <QRCode value={`https://www.rttgroups.com/zws/itrack.php?docnum=${doNo}`} size={100} />
                </td>
              </tr>
              <tr>
                <td>อัตราค่าบริการ : {transportationNetPrice}</td>
              </tr>
              <tr>
                <td>{recipientProvinceName}</td>
              </tr>
              <tr>
                <td>{recipientDistrictName}</td>
              </tr>
              <tr>
                <td>{recipientSubdistrictName}</td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: 'Verdana,Sans-Serif'
                  }}
                >
                  {parseFloat(cod) > 0.0 ? `COD ${cod}` : ''}&nbsp;
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <hr color="black" size="1" />
                </td>
              </tr>
            </table>
          </>
        })}

        {/* <!-- Footer --> */}
        <table
          style={{
            width: '100%',
            textAlign: 'left',
            fontSize: '12px',
            fontFamily: 'Verdana,Sans-Serif',
            borderCollapse: 'collapse',
            border: '0px solid black'
          }}
        >
          <tr>
            <td>
              * ประกันพัสดุ กรณีสูญหายหรือเสียหาย ตามมูลค่าจริง ไม่เกิน 2,000
              บาท
            </td>
          </tr>
          <tr>
            <td>
              * กรณีมีความประสงค์ ประกันพัสดุ มากกว่า 2,000 บาท
              กรุณาติดต่อเจ้าหน้าที่เพื่อขอซื้อประกันเพิ่มเติม
            </td>
          </tr>
          <tr>
            <td>
              * หากติดต่อผู้รับไม่ได้ภายใน 7 วัน ทางบริษัทจะนําพัสดุกลับ
              ผู้ส่งสามารถรับพัสดุคืน ณ จุดบริการส่งพัสดุต้นทางภายใน 30 วัน
            </td>
          </tr>
          <tr>
            <td>
              * ในกรณีทีเกิดการจัดส่งพัสดุล่าช้าหรือไม่เป็นไปตามที่ระบุไว้
              ทางบริษัทขอสงวนสิทธิ์ไม่รับผิดชอบและไม่คืนเงินทุกประการ
            </td>
          </tr>
          <tr>
            <td>* บริษัทขอสงวนสิทธิ์การเคลมเฉพาะลูกค้าที่มีใบเสร็จเท่านั้น</td>
          </tr>
          <tr>
            <td />
          </tr>
        </table>

        <br />

        <table
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'Verdana,Sans-Serif',
            borderCollapse: 'collapse',
            border: '0px solid black'
          }}
        >
          <tr>
            <td>ผู้ส่งได้รับทราบเงื่อนไขและข้อจํากัดในการจัดส่ง</td>
          </tr>
          <tr>
            <td>สินค้าแล้วยินยอมตกลงด้วย</td>
          </tr>
        </table>
        <br />

        <table
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'Verdana,Sans-Serif',
            borderCollapse: 'collapse',
            border: '0px solid black'
          }}
        >
          <tr>
            <td>ลงชื่อ...............................ผู้ส่ง/รับทราบ</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default ComponentPrintReceipt;
