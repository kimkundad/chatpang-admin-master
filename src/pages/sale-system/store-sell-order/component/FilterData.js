import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Spin,
  Select,
  Table,
  Layout,
  AutoComplete,
  message,
  DatePicker,
} from 'antd';

import {
  CloseCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import allAction from '../../../../app/actions';

const { RangePicker } = DatePicker;

const { Option } = Select;

const FilterData = ({ onSearch, pageCode, exportFunction }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { masterLevelList, masterHubList, masterAgencyList } = useSelector(
    (state) => state.storeListSellReducer,
  );
  const { userLevel } = useSelector((state) => state.authenReducer);
  const { companyData } = useSelector((state) => state.companyReducer);
  const { masterStatus } = useSelector((state) => state.storeSellOrderReducer);

  // console.log('company : ', companyData);
  // console.log('masterHubList : ', masterHubList);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
    },
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  const exportItemAll = () => {
    // const f = form.getFieldsValue();
    const query = {
      companyId: form.getFieldValue('companyId'),
      hubId: form.getFieldValue('hubId'),
      agencyId: form.getFieldValue('agencyId'),
      orderStatusCode: form.getFieldValue('orderStatusCode'),
      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
      search: form.getFieldValue('search'),
    };

    dispatch(allAction.report.exportOrder(query));
    console.log('exportItemAll', query);
  };

  exportFunction.current = exportItemAll;

  useEffect(() => {
    // dispatch(allAction.storeListSellAction.getMasterLevel())
    //   .then()
    //   .catch((e) => message.error(e.message));

    const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    const end = moment(new Date(), 'YYYY-MM-DD');
    form.setFieldsValue({
      createdAt: [std, end],
    });
    dispatch(allAction.companyAction.getCompanyData())
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.storeListSellAction.getHubList())
      .then()
      .catch((e) => message.error(e.message));
    dispatch(
      allAction.storeListSellAction.getAgencyList({
        isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB']) ? 'ALL' : null,
      }),
    )
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.StoreSellOrder.getMasterStatus())
      .then()
      .catch((e) => message.error(e.message));
    // masterLevelList.filter((val) => !['SAD'].includes(val.levelCode));
  }, []);

  const handleSearchHub = (value) => {
    const objSearch = {
      search: value,
    };
    if (form.getFieldValue('companyId')) {
      objSearch.companyId = form.getFieldValue('companyId');
    }
    dispatch(allAction.userManagementAction.getHubList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };

  const handleSearchAgency = (value) => {
    const objSearch = {
      search: value,
      isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB']) ? 'ALL' : null,
    };
    if (form.getFieldValue('companyId')) {
      objSearch.companyId = form.getFieldValue('companyId');
    }
    if (form.getFieldValue('hubId')) {
      objSearch.hubId = form.getFieldValue('hubId');
    }
    dispatch(allAction.userManagementAction.getAgencyList(objSearch))
      .then()
      .catch((e) => message.error(e.message));
  };
  const handleSearchStatus = (value) => {
    const objSearch = {
      search: value,
    };
    // if (form.getFieldValue('companyId')) {
    //   objSearch.companyId = form.getFieldValue('companyId');
    // }
    // if (form.getFieldValue('hubId')) {
    //   objSearch.hubId = form.getFieldValue('hubId');
    // }
    // dispatch(allAction.userManagementAction.getAgencyList(objSearch))
    //   .then()
    //   .catch((e) => message.error(e.message));
  };

  const onReset = () => {
    form.resetFields();
    onSearch();
  };

  return (
    <>
      <Form
        form={form}
        {...formItemLayout}
        layout="vertical"
        onFinish={
          (value) => onSearch({
            companyId: value.companyId,
            hubId: value.hubId,
            agencyId: value.agencyId,
            orderStatusCode: value.orderStatusCode,
            startDate: value.createdAt ? moment(value.createdAt[0]).format('YYYY-MM-DD') : null,
            endDate: value.createdAt ? moment(value.createdAt[1]).format('YYYY-MM-DD') : null,
            search: value.search,
          })
        }
      >
        <Row gutter={[8, 4]}>
          {FilterUserLevel(['SAD']) && (
            <Col flex="1 1 100px">
              <Form.Item label={t('company-select')} name="companyId">
                <Select
                  // allowClear
                  showSearch
                  optionFilterProp="children"
                  defaultValue=""
                  onChange={(e) => {
                    form.resetFields(['hubId', 'agencyId']);
                  }}
                  filterOption={(input, option) => option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0}
                  onSelect={(e) => {
                    onSearch({
                      companyId: e,
                      hubId: form.getFieldValue('hubId'),
                      agencyId: form.getFieldValue('agencyId'),
                      orderStatusCode: form.getFieldValue('orderStatusCode'),
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                      search: form.getFieldValue('search'),
                    });
                    dispatch(
                      allAction.userManagementAction.getHubList({
                        companyId: e,
                      }),
                    );
                    dispatch(
                      allAction.userManagementAction.getAgencyList({
                        companyId: e,
                        isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB'])
                          ? 'ALL'
                          : null,
                      }),
                    );
                  }}
                >
                  <Option value="">{t('all-select')}</Option>
                  {companyData
                    && companyData.map((val) => (
                      <Option value={val.companyId}>{val.companyName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {FilterUserLevel(['SAD', 'COM']) && (
            <Col flex="1 1 100px">
              <Form.Item label={t('hub')} name="hubId">
                <Select
                  // allowClear
                  showSearch
                  defaultValue=""
                  onSearch={handleSearchHub}
                  onChange={(e) => {
                    form.resetFields(['agencyId']);
                  }}
                  onSelect={(e) => {
                    onSearch({
                      companyId: form.getFieldValue('companyId'),
                      hubId: e,
                      agencyId: form.getFieldValue('agencyId'),
                      orderStatusCode: form.getFieldValue('orderStatusCode'),
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                      search: form.getFieldValue('search'),
                    });
                    dispatch(
                      allAction.userManagementAction.getAgencyList({
                        hubId: e,
                        isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB'])
                          ? 'ALL'
                          : null,
                      }),
                    );
                  }}
                  filterOption={(input, option) => option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">{t('all-select')}</Option>

                  {masterHubList
                    && masterHubList.map((val) => (
                      <Option value={val.hubId}>{val.hubName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
            <Col flex="1 1 100px">
              <Form.Item label={t('agency')} name="agencyId">
                <Select
                  // allowClear
                  showSearch
                  defaultValue=""
                  onSearch={handleSearchAgency}
                  onSelect={(e) => {
                    onSearch({
                      companyId: form.getFieldValue('companyId'),
                      hubId: form.getFieldValue('hubId'),
                      agencyId: e,
                      orderStatusCode: form.getFieldValue('orderStatusCode'),
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                      search: form.getFieldValue('search'),
                    });
                  }}
                  filterOption={(input, option) => option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">{t('all-select')}</Option>

                  {masterAgencyList
                    && masterAgencyList.map((val) => (
                      <Option value={val.agencyId}>
                        {val.agencyCode}
                        {/* {val.isCustomer
                          ? `${val?.customerData?.customerName || ''} ${val?.customerData?.customerLastName || ''
                          }`
                          : val.agencyCode} */}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col flex="1 1 100px">
            <Form.Item label={t('status')} name="orderStatusCode">
              <Select
                // allowClear
                // showSearch
                defaultValue=""
                onSearch={handleSearchStatus}
                onSelect={(e) => {
                  onSearch({
                    companyId: form.getFieldValue('companyId'),
                    hubId: form.getFieldValue('hubId'),
                    agencyId: form.getFieldValue('agencyId'),
                    orderStatusCode: e,
                    startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                    endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                    search: form.getFieldValue('search'),
                  });
                }}
              >
                <Option value="">{t('all-select')}</Option>

                {masterStatus
                  && masterStatus.map((val) => (
                    <Option value={val.orderStatusCode}>
                      {val.orderStatusDesc}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item name="createdAt" label={t('date')}>
              <RangePicker
                // style={{ width: '100%' }}
                placeholder={[t('date'), t('date')]}
                onChange={(e) => {
                  onSearch({
                    companyId: form.getFieldValue('companyId'),
                    hubId: form.getFieldValue('hubId'),
                    agencyId: form.getFieldValue('agencyId'),
                    orderStatusCode: form.getFieldValue('orderStatusCode'),
                    startDate: e ? moment(e[0]).format('YYYY-MM-DD') : null,
                    endDate: e ? moment(e[1]).format('YYYY-MM-DD') : null,
                    search: form.getFieldValue('search'),
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item name="search" label="&nbsp;">
              <Input
                allowClear
                onChange={(e) => {
                  if (e.target.value === '') {
                    onSearch({
                      companyId: form.getFieldValue('companyId'),
                      hubId: form.getFieldValue('hubId'),
                      agencyId: form.getFieldValue('agencyId'),
                      orderStatusCode: form.getFieldValue('orderStatusCode'),
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                      search: form.getFieldValue('search'),
                    });
                  }
                }}
                placeholder={t('search')}
              />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item name="search" label=" ">
              <Button
                block
                type="default"
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{ width: '120px' }}
              >
                {t('search')}
              </Button>
            </Form.Item>
            {/* <Form.Item name="search">
              <Button block type="default" htmlType="button" icon={<CloseCircleOutlined />} onClick={onReset}>{t('clear-search')}</Button>

            </Form.Item> */}
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FilterData;
