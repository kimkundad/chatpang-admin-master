/* eslint-disable  */
import { Layout, Spin, message, Col, Row, Table, Modal, Button,   Form,
    Input,
    Select } from 'antd';
import { DeleteFilled,ExportOutlined,SearchOutlined,PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../app/actions/index';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DownloadExcel } from "react-excel-export";

const Line = (props) => {
  const { isLoading, isMobile } = useSelector((state) => state.mainReducer);
  const { lineData } = useSelector((state) => state.lineReducer);
  const [listResult, setListResult] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    var list = []
    if (selectedRowKeys.length == 0){
      if (lineData !== undefined){
        for (const element of lineData) {
          list.push(element)
        }
      }
    }else{
      for (const element of lineData) {
        for (const index of selectedRowKeys) {
          if (element.key == index) {
            list.push(element)
          }
        }
      }
    }
    setListResult(list);
  }, [selectedRowKeys,lineData]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allAction.lineAction.getLineData(undefined , undefined))
      .then(() => {})
      .catch((e) => {
        if (e.message === "Unauthorized"){
          window.localStorage.removeItem('authen-token');
          // push('./');
        }
        message.error(e.message);
      });
  }, []);

  const onFinishSearch = (value) => {
    window.scrollTo(0, 0);
    dispatch(allAction.lineAction.getLineData(value.status , value.search))
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
      width: '16%',
      key: 'id',
    },
    {
        title: 'สถานะ',
        dataIndex: '',
        width: '6%',
        align: 'center',
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
        title: 'ชื่อกลุ่ม Line',
        dataIndex: 'name',
        width: 200,
        key: 'name',
      },
    {
      title: 'Line access Token',
      dataIndex: 'token',
      width: 200,
      key: 'token',
    },
  ];

  const handleFilterChange = (value) => {
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
                    onClick={() => history.push('/line/create')}
                    style={{ marginBottom: 12 }}
                    block
                  >
                    {t('create')}
                  </Button>
                  <DownloadExcel
              data={listResult.length == 0 ? lineData : listResult}
              buttonLabel="Export ข้อมูล"
              fileName="line"
              className="export-button"
          />
              </div>
             
              ) : (
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                  <DownloadExcel
                data={listResult.length == 0 ? lineData : listResult}
                buttonLabel="Export ข้อมูล"
                fileName="line"
                className="export-button"
            />
             <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => history.push('/line/create')}
                      style={{ width: '120px', marginLeft: 18 }}
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
          </Form>
          <Row gutter={[24, 24]} style={{ marginTop: 18 }}>
            <Col xs={{ span: 24 }}>
              {lineData && (
                <Table
                  scroll={{ x: 720 }}
                  dataSource={lineData}
                  rowSelection={rowSelection}
                  columns={columns}
                  style={{ fontFamily: 'KanitRegular', cursor: 'pointer' }}
                  pagination={{
                    total: lineData?.length || 0,
                    showTotal: (total, range) =>
                      `แสดง ${range[0]}  ถึง ${range[1]} จาก ${total} รายการ`,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: event => {
                        history.push(`./line/${record.id}`);
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

export default Line;
