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

const FilterData = ({ onSearch, pageCode }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { masterLevelList, masterHubList, masterAgencyList } = useSelector(
    (state) => state.storeSettingReducer,
  );
  const { userLevel, agencyId } = useSelector((state) => state.authenReducer);
  const { companyData } = useSelector((state) => state.companyReducer);

  // console.log('company : ', companyData);
  // console.log('masterHubList : ', masterHubList);
  // console.log('masterAgencyList', masterAgencyList);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
    },
  };

  const FilterUserLevel = (value) => {
    const resLev = value.includes(userLevel);
    return resLev;
  };

  useEffect(() => {
    // console.log(FilterUserLevel(['SAD', 'COM', 'HUB']));
    const std = moment(new Date(), 'YYYY-MM-DD').subtract(2, 'days');
    const end = moment(new Date(), 'YYYY-MM-DD');
    form.setFieldsValue({
      createdAt: [std, end],
    });
    // dispatch(allAction.storeListSellAction.getMasterLevel())
    //   .then()
    //   .catch((e) => message.error(e.message));
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
    // onSearch();
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
        onFinish={() => onSearch({
          agencyId: form.getFieldValue('agencyId') || agencyId,
          status: form.getFieldValue('status'),
          startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
          endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
        })}
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
                  <Option value="">{t('please-select')}</Option>
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
                  onSelect={(e) => dispatch(
                    allAction.userManagementAction.getAgencyList({
                      hubId: e,
                      isCustomer: FilterUserLevel(['SAD', 'COM', 'HUB'])
                        ? 'ALL'
                        : null,
                    }),
                  )}
                  filterOption={(input, option) => option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">{t('please-select')}</Option>

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
                  onChange={(e) => {
                    onSearch({
                      agencyId: e,
                      status: form.getFieldValue('status') || 'NOT_COMPLETE',
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                    });
                  }}
                  showSearch
                  defaultValue=""
                  onSearch={handleSearchAgency}
                  filterOption={(input, option) => option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">{t('please-select')}</Option>

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
          <Col xs={24} sm={6}>
            <Form.Item label={t('status-work')} name="status">
              <Select
                // allowClear
                defaultValue="NOT_COMPLETE"
                onChange={(e) => {
                  onSearch({
                    agencyId: form.getFieldValue('agencyId') || agencyId,
                    status: e,
                    startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                    endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                  });
                }}
              >
                <Option value="NOT_COMPLETE">{t('not-complete-work')}</Option>
                <Option value="ON_SITE">{t('on-site')}</Option>
                <Option value="ALL">{t('all-work')}</Option>

              </Select>
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
            <Form.Item name="createdAt" label={t('date')}>
              <RangePicker
                placeholder={[t('date'), t('date')]}
                // onChange={handleSearchDate}
                onChange={(e) => {
                  onSearch({
                    agencyId: form.getFieldValue('agencyId') || agencyId,
                    status: form.getFieldValue('status') || 'NOT_COMPLETE',
                    startDate: e ? moment(e[0]).format('YYYY-MM-DD') : null,
                    endDate: e ? moment(e[1]).format('YYYY-MM-DD') : null,
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FilterData;
