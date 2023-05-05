import {
	Form,
	Input,
	Button,
	message,
	Layout,
	Col,
	Row,
	Spin,
	Select,
	Typography,
	Table,
	Space,
	Modal,
} from 'antd'
import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import allAction from '../../app/actions/index'
import { useTranslation } from 'react-i18next'
import { FileOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { Content } from 'antd/lib/layout/layout'

const { Column } = Table
const { Option } = Select

const Vehicles = (props) => {
	const { isLoading, isMobile } = useSelector((state) => state.mainReducer)
	const { customerData } = useSelector((state) => state.customerReducer)

	const dispatch = useDispatch()

	const [isModalVisible, setIsModalVisible] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		dispatch(allAction.customerAction.getCustomerData())
	}, [])

	const onFinish = (values) => {
		// console.log('Success:', values);
		// dispatch(login(values.username))
		dispatch(allAction.customerAction.getCustomerData(values))
	}

	const data = [
		{
			key: '1',
			agency_type: 'มีหน้าร้าน',
		},
		{
			key: '2',
			agency_type: 'ไม่มีหน้าร้าน',
		},
		{
			key: '3',
			agency_type: 'ผู้เเนะนำ',
		},
	]

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleOk = () => {
		setIsModalVisible(false)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	return (
		<>
			<Spin
				style={{ verticalAlign: 'middle', minHeight: '80vh' }}
				spinning={isLoading}
				tip='Loading...'
			>
				<Layout style={{ minHeight: '100vh' }}>
					<Row gutter={[24, 24]}>
						<Col xs={{ span: 24 }}>
							<Typography.Title level={3}>ประเภท Agency</Typography.Title>
						</Col>
					</Row>

					<Form layout='vertical' name='customer' onFinish={onFinish}>
						<Row gutter={[8, 8]} justify='end'>
							<Col
								xs={{ span: 24 }}
								lg={{ span: 3, offset: 21 }}
								xxl={{ span: 2, offset: 22 }}
							>
								<Form.Item>
									<Button
										type='primary'
										icon={<PlusOutlined />}
										style={{ width: isMobile ? '100%' : '100px' }}
										onClick={showModal}
									>
										{t('create')}
									</Button>
								</Form.Item>
								{/* <Row justify='end' >
                                <Col xs={{ span: 24 }} sm={{ span: 4 }} lg={{ span: 5 }} >
                                   
                                </Col>
                            </Row> */}
							</Col>
						</Row>
					</Form>
					<Row gutter={[24, 24]}>
						<Col xs={{ span: 24 }}>
							<Table scroll={{ x: 800 }} dataSource={data}>
								<Column
									title='Agency Type'
									width={800}
									dataIndex='agency_type'
									key='agency_type'
								/>
							</Table>
						</Col>
					</Row>

					<Modal
						title='สร้างประเภท Agency'
						visible={isModalVisible}
						onOk={handleOk}
						onCancel={handleCancel}
						okText='บันทึก'
						cancelText='ยกเลิก'
					>
						<Form layout='vertical' name='customer' onFinish={onFinish}>
							<Row align='middle'>
								<Col xs={{ span: 24 }} lg={{ span: 5 }}>
									<Form.Item>
										<Typography.Text>Agency Type*</Typography.Text>
									</Form.Item>
								</Col>

								<Col xs={{ span: 24 }} lg={{ span: 19 }}>
									<Form.Item>
										<Input />
									</Form.Item>
								</Col>
							</Row>
						</Form>

						<Form layout='vertical' name='customer' onFinish={onFinish}>
							<Row align='middle'>
								<Col xs={{ span: 24 }} lg={{ span: 5 }}>
									<Form.Item>
										<Typography.Text>Description</Typography.Text>
									</Form.Item>
								</Col>

								<Col xs={{ span: 24 }} lg={{ span: 19 }}>
									<Form.Item>
										<Input />
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Modal>
				</Layout>
			</Spin>
		</>
	)
}

export default Vehicles
