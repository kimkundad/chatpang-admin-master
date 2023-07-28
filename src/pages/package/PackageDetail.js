/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable arrow-parens */
/* eslint-disable max-len */
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
    Checkbox,
    Modal,
    message,
} from 'antd';
import { useHistory } from 'react-router-dom';

import {
    EditOutlined,
    RollbackOutlined,
    ExclamationCircleOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';

const PackageDetail = (props) => {
    const { isMobile } = useSelector((state) => state.mainReducer);
    const dispatch = useDispatch();
    const [detail, setDetail] = useState({});

    const {
        match: {
            params: { packageId },
        },
    } = props;

    const [loading, setLoadIng] = useState(false);

    const history = useHistory();

    useEffect(() => {
        async function fetchMyAPI() {
            callDetail(packageId);
        }
        fetchMyAPI();
    }, []);

    // eslint-disable-next-line no-shadow
    const callDetail = async (packageId) => {
        setLoadIng(true);
        fetch({
            method: 'get',
            url: `/packages/${packageId}`,
        })
            .then((res) => {
                setLoadIng(false);
                setDetail(res.data.data);
            })
            .catch((error) => {
                setLoadIng(false);
                console.log(error);
            });
    };

    const showConfirm = (id) => {
        Modal.confirm({
          title: 'คุณต้องการลบข้อมูล?',
          icon: <ExclamationCircleOutlined />,
          onOk() {
            dispatch(allAction.packageAction.deletePackage(id))
              .then(() => {
                message.success('Delete Success!');
                history.push('../package');
              })
              .catch((e) => message.error(e.message));
          },
          onCancel() { },
        });
    };

    // console.log("detail : ", detail);

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
                                            onClick={() => history.push('../package')}
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
                                    onClick={() => history.push('../package')}
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
                        <span>Package ID : {packageId}</span>
                    </Typography.Title>
                )}
                extra={
                    <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ width: isMobile ? '100%' : '100px' }}
                    onClick={() => showConfirm(detail.id)}
                    >
                     ลบข้อมูล
                    </Button>
                  }
            >
                {detail && <>
                    <Row gutter={[8, 8]} align="middle">
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    ชื่อเเพ็คเกจ
                                    {' '}
                                    :
                                    {' '}
                                    {detail.name}
                                </Typography.Text>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                สถานะ
                                {' '}
                                :
                                {' '}
                                </Typography.Text>
                                <Checkbox
                                    style={{ marginLeft: 8 }}
                                    checked={detail.status === 'active' ? true : false}
                                    disabled
                                >
                                    Active
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    ราคา
                                    {' '}
                                    :
                                    {' '}
                                    {detail.price}
                                    {' '}
                                    บาท
                                </Typography.Text>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    จำนวนเพจ
                                    {' '}
                                    :
                                    {' '}
                                    {detail.page_limit}
                                    {' '}
                                    เพจ
                                </Typography.Text>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    จำนวนวัน
                                    {' '}
                                    :
                                    {' '}
                                    {detail.days}
                                    {' '}
                                    วัน
                                </Typography.Text>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    จำนวน Line Notification
                                    {' '}
                                    :
                                    {' '}
                                    {detail.line_notification_limit}
                                    {' '}
                                    Line
                                </Typography.Text>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    จำนวนการตอบกลับของ Bot
                                    {' '}
                                    :
                                    {' '}
                                    {detail.quota_limit}
                                    {' '}
                                    ข้อความ
                                </Typography.Text>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    ข้อความพิเศษ
                                    {' '}
                                    :
                                    {' '}
                                    {detail.special_text}
                                    {' '}
                                </Typography.Text>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    ดึงคอมเม้นเข้า Inbox / วัน
                                    {' '}
                                    :
                                    {' '}
                                    {detail.quota_limit_comment_box}
                                    {' '}
                                    ข้อความ
                                </Typography.Text>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    ตอบคอมเม้น / วัน
                                    {' '}
                                    :
                                    {' '}
                                    {detail.quota_limit_comment_send}
                                    {' '}
                                    ข้อความ
                                </Typography.Text>
                            </Form.Item>
                        </Col>
                        
                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                เลือกจำกัดตอบกลับของ Bot รายวัน
                                {' '}
                                :
                                {' '}
                                </Typography.Text>
                                <Checkbox
                                    style={{ marginLeft: 8 }}
                                    checked={detail.per_day}
                                    disabled
                                >
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                เลือกเปิดใช้งาน ข้อความต้อนรับ
                                {' '}
                                :
                                {' '}
                                </Typography.Text>
                                <Checkbox
                                    style={{ marginLeft: 8 }}
                                    checked={detail.welcomemsg}
                                    disabled
                                >
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                เลือกเปิดใช้งาน ตอบตามคีย์เวิร์ด
                                {' '}
                                :
                                {' '}
                                </Typography.Text>
                                <Checkbox
                                    style={{ marginLeft: 8 }}
                                    checked={detail.keywordmsg}
                                    disabled
                                >
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ marginBottom: 6 }}>
                                        <Typography.Text>
                                            รายละเอียด
                                        </Typography.Text>
                                    </div>
                                    {detail.options && [...Array.from({ length: detail.options.length }, (_, i) => i)].map(i => (
                                        <div style={{ marginTop: 4, marginBottom: 4 }}>
                                            <Typography.Text>
                                                {detail.options[i]}
                                            </Typography.Text>
                                        </div>
                                    ))}

                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: '12px' }}>
                        {isMobile ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    {/* <Col xs={24}>
                                        <Button
                                            type="primary"
                                            onClick={() => dispatch(allAction.lineAction.setActionPage('edit'))}
                                            icon={<EditOutlined />}
                                            block
                                        >
                                            แก้ไข
                                        </Button>
                                    </Col> */}
                                    <Col xs={24}>
                                        <Button
                                            type="default"
                                            icon={<RollbackOutlined />}
                                            onClick={() => history.push('../package')}
                                            block
                                        >
                                            ยกเลิก
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <>
                                {/* <Button
                                    type="default"
                                    icon={<RollbackOutlined />}
                                    onClick={() => history.push('../package')}
                                    style={{ width: '100px', float: 'right', marginLeft: 15 }}
                                >
                                    ยกเลิก
                                </Button> */}
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    style={{ width: '100px', float: 'right' }}
                                    onClick={() => dispatch(allAction.lineAction.setActionPage('edit'))}
                                >
                                    แก้ไข
                                </Button>
                            </>
                        )}
                    </Form.Item>

                </>}

            </Card>
        </Spin>
    );
};

export default PackageDetail;
