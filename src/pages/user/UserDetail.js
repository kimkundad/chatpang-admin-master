/* eslint-disable radix */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/order */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
/* eslint-disable no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable semi */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable max-len */
/* eslint-disable no-const-assign */
/* eslint-disable no-underscore-dangle */
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
  Table,
  Modal,
  message,
  Input,
  Select,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  RollbackOutlined,
  DeleteFilled,
  EditOutlined,
  SearchOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetch } from '../../utils/fetch';
import allAction from '../../app/actions/index';
import { DownloadExcel } from 'react-excel-export';

const UserDetail = (props) => {
  const { isMobile } = useSelector((state) => state.mainReducer);
  const [detail, setDetail] = useState({});
  const [pageDetail, setPageDetail] = useState([]);
  const [listPackage, setListPackage] = useState([]);
  const [listPackageDefault, setListPackageDefault] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [openUpdate, setUpdateDetail] = useState(false);
  const [packageID, setPackageID] = useState('');
  const [packageName, setPackageName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [dayCount, setDays] = useState(0);
  const [quotaCount, setQuota] = useState(0);
  const [netCount, setNet] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const {
    match: {
      params: { userId },
    },
  } = props;

  const [loading, setLoadIng] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMyAPI() {
      callDetail(userId);
      callAllPage();
    }
    fetchMyAPI();
  }, []);

  useEffect(() => {
    async function fetchMyAPI() {
    //   callDetail(userId);
      callAllPage();
    }
    fetchMyAPI();
  }, [detail]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const callDetail = async (userId) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: '/facebook-users/' + userId,
    })
      .then((res) => {
        const { data } = res.data;
        setDetail(data);
        setLoadIng(false);
        fetch({
          method: 'get',
          url: '/facebook-pages/' + data.id + '/facebook-user',
        })
          .then((resData) => {
            setLoadIng(false);
            var list = [];
            for (const element of resData.data.data.results) {
              var value = {
                id: element.id.substring(
                  element.id.length - 5,
                  element.id.length
                ),
                id_send: element.id,
                name: element.name,
                expire_date: moment(element.expire_date).format('YYYY/MM/DD'),
              };
              list.push(value);
            }
            setPageDetail(list);
            fetch({
              method: 'get',
              url: '/orders/' + userId + '/facebook-user',
            })
              .then((resDataHistory) => {
                setLoadIng(false);
                var list = []
                for (const element of resDataHistory.data.data.results) {
                    var obj = {
                        ...element,
                        isConfirm: element.state === "pending"
                    }
                    list.push(obj);
                }
                setOrderDetail(list);
              })
              .catch((error) => {
                setLoadIng(false);
                console.log(error);
              });
          })
          .catch((error) => {
            setLoadIng(false);
            console.log(error);
          });
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const callPageDetailFilter = async (userDefaultID, search) => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url:
        '/facebook-pages/' + userDefaultID + '/facebook-user?search=' + search,
    })
      .then((resData) => {
        setLoadIng(false);
        var list = [];
        for (const element of resData.data.data.results) {
          var value = {
            id: element.id.substring(element.id.length - 5, element.id.length),
            id_send: element.id,
            name: element.name,
            expire_date: moment(element.expire_date).format('YYYY/MM/DD'),
          };
          list.push(value);
        }
        setPageDetail(list);
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const callAllPage = async () => {
    setLoadIng(true);
    fetch({
      method: 'get',
      url: '/packages',
    })
      .then((resData) => {
        setLoadIng(false);
        var list = [];
        for (const element of resData.data.data.results) {
          var value = {
            id: element.id,
            name: element.name,
          };
          if (detail.order !== undefined) {
            if (detail.order.package.name === element.name) {
                setPackageName(element.name)
                setPageCount(element.page_limit)
                setLineCount(element.line_notification_limit)
                setDays(element.days)
                setQuota(element.quota_limit)
                setNet(element.price)
            }
          }
          list.push(value);
        }
        setListPackageDefault(resData.data.data.results)
        setListPackage(list);
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const callUpdatePaymeny = async (orderID) => {
    setLoadIng(true);
    fetch({
      method: 'patch',
      url:
        '/orders/' + orderID + '/paid',
    })
      .then((resData) => {
        setLoadIng(false);
        callDetail(userId);
        callAllPage();
      })
      .catch((error) => {
        setLoadIng(false);
        console.log(error);
      });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'คุณต้องการลบข้อมูล?',
      icon: <DeleteFilled />,
      onOk() {
        dispatch(allAction.userAction.deletePageUser(id))
          .then(() => {
            message.success('Delete Success!');
            callDetail(userId);
          })
          .catch((e) => message.error(e.message));
      },
      onCancel() {},
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      key: 'id',
    },
    {
      title: 'ชื่อเพจ',
      dataIndex: 'name',
      width: '40%',
      key: 'name',
    },
    {
      title: 'วันหมดอายุ',
      dataIndex: 'expire_date',
      width: 10,
      key: 'expire_date',
    },
    {
      title: 'การกระทำ',
      dataIndex: '',
      key: 'no',
      align: 'center',
      width: 10,
      render: (record) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DeleteFilled
            style={{ marginLeft: 24, fontSize: 18, color: '#FF0000' }}
            onClick={() => {
              confirmDelete(record.id_send);
            }}
          />
        </div>
      ),
    },
  ];

  const columnsHistory = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '20%',
      key: 'id',
    },
    {
      title: 'สถานะ',
      dataIndex: '',
      width: '40%',
      key: 'status',
      render: (record) => (
        <div>
          {record.status === 'active' ? (
            <div
              style={{
                backgroundColor: '#18AF06',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRadius: 20,
                textAlign: 'center',
                width: '80px',
              }}
            >
              ACTIVE
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: 'สถานะ การชำระเงิน',
      dataIndex: '',
      width: '40%',
      key: 'state',
      render: (record) => (
        <div>
          {record.state === 'paid' ? (
            <div
              style={{
                backgroundColor: '#18AF06',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRadius: 20,
                textAlign: 'center',
                width: '80px',
              }}
            >
              จ่ายเเล้ว
            </div>
          ) : record.state === 'pending' ? (
            <div
              style={{
                backgroundColor: '#DCDC33',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRadius: 20,
                textAlign: 'center',
                width: '80px',
              }}
            >
              รอยืนยัน
            </div>
          ) : null}
        </div>
      ),
    },
    {
        title: 'การกระทำ',
        dataIndex: '',
        key: 'no',
        align: 'center',
        width: 10,
        render: (record) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {record.isConfirm ?
                <Button
                 type="primary"
                //  icon={<EditOutlined />}
                 size="small"
                 block
                 style={{ width: 100, marginTop: 12 }}
                 onClick={() => {
                    handleUpdatePayment(record)
                 }}
               >
                 อัพเดต
               </Button>
                :
                null}
          </div>
        ),
      },
  ];

  const handleUpdateOk = () => {
    var data = {
      packageId: packageID,
      quotaLimit: parseInt(quotaCount),
      pageLimit: parseInt(pageCount),
      lineNotificationLimit: parseInt(lineCount),
      days: parseInt(dayCount),
      net: parseInt(netCount),
    };

    dispatch(allAction.userAction.updatePackageUser(userId, data))
      .then(() => {
        message.success('Update Success!');
        setUpdateDetail(false);
        history.push('../user');
      })
      .catch((e) => message.error(e.message));
  };

  const handleUpdateCancel = () => {
    setUpdateDetail(false);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    for (const element of listPackageDefault) {
        if (e === element.id) {
            setPackageName(element.name)
            setPageCount(element.page_limit)
            setLineCount(element.line_notification_limit)
            setDays(element.days)
            setQuota(element.quota_limit)
            setNet(element.price)
        }
    }
    setPackageID(e);
  };

  const onChangePageCount = (e) => {
    setPageCount(e.target.value);
  };

  const onChangeLineCount = (e) => {
    setLineCount(e.target.value);
  };

  const onChangeDays = (e) => {
    setDays(e.target.value);
  };

  const onChangeNet = (e) => {
    setNet(e.target.value);
  };

  const onChangeQuota = (e) => {
    setQuota(e.target.value);
  };

  const handleUpdatePayment = (values) => {
    // const data = {
    //     name: values.name,
    //     token: values.token,
    //     status: values.status ? 'active' : 'inactive',
    //   };
    Modal.confirm({
      title: 'คุณต้องการอัพเดตการจ่ายเงิน?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        window.scrollTo(0, 0);
        callUpdatePaymeny(values.id);
        // console.log('values : ', values.order_id)
        // callUpdatePaymeny(values.)
        // dispatch(allAction.lineAction.updateLineDetail(lineId, data))
        //   .then(() => {
        //     message.success('Update Success!');
        //     history.push('../line');
        //     // dispatch(allAction.lineAction.setActionPage('view'));
        //   })
        //   .catch((e) => message.error(e.message));
      },
      onCancel() {},
    });
  };

  return (
    // eslint-disable-next-line react/jsx-indent
    <>
      <Modal
        title="คุณต้องการอัพเดตข้อมูล?"
        visible={openUpdate}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      >
        <div>
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
              <Typography.Text>Package :</Typography.Text>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 18 }}>
              <Select
                defaultValue={packageName}
                onChange={handleFilterChange}
                style={{ width: '100%' }}
              >
                <Option value="">{t('all-select')}</Option>
                {listPackage.map((field) => (
                  <Option value={field.id}>{field.name}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
              <Typography.Text>จำนวนเพจ :</Typography.Text>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 18 }}>
              <Input value={pageCount} onChange={onChangePageCount}></Input>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
              <Typography.Text>จำนวนไลน์ Notify :</Typography.Text>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 18 }}>
              <Input value={lineCount} onChange={onChangeLineCount}></Input>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
              <Typography.Text>จำนวนวันสมาชิก :</Typography.Text>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 18 }}>
              <Input value={dayCount} onChange={onChangeDays}></Input>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
              <Typography.Text>จำนวนบอท Limit :</Typography.Text>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 18 }}>
              <Input value={quotaCount} onChange={onChangeQuota}></Input>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
              <Typography.Text>จำนวนเงิน :</Typography.Text>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 18 }}>
              <Input value={netCount} onChange={onChangeNet}></Input>
            </Col>
          </Row>
        </div>
      </Modal>
      <Spin spinning={loading} tip="Loading...">
        <Form.Item>
          {isMobile ? (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Button
                    type="default"
                    icon={<RollbackOutlined />}
                    onClick={() => history.push('../user')}
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
                onClick={() => history.push('../user')}
                style={{ width: '100px', float: 'left' }}
              >
                ยกเลิก
              </Button>
            </>
          )}
        </Form.Item>
        <Card
          // eslint-disable-next-line react/jsx-indent-props
          title={
            <Typography.Title level={3}>
              <span>User ID : {userId}</span>
            </Typography.Title>
          }
        >
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} lg={{ span: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Avatar
                  src={detail.picture}
                  style={{ width: 100, height: 100, marginTop: 6 }}
                />
                <Typography.Text style={{ marginTop: 24 }}>
                  ชื่อ - นามสกุล : {detail.name}
                </Typography.Text>
                <Typography.Text style={{ marginTop: 12 }}>
                  อีเมล : {detail.email}
                </Typography.Text>
                <Typography.Text style={{ marginTop: 12 }}>
                  เบอร์โทรศัพท์ : {detail.tel}
                </Typography.Text>
                <Typography.Text style={{ marginTop: 12 }}>
                  สถานะ : {detail.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                </Typography.Text>
              </div>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 8 }}>
              <Card
                title={
                  <Typography.Title level={5}>
                    <span>เเพ็คเกจปัจจุบัน</span>
                  </Typography.Title>
                }
                style={{ borderRadius: 12 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography.Text style={{ marginTop: 4 }}>
                    ชื่อเเพ็คเกจ :{' '}
                    {detail.order !== undefined
                      ? detail.order.package.name
                      : ''}
                  </Typography.Text>
                  {detail.expire_date == null ||
                  detail.expire_date === undefined ? null : (
                    <>
                      <Typography.Text
                        style={{ color: '#FF0000', marginTop: 12 }}
                      >
                        วันหมดอายุ :
                      </Typography.Text>
                      <div
                        style={{
                          backgroundColor: '#EFEFEF',
                          width: 100,
                          marginTop: 6,
                          display: 'flex',
                          justifyContent: 'center',
                          borderRadius: 4,
                        }}
                      >
                        {moment(detail.expire_date).format('YYYY/MM/DD')}
                      </div>
                    </>
                  )}
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    block
                    style={{ width: 100, marginTop: 12 }}
                    onClick={() => {
                      setUpdateDetail(true);
                    }}
                  >
                    อัพเดต
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 36 }}>
            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
              {pageDetail && (
                <>
                  <Typography.Text style={{ marginTop: 24, fontSize: 24 }}>
                    รายชื่อเพจ
                  </Typography.Text>
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
                          data={pageDetail}
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
                              data={pageDetail}
                              buttonLabel="Export ข้อมูล"
                              fileName="user"
                              className="export-button"
                            />
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]} align="middle" style={{ marginTop: 12 }}>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                      <Form.Item>
                        <Input
                          placeholder={t('search')}
                          allowClear
                          onChange={onChangeSearch}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                      <Form.Item>
                        <Button
                          type="default"
                          icon={<SearchOutlined />}
                          htmlType="submit"
                          style={{ width: isMobile ? '100%' : '100px' }}
                          onClick={() => {
                            callPageDetailFilter(detail.id, search);
                          }}
                        >
                          {t('search')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Table
                    scroll={{ x: 720 }}
                    dataSource={pageDetail}
                    rowSelection={rowSelection}
                    columns={columns}
                    style={{
                      fontFamily: 'KanitRegular',
                      cursor: 'pointer',
                      marginTop: 12,
                    }}
                    pagination={{
                      total: pageDetail?.length || 0,
                      showTotal: (total, range) => `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                    }}
                  ></Table>
                </>
              )}
            </Col>
          </Row>

          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 36 }}>
            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
              {orderDetail && (
                <>
                  <Typography.Text style={{ marginTop: 24, fontSize: 24 }}>
                    กิจกรรมของลูกค้า
                  </Typography.Text>
                  <Table
                    scroll={{ x: 720 }}
                    dataSource={orderDetail}
                    columns={columnsHistory}
                    style={{
                      fontFamily: 'KanitRegular',
                      cursor: 'pointer',
                      marginTop: 12,
                    }}
                    pagination={{
                      total: orderDetail?.length || 0,
                      showTotal: (total, range) => `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                    }}
                  ></Table>
                </>
              )}
            </Col>
          </Row>
        </Card>
      </Spin>
    </>
  );
};

export default UserDetail;
