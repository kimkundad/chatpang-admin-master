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
import allAction from '../../../../app/actions';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FilterData = ({ onSearch, pageCode }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { t } = useTranslation();

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
        onFinish={onSearch}
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
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={(e) => {
                    onSearch({
                      companyId: e,
                      createdAt: form.getFieldValue('createdAt'),
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
                      createdAt: form.getFieldValue('createdAt'),
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
                      createdAt: form.getFieldValue('createdAt'),
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
          <Col flex="1 1 100px">
            <Form.Item label={t('date')} name="createdAt">
              <RangePicker
                format="YYYY-MM-DD"
                onChange={(value) => {
                  onSearch({
                    companyId: form.getFieldValue('companyId'),
                    hubId: form.getFieldValue('hubId'),
                    agencyId: form.getFieldValue('agencyId'),
                    createdAt: value,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col flex="1 1 100px">
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
