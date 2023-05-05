import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from 'antd';


// import ComponentToPrint from './ComponentToPrint';

const ButtonPrinting = (props) => {
    const { componentRef } = props;

    // const [printReady, setPrintReady] = useState(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Button
            // style={props.style}
            // disabled={props.disabled}
            onClick={handlePrint}
            // icon={props.icon}
            {...props}
        >
            {props.children}
        </Button>
    );
};

export default ButtonPrinting;
