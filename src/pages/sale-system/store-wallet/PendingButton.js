import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Spin,
    Typography,
    Table,
    Layout,
    message,
    Button,
    Space,
    Modal,
    Image,
    Input,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';

import {
    // useGetEnquiryQuery,
    useLazyGetEnquiryQuery
} from '../../../app/api/walletApi';

import { useRef } from 'react';

const PendingButton = (props) => {


    const { t } = useTranslation();

    const { rowData, pageCode, urlQR } = props;

    const [curStatus, setCurStatus] = useState(rowData.statusCode);

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const [getEnquiry] = useLazyGetEnquiryQuery()

    // const {
    //     data: resultEnquiry,
    //     isFetching,
    //     isLoading,
    //     isSuccess,
    //     // isError,
    //     // error,
    //     refetch,
    // } = useGetEnquiryQuery(rowData.orderId, { skip: isSkip });

    // useEffect(() => {
    //     console.log("isLoading rowData.orderId", rowData.orderId)
    //     console.log("countCall", countCall.current, urlQR)
    // }, [isLoading, isFetching]);

    // useEffect(() => {
    //     console.log("resultEnquiry", resultEnquiry)

    //     if (isSuccess && !(isLoading && isFetching) && resultEnquiry?.statusCode) {
    //         setCurStatus(resultEnquiry?.statusCode)
    //     }
    // }, [isLoading, isFetching]);

    useEffect(() => {
        setCurStatus(rowData.statusCode)
    }, [rowData.orderId]);

    // useEffect(() => {
    //   if(!urlQR) {
    //     reCheck();
    //   }
    // }, [urlQR]);

    const reCheck = () => {
        setIsLoading(true)
        // refetch()
        getEnquiry(rowData.orderId)
            .unwrap()
            .then(data => {
                setCurStatus(data?.statusCode)
                setIsLoading(false)
            })
            .catch((e) => {
                setIsLoading(false)
            })
    }

    const onCancel = () => {

    }

    const onOk = () => {

    }

    return <>
        {
            curStatus == "SUCCESS" ?
                <span style={{ color: "green" }}>SUCCESS</span> :

                curStatus == "PENDING" ?
                    <Button
                        type="primary"
                        size="default"
                        loading={isLoading}
                        onClick={() => {
                            console.log("rowData", rowData)
                            reCheck();
                        }}>
                        PENDING
                    </Button> :
                    <Button
                        type="default"
                        size="small"
                        loading={isLoading}
                        onClick={() => {
                            console.log("rowData", rowData)
                            reCheck();
                        }}>
                        FAIL
                    </Button>

        }
        {/* { curStatus == "PENDING" || curStatus == "FAIL" ?
            <Button 
                type={curStatus == "PENDING" ? "primary" : "default"}
                size={curStatus == "PENDING" ? "default" : "small"}
                loading={isLoading}
                onClick={() => {
                    console.log("rowData", rowData)
                    reCheck();
                }}>
                {curStatus}
            </Button> :
            curStatus == "SUCCESS" ?
                <span style={{ color: "green" }}>SUCCESS</span> :
                <span style={{ color: "red" }}>{curStatus}</span>
        } */}
    </>

};

export default PendingButton;
