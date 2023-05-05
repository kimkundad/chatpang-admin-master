/* eslint-disable  */
import {
    Layout,
    Spin,
    Form,
    Button,
    Row,
    Col,
    Avatar,
    Input,
    Table,
    Rate
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Review = (props) => {
    const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
    const { reviewData } = useSelector((state) => state.reviewReducer);
    const dispatch = useDispatch();
    const history = useHistory();
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(allAction.reviewAction.getReviewData(null))
            .then(() => { })
            .catch((e) => {
              if (e.message === "Unauthorized"){
                window.localStorage.removeItem('authen-token');
                // push('./');
              }
                message.error(e.message)
            });
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '8%',
            key: 'id',
        },
        {
            title: 'รูปภาพ',
            dataIndex: '',
            width: '6%',
            align: 'center',
            key: 'image',
            render: (record) => <div style={{
                display: 'flex', flexDirection: 'row',  alignItems : 'center' , justifyContent : 'center'
            }}
            >
                <Avatar src={record.picture} style={{ width: 50, height: 50 }} />
            </div>,
        },
        {
            title: 'ชื่อ - นามสกุล',
            dataIndex: 'name',
            width: '10%',
            key: 'name',
        },
        {
            title: 'ความนิยม',
            dataIndex: '',
            width: '10%',
            key: 'rate',
            render: (record) => <div style={{
                display: 'flex', flexDirection: 'row',  alignItems : 'center' , justifyContent : 'center'
            }}
            >
                <Rate  value={record.rate} disabled/>
            </div>,
        },
        {
            title: 'รายละเอียด',
            dataIndex: 'description',
            width: '30%',
            key: 'description',
        },
    ];

    const onFinishSearch = (value) => {
        window.scrollTo(0, 0);
        dispatch(allAction.reviewAction.getReviewData(value.search))
            .then(() => { })
            .catch((e) => {
                console.log('e.message : ', e.message)
                message.error(e.message)
            });
    };

    return (
        <>
            <Spin
                style={{ verticalAlign: 'middle', minHeight: '80vh' }}
                spinning={isLoading}
                tip="Loading..."
            >
                <Layout style={{ minHeight: '100vh' }}>
                <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 24 }} xxl={{ span: 24 }}>
              {isMobile ? (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push('/review/create')}
                    block
                  >
                    {t('create')}
                  </Button>
              ) : (
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => history.push('/review/create')}
                      style={{ width: '120px' }}
                    >
                      {t('create')}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
                </Row>
                <Form layout="vertical" form={form} onFinish={onFinishSearch}>
            <Row gutter={[8, 8]} align="middle">
              <Col
                xs={{ span: 24 }}
                lg={{ span: 4 }}
              >
                <Form.Item name="search" label="&nbsp;">
                    <Input placeholder={t('search')} allowClear />
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                lg={{ span: 2 }}
              >
                <Form.Item label="&nbsp;">
                    <Button
                      type="default"
                      icon={<SearchOutlined />}
                      htmlType="submit"
                      style={{ width: isMobile ? '100%' : '100px' }}
                    >
                      {t('search')}
                    </Button>
                </Form.Item>
              </Col>

            </Row>
          </Form>
                    <Row gutter={[24, 24]} style={{ marginTop: 18 }}>
                        <Col xs={{ span: 24 }}>
                            {reviewData && <Table
                                scroll={{ x: 720 }}
                                dataSource={reviewData}
                                columns={columns}
                                style={{ fontFamily: 'KanitRegular', cursor: 'pointer' }}
                                pagination={{
                                    total: reviewData?.length || 0,
                                    showTotal: (total, range) =>
                                        `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                                    defaultPageSize: 10,
                                    defaultCurrent: 1,
                                }}
                                onRow={(record, rowIndex) => {
                                    return {
                                      onClick: event => {
                                            history.push(`./review/${record.id}`);
                                            dispatch(allAction.lineAction.setActionPage('view'));
                                      }, // click row
                                    };
                                }}
                            >
                            </Table>}

                        </Col>
                    </Row>
                </Layout>
            </Spin>
        </>
    );
};

export default Review;
