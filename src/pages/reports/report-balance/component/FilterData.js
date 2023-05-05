import React, { useEffect, useState } from 'react';
import {
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
  Input
} from 'antd';

import {
  CloseCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import moment from 'moment';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import allAction from '../../../../app/actions';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FilterData = ({ onSearch, pageCode,exportFunction }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  // console.log('userLevel : ' , userLevel)

  const { masterLevelList, masterHubList, masterAgencyList } = useSelector(
    (state) => state.storeListSellReducer
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

  useEffect(() => {
    // dispatch(allAction.storeListSellAction.getMasterLevel())
    //   .then()
    //   .catch((e) => message.error(e.message));
    const std = moment(new Date(), 'YYYY-MM-DD');
    const end = moment(new Date(), 'YYYY-MM-DD');
    form.setFieldsValue({
      createdAt: [std, end],
    });
  }, []);

  const exportLogBalance = () => {
    // const f = form.getFieldsValue();
    
    const query = {
        companyId: form.getFieldValue('companyId'),
        hubId: form.getFieldValue('hubId'),
        agencyId: form.getFieldValue('agencyId'),
        startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
        endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
        filterName: form.getFieldValue('filterName')
      };
      console.log("query",query)

      dispatch(allAction.reportBalanceAction.exportLogBalance(query));
  };

  exportFunction.current = exportLogBalance;

  useEffect(() => {
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


  console.log('userLevel : 1234 : ', userLevel)

  return (
    <>
      <Form
        form={form}
        {...formItemLayout}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={[8, 4]}>
          {FilterUserLevel(['SAD']) && (
            <Col xs={{ span: 24 }} lg={{ span: 3 }}>
              <Form.Item label={t('company-select')} name="companyId">
                <Select
                  // allowClear
                  showSearch
                  optionFilterProp="children"
                  defaultValue=""
                  onChange={(e) => {
                    form.resetFields(['hubId', 'agencyId']);
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={(e) => {
                    form.setFieldsValue({ 'filterName': '' })
                    onSearch({
                      companyId: e,
                      createdAt: form.getFieldValue('createdAt'),
                      filterName: form.getFieldValue('filterName')
                    });
                    dispatch(
                      allAction.userManagementAction.getHubList({
                        companyId: e,
                      })
                    );
                    dispatch(
                      allAction.userManagementAction.getAgencyList({
                        companyId: e,
                      })
                    );
                  }}
                >
                  <Option value="">{t('all-select')}</Option>
                  {companyData &&
                    companyData.map((val) => (
                      <Option value={val.companyId}>{val.companyName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {FilterUserLevel(['SAD', 'COM']) && (
            <Col xs={{ span: 24 }} lg={{ span: 3 }}>
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
                    form.setFieldsValue({ 'filterName': '' })
                    onSearch({
                      companyId: form.getFieldValue('companyId'),
                      hubId: e,
                      createdAt: form.getFieldValue('createdAt'),
                      filterName: form.getFieldValue('filterName')
                    });
                    dispatch(
                      allAction.userManagementAction.getAgencyList({ hubId: e })
                    );
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">{t('all-select')}</Option>

                  {masterHubList &&
                    masterHubList.map((val) => (
                      <Option value={val.hubId}>{val.hubName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {FilterUserLevel(['SAD', 'COM', 'HUB']) && (
            <Col xs={{ span: 24 }} lg={{ span: 3 }}>
              <Form.Item label={t('agency')} name="agencyId">
                <Select
                  // allowClear
                  showSearch
                  defaultValue=""
                  onSearch={handleSearchAgency}
                  onSelect={(e) => {
                    form.setFieldsValue({ 'filterName': '' })
                    onSearch({
                      companyId: form.getFieldValue('companyId'),
                      hubId: form.getFieldValue('hubId'),
                      agencyId: e,
                      createdAt: form.getFieldValue('createdAt'),
                      filterName: form.getFieldValue('filterName')
                    });
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">{t('all-select')}</Option>

                  {masterAgencyList &&
                    masterAgencyList.map((val) => (
                      <Option value={val.agencyId}>{val.agencyCode}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col xs={{ span: 24 }} lg={{ span: 6 }}>
            <Form.Item label={t('date')} name="createdAt">
              <RangePicker
                format="YYYY-MM-DD"
                defaultValue={[moment(), moment()]}
                onChange={(value) => {
                  form.setFieldsValue({ 'filterName': '' })
                  onSearch({
                    companyId: form.getFieldValue('companyId'),
                    hubId: form.getFieldValue('hubId'),
                    agencyId: form.getFieldValue('agencyId'),
                    createdAt: value,
                    filterName: form.getFieldValue('filterName')
                  });
                }}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          {/* <Col xs={{ span: 24 }} lg={{ span: 4 }}>
            <Form.Item label={t('filter')} name="filterName">
              <Input placeholder={t('filter')}  
              onChange={(e) => {
                onSearch({
                  companyId: form.getFieldValue('companyId'),
                  hubId: form.getFieldValue('hubId'),
                  agencyId: form.getFieldValue('agencyId'),
                  createdAt: form.getFieldValue('createdAt'),
                  filterName :  e.target.value
                });
              }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 2 }}>
            <Form.Item label=" ">
              <Button
                block
                type="default"
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{ width: '100%'}}
              >
                {t('search')}
              </Button>
            </Form.Item>
          </Col> */}

        </Row>
      </Form>
    </>
  );
};

export default FilterData;
