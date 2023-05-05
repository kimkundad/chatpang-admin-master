/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-unneeded-ternary */
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
    DeleteOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';

const LineDetail = (props) => {
    const { isMobile } = useSelector((state) => state.mainReducer);
    const dispatch = useDispatch();
    const [detail, setDetail] = useState({});

    const {
        match: {
            params: { lineId },
        },
    } = props;

    const [loading, setLoadIng] = useState(false);

    const history = useHistory();

    useEffect(() => {
        async function fetchMyAPI() {
            callDetail(lineId);
        }
        fetchMyAPI();
    }, []);

    // eslint-disable-next-line no-shadow
    const callDetail = async (lineId) => {
        setLoadIng(true);
        fetch({
            method: 'get',
            url: `/line-notifications/${lineId}`,
        })
            .then((res) => {
                setLoadIng(false);
                setDetail(res.data.data);
                console.log('res.data.data : ', res.data.data);
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
            dispatch(allAction.lineAction.deleteLine(id))
              .then(() => {
                message.success('Delete Success!');
                history.push('../line');
              })
              .catch((e) => message.error(e.message));
          },
          onCancel() { },
        });
      };

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
                                            onClick={() => history.push('../line')}
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
                                    onClick={() => history.push('../line')}
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
                        <span>Notification ID : {detail.id}</span>
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

                <Row gutter={[8, 8]} align="middle">
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                ชื่อกลุ่ม
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
                                Line access token
                                {' '}
                                :
                                {' '}
                                {detail.token}
                            </Typography.Text>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                สถานะ
                                {' '}
                                :
                                {' '}
                                </Typography.Text>
                                <Checkbox
                                    style={{ marginLeft: 12 }}
                                    checked={detail.status === 'active' ? true : false}
                                    disabled
                                >
                                    Active
                                </Checkbox>
                            </Form.Item>
                        </Col>
                </Row>

                <Form.Item style={{ marginTop: '12px' }}>
                    {isMobile ? (
                        <>
                            <Row gutter={[16, 16]}>
                                <Col xs={24}>
                                    <Button
                                        type="primary"
                                        onClick={() => dispatch(allAction.lineAction.setActionPage('edit'))}
                                        icon={<EditOutlined />}
                                        block
                                    >
                                        แก้ไข
                                    </Button>
                                </Col>
                                {/* <Col xs={24}>
                                    <Button
                                        type="default"
                                        icon={<RollbackOutlined />}
                                        onClick={() => history.push('../line')}
                                        block
                                    >
                                        ยกเลิก
                                    </Button>
                                </Col> */}
                            </Row>
                        </>
                    ) : (
                        <>
                            {/* <Button
                                type="default"
                                icon={<RollbackOutlined />}
                                onClick={() => history.push('../line')}
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
            </Card>
        </Spin>
    );
};

export default LineDetail;
