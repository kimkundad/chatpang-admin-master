/* eslint-disable  */
import {
  Layout,
  Spin,
  message,
  Col,
  Row,
  Table,
  Avatar,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { DownloadExcel } from 'react-excel-export';

const User = (props) => {
  const { isMobile, isLoading } = useSelector((state) => state.mainReducer);
  const { userData } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [listResult, setListResult] = useState([]);
  const { push } = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(
      allAction.userAction.getUserData(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )
    )
      .then(() => {
      })
      .catch((e) => {
        if (e.message === "Unauthorized"){
          window.localStorage.removeItem('authen-token');
          // push('./');
        }
        message.error(e.message);
      });
  }, []);

  useEffect(() => {
    var list = [];
    if (selectedRowKeys.length == 0) {
      if (userData !== undefined) {
        for (const element of userData) {
          list.push(element);
        }
      }
    } else {
      for (const element of userData) {
        for (const index of selectedRowKeys) {
          if (element.key == index) {
            list.push(element);
          }
        }
      }
    }
    setListResult(list);
  }, [selectedRowKeys, userData]);

  const onFinishSearch = (value) => {
    var StartDate = '';
    var ExpireDate = '';
    if (value.start_date != null) {
      StartDate = moment(value.start_date).format('YYYY-MM-DD');
    } else {
      StartDate = undefined;
    }

    if (value.expire_date != null) {
      ExpireDate = moment(value.expire_date).format('YYYY-MM-DD');
    } else {
      ExpireDate = undefined;
    }

    window.scrollTo(0, 0);
    dispatch(
      allAction.userAction.getUserData(
        value.status_paid,
        value.status,
        StartDate,
        ExpireDate,
        value.search
      )
    )
      .then(() => {})
      .catch((e) => {
        console.log('e.message : ', e.message);
        message.error(e.message);
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
    },
    {
      title: 'สถานะ',
      dataIndex: '',
      key: 'status_payment',
      align: 'center',
      render: (record) => (
        <div>
          {record.status_payment == 'paid' ? (
            <div
              style={{
                backgroundColor: '#18AF06',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRadius: 20,
                textAlign: 'center',
              }}
            >
              จ่ายเเล้ว
            </div>
          ) : record.status_payment == 'pending' ? (
            <div
              style={{
                backgroundColor: '#DCDC33',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRadius: 20,
                textAlign: 'center',
              }}
            >
              รอยืนยัน
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: 'จำนวนเพจ',
      dataIndex: 'pages',
      key: 'pages',
      align: 'center',
    },
    {
      title: 'สถานะ User',
      dataIndex: '',
      key: 'status',
      render: (record) => (
        <div>
          {record.status == 'active' ? (
            <div
              style={{
                backgroundColor: '#18AF06',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRadius: 20,
                textAlign: 'center',
              }}
            >
              ACTIVE
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: 'การชำระ',
      dataIndex: 'purchases',
      key: 'purchases',
      align: 'center',
      width: '8%',
    },
    {
      title: 'ชื่อ - นามสกุล',
      dataIndex: '',
      key: 'name',
      width: '16%',
      render: (record) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={record.picture}
            style={{ width: 30, height: 30, marginRight: 8 }}
          />
          {record.name.length >= 14
            ? record.name.substring(0, 12) + ' ...'
            : record.name}
        </div>
      ),
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    //   width : '12px'
    // },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: 'เเพ็คเกจ',
      dataIndex: 'package',
      key: 'package',
      align: 'center',
    },
    {
      title: 'เริ่มใช้งาน',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'หมดอายุ',
      dataIndex: 'expire_date',
      key: 'expire_date',
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleFilterChange = (value) => {};

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
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
                // <Button
                //   type="primary"
                //   icon={<ExportOutlined />}
                //   onClick={() => console.log('1234')}
                //   block
                // >
                //   Export ข้อมูล
                // </Button>
                <DownloadExcel
                  data={listResult.length == 0 ? userData : listResult}
                  buttonLabel="Export ข้อมูล"
                  fileName="user"
                  className="export-button"
                />
              ) : (
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    {/* <Button
                      type="primary"
                      icon={<ExportOutlined />}
                      onClick={() => console.log('1234')}
                      style={{ width: '140px' }}
                    >
                      Export ข้อมูล
                    </Button> */}
                    <DownloadExcel
                      data={listResult.length == 0 ? userData : listResult}
                      buttonLabel="Export ข้อมูล"
                      fileName="user"
                      className="export-button"
                    />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinishSearch}
            style={{ marginTop: 12 }}
          >
            <Row gutter={[8, 8]} align="middle">
              <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                <Form.Item label={'สถานะการชำระเงิน'} name="status_paid">
                  <Select
                    defaultValue={t('all-select')}
                    onChange={handleFilterChange}
                  >
                    <Option value="">{t('all-select')}</Option>
                    <Option value="paid">จ่ายเเล้ว</Option>
                    <Option value="pending">รอยืนยัน</Option>
                    <Option value="canceled">หมดอายุ</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                <Form.Item label={'สถานะ'} name="status">
                  <Select
                    defaultValue={t('all-select')}
                    onChange={handleFilterChange}
                  >
                    <Option value="">{t('all-select')}</Option>
                    <Option value="active">ACTIVE</Option>
                    <Option value="inactive">INACTIVE</Option>
                    <Option value="deleted">DELETE</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                <Form.Item label={'วันที่เริ่มใช้งาน'} name="start_date">
                  <DatePicker onChange={onChange} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                <Form.Item label={'วันที่หมดอายุ'} name="expire_date">
                  <DatePicker onChange={onChange} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                <Form.Item name="search" label="&nbsp;">
                  <Input placeholder={t('search')} allowClear />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 2 }}>
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
              {userData && (
                <Table
                  scroll={{ x: 980 }}
                  dataSource={userData}
                  columns={columns}
                  rowSelection={rowSelection}
                  style={{ fontFamily: 'KanitRegular', cursor: 'pointer' }}
                  pagination={{
                    total: userData?.length || 0,
                    showTotal: (total, range) =>
                      `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        history.push(`./user/${record.id_send}`);
                        dispatch(allAction.lineAction.setActionPage('view'));
                      },
                    };
                  }}
                ></Table>
              )}
            </Col>
          </Row>
        </Layout>
      </Spin>
    </>
  );
};

export default User;
