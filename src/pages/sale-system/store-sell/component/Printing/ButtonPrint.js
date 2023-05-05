/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-multi-str

import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import allAction from '../../../../../app/actions';
import {
  Button,
} from 'antd';

import {
  QrcodeOutlined,
} from '@ant-design/icons';

import ComponentToPrint from './ComponentToPrint';

const ButtonPrint = (props) => {
  const {
    index, form, label, fieldKey, disabled, onClickItem, orderId
  } = props;

  const [toPrint, setToPrint] = useState(null);
  const [printReady, setPrintReady] = useState(null);

  useEffect(() => {
    if (printReady) handlePrint();
  }, [printReady]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const componentRef = useRef();



  const startPrint = () => {

    // var orderData = form.getFieldValue()
    // console.log("startPrint", form.getFieldValue())
    // dispatch(allAction.storeSellAction.getCustomerDetail(orderId))
    //   .then((data) => {
    //   })

    setToPrint(new Date());
  }

  return (
    <>
      <Button
        size="small"
        type="primary"
        style={{
          float: 'right',
          marginRight: 10,
          marginBottom: 6,
          width: '110px',
          fontSize: '12px',
        }}
        disabled={disabled}
        onClick={async () => {
          console.log("onClickItem")
          if (onClickItem !== null) {
            // Save DO and Print
            if (await onClickItem()) {
              startPrint()
            }
          } else {
            // Print only
            startPrint()
          }
        }}
        icon={<QrcodeOutlined />}
      >
        {label}
      </Button>
      <div style={{ display: 'none' }}>
        <ComponentToPrint {...props} setPrintReady={setPrintReady} toPrint={toPrint} refPropWithAnotherName={componentRef} />
      </div>
    </>
  );
};

export default ButtonPrint;
