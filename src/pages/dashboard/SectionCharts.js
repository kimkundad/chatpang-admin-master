import React, { useEffect, useState } from 'react';
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
import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

// import TopTransportation from './charts/TopTransportation';
import ChartBox from './charts/ChartBox';
import BarChart from './component/BarChart';
import BarChartTopSender from './component/BarChartTopSender';

import {
    // useLazyGetTopParcelQuery,
    // useLazyGetTopTransporationPriceQuery,
    // useLazyGetTopTransporationNetPriceQuery,
    // useLazyGetTopCodQuery,
    // useLazyGetTopChargeCodPriceQuery,
    // useLazyGetTopVolumeQuery,
    // useLazyGetTopWeightQuery,
    // useLazyGetTopSenderQuery,
    // useLazyGetTopRateQuery,
    // useLazyGetTopProvinceQuery,
    // useLazyGetTopWalletQuery,
    // useLazyGetTopTransportationQuery,

    useGetTopParcelQuery,
    useGetTopTransporationPriceQuery,
    useGetTopTransporationNetPriceQuery,
    useGetTopCodQuery,
    useGetTopChargeCodPriceQuery,
    useGetTopVolumeQuery,
    useGetTopWeightQuery,
    useGetTopSenderQuery,
    useGetTopRateQuery,
    useGetTopProvinceQuery,
    useGetTopWalletQuery,
    useGetTopTransportationQuery,
} from '../../app/api/dashboardApi';
import BarChartTopRate from './component/BarChartTopRate';
import BarChartTopProvince from './component/BarChartTopProvince';
import BarChartTopWallet from './component/BarChartTopWallet';
import BarChartTopTransportation from './component/BarChartTopTransportation';


const SectionCharts = (props) => {

    const { t } = useTranslation();

    // const [getTopParcelQuery] = useLazyGetTopParcelQuery()
    // const [getTopTransporationPriceQuery] = useLazyGetTopTransporationPriceQuery()
    // const [getTopTransporationNetPriceQuery] = useLazyGetTopTransporationNetPriceQuery()
    // const [getTopCodQuery] = useLazyGetTopCodQuery()
    // const [getTopChargeCodPriceQuery] = useLazyGetTopChargeCodPriceQuery()
    // const [getTopVolumeQuery] = useLazyGetTopVolumeQuery()
    // const [getTopWeightQuery] = useLazyGetTopWeightQuery()
    // const [getTopSenderQuery] = useLazyGetTopSenderQuery()
    // const [getTopRateQuery] = useLazyGetTopRateQuery()
    // const [getTopProvinceQuery] = useLazyGetTopProvinceQuery()
    // const [getTopWalletQuery] = useLazyGetTopWalletQuery()
    // const [getTopTransportationQuery] = useLazyGetTopTransportationQuery()


    function prepareData(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newArray.push(arr[i]);
        }
        return newArray;
    }

    function prepareDataTopWallet(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            var tmp = { ...arr[i] }
            tmp.amount_sub_total = tmp.amount - tmp.total
            newArray.push(tmp);
        }
        return newArray;
    }

    function prepareDataTopTransportation(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            var tmp = { ...arr[i] }
            tmp.confirm = tmp?.confirm ? tmp.confirm : 0
            tmp.total_sub_confirm = tmp.total - tmp.confirm
            newArray.push(tmp);
        }
        console.log("prepareDataTopTransportation",newArray)
        return newArray;
    }

    return (
        <>
            <Row gutter={[16, 24]}>
                <Col xs={8}>
                    <ChartBox title="จำนวนพัสดุ (ชิ้น)"
                        getCached={useGetTopParcelQuery}
                        // getQuery={getTopParcelQuery}
                        ChartComponent={BarChart}
                        prepareData={prepareData} />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="ค่าขนส่ง (บาท)"
                        getCached={useGetTopTransporationPriceQuery}
                        // getQuery={getTopTransporationPriceQuery}
                        ChartComponent={BarChart}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox title="ค่าส่งสุทธิ (บาท)"
                        getCached={useGetTopTransporationNetPriceQuery}
                        // getQuery={getTopTransporationNetPriceQuery}
                        ChartComponent={BarChart}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox title="ยอด COD (บาท)"
                        getCached={useGetTopCodQuery}
                        // getQuery={getTopCodQuery}
                        ChartComponent={BarChart}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="ค่าบริการ COD (บาท)"
                        getCached={useGetTopChargeCodPriceQuery}
                        // getQuery={getTopChargeCodPriceQuery}
                        ChartComponent={BarChart}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="ปริมาตรพัสดุ (ลบ.ซม.)"
                        getCached={useGetTopVolumeQuery}
                        // getQuery={getTopVolumeQuery}
                        ChartComponent={BarChart}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="น้ำหนัก (กก.)"
                        getCached={useGetTopWeightQuery}
                        // getQuery={getTopWeightQuery}
                        ChartComponent={BarChart}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="ผู้ส่ง (บาท/ชิ้น)"
                        getCached={useGetTopSenderQuery}
                        // getQuery={getTopSenderQuery}
                        ChartComponent={BarChartTopSender}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox title="เรทราคา (ชิ้น)"
                        getCached={useGetTopRateQuery}
                        // getQuery={getTopRateQuery}
                        ChartComponent={BarChartTopRate}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="จังหวัดปลายทาง (ชิ้น)"
                        getCached={useGetTopProvinceQuery}
                        // getQuery={getTopProvinceQuery}
                        ChartComponent={BarChartTopProvince}
                        prepareData={prepareData}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="ยอดเติม Wallet (บาท)"
                        getCached={useGetTopWalletQuery}
                        // getQuery={getTopWalletQuery}
                        ChartComponent={BarChartTopWallet}
                        prepareData={prepareDataTopWallet}
                    />
                </Col>
                <Col xs={8}>
                    <ChartBox
                        title="รายการเรียกรถ (ครั้ง)"
                        getCached={useGetTopTransportationQuery}
                        // getQuery={getTopTransportationQuery}
                        ChartComponent={BarChartTopTransportation}
                        prepareData={prepareDataTopTransportation}
                    />
                </Col>
            </Row>
        </>
    );
};

export default SectionCharts;
