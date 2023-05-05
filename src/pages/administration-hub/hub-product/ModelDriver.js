import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Layout,
  message,
  Form,
  Button,
  Input,
  Card,
  Space,
  Modal,
  Tag,
} from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../app/actions/index';
import FilterData from './component/FilterData';

const { Column } = Table;

const ModelDriver = (props) => {

  const {
    toChangeDriver,
    selectedTO,
    hubIdSelect,
    statusSelect,
    createSelect,
    modalCancelCancel,
    selectedRowKey,
  } = props;
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [searchDriver, setSearchDriver] = useState('');

  const {
    activeDriverList,
  } = useSelector((state) => state.hubProductReducer);

  const { hubId, permission, userLevel } = useSelector(
    (state) => state.authenReducer
  );

  console.log("selectedTO", selectedTO)

  return <>
    <Row gutter={24}>
      <Col xs={24} sm={8}>
        <Input
          allowClear
          placeholder={t('search')}
          onChange={(e) => {
            setSearchDriver(e.target.value);
          }}
          value={searchDriver}
        />
      </Col>
      <Col xs={24} sm={8}>
        <Button
          onClick={(e) => {
            dispatch(
              allAction.hubProductAction.getActiveDriver({
                hubId: hubIdSelect || hubId,
                search: searchDriver,
              })
            )
              .then()
              .catch((er) => message.error(er.message));
          }}
        >
          {t('search')}
        </Button>
      </Col>
    </Row>
    <Row>
      <Table
        size="small"
        style={{ marginTop: 24 }}
        // onChange={handleChange}
        dataSource={activeDriverList}
        // scroll={{ x: 1000 }}
        pagination={{
          total: activeDriverList?.length || 0,
          showTotal: (total, range) =>
            `${t('show')} ${range[0]}  ${t('to')} ${range[1]} ${t(
              'from'
            )} ${total} ${t('record')}`,
          defaultPageSize: 10,
          defaultCurrent: 1,
        }}
      >
        <Column
          width="20%"
          align="center"
          dataIndex="userId"
          key="userId"
          render={(text, obj) => (
            <>
              {!toChangeDriver ?
                <Button
                  size="small"
                  type="primary"
                  style={{ width: '60px' }}
                  onClick={() => {
                    // ปุ่มจ่ายงานให้คนขับ
                    dispatch(
                      allAction.hubProductAction.assignDriver({
                        transportationOrderIds:
                          selectedRowKey.length > 0
                            ? selectedRowKey
                            : [transportationOrderForCancel],
                        driverId: text,
                      })
                    )
                      .then(() => {
                        message.success('Assign Driver Success!');
                        dispatch(allAction.authenAction.getNotification());
                        dispatch(
                          allAction.hubProductAction.getTransportationOrderByHub({
                            hubId: hubIdSelect || hubId,
                            status: statusSelect,
                            startDate: createSelect?.[0]
                              ? moment(createSelect?.[0]).format('YYYY-MM-DD')
                              : null,
                            endDate: createSelect?.[1]
                              ? moment(createSelect?.[1]).format('YYYY-MM-DD')
                              : null,
                          })
                        )
                          .then()
                          .catch((e) => message.error(e.message));
                        modalCancelCancel();
                      })
                      .catch((e) => message.error(e.message));
                  }}
                >
                  {t('assign')}
                </Button> :
                <Button
                  size="small"
                  type="primary"
                  style={{ width: '110px' }}
                  onClick={() => {
                    // ปุ่มเปลี่ยนคนขับ
                    dispatch(
                      allAction.hubProductAction.changeDriver({
                        transportationOrderId: selectedTO.transportationOrderId,
                        driverId: text,
                      })
                    )
                      .then(() => {
                        message.success('Change Driver Success!');
                        dispatch(allAction.authenAction.getNotification());
                        dispatch(
                          allAction.hubProductAction.getTransportationOrderByHub({
                            hubId: hubIdSelect || hubId,
                            status: statusSelect,
                            startDate: createSelect?.[0]
                              ? moment(createSelect?.[0]).format('YYYY-MM-DD')
                              : null,
                            endDate: createSelect?.[1]
                              ? moment(createSelect?.[1]).format('YYYY-MM-DD')
                              : null,
                          })
                        )
                          .then()
                          .catch((e) => message.error(e.message));
                        modalCancelCancel();
                      })
                      .catch((e) => message.error(e.message));
                  }}
                >
                  {t('change-driver')}
                </Button>
              }
            </>
          )}
        />
        <Column
          width="30%"
          title={t('name')}
          ellipsis
          dataIndex="userData"
          key="userData"
          render={(text) => text.name}
        />
        <Column
          // width={60}
          title={t('phone-no')}
          ellipsis
          dataIndex="phoneNo"
          key="phoneNo"
        />
        <Column
          // width={60}
          title={t('total-job')}
          ellipsis
          dataIndex="totalJob"
          key="totalJob"
        />
      </Table>
    </Row>
  </>
};

export default ModelDriver;
