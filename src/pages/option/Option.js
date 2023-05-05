/* eslint-disable  */
import { Layout, Spin, message, Col, Row, Table, Avatar, Button, Form,
    Input,
    Select,
    DatePicker,
    Modal} from 'antd';
import { ExportOutlined , PlusCircleOutlined , MinusCircleOutlined,SearchOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { DownloadExcel } from "react-excel-export";

const Option = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { historyData } = useSelector((state) => state.historyReducer);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openDecrease, setOpenDecrease] = useState(false);
  const [openIncrease, setOpenIncrease] = useState(false);
  const [listResult, setListResult] = useState([]);
  const [daysDecrease, setDayDecrease] = useState(0);
  const [daysIncrease, setDayIncrease] = useState(0);
  const [facebookID, setFacebookId] = useState('');
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const history = useHistory();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { push } = useHistory();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.historyAction.getUserPaymentData(undefined,undefined,undefined,undefined))
      .then(() => {
        setRefresh(false)
      })
      .catch((e) => {
        if (e.message === "Unauthorized"){
          window.localStorage.removeItem('authen-token');
          // push('./');
        }
        message.error(e.message);
      });
  }, [refresh]);

  useEffect(() => {
    var list = []
    if (selectedRowKeys.length == 0){
      if (historyData !== undefined){
        for (const element of historyData) {
          list.push(element)
        }
      }
    }else{
      for (const element of historyData) {
        for (const index of selectedRowKeys) {
          if (element.key == index) {
            list.push(element)
          }
        }
      }
    }
    setListResult(list);
  }, [selectedRowKeys,historyData]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onFinishSearch = (value) => {
    window.scrollTo(0, 0);
    var StartDate = ''
    var ExpireDate = ''
    if (value.start_date != null){
        StartDate = moment(value.start_date).format('YYYY-MM-DD')
    } else {
        StartDate = undefined
    }

    if (value.expire_date != null){
        ExpireDate = moment(value.expire_date).format('YYYY-MM-DD')
    } else {
        ExpireDate = undefined
    }

    dispatch(allAction.historyAction.getUserPaymentData(value.status,value.search,StartDate ,ExpireDate))
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
      dataIndex: '',
      key: 'status',
      align: 'center',
      width: '10%',
      render: (record) => (
        <div>
          {record.status == 'paid' ? (
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
          ) : record.status == 'pending' ? (
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
      title: 'เเพ็คเกจปัจจุบัน',
      dataIndex: 'package',
      key: 'package',
      align: 'center',
      width: '12%',
    },
    {
      title: 'จำนวนครั้งที่ต่ออายุ',
      dataIndex: 'purchases',
      key: 'purchases',
      align: 'center',
      width: '12%',
    },
    {
      title: 'วันที่เริ่มใช้งาน',
      dataIndex: 'dateStart',
      key: 'dateStart',
    },
    {
      title: 'วันที่หมดอายุ',
      dataIndex: 'dateEnd',
      key: 'dateEnd',
    },
    {
        title: 'การกระทำ',
        dataIndex: '',
        key: 'no',
        align: 'center',
        width: '6%',
        render: (record) =>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <MinusCircleOutlined
                    style={{ fontSize: 22 , color : "#D6000A" }}
                    onClick={() => {
                        setFacebookId(record.userId)
                        setOpenDecrease(true)
                    }}
                />
                <PlusCircleOutlined
                    style={{ marginLeft: 24, fontSize: 22, color : "#18AF06"}}
                    onClick={() => {
                        setFacebookId(record.userId)
                        setOpenIncrease(true)
                    }}
                />
            </div>,
    },
  ];
  

  const handleFilterChange = (value) => {
  };

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };


  const handleIncreaseOk = () => {
    if (selectedRowKeys.length == 0){
      var data = {
        days: parseInt(daysIncrease)
    }
    dispatch(allAction.historyAction.updateIncreaseOrder(facebookID, data))
              .then(() => {
                setRefresh(true)
                setOpenIncrease(false)
                setDayIncrease(0)
              })
              .catch((e) => message.error(e.message));
    }else{
      showConfirmDecrease();
    }
   
  };

  const handleIncreaseCancel = () => {
    setOpenIncrease(false)
  };


  const handleDecreaseOk = () => {
    if (selectedRowKeys.length == 0){
      var data = {
        days: parseInt(daysDecrease)
    }
    dispatch(allAction.historyAction.updateDecreaseOrder(facebookID, data))
              .then(() => {
                setRefresh(true)
                setOpenDecrease(false)
                setDayDecrease(0)
              })
              .catch((e) => message.error(e.message));
    }else{
      showConfirmIncrease();
      // 
    }
   
  };

  const handleDecreaseCancel = () => {
    setOpenDecrease(false)
  };

  const handleTextInputIncrease = (e) => {
    setDayIncrease(e.target.value)
  };

  const handleTextInputDecrease = (e) => {
    setDayDecrease(e.target.value)
  };


  const showConfirmDecrease = () => {
    Modal.confirm({
      title: 'คุณต้องการลดวันทั้งหมดที่เลือก?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        var data = {
          days: parseInt(daysIncrease)
        }
        for (const element of historyData) {
          for (const index of selectedRowKeys) {
            if (element.key == index) {
            dispatch(allAction.historyAction.updateDecreaseOrder(element.userId, data))
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


  const showConfirmIncrease = () => {
    Modal.confirm({
      title: 'คุณต้องการเพิ่มวันทั้งหมดที่เลือก?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        var data = {
          days: parseInt(daysDecrease)
        }
        for (const element of historyData) {
          for (const index of selectedRowKeys) {
            if (element.key == index) {
              dispatch(allAction.historyAction.updateIncreaseOrder(element.userId, data))
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

  // console.log('list result 1234 : ' , listResult)

  return (
    <>
    <Modal
        title="ทำการเพิ่มวันใช้งานให้ลูกค้่า"
        visible={openIncrease}
        onOk={handleIncreaseOk}
        confirmLoading={confirmLoading}
        onCancel={handleIncreaseCancel}
      >
        <Form.Item label="จำนวนวัน">
            <Input allowClear onChange={handleTextInputIncrease}/>
        </Form.Item>
    </Modal>
    <Modal
        title="ทำการเพิ่มลดใช้งานให้ลูกค้่า"
        visible={openDecrease}
        onOk={handleDecreaseOk}
        confirmLoading={confirmLoading}
        onCancel={handleDecreaseCancel}
      >
        <Form.Item label="จำนวนวัน">
            <Input allowClear onChange={handleTextInputDecrease} />
        </Form.Item>
    </Modal>
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
                data={listResult.length == 0 ? historyData : listResult}
                buttonLabel="Export ข้อมูล"
                fileName="purchase"
                className="export-button"
            />
              ) : (
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    {/* <Button
                      type="primary"
                      icon={<ExportOutlined />}
                      onClick={() => console.log('1234', selectedRowKeys)}
                      style={{ width: '140px' }}
                    >
                      Export ข้อมูล
                    </Button> */}
                    <DownloadExcel
                        data={historyData}
                        buttonLabel="Export ข้อมูล"
                        fileName="purchase"
                        className="export-button"
                    />
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
                <Form.Item label={'วันที่เริ่มใช้งาน'} name="start_date">
                    <DatePicker onChange={onChange} style={{width : '100%'}}/>
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                lg={{ span: 4 }}
              >
                <Form.Item label={'วันที่หมดอายุ'} name="expire_date">
                    <DatePicker onChange={onChange} style={{width : '100%'}}/>
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
          </Form>

          <Row gutter={[8, 8]} align="middle">
              <Col xs={{ span: 24 }} lg={{ span: 3}}>
                <Button
                  type="primary"
                  onClick={() => {
                    // setFacebookId(record.userId)
                    setOpenDecrease(true)
                  }}
                  style={{ width: '140px',backgroundColor : "#18AF06" , borderColor : '#18AF06'  }}
                >
                  เพิ่มวันทั้งหมด
                </Button>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 3 }}>
                <Button
                  type="primary"
                  danger
                 
                  onClick={() => { 
                    // showConfirmDecrease()
                    setOpenIncrease(true)
                  }}
                  style={{ width: '140px',backgroundColor : "#D6000A"   }}
                >
                  ลดวันทั้งหมด
                </Button>
              </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: 18 }}>
            <Col xs={{ span: 24 }}>
              {historyData && (
                <Table
                  scroll={{ x: 720 }}
                  dataSource={historyData}
                  columns={columns}
                  rowSelection={rowSelection}
                  style={{ fontFamily: 'KanitRegular', cursor: 'pointer' }}
                  pagination={{
                    total: historyData?.length || 0,
                    showTotal: (total, range) =>
                      `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
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

export default Option;
