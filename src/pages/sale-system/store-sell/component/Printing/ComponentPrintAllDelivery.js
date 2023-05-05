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
import { Button } from 'antd';

const ComponentPrintAllDelivery = ({
  form,
  refPropWithAnotherName,
  toPrint,
  setPrintReady,
}) => {
  const { date, senderName, senderLastName, senderInput, addressSender } =
    form.getFieldValue();

  const [itemStoreSell, setItemStoreSell] = useState(null);
  const [formData, setFormData] = useState(form);

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

  const detailPrintOrder = useSelector(
    (state) => state.storeSellReducer.detailPrintOrder
  );


  useEffect(() => {
    if (itemStoreSell) {
      setPrintReady(new Date());
    }
  }, [itemStoreSell, toPrint]);

  useEffect(() => {
    if (toPrint) {
      if (form.getFieldValue()?.itemStoreSell.length > 0) {
        setFormData(form.getFieldValue());
        setItemStoreSell(form.getFieldValue()?.itemStoreSell);
      }
    }
  }, [toPrint]);

  return (
    <div ref={refPropWithAnotherName}>
      {itemStoreSell &&
        itemStoreSell.map((item) => {
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
          } = item;

          return (
            <div
              id="print_area"
              style={{
                width: '90%',
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 50,
                pageBreakAfter: 'always',
              }}
            >
              <table
                style={{
                  height: '100%',
                  width: '100%',
                  border: '0px solid black',
                }}
              >
                <tr>
                  <td
                    style={{
                      textAlign: 'top',
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontFamily: 'Arail',
                        borderCollapse: 'collapse',
                        border: '0px solid black',
                      }}
                    >
                      <tr>
                        <td
                          style={{
                            width: '40%',
                          }}
                        >
                          เลขที่ : {doNo}
                        </td>
                        <td>ใบส่ง EXPRESS</td>

                        <td
                          style={{
                            textAlign: 'right',
                            fontSize: '14px',
                          }}
                        >
                          {' '}
                          {formData?.date}
                        </td>
                      </tr>
                    </table>

                    <table
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontFamily: 'Arail',
                        border: '0px solid black',
                      }}
                    >
                      <tr>
                        <td
                          style={{
                            width: '50%',
                            textAlign: 'left',
                          }}
                        >
                          ผู้ส่ง : {senderName}{' '}
                          {senderLastName === '-' ? '' : `${senderLastName} `}
                          {/* {senderInput} */}
                        </td>
                        <td
                          style={{
                            width: '50%',
                            textAlign: 'left',
                          }}
                        >
                          ผู้รับ : {recipientName} {recipientLastName}{' '}
                          {recipientInput}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: '50%',
                            text: 'top',
                            textAlign: 'left',
                            verticalalign: 'top',
                            fontSize: '12px',
                            fontFamily: 'Arail',
                          }}
                        >
                          ที่อยู่ : เลขที่ {addressSender}
                        </td>

                        <td
                          style={{
                            width: '50%',
                            textAlignVertical: 'top',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontFamily: 'Arail',
                          }}
                        >
                          ที่อยู่ : {`เลขที่ ${recipientNo}`}
                          {recipientMoo !== '-' &&
                            recipientMoo &&
                            ` หมู่ ${recipientMoo}`}
                          {recipientAlley !== '-' &&
                            recipientAlley &&
                            ` ซ.${recipientAlley}`}
                          {recipientRoad !== '-' &&
                            recipientRoad &&
                            ` ถ.${recipientRoad}`}
                          {recipientSubdistrictName &&
                            ` ต.${recipientSubdistrictName}`}
                          {recipientDistrictName &&
                            ` อ.${recipientDistrictName}`}
                          {recipientProvinceName &&
                            ` จ.${recipientProvinceName}`}
                          {recipientPostcode && ` ${recipientPostcode}`}
                          {recipientOther && ` ${recipientOther}`}
                        </td>
                      </tr>
                    </table>

                    <table
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontFamily: 'Arail',
                        border: '0px solid black',
                      }}
                    >
                      <tr>
                        <td
                          style={{
                            width: '20%',
                            textAlign: 'left',
                          }}
                        >
                          นัดส่ง :
                        </td>

                        <td
                          style={{
                            width: '30%',
                            textAlign: 'left',
                          }}
                        >
                          เลขอื่นๆ : EXPRESS
                        </td>
                        <td align="left">{recipientProvinceName}</td>
                        <td align="left">{recipientDistrictName}</td>
                        <td align="left">{recipientSubdistrictName}</td>
                      </tr>
                    </table>

                    <hr color="black" size="1" />

                    <table
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontFamily: 'Arail',
                        border: '0px solid black',
                      }}
                    >
                      <tr>
                        <td align="center" width="15%">
                          จำนวนชิ้น
                        </td>
                        <td align="center" width="15%">
                          น้ำหนัก
                        </td>
                        <td align="center" width="15%">
                          ปริมาตร
                        </td>
                        <td align="right" rowspan="2">
                          <table
                            style={{
                              width: '55%',
                              textAlign: 'center',
                              fontSize: '14px',
                              fontFamily: 'Arail',
                              borderCollapse: 'collapse',
                              border: '1px solid black',
                            }}
                          >
                            <tr
                              style={{
                                borderCollapse: 'collapse',
                                border: '1px solid black',
                              }}
                            >
                              <td>COD เก็บปลายทาง</td>
                            </tr>

                            <tr
                              style={{
                                borderCollapse: 'collapse',
                                border: '1px solid black',
                              }}
                            >
                              <td>{parseFloat(cod) > 0.0 ? cod : ''}&nbsp;</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" width="15%">
                          1
                        </td>
                        <td align="center" width="15%">
                          {weight}
                        </td>
                        <td align="center" width="15%">
                          {dimension}
                        </td>
                      </tr>
                    </table>

                    <table
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontFamily: 'Arail',
                        borderCollapse: 'collapse',
                        border: '0px solid black',
                      }}
                    >
                      <tr>
                        <td>หมายเหตุ :</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      textAlign: 'bottom',
                    }}
                  >
                    {/* <hr color="black" size="1" /> */}
                    {remark}
                    <br />
                    <table
                      style={{
                        position: 'fixed',
                        bottom: '80px',
                        width: '87%',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontFamily: 'Arail',
                        borderCollapse: 'collapse',
                        border: '0px solid black',
                      }}
                    >
                      <tr>
                        <td colspan="3">
                          <hr color="black" size="1" />
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          กรุณาตรวจสอบสินค้าให้ครบถ้วนก่อนลงชื่อตัวบรรจงและประทับตรา
                        </td>
                        <td>ตราประทับ (ถ้ามี)</td>
                      </tr>
                      <tr>
                        <td>ลงชื่อ.....................ผู้ส่งสินค้า</td>

                        <td
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          ลงชื่อ.....................ผู้รับสินค้า
                        </td>
                        <td />
                      </tr>
                      <tr>
                        <td>รหัส/ทะเบียน..........วันที่.../.../....</td>
                        <td
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          วันที่.../.../......
                        </td>
                        <td />
                      </tr>
                      <tr>
                        <td colspan="3">
                          ติดต่อลูกค้าสัมพันธ์{' '}
                          {detailPrintOrder?.agencyData?.hubData?.phoneNo}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          );
        })}
    </div>
  );
};

export default ComponentPrintAllDelivery;
