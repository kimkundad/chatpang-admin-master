import { Form, Input, Button, message, Layout, Col, Row, Spin, Select, Typography, Table, Space, Checkbox, Card } from 'antd';
import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';

import { useTranslation, } from 'react-i18next';
import {
    FileOutlined,
    DownloadOutlined,
    PlusOutlined
} from '@ant-design/icons'
import { Content } from 'antd/lib/layout/layout';

const { Column } = Table
const { Option } = Select

const Products = (props) => {

    const { isLoading, isMobile } = useSelector(state => state.mainReducer)
    const { customerData } = useSelector(state => state.customerReducer)

    const dispatch = useDispatch()
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(allAction.customerAction.getCustomerData())
    }, []);

    const onFinish = (values) => {
        // console.log('Success:', values);
        // dispatch(login(values.username))
        dispatch(allAction.customerAction.getCustomerData(values))
    };


    const data = [
        {
            key: '1',
            hub_code: 'John Brown',
            hub_name: '32',
            phone: "New York No. 1 Lake Park",
            province: "กรุงเทพมหานคร"
        },
        {
            key: '2',
            hub_code: 'Jim Green',
            hub_name: '42',
            phone: "London No. 1 Lake Park",
            province: "นนทบุรี"
        },
        {
            key: '3',
            hub_code: 'Joe Black',
            hub_name: '32',
            phone: "Sidney No. 1 Lake Park",
            province: "ปทุมธานี"
        }

    ];


    return (<>
        <Spin style={{ verticalAlign: 'middle', minHeight: '80vh' }} spinning={isLoading} tip='Loading...'>

            <Layout style={{ minHeight: '100vh' }} >

                <Form
                    layout='vertical'
                    name="customer"
                    onFinish={onFinish}
                >
                    <Row gutter={[8, 8]} align='middle'>

                        <Col xs={{ span: 24 }} lg={{ span: 2 }}>

                            <Form.Item >
                                <Typography.Text  >รหัส Hub</Typography.Text>
                            </Form.Item>
                        </Col>


                        <Col xs={{ span: 24 }} lg={{ span: 6 }}>

                            <Form.Item>
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col xs={{ span: 24 }} lg={{ span: 15, offset: 1 }} xxl={{ span: 15, offset: 1 }}>
                            <Form.Item>
                                <Checkbox >ปิดการใช้งาน</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>


                <Space size={[24, 16]} direction="vertical">
                    <Card title="รายละเอียด Hub">

                        <Form
                            layout='vertical'
                            name="customer"
                            onFinish={onFinish}
                        >
                            <Row align='middle'>

                                <Col xs={{ span: 24 }} lg={{ span: 3 }}>

                                    <Form.Item >
                                        <Typography.Text  >ชื่อ Hub</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 9 }}>

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

                                <Col xs={{ span: 24 }} lg={{ span: 3 }}>

                                    <Form.Item >
                                        <Typography.Text  >เบอร์โทรศัพท์</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 9 }}>

                                    <Form.Item>
                                        <Input />
                                    </Form.Item>
                                </Col>



                            </Row>

                        </Form>



                    </Card>





                    <Card title="ที่ตั้ง">
                        <Form
                            layout='vertical'
                            name="customer"
                            onFinish={onFinish}
                        >
                            <Row align='middle'>

                                <Col xs={{ span: 24 }} lg={{ span: 2 }}>

                                    <Form.Item >
                                        <Typography.Text  >ละติจูด</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 6 }}>

                                    <Form.Item>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 2, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >ลองติจูด</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 6 }}>

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

                                <Col xs={{ span: 24 }} lg={{ span: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >เลขที่</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 2 }}>

                                    <Form.Item>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 1, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >หมู่</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 2 }}>

                                    <Form.Item>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 1, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >ซอย</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 4 }}>

                                    <Form.Item>
                                        <Input />
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 1, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >ถนน</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 4 }}>

                                    <Form.Item>
                                        <Input />
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 1, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >อื่นๆ</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 3 }}>

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

                                <Col xs={{ span: 24 }} lg={{ span: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >ตำบล</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 4 }}>

                                    <Form.Item>
                                        <Select placeholder={t('search')} defaultValue={'all'}>
                                            <Option value={'all'}>
                                                แสดงทั้งหมด
                                    </Option>
                                            <Option value="comp1">RBH</Option>
                                            <Option value="comp2">ABC</Option>
                                            <Option value="comp3">QAZ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 1, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >อำเภอ</Typography.Text>
                                    </Form.Item>
                                </Col>


                                <Col xs={{ span: 24 }} lg={{ span: 4 }}>

                                    <Form.Item>
                                        <Select placeholder={t('search')} defaultValue={'all'}>
                                            <Option value={'all'}>
                                                แสดงทั้งหมด
                                    </Option>
                                            <Option value="comp1">RBH</Option>
                                            <Option value="comp2">ABC</Option>
                                            <Option value="comp3">QAZ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 1, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >จังหวัด</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 4 }}>

                                    <Form.Item>
                                        <Select placeholder={t('search')} defaultValue={'all'}>
                                            <Option value={'all'}>
                                                แสดงทั้งหมด
                                    </Option>
                                            <Option value="comp1">RBH</Option>
                                            <Option value="comp2">ABC</Option>
                                            <Option value="comp3">QAZ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 2, offset: 1 }}>

                                    <Form.Item >
                                        <Typography.Text  >รหัสไปรษณีย์</Typography.Text>
                                    </Form.Item>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 4 }}>

                                    <Form.Item>
                                        <Input />
                                    </Form.Item>
                                </Col>



                            </Row>

                        </Form>


                    </Card>

                    <Form
                        layout='vertical'
                        name="customer"
                        onFinish={onFinish}
                    >
                        <Row align='bottom'>

                            <Col xs={{ span: 24 }} lg={{ span: 1 }}>

                                <Form.Item >
                                    <Button type="primary" htmlType="submit" style={{ width: isMobile ? '100%' : '100px' }}>บันทึก</Button>
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} lg={{ span: 21, offset: 2 }} xxl={{ span: 22, offset: 1 }}>

                                <Form.Item >
                                    <Button type="primary" htmlType="submit" style={{ width: isMobile ? '100%' : '100px' }}>ยกเลิก</Button>
                                </Form.Item>
                            </Col>

                        </Row>


                    </Form>


                </Space>



            </Layout >
        </Spin >

    </>
    );
};



export default Products