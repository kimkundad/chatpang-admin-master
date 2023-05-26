/* eslint-disable object-curly-newline */
/* eslint-disable no-var */
/* eslint-disable comma-dangle */
/* eslint-disable vars-on-top */
/* eslint-disable semi */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import {
    Form,
    Layout,
    Spin,
    Typography,
    Card,
    Row,
    Col,
    Input,
    Button,
    Modal,
    message,
    Avatar,
    Upload,
    Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    RollbackOutlined,
    SaveOutlined,
    ExclamationCircleOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import allAction from '../../app/actions/index';
import { fetch } from '../../utils/fetch';
import ReviewDetail from './ReviewDetail';

const { TextArea } = Input;
const ReviewInput = (props) => {
    const {
        actionPage,
    } = useSelector(
        (state) => state.lineReducer,
    );
    const { isMobile } = useSelector((state) => state.mainReducer);
    const [loading, setLoadIng] = useState(false);
    const [image, setImage] = useState('');
    const {
        match: {
            params: { reviewId },
        },
    } = props;
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const history = useHistory();
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchMyAPI() {
            callDetail(reviewId);
        }
        fetchMyAPI();
    }, [actionPage]);

    const callDetail = async (reviewId) => {
        setLoadIng(true);
        fetch({
            method: 'get',
            url: `/reviews/${reviewId}`,
        })
            .then((res) => {
                setLoadIng(false);
                const initFormData = {
                    name: res.data.data.name,
                    imgURL: res.data.data.picture,
                    rating: res.data.data.rate,
                    linkUrl: res.data.data.video_url,
                    detail: res.data.data.description,
                };
                setImage(res.data.data.picture);
                form.setFieldsValue(initFormData);
            })
            .catch((error) => {
                setLoadIng(false);
                console.log(error);
            });
    };

    // const callInformation = async (lineId) => {
    //     setLoadIng(true);
    //     fetch({
    //         method: 'get',
    //         url: `/notifications/detail/${lineId}`,
    //     })
    //         .then((res) => {
    //             setLoadIng(false);
    //             const initFormData = {
    //                 lineName: res.data.lineName,
    //                 lineAccessToken: res.data.lineAccessToken,
    //             };
    //             form.setFieldsValue(initFormData);
    //         })
    //         .catch((error) => {
    //             setLoadIng(false);
    //             console.log(error);
    //         });
    // };

    // //  handleSubmit ?
    const handleSubmit = (values) => {
        var result = {
            name: values.name,
            video_url: values.linkUrl,
            rate: values.rating,
            description: values.detail,
            picture: image
        }

        Modal.confirm({
            title:
                'คุณต้องการเเก้ไขการรีวิว?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                window.scrollTo(0, 0);
                dispatch(allAction.reviewAction.updateReviewDetail(reviewId, result))
                    .then(() => {
                        message.success('Update Success!');
                        history.push('../review');
                    })
                    .catch((e) => message.error(e.message));
            },
            onCancel() { },
        });
    };

    if (reviewId !== 'create' && actionPage === 'view') {
        return <ReviewDetail {...props} />;
    }

    const onChange = (file) => {
        var bodyFormData = new FormData();
        bodyFormData.append('file', file.file.originFileObj);
        axios({
            method: 'post',
            url: 'https://app.chatpang.co/upload',
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then((res) => {
                setImage(res.data.data.public_url);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Spin
                style={{ verticalAlign: 'middle', minHeight: '80vh' }}
                spinning={loading}
                tip="Loading..."
            >
                <Layout style={{ minHeight: '100vh' }}>
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
                                <span className="text-primary">
                                    จัดการรีวิวจากลูกค้า
                                </span>
                            </Typography.Title>
                        )}
                    >
                        <Form
                            layout="horizontal"
                            name="search"
                            form={form}
                            onFinish={handleSubmit}
                        >
                            <>
                                <Row gutter={[8, 8]} align="middle">
                                    <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                        <Form.Item>
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography.Text>
                                                    รูปโปรไฟล์
                                                </Typography.Text>
                                                <Avatar src={image} style={{ width: 140, height: 140, marginTop: 6 }} />
                                                {/* </Form.Item> */}
                                                <Upload {...props} onChange={onChange} showUploadList={false}>
                                                    <Button style={{ marginTop: 18 }} icon={<UploadOutlined />}>เเก้ไข</Button>
                                                </Upload>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                        <Form.Item
                                            label="Url วิดีโอ"
                                            name="linkUrl"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ fontFamily: 'KanitRegular' }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                        <Form.Item
                                            label="ชื่อ - นามสกุล"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ fontFamily: 'KanitRegular' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 8]} align="middle">
                                    <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                        <Form.Item
                                            label="Rating"
                                            name="rating"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Select
                                                optionFilterProp="children"
                                                defaultValue=""
                                                onChange={(e) => {
                                                }}
                                                onSelect={(e) => {
                                                }}
                                            >
                                                <Option value="">{t('all-select')}</Option>
                                                {[1, 2, 3, 4, 5].map((val) => (
                                                    <Option style={{ backgroundColor: '#FFF' }} value={val}>{val}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 8]} align="middle">
                                    <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                        <Form.Item
                                            label="รายละเอียด"
                                            name="detail"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <TextArea rows={6} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item style={{ marginTop: '12px' }}>
                                    {isMobile ? (
                                        <>
                                            <Row gutter={[16, 16]}>
                                                <Col xs={24}>
                                                    <Button
                                                        htmlType="submit"
                                                        icon={<SaveOutlined />}
                                                        style={{ backgroundColor: '#000', color: '#FFF' }}
                                                        block
                                                    >
                                                        {t('save')}
                                                    </Button>
                                                </Col>
                                                {/* <Col xs={24}>
                                                    <Button
                                                        type="default"
                                                        icon={<RollbackOutlined />}
                                                        onClick={() => history.push('../review')}
                                                        block
                                                    >
                                                        {t('cancel')}
                                                    </Button>
                                                </Col> */}
                                            </Row>
                                        </>
                                    ) : (
                                        <>
                                            {/* <Button
                                                type="default"
                                                icon={<RollbackOutlined />}
                                                style={{ width: '100px', float: 'Right', marginLeft: 15 }}
                                                onClick={() => history.push('../review')}
                                            >
                                                {t('cancel')}
                                            </Button> */}
                                            <Button
                                                htmlType="submit"
                                                icon={<SaveOutlined />}
                                                type="primary"
                                                style={{ width: '100px', float: 'right' }}
                                            >
                                                {t('save')}
                                            </Button>
                                        </>
                                    )}
                                </Form.Item>
                            </>
                        </Form>
                    </Card>
                </Layout>
            </Spin>
        </>
    );
};

export default ReviewInput;
