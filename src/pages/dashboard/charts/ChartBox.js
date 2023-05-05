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
    Modal
} from 'antd';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import BarChart from '../component/BarChart';

// import {
//     useGetTopParcelQuery,
//     useLazyGetTopParcelQuery
// } from '../../../app/api/dashboardApi';

const ChartBox = (props) => {
    const { title, getCached, ChartComponent, prepareData } = props;
    const { t } = useTranslation();

    const { createdChartTime,
        companyId,
        hubId,
        startDate,
        endDate,
        allAgency
    } = useSelector((state) => state.dashboardReducer);

    // const [chartData, setChartData] = useState(null)
    const [isShowBigChart, setIsShowBigChart] = useState(false)
    // const [isLoading, setIsLoading] = useState(false)
    const [sortedData, setSortedData] = useState([])
    // const [getTopParcelQuery] = useLazyGetTopParcelQuery()

    // function reverseArray(arr) {
    //     var newArray = [];
    //     for (var i = arr.length - 1; i >= 0; i--) {
    //         newArray.push(arr[i]);
    //     }
    //     return newArray;
    // }


    const {
        data,
        isFetching,
        isLoading,
        // isSuccess, 
        // isError,
        // error,
        // refetch,
    } = getCached({
        companyId,
        hubId,
        startDate,
        endDate,
        allAgency
    });

    useEffect(() => {
        console.log("data", data)
        if (data) {
            console.log("data set", data)
            setSortedData(prepareData(data))
        } else {
            setSortedData([])
        }
    }, [data])

    // const createChartData = (result) => {
    //     setChartData(prepareData(result))
    // }

    // useEffect(() => {
    //     if (createdChartTime) {
    //         setIsLoading(true)
    //         getQuery({
    //             companyId,
    //             hubId,
    //             startDate,
    //             endDate,
    //             allAgency
    //         })
    //             .unwrap()
    //             .then(result => {
    //                 console.log("getQuery", result)
    //                 createChartData(result)
    //                 setIsLoading(false)
    //             })
    //             .catch((e) => {
    //                 setIsLoading(false)
    //                 console.log("getQuery-error", e)
    //             })
    //     }
    // }, [createdChartTime])

    const ModalBigChart = (comp) => (
        <Modal
            // title={""}
            // centered
            visible={isShowBigChart}
            // onOk={updateDo}
            // okButtonProps={{
            //   disabled: !data?.isChecked,
            // }}
            // okText={t('hub-return')}
            footer={[
                <Button key="back" onClick={() => setIsShowBigChart(false)}>
                    กลับ
                </Button>,
            ]}
            cancelText={t('cancel-modal')}
            onCancel={() => setIsShowBigChart(false)}
            width={"90%"}
            height={"80%"}
        >
            {isShowBigChart && BigChart()}
        </Modal>
    );

    const cardChartStyle = {
        borderRadius: '10px', boxShadow: '2px 2px #e6e6e6', textAlign: 'center',
        // cursor: 'pointer',
        // height: "500px",
    };
    const textStyle = {
        fontSize: '22px', fontWeight: '300', marginTop: 3, color: '#000000', cursor: 'pointer',
        flex: 1,
    };

    const CardChart = (h) => (
        <Card bodyStyle={{ color: '#224b99', paddingTop: 10, paddingBottom: 0 }} style={cardChartStyle}
            onClick={() => setIsShowBigChart(true)}>
            <div
                style={textStyle}
            // onClick={() => setIsShowBigChart(true)}
            >
                {title}
            </div>
            <div style={{ display: "flex", height: "260px", justifyContent: "center", alignItems: "center" }}>
                {
                    isLoading || isFetching ?
                        <Spin /> :
                        <ChartComponent data={sortedData} fcomma={fcomma} />
                }
            </div>
        </Card>
    )

    const BigChart = (h) => (
        <Card bodyStyle={{ color: '#224b99', paddingTop: 10, paddingBottom: 0 }} style={cardChartStyle}>
            <div style={textStyle} onClick={() => setIsShowBigChart(false)}>
                {title}
            </div>
            <div style={{ height: "calc(100vh - 400px)" }}>
                <ChartComponent
                    data={sortedData}
                    fcomma={fcomma}
                />
            </div>
        </Card>
    )

    return (
        <>
            {CardChart()}
            {ModalBigChart()}
        </>
    );
};

function fcomma(number, decimals, dec_point, thousands_sep) {

    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        toFixedFix = function (n, prec) {
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            var k = Math.pow(10, prec);
            return Math.round(n * k) / k;
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

export default ChartBox;
