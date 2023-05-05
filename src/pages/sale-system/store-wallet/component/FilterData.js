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
  DatePicker,
  message,
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

const { Option } = Select;
const { RangePicker } = DatePicker;
const FilterData = ({ onSearch, pageCode }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { masterLevelList, masterHubList, masterAgencyList } = useSelector(
    (state) => state.storeListSellReducer,
  );
  const { userLevel, agencyId } = useSelector((state) => state.authenReducer);
  const isCustomer = useSelector((state) => state.authenReducer.isCustomer);

  const { companyData } = useSelector((state) => state.companyReducer);
  const { masterStatus } = useSelector((state) => state.storeSellOrderReducer);

  const { socket } = useSelector((state) => state.mainReducer);


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

  useEffect(() => {
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
    dispatch(allAction.storeListSellAction.getAgencyList())
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
        onFinish={() => onSearch({
          companyId: form.getFieldValue('companyId'),
          hubId: form.getFieldValue('hubId'),
          agencyId: form.getFieldValue('agencyId'),
          startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
          endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
        })}
      >
        <Row gutter={[8, 4]}>
          {FilterUserLevel(['SAD']) && (
            <Col xs={5}>
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
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                    });
                    dispatch(
                      allAction.userManagementAction.getHubList({
                        companyId: e,
                      }),
                    );
                    dispatch(
                      allAction.userManagementAction.getAgencyList({
                        companyId: e,
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
            <Col xs={5}>
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
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                    });
                    dispatch(
                      allAction.userManagementAction.getAgencyList({ hubId: e }),
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
            <Col xs={5}>
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
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                    });
                  }}
                  filterOption={(input, option) => option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">{t('all-select')}</Option>

                  {masterAgencyList
                    && masterAgencyList.map((val) => (
                      <Option value={val.agencyId}>{val.agencyCode}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col xs={5}>
            <Form.Item label={t('date')} name="createdAt">
              <RangePicker
                format="YYYY-MM-DD"
                onChange={(value) => {
                  onSearch({
                    companyId: form.getFieldValue('companyId'),
                    hubId: form.getFieldValue('hubId'),
                    agencyId: form.getFieldValue('agencyId'),
                    startDate: value ? moment(value[0]).format('YYYY-MM-DD') : null,
                    endDate: value ? moment(value[1]).format('YYYY-MM-DD') : null,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={4}>
            <Form.Item label=" ">
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
