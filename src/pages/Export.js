/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
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
} from 'antd';

// eslint-disable-next-line no-multi-str
const htmlString = '<div id="print_area">\
<table border="0" width="470" style="border-collapse: collapse;">\
  <tr>\
    <td style="vertical-align: top; text-align:left">\
      <img width="280" src="https://wanpra.com/tmp/barcode.png"\
    </td>\
    <td rowspan="2" align="right">\
      <img\
      width="80"\
      src="https://boofcv.org/images/3/35/Example_rendered_qrcode.png"\
            />\
    </td>\
  </tr>\
  <tr>\
    <td\
          style="vertical-align: top; text-align:left; font-size:20px; font-family: Verdana,Sans-Serif; font-weight: bold;">\
    210800000001\
        </td>\
      </tr>\
    </table >\
<br />\
<table width="470"\
  style="text-align:left; font-size:18px; font-family: Sans-Serif; border-collapse: collapse; border: 1px solid black;">\
  <tr>\
    <td colspan="3">\
      ผู้ส่ง นาย ณัชพล ราชายนต์ 0939826456s\
    </td>\
  </tr>\
  <tr>\
    <td colspan="3">\
      เลขที่ 89/83 หมู่ 6 ซ.5 ถ.ศรีนครินทร์ ต.บางเมืองใหม่ อ.เมือง\
      จ.สมุทรปราการ 10270\
    </td>\
  </tr>\
  <tr style="text-align:center; border-collapse: collapse; border: 1px solid black;">\
    <td style="border-collapse: collapse; border: 1px solid black;">\
      กรุงเทพ B\
    </td>\
    <td style="text-align:left; border-collapse: collapse; border: 1px solid black;">\
      Weight : 35\
    </td>\
    <td style="border-collapse: collapse; border: 1px solid black; font-weight:bold;">\
      COD\
    </td>\
  </tr>\
  <tr style="text-align:center; border-collapse: collapse; border: 1px solid black;">\
    <td style="border-collapse: collapse; border: 1px solid black;">\
      กรุงเทพ 10\
    </td>\
    <td style="text-align:left; border-collapse: collapse; border: 1px solid black;">\
      LWH : 130\
    </td>\
    <td style="border-collapse: collapse; border: 1px solid black; font-weight:bold;">\
      150\
    </td>\
  </tr>\
  <tr>\
    <td colspan="3">\
      ผู้รับ ดลยา สุทธาพิทักษ์สกุล 0818246091\
    </td>\
  </tr>\
  <tr>\
    <td colspan="3">\
      เลขที 1305/84 หมู่ 4 ซ.ด่านสําโรง 28 ถ.ศรีนครินทร์ ต.สําโรงเหนือ\
      อ.เมือง จ.สมุทรปราการ 10270\
    </td>\
  </tr>\
  <tr style="text-align:center; border-collapse: collapse; border: 1px solid black;">\
    <td style="border-collapse: collapse; border: 1px solid black;">\
      สมุทรปราการ\
    </td>\
    <td style="border-collapse: collapse; border: 1px solid black;">\
      เมือง\
    </td>\
    <td style="border-collapse: collapse; border: 1px solid black;">\
      สำโรงเหนือ\
    </td>\
  </tr>\
  <tr>\
    <td colspan="3">\
      หมายเหตุ : -\
    </td>\
  </tr>\
</table>\
<table border="0" width="470" style="border-collapse: collapse;">\
  <tr>\
    <td style="vertical-align: top; text-align:left; font-size:18px; font-family: Verdana,Sans-Serif;">\
      ติดต่อลูกค้าสัมพันธ์\
    </td>\
  </tr>\
  <tr>\
    <td style="vertical-align: top; text-align:right; font-size:18px; font-family: Verdana,Sans-Serif;">\
      24-ส.ค.-2564\
    </td>\
  </tr>\
</table>\
<p>\
</p>\
  </div >';

const Export = (props) => {
  const {
    match: {
      params: { orderId },
    },
  } = props;

  console.log('orderCode : ', orderId);

  const clickHandler = (_e) => {
    const a = window.open('', '', 'height=500, width=500');
    a.document.write('<html><body>');
    a.document.write(document.getElementById('print_area').innerHTML);
    a.document.write('<script> setTimeout(() => window.close(), 1000)</script>');
    a.document.write('</body></html>');
    a.document.close();
    a.print();
  };

  const createMarkup = (value) => ({ __html: value });

  // const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const componentRef = useRef();
  return (
    <>
      {/* <ReactToPrint
        trigger={() => <a href="#">Print this out!</a>}
        content={() => componentRef.current}
      /> */}
      <Button onClick={handlePrint}>Print this out!</Button>
      <div style={{ display: 'none' }}>
        <ComponentToPrint refPropWithAnotherName={componentRef} />
      </div>
    </>
  );

  // return (
  //   <div>
  //     <ComponentToPrint ref={componentRef} />
  //     <button onClick={handlePrint}>Print this out!</button>
  //   </div>
  // );

  // return (
  //   // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  //   <div style={{
  //     display: 'flex',
  //     padding: 10,
  //     justifyContent: 'center',
  //     // flexDirection: 'column',
  //     // border: '1px gray solid',
  //   }}
  //   >

  //     <div>
  //       <div style={{ textAlign: 'right' }}>
  //         <Button onClick={() => {
  //           window.close();
  //         }}
  //         >
  //           Cancel
  //         </Button>
  //         <Button
  //           style={{
  //             marginLeft: 20, marginTop: 0, marginBottom: 20, width: 200, height: 50,
  //           }}
  //           type="primary"
  //           onClick={() => {
  //             clickHandler();
  //             setTimeout(() => window.close(), 2000);
  //           }}
  //         >
  //           Print
  //         </Button>
  //       </div>
  //       <div
  //         style={{
  //           padding: 20,
  //           border: '1px gray solid',
  //         }}
  //         dangerouslySetInnerHTML={createMarkup(htmlString)}
  //       />
  //     </div>
  //   </div>
  // );
};

const ComponentToPrint = ({ refPropWithAnotherName }) => (
  <div ref={refPropWithAnotherName}>
    <p>hello</p>
  </div>
);

// const ComponentToPrint = (props) => (
//   <table>
//     <thead>
//       <th>column 1</th>
//       <th>column 2</th>
//       <th>column 3</th>
//     </thead>
//     <tbody>
//       <tr>
//         <td>data 1</td>
//         <td>data 2</td>
//         <td>data 3</td>
//       </tr>
//     </tbody>
//   </table>
// );
export default Export;
