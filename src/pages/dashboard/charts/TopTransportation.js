import React, { useEffect, useState } from 'react';
import {
    Card,
} from 'antd';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';

import BarChart from '../component/BarChart';

import {
    useLazyGetTopTransportationQuery
} from '../../../app/api/dashboardApi';
import BarChartTopTransportation from '../component/BarChartTopTransportation';

const TopTransportation = (props) => {

    const { t } = useTranslation();

    const { createdChartTime,
        companyId,
        hubId,
        startDate,
        endDate,
    } = useSelector((state) => state.dashboardReducer);

    const [chartData, setChartData] = useState(null)
    const [getTopTransportationQuery] = useLazyGetTopTransportationQuery()


    function reverseArray(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            var tmp = { ...arr[i] }
            tmp.total_sub_confirm = tmp.total - tmp.confirm
            newArray.push(tmp);
        }
        return newArray;
    }

    const createChartData = (result) => {
        setChartData(reverseArray(result))
    }

    useEffect(() => {
        if (createdChartTime)
            getTopTransportationQuery({
                companyId,
                hubId,
                startDate,
                endDate,
            })
                .unwrap()
                .then(result => {
                    console.log("getTopTransportationQuery", result)
                    createChartData(result)
                })
                .catch((e) => {
                    console.log("getTopTransportationQuery-error", e)
                })
    }, [createdChartTime])

    const cardChartStyle = {
        borderRadius: '10px', boxShadow: '2px 2px #e6e6e6', textAlign: 'center',
    };
    const textStyle = {
        fontSize: '22px', fontWeight: '300', marginTop: 3, color: '#000000',
    };

    return (
        <>
            <Card bodyStyle={{ color: '#224b99', paddingTop: 10, paddingBottom: 0 }} style={cardChartStyle}>
                <div style={textStyle}>
                    รายการเรียกรถเข้ารับพัสดุ (ครั้ง)
                </div>
                <BarChartTopTransportation
                    data={chartData}
                // options={options}
                // plugins={[ChartDataLabels]}
                // height="200px"
                />
            </Card>
        </>
    );
};

export default TopTransportation;
