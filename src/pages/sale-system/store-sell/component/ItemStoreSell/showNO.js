/* eslint-disable */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Input,
    Form,
    Button,
    Row,
    Col,
    Spin,
    Typography,
    Table,
    Space,
    InputNumber,
    message,
    Card,
    Modal,
    Select,
    Divider,
    Image,
} from 'antd';

import allAction from '../../../../../app/actions';

import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import {
    NumberOutlined,
} from '@ant-design/icons';

const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const { Text } = Typography;
const { Option } = Select;

const ShownNO = (props) => {
    const {
        form, index
    } = props;

    const itemCount = useSelector((state) => state.storeSellReducer.itemCount);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    // console.log("form.getFieldsValue()?.itemStoreSell?.length", form.getFieldsValue()?.itemStoreSell?.length)
    const length = form.getFieldsValue()?.itemStoreSell?.length

    return <>
        <span
            style={{
                fontFamily: 'sans-serif',
                color: '#838383',
                border: '1px #838383 solid',
                borderRadius: 3,
                padding: 2,
                // backgroundColor: "white"
            }}
        >
            <NumberOutlined />{' '}
            {itemCount -
                index}{' '}
        / {itemCount}
        </span>
        {/* <Button onClick={() => {
            console.log("form.getFieldsValue()?.itemStoreSell?.length", form.getFieldsValue()?.itemStoreSell?.length)
            console.log("index", index)
            console.log("length", length)
        }}>LLsLL</Button> */}
    </>
};

export default ShownNO;
