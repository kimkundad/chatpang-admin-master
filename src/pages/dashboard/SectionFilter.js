import React, { useEffect, useState } from 'react';
import { format } from 'date-fns'

import {
    Input,
    Form,
    Button,
    Row,
    Col,
    Spin,
    Typography,
    Table,
    Layout,
    Badge,
    message,
    Image,
    Card,
  } from 'antd';

import FilterData from './component/FilterData';

const SectionFilter = (props) => {
    const  {pageCode} = props

    const onSearch = (value) => {
        // setQuery(value);
        console.log("value", value);
        const newValue = value;
        newValue.startDate = value?.createdAt
            ? format(new Date(value?.createdAt[0]), 'yyyy-MM-dd')
            : '';
        newValue.endDate = value?.createdAt
            ? format(new Date(value?.createdAt[1]), 'yyyy-MM-dd')
            : '';
        delete newValue.createdAt;
        // setSearch(newValue);
        // dispatch(allAction.report.getCodList(newValue))
        //   .then()
        //   .catch((e) => message.error(e.message));
    };


    return (
        <>
            <FilterData onSearch={onSearch} pageCode={pageCode} {...props} />
            
        </>
    );
};

export default SectionFilter;
