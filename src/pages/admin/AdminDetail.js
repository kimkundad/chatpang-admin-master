/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable prefer-template */
/* eslint-disable max-len */
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

const AdminDetail = (props) => {
    const { isMobile } = useSelector((state) => state.mainReducer);
    const dispatch = useDispatch();
    const [detail, setDetail] = useState({});

    const {
        match: {
            params: { adminId },
        },
    } = props;

    const [loading, setLoadIng] = useState(false);

    const history = useHistory();

    useEffect(() => {
        async function fetchMyAPI() {
            callDetail(adminId);
        }
        fetchMyAPI();
    }, []);

    // eslint-disable-next-line no-shadow
    const callDetail = async (adminId) => {
        setLoadIng(true);
        fetch({
            method: 'get',
            url: `/admins/${adminId}`,
        })
            .then((res) => {
                setLoadIng(false);
                setDetail(res.data.data);
                console.log('res data : ', res.data.data);
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
            dispatch(allAction.adminAction.deleteAdmin(id))
              .then(() => {
                message.success('Delete Success!');
                history.push('../admin');
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
                                            onClick={() => history.push('../admin')}
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
                                    onClick={() => history.push('../admin')}
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
                        <span>Admin ID : {adminId}</span>
                    </Typography.Title>
                )}
                extra={
                    detail.role === "super_admin" ?
                    null
                    :
                    <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ width: isMobile ? '100%' : '100px' }}
                    onClick={() => showConfirm(adminId)}
                    >
                     ลบข้อมูล
                    </Button>

                  }
            >

                <Row gutter={[8, 8]} align="middle">
                    {/* <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography.Text>
                                    รูปโปรไฟล์
                                </Typography.Text>
                                <Avatar src={detail.picture} style={{ width: 100, height: 100, marginTop: 6 }} />
                            </div>
                        </Form.Item>
                    </Col> */}
                    <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            <Form.Item>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography.Text>
                                        รูปโปรไฟล์
                                    </Typography.Text>
                                    <Avatar src={detail.picture} style={{ width: 140, height: 140, marginTop: 24 }} />
                                </div>
                            </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                ชื่อ - นามสกุล
                                {' '}
                                :
                                {' '}
                                {detail.first_name + ' ' + detail.last_name}
                            </Typography.Text>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                username
                                {' '}
                                :
                                {' '}
                                {detail.username}
                            </Typography.Text>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} align="middle" style={{ marginTop: -12 }}>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                อีเมล
                                {' '}
                                :
                                {' '}
                                {detail.email}
                            </Typography.Text>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                เบอร์โทรศัพท์
                                {' '}
                                :
                                {' '}
                                {detail.tel}
                            </Typography.Text>
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                username
                                {' '}
                                :
                                {' '}
                                {detail.username}
                            </Typography.Text>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                รหัสผ่าน
                                {' '}
                                :
                                {' '}
                                {detail.password}
                            </Typography.Text>
                        </Form.Item>
                    </Col>
                </Row> */}
                {/* <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                จังหวัด
                                {' '}
                                :
                                {' '}
                                {detail.province}
                            </Typography.Text>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                อำเภอ/เขต
                                {' '}
                                :
                                {' '}
                                {detail.district}
                            </Typography.Text>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                ตำบล/เเขวง
                                {' '}
                                :
                                {' '}
                                {detail.subDistrict}
                            </Typography.Text>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item>
                            <Typography.Text>
                                รหัสไปรษณีย์
                                {' '}
                                :
                                {' '}
                                {detail.postalCode}
                            </Typography.Text>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <Form.Item>
                            <Typography.Text>
                                ที่อยู่
                                {' '}
                                :
                                {' '}
                                {detail.address}
                            </Typography.Text>
                        </Form.Item>
                    </Col>
                </Row> */}

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
                                        onClick={() => history.push('../admin')}
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
                                onClick={() => history.push('../admin')}
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

export default AdminDetail;
