/* eslint-disable  */
import {
  Layout,
  Spin,
  Modal,
  message,
  Col,
  Row,
  Table,
  Button,
  Avatar,
  Form,
  Input,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DownloadExcel } from 'react-excel-export';

const Admin = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { adminData } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [isDelete, setDelete] = useState(false);
  const [listResult, setListResult] = useState([]);
  

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setDelete(false)
    dispatch(allAction.adminAction.getAdminData(undefined, undefined))
      .then(() => {})
      .catch((e) => {
        console.log('e.message : ', e.message);
        message.error(e.message);
      });
  }, [isDelete]);

  useEffect(() => {
    var list = []
    if (selectedRowKeys.length == 0){
      if (adminData !== undefined){
        for (const element of adminData) {
          list.push(element)
        }
      }
    }else{
      for (const element of adminData) {
        for (const index of selectedRowKeys) {
          if (element.key == index) {
            list.push(element)
          }
        }
      }
    }
    setListResult(list);
  }, [selectedRowKeys,adminData]);

  const onFinishSearch = (value) => {
    window.scrollTo(0, 0);
    dispatch(allAction.adminAction.getAdminData(value.status, value.search))
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
      width: 120,
      key: 'id',
    },
    {
      title: 'สถานะ',
      key: 'status',
      align: 'center',
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
          ) : record.status == 'inactive' ? (
            <div
              style={{
                backgroundColor: '#D6000A',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRadius: 20,
                textAlign: 'center',
              }}
            >
              INACTIVE
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: 'ตำเเหน่ง',
      dataIndex: '',
      width: '10%',
      key: 'role',
      render: (record) => (
        <div>
          {record.role === 'super_admin' ? (
            <div>Super Admin</div>
          ) : (
            <div>Admin</div>
          )}
        </div>
      ),
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
    {
      title: 'Email',
      dataIndex: 'email',
      width: '16%',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: '16%',
      key: 'username',
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'tel',
      width: '10%',
      key: 'tel',
    },
    {
      title: 'วันที่เข้าระบบล่าสุด',
      dataIndex: 'last_login',
      key: 'last_login',
    },
  ];

  const handleFilterChange = (value) => {};

  const showConfirm = () => {
    Modal.confirm({
      title: 'คุณต้องการลบข้อมูลทั้งหมดที่เลือก?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        for (const element of adminData) {
          for (const index of selectedRowKeys) {
            if (element.key == index) {
              dispatch(allAction.adminAction.deleteAdmin(element.id_send))
                .then(() => {
                  window.location.reload();
                })
                .catch((e) => message.error(e.message));
            }
          }
        }
      },
      onCancel() {},
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
                <div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push('/admin/create')}
                    style={{ marginBottom: 12 }}
                    block
                  >
                    {t('create')}
                  </Button>
                  {/* <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    onClick={() => console.log('1234')}
                    style={{ marginTop: 12 }}
                    block
                  >
                    Export ข้อมูล
                  </Button> */}
                  <DownloadExcel
                    data={listResult.length == 0 ? adminData : listResult}
                    buttonLabel="Export ข้อมูล"
                    fileName="admin"
                    className="export-button"
                  />
                </div>
              ) : (
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    {/* <Button
                      type="primary"
                      icon={<ExportOutlined />}
                      onClick={() => console.log('1234')}
                      style={{ width: '140px', marginRight: 18 }}
                    >
                      Export ข้อมูล
                    </Button> */}
                    <DownloadExcel
                      data={listResult.length == 0 ? adminData : listResult}
                      buttonLabel="Export ข้อมูล"
                      fileName="admin"
                      className="export-button"
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => history.push('/admin/create')}
                      style={{ width: '120px', marginLeft: 18 }}
                    >
                      {t('create')}
                    </Button>
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

            <Row gutter={[8, 8]} align="middle">
              <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => showConfirm()}
                  style={{ width: '120px' }}
                >
                  ลบทั้งหมด
                </Button>
              </Col>
            </Row>
          </Form>
          <Row gutter={[24, 24]} style={{ marginTop: 18 }}>
            <Col xs={{ span: 24 }}>
              {adminData && (
                <Table
                  scroll={{ x: 720 }}
                  dataSource={adminData}
                  columns={columns}
                  rowSelection={rowSelection}
                  style={{ fontFamily: 'KanitRegular', cursor: 'pointer' }}
                  pagination={{
                    total: adminData?.length || 0,
                    showTotal: (total, range) =>
                      `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        history.push(`./admin/${record.id_send}`);
                        dispatch(allAction.lineAction.setActionPage('view'));
                      }, // click row
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

export default Admin;
