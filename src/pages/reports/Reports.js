import { Form, Input, Button, message, Layout, Col, Row, Spin, Select, Typography, Table, Space, Tag, Modal } from 'antd';
import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';

import { useTranslation, } from 'react-i18next';
import {
    FileOutlined,
    DownloadOutlined,
    PlusOutlined,
    PlusCircleFilled
} from '@ant-design/icons'
import { Content } from 'antd/lib/layout/layout';

const { Column } = Table
const { Option } = Select

const Reports = (props) => {

    const { isLoading, isMobile } = useSelector(state => state.mainReducer)
    const { customerData } = useSelector(state => state.customerReducer)

    const dispatch = useDispatch()

    const [isModalVisible, setIsModalVisible] = useState(false);

    const options = [{ value: '5%' }, { value: '7%' }, { value: '10%' }];

    const { t } = useTranslation();

    useEffect(() => {
        dispatch(allAction.customerAction.getCustomerData())
    }, []);

    const onFinish = (values) => {
        // console.log('Success:', values);
        // dispatch(login(values.username))
        dispatch(allAction.customerAction.getCustomerData(values))
    };


    const columns = [
        {
            title: 'ระดับเอเจนซี่',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: text => <Typography.Text>{text}</Typography.Text>,
        },
        {
            title: 'อัตราส่วนลด',
            dataIndex: 'age',
            width: 200,
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'blue' : 'blue';
                        if (tag === 'blue') {
                            color = 'blue';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'อัตรา COD',
            key: 'tags',
            dataIndex: 'tags',
            width: 200,
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'blue' : 'blue';
                        if (tag === 'blue') {
                            color = 'blue';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 200,
            render: (text, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" style={{ backgroundColor: "grey", borderColor: "grey", color: "#FFF", width: 80 }}>
                        เเก้ไข
                    </Button>
                    <Button size="small" type="primary" style={{ backgroundColor: "red", borderColor: "red", color: "#FFF", width: 80 }}>
                        ลบ
                    </Button>
                </Space>
            ),
        },
    ];


    const data = [
        {
            key: '1',
            name: 'A',
            age: ['5%'],
            tags: ['5%', '7%', '10%'],
        },
        {
            key: '2',
            name: 'B',
            age: ['7%'],
            tags: ['5%'],
        },
        {
            key: '3',
            name: 'C',
            age: ['10%'],
            tags: ['5%', '7%', '10%'],
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function tagRender(props) {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = event => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color={'blue'}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
            >
                {label}
            </Tag>
        );
    }


    return (<>
        <Spin style={{ verticalAlign: 'middle', minHeight: '80vh' }} spinning={isLoading} tip='Loading...'>

            <Layout style={{ minHeight: '100vh' }} >
                <Row gutter={[24, 24]}>
                    <Col xs={{ span: 24 }}>
                        <Typography.Title level={3}>ระดับเอเจนซี</Typography.Title>
                    </Col>
                </Row>

                <Form
                    layout='vertical'
                    name="customer"
                    onFinish={onFinish}
                >
                    <Row gutter={[8, 8]} align='middle'>

                        <Col xs={{ span: 24 }} lg={{ span: 6 }}>

                            <Form.Item>
                                <Input placeholder={t('search')} />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 2 }}>

                            <Form.Item >
                                <Button type="primary" htmlType="submit" style={{ width: isMobile ? '100%' : '100px' }}>{t('search')}</Button>
                            </Form.Item>
                        </Col>


                        <Col xs={{ span: 24 }} lg={{ span: 14, offset: 2 }} xxl={{ span: 9, offset: 7 }}>
                            <Row gutter={[24, 24]} justify='end' >


                                <Col xs={{ span: 24 }} sm={{ span: 4 }} lg={{ span: 5 }} >

                                    <Form.Item >
                                        <Button type="primary" icon={<PlusOutlined />} style={{ width: isMobile ? '100%' : '100px' }} onClick={showModal}>{t('create')}</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Form>
                <Row gutter={[24, 24]}>

                    <Col xs={{ span: 24 }}>
                        <Table scroll={{ x: 800 }} columns={columns} dataSource={data} />
                    </Col>

                </Row>
            </Layout >


            <Modal title="ระดับเอเจนซี" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="บันทึก"
                cancelText="ยกเลิก">

                <Form
                    layout='vertical'
                    name="customer"
                    onFinish={onFinish}
                >
                    <Row align='middle'>

                        <Col xs={{ span: 24 }} lg={{ span: 5 }}>

                            <Form.Item >
                                <Typography.Text  >ระดับเอเจนซี</Typography.Text>
                            </Form.Item>
                        </Col>


                        <Col xs={{ span: 24 }} lg={{ span: 19 }}>

                            <Form.Item>
                                <Input />
                            </Form.Item>
                        </Col>








                    </Row>

                </Form>

                <Form
                    layout='vertical'
                    name="customer"
                    onFinish={onFinish}
                >
                    <Row align='middle'>

                        <Col xs={{ span: 24 }} lg={{ span: 5 }}>

                            <Form.Item >
                                <Typography.Text  >อัตราส่วนลด</Typography.Text>
                            </Form.Item>
                        </Col>


                        <Col xs={{ span: 24 }} lg={{ span: 19 }}>

                            <Form.Item>
                                <Select
                                    mode="multiple"
                                    showArrow
                                    tagRender={tagRender}
                                    defaultValue={['5%']}
                                    style={{ width: '100%' }}
                                    options={options}
                                />
                            </Form.Item>
                        </Col>





                    </Row>

                </Form>


                <Form
                    layout='vertical'
                    name="customer"
                    onFinish={onFinish}
                >
                    <Row align='middle'>

                        <Col xs={{ span: 24 }} lg={{ span: 5 }}>

                            <Form.Item >
                                <Typography.Text  >อัตรา COD</Typography.Text>
                            </Form.Item>
                        </Col>


                        <Col xs={{ span: 24 }} lg={{ span: 19 }}>

                            <Form.Item>
                                <Select
                                    mode="multiple"
                                    showArrow
                                    tagRender={tagRender}
                                    defaultValue={['5%', '7%', '10%']}
                                    style={{ width: '100%' }}
                                    options={options}
                                />
                            </Form.Item>
                        </Col>




                    </Row>

                </Form>




            </Modal>


        </Spin >

    </>
    );
};




export default Reports