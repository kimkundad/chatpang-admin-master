/* eslint-disable  */
import { Layout, Spin, Modal, message, Col, Row, Table, Button, Tag, Form,
    Input,
    Select  } from 'antd';
import {
  DeleteFilled,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const Package = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { packageData } = useSelector((state) => state.packageReducer);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onFinishSearch = (value) => {
    window.scrollTo(0, 0);
    dispatch(allAction.packageAction.getPackageData(value.status , value.search))
      .then(() => {})
      .catch((e) => {
        console.log('e.message : ', e.message);
        message.error(e.message);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.packageAction.getPackageData(undefined , undefined))
      .then(() => {})
      .catch((e) => {
        if (e.message === "Unauthorized"){
          window.localStorage.removeItem('authen-token');
          // push('./');
        }
        message.error(e.message);
      });
  }, []);

  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
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
      title: 'ชื่อเเพ็คเกจ',
      dataIndex: 'name',
      width: '20%',
      key: 'name',
    },
    {
      title: 'ราคา (บาท)',
      dataIndex: 'price',
      width: '20%',
      key: 'price',
    },
    {
        title: 'จำนวนเพจ',
        dataIndex: 'page_limit',
        width: '20%',
        key: 'page_limit',
        align: 'center',
      },
      {
        title: 'จำนวนวัน',
        dataIndex: 'days',
        width: '20%',
        key: 'days',
        align: 'center',
      },
      {
        title: 'ยอดนิยม',
        dataIndex: '',
        width: '20%',
        key: 'special_text',
        align: 'center',
        render: (record) => (
            <div>
                {record.special_text != null ?
                    <Tag color="#ff7157">ขายดี</Tag>
                    :
                    null
                }
               
            </div>
        )
      },
  ];

  const handleFilterChange = (value) => {
  };

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
                  message.success('Delete Success!');
                  // history.push('../admin');
                  setDelete(true)
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
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push('/package/create')}
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
                      onClick={() => history.push('/package/create')}
                      style={{ width: '120px' }}
                    >
                      {t('create')}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <Form layout="vertical" form={form} onFinish={onFinishSearch} style={{ marginTop: 12 }}>
            <Row gutter={[8, 8]} align="middle">
              <Col
                xs={{ span: 24 }}
                lg={{ span: 4 }}
              >
                <Form.Item label={'สถานะ'} name="status">
                    <Select
                      defaultValue={t('all-select')}
                      onChange={handleFilterChange}
                    >
                      <Option value="">{t('all-select')}</Option>
                      <Option value='active'>ACTIVE</Option>
                      <Option value='inactive'>INACTIVE</Option>
                      <Option value='deleted'>DELETE</Option>
                    </Select>
                  </Form.Item>
              </Col>
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
              {packageData && (
                <Table
                  scroll={{ x: 720 }}
                  rowSelection={rowSelection}
                  dataSource={packageData}
                  columns={columns}
                  style={{ fontFamily: 'KanitRegular', cursor: 'pointer' }}
                  pagination={{
                    total: packageData?.length || 0,
                    showTotal: (total, range) =>
                      `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: event => {
                            history.push(`./package/${record.id}`);
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

export default Package;
