/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-multi-str

import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Button,
} from 'antd';

import {
  QrcodeOutlined,
} from '@ant-design/icons';

import ComponentPrintReceiptNoPrice from './ComponentPrintReceiptNoPrice';

const ButtonPrintRecieptNoPrice = (props) => {
  const {
    form, label, disabled, onClickItem, style, icon,
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

  return (
    <>
      <Button
        size="small"
        type="primary"
        style={style}
        disabled={disabled}
        onClick={async () => {
          console.log('form--', form.getFieldsValue());
          if (onClickItem !== null) {
            // Save DO and Print
            if (await onClickItem()) {
              setToPrint(new Date());
            }
          } else {
            // Print only
            setToPrint(new Date());
          }
        }}
        icon={icon}
      >
        {label}
      </Button>
      <div style={{ display: 'none' }}>

        <ComponentPrintReceiptNoPrice {...props} setPrintReady={setPrintReady} toPrint={toPrint} refPropWithAnotherName={componentRef} />
      </div>
    </>
  );
};

export default ButtonPrintRecieptNoPrice;
