import React, { useEffect, useState } from 'react';
import {
  Form, Row, Col, Select, message, Input, Button, DatePicker,
} from 'antd';

import { SearchOutlined } from '@ant-design/icons';
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
  const { userLevel } = useSelector((state) => state.authenReducer);
  const { companyData } = useSelector((state) => state.companyReducer);

  const [hubId, setHubId] = useState(null);
  const [isCompletedReceipt, setIsCompletedReceipt] = useState('');

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

    dispatch(allAction.companyAction.getCompanyData())
      .then()
      .catch((e) => message.error(e.message));
    dispatch(allAction.storeListSellAction.getHubList())
      .then()
      .catch((e) => message.error(e.message));
  }, []);

  // const handleSearchHub = (value) => {
  //   const objSearch = {
  //     search: value,
  //   };
  //   if (form.getFieldValue('companyId')) {
  //     objSearch.companyId = form.getFieldValue('companyId');
  //   }
  //   dispatch(allAction.userManagementAction.getHubList(objSearch))
  //     .then()
  //     .catch((e) => message.error(e.message));
  //   onSearch();
  // };

  // const onReset = () => {
  //   form.resetFields();
  //   onSearch();
  // };

  return (
    <>
      <Form
        form={form}
        {...formItemLayout}
        layout="vertical"
        onFinish={() => onSearch({
          companyId: form.getFieldValue('companyId'),
          hubId: form.getFieldValue('hubId'),
          // agencyId: form.getFieldValue('agencyId'),
          isCompletedReceipt: form.getFieldValue('isCompletedReceipt'),
          search: form.getFieldValue('search'),
          startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
          endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
        })}
        initialValues={{ isCompletedReceipt: '0', hubId: '' }}
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
                    // dispatch(
                    //   allAction.userManagementAction.getAgencyList({
                    //     companyId: e, isCustomer: 'ALL',
                    //   }),
                    // );
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
                  // onSearch={handleSearchHub}
                  onChange={(e) => {
                    // console.log(form.getFieldValue());
                    setHubId(e);
                    onSearch(onSearch({
                      companyId: form.getFieldValue('companyId'),
                      hubId: e,
                      // agencyId: form.getFieldValue('agencyId'),
                      isCompletedReceipt: form.getFieldValue('isCompletedReceipt'),
                      search: form.getFieldValue('search'),
                      startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                      endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                    }));
                  }}
                  // onSelect={(e) => dispatch(
                  //   allAction.userManagementAction.getAgencyList({ hubId: e, isCustomer: 'ALL' }),
                  // )}
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

          <Col flex="1 1 100px">
            <Form.Item label={t('receipt-status')} name="isCompletedReceipt">
              <Select
                defaultValue="0"
                onChange={(e) => {
                  onSearch({
                    companyId: form.getFieldValue('companyId'),
                    hubId: form.getFieldValue('hubId'),
                    // agencyId: form.getFieldValue('agencyId'),
                    isCompletedReceipt: e,
                    search: form.getFieldValue('search'),
                    startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                    endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                  });
                }}
              >
                <Option value="">{t('all-select')}</Option>
                <Option value="1">{t('complete')}</Option>
                <Option value="0">{t('not-complete')}</Option>
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
                    // agencyId: form.getFieldValue('agencyId'),
                    isCompletedReceipt: form.getFieldValue('isCompletedReceipt'),
                    search: form.getFieldValue('search'),
                    startDate: e ? moment(e[0]).format('YYYY-MM-DD') : null,
                    endDate: e ? moment(e[1]).format('YYYY-MM-DD') : null,
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
                      onSearch({
                        companyId: form.getFieldValue('companyId'),
                        hubId: form.getFieldValue('hubId'),
                        // agencyId: form.getFieldValue('agencyId'),
                        isCompletedReceipt: form.getFieldValue('isCompletedReceipt'),
                        search: e,
                        startDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[0]).format('YYYY-MM-DD') : null,
                        endDate: form.getFieldValue('createdAt') ? moment(form.getFieldValue('createdAt')[1]).format('YYYY-MM-DD') : null,
                      });
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
