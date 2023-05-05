/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable quotes */
/* eslint-disable prefer-template */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable max-len */
/* eslint-disable no-const-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import {
    Form,
    Button,
    Row,
    Col,
    Spin,
    Typography,
    Card,
    Avatar,
    Table,
} from 'antd';
import { useHistory } from 'react-router-dom';

import {
    RollbackOutlined,
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { fetch } from '../../utils/fetch';

const HistoryDetail = (props) => {
    const { isMobile } = useSelector((state) => state.mainReducer);
    const [detail, setDetail] = useState({});
    const [paymentDetail, setPaymentDetail] = useState([]);

    const {
        match: {
            params: { historyId },
        },
    } = props;

    const [loading, setLoadIng] = useState(false);

    const history = useHistory();

    useEffect(() => {
        async function fetchMyAPI() {
            callDetail(historyId);
        }
        fetchMyAPI();
    }, []);

    // eslint-disable-next-line no-shadow
    const callDetail = async (historyId) => {
        setLoadIng(true);
        fetch({
            method: 'get',
            url: '/facebook-users/' + historyId,
        })
            .then((res) => {
                const { data } = res.data;
                setDetail(data);
                fetch({
                    method: 'get',
                    url: '/purchases/' + data.id + '/facebook-user',
                })
                    .then((resData) => {
                        setLoadIng(false);
                        var list = [];
                        for (const element of resData.data.data) {
                            var value = {
                                name: element.order.package.name,
                                price: element.order.payment.amount + " บาท",
                                createAt: element.created_at.substring(8, 10) + "/" + element.created_at.substring(5, 7) + "/" + element.created_at.substring(0, 4),
                            };
                            list.push(value);
                        }
                        setPaymentDetail(list);
                    })
                    .catch((error) => {
                        setLoadIng(false);
                        console.log(error);
                    });
            })
            .catch((error) => {
                setLoadIng(false);
                console.log(error);
            });
    };

    // console.log('ggg : ', detail);

    const columns = [
        {
            title: 'ชื่อเเพ็คเกจ',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'ราคา',
            dataIndex: 'price',
            key: 'price',
            width: '30%',
        },
        {
            title: 'วันที่เริ่มใช้งาน',
            dataIndex: 'createAt',
            key: 'createAt',
            width: '30%',
        },
    ];

    return (
        // eslint-disable-next-line react/jsx-indent
        <Spin spinning={loading} tip="Loading...">
            <Form.Item>
                        {isMobile ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Button
                                            type="default"
                                            icon={<RollbackOutlined />}
                                            onClick={() => history.push('../history')}
                                            block
                                        >
                                            ยกเลิก
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="default"
                                    icon={<RollbackOutlined />}
                                    onClick={() => history.push('../history')}
                                    style={{ width: '100px', float: 'left' }}
                                >
                                    ยกเลิก
                                </Button>
                            </>
                        )}
            </Form.Item>
            <Card
                // eslint-disable-next-line react/jsx-indent-props
                title={(
                    <Typography.Title level={3}>
                        <span>User ID : {historyId}</span>
                    </Typography.Title>
                )}
            >

                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Avatar src={detail.picture} style={{ width: 100, height: 100, marginTop: 6 }} />
                                <Typography.Text style={{ marginTop: 24 }}>
                                    ชื่อ - นามสกุล
                                    {' '}
                                    :
                                    {' '}
                                    {detail.name}
                                </Typography.Text>
                                <Typography.Text style={{ marginTop: 12 }}>
                                    อีเมล
                                    {' '}
                                    :
                                    {' '}
                                    {detail.email}
                                </Typography.Text>
                                <Typography.Text style={{ marginTop: 12 }}>
                                    เบอร์โทรศัพท์
                                    {' '}
                                    :
                                    {' '}
                                    {detail.tel}
                                </Typography.Text>
                                <Typography.Text style={{ marginTop: 12 }}>
                                    สถานะ
                                    {' '}
                                    :
                                    {' '}
                                    {detail.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                                </Typography.Text>
                            </div>
                        </Col>

                        <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                            <Card
                                title={(
                                    <Typography.Title level={5}>
                                        <span>เเพ็คเกจปัจจุบัน</span>
                                    </Typography.Title>
                                )}
                                style={{ borderRadius: 12 }}

                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography.Text style={{ marginTop: 4 }}>
                                        ชื่อเเพ็คเกจ
                                        {' '}
                                        :
                                        {' '}
                                        {detail.order !== undefined ? detail.order.package.name : ""}
                                    </Typography.Text>
                                    <Typography.Text style={{ color: '#FF0000', marginTop: 12 }}>
                                        วันหมดอายุ :
                                    </Typography.Text>
                                    <div style={{
                                        backgroundColor: '#EFEFEF', width: 100, marginTop: 6, display: 'flex', justifyContent: 'center', borderRadius: 4
                                    }}
                                    >
                                        {
                                            detail.expire_date !== undefined ?
                                            `${detail.expire_date.substring(8, 10)}/${detail.expire_date.substring(5, 7)}/${detail.expire_date.substring(0, 4)}`
                                            :
                                            null
                                        }
                                    </div>
                                </div>

                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: 36 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            {paymentDetail &&
                                <>
                                    <Typography.Text style={{ marginTop: 24, fontSize: 24 }}>
                                        ประวัติการต่ออายุ
                                    </Typography.Text>
                                    <Table
                                        scroll={{ x: 720 }}
                                        dataSource={paymentDetail}
                                        columns={columns}
                                        style={{ fontFamily: 'KanitRegular', cursor: 'pointer', marginTop: 12 }}
                                        pagination={{
                                            total: paymentDetail?.length || 0,
                                            showTotal: (total, range) =>
                                                `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                                            defaultPageSize: 10,
                                            defaultCurrent: 1,
                                        }}
                                    >
                                    </Table>
                                </>}
                        </Col>
                    </Row>

                    {/* <Form.Item style={{ marginTop: '12px' }}>
                        {isMobile ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Button
                                            type="default"
                                            icon={<RollbackOutlined />}
                                            onClick={() => history.push('../history')}
                                            block
                                        >
                                            ยกเลิก
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="default"
                                    icon={<RollbackOutlined />}
                                    onClick={() => history.push('../history')}
                                    style={{ width: '100px', float: 'right', marginLeft: 15 }}
                                >
                                    ยกเลิก
                                </Button>
                            </>
                        )}
                    </Form.Item> */}

            </Card>
        </Spin>
    );
};

export default HistoryDetail;
