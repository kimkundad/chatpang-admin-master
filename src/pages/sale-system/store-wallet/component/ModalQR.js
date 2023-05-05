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

import { GlobalOutlined } from '@ant-design/icons';

import QRCode from 'react-qr-code';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';

const ModalQR = (props) => {


    const { t } = useTranslation();

    const { urlQR, setUrlQR, onQrOk, selectedBank } = props;

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const onCancel = () => {
        setUrlQR(null)
    }

    useEffect(() => {
      console.log("checkSCB3",urlQR)
    }, [urlQR]);
    
    return <>
        <Modal
            title={
                <Typography.Title
                    level={4}
                    style={{
                        color: '#264B9B',
                        alignItems: 'center',
                        margin: 'auto',
                    }}
                >
                    แสกนคิวอาร์โค้ด
                </Typography.Title>
            }
            centered
            visible={urlQR}
            onOk={() => {
                onQrOk()
                setLoading(true)
            }}
            afterClose={() => {
                setLoading(false)
            }}
            confirmLoading={loading}
            okText={"เสร็จสิ้น"}
            cancelText={t('cancel-modal')}
            onCancel={() => onCancel()}
            width={300}
            maskClosable={false}
        >
            <div style={{ textAlign: "center" }} >
                <QRCode
                    value={urlQR}
                    size={200}
                />
                <div>( สำหรับแสกนเพื่อเปิด Mobile Banking )</div>
                {(selectedBank == "SCB" || selectedBank == "BBL") &&
                    <Button
                        type="dashed"
                        // type="primary"
                        style={{ marginTop: 5 }}
                        icon={<GlobalOutlined />}
                        onClick={() => {
                            console.log("checkSCB2", urlQR)
                            window.open(urlQR, '_blank');
                        }}
                    >
                        คลิ๊กที่นี่เพื่อเปิดเวป Internet Banking
                    </Button>
                }
                <div style={{ marginTop: 20 }}>กรุณากดเสร็จสิ้นเมื่อชำระเงินเรียบร้อย</div>
            </div>

        </Modal>
    </>

};

export default ModalQR;
