/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable object-curly-spacing */
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
    Avatar,
    Rate,
} from 'antd';
import { useHistory } from 'react-router-dom';

import {
    RollbackOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';

const ReviewDetail = (props) => {
    const { isMobile } = useSelector((state) => state.mainReducer);
    const dispatch = useDispatch();
    const [detail, setDetail] = useState({});

    const {
        match: {
            params: { reviewId },
        },
    } = props;

    const [loading, setLoadIng] = useState(false);

    const history = useHistory();

    useEffect(() => {
        async function fetchMyAPI() {
            callDetail(reviewId);
        }
        fetchMyAPI();
    }, []);

    // eslint-disable-next-line no-shadow
    const callDetail = async (reviewId) => {
        setLoadIng(true);
        fetch({
            method: 'get',
            url: `/reviews/${reviewId}`,
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
                                            onClick={() => history.push('../review')}
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
                                    onClick={() => history.push('../review')}
                                    style={{ width: '100px', float: 'left' }}
                                >
                                    ยกเลิก
                                </Button>
                            </>
                        )}
            </Form.Item>
            <Card
                title={(
                    <Typography.Title level={3}>
                        <span>Review ID : {detail.id}</span>
                    </Typography.Title>
                )}
            >
                {detail && <>
                    <Row gutter={[8, 8]} align="middle">
                        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            <Form.Item>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <Typography.Text>
                                        รูปโปรไฟล์
                                    </Typography.Text>
                                    <Avatar src={detail.picture} style={{ width: 140, height: 140, marginTop: 24 }} />
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} align="middle" style={{ marginTop: 24 }}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    Url วิดีโอ
                                    {' '}
                                    :
                                    {' '}
                                    {detail.video_url}
                                </Typography.Text>
                            </Form.Item>
                            {/* <Form.Item
                                label="Url วิดีโอ"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    value={reviewData[i].linkUrl}
                                    style={{ fontFamily: 'KanitRegular' }}
                                />
                            </Form.Item> */}
                        </Col>

                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Form.Item>
                                <Typography.Text>
                                    ชื่อ - นามสกุล
                                    {' '}
                                    :
                                    {' '}
                                    {detail.name}
                                </Typography.Text>
                            </Form.Item>
                            {/* <Form.Item
                                label="ชื่อ - นามสกุล"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    value={reviewData[i].name}
                                    style={{ fontFamily: 'KanitRegular' }}
                                />
                            </Form.Item> */}
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} align="middle">
                        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            <Form.Item>
                                <Typography.Text>
                                    Rating
                                    {' '}
                                    :
                                </Typography.Text>
                                <Rate style={{marginLeft: 12 }} value={detail.rate} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} align="middle">
                        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            <Typography.Text>
                                รายละเอียด
                                {' '}
                                :
                                {' '}
                                {detail.description}
                                {' คะเเนน'}
                            </Typography.Text>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: '12px' }}>
                        {isMobile ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Button
                                            onClick={() => dispatch(allAction.lineAction.setActionPage('edit'))}
                                            icon={<EditOutlined />}
                                            style={{ backgroundColor: '#000', color: '#FFF' }}
                                            block
                                        >
                                            แก้ไข
                                        </Button>
                                    </Col>
                                    {/* <Col xs={24}>
                                        <Button
                                            type="default"
                                            icon={<RollbackOutlined />}
                                            onClick={() => history.push('../review')}
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
                                    onClick={() => history.push('../review')}
                                    style={{ width: '100px', float: 'right', marginLeft: 15 }}
                                >
                                    ยกเลิก
                                </Button> */}
                                <Button
                                    icon={<EditOutlined />}
                                    type="primary"
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

export default ReviewDetail;
