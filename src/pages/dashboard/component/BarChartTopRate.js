import React, { useState, useEffect } from "react";
import { Bar, ResponsiveBar } from "@nivo/bar";

const sampleData = [
    {
        "country": "AD",
        "hot dog": 146,
        "hot dogColor": "hsl(317, 70%, 50%)",
        "burger": 41,
        "burgerColor": "hsl(116, 70%, 50%)",
        "sandwich": 43,
        "sandwichColor": "hsl(34, 70%, 50%)",
        "kebab": 126,
        "kebabColor": "hsl(13, 70%, 50%)",
        "fries": 44,
        "friesColor": "hsl(152, 70%, 50%)",
        "donut": 91,
        "donutColor": "hsl(124, 70%, 50%)"
    },
    {
        "country": "AE",
        "hot dog": 35,
        "hot dogColor": "hsl(88, 70%, 50%)",
        "burger": 90,
        "burgerColor": "hsl(269, 70%, 50%)",
        "sandwich": 55,
        "sandwichColor": "hsl(143, 70%, 50%)",
        "kebab": 21,
        "kebabColor": "hsl(33, 70%, 50%)",
        "fries": 158,
        "friesColor": "hsl(161, 70%, 50%)",
        "donut": 149,
        "donutColor": "hsl(330, 70%, 50%)"
    },
    {
        "country": "AF",
        "hot dog": 187,
        "hot dogColor": "hsl(264, 70%, 50%)",
        "burger": 13,
        "burgerColor": "hsl(332, 70%, 50%)",
        "sandwich": 48,
        "sandwichColor": "hsl(293, 70%, 50%)",
        "kebab": 82,
        "kebabColor": "hsl(44, 70%, 50%)",
        "fries": 71,
        "friesColor": "hsl(293, 70%, 50%)",
        "donut": 170,
        "donutColor": "hsl(24, 70%, 50%)"
    },
    {
        "country": "AG",
        "hot dog": 6,
        "hot dogColor": "hsl(61, 70%, 50%)",
        "burger": 179,
        "burgerColor": "hsl(70, 70%, 50%)",
        "sandwich": 200,
        "sandwichColor": "hsl(355, 70%, 50%)",
        "kebab": 109,
        "kebabColor": "hsl(327, 70%, 50%)",
        "fries": 36,
        "friesColor": "hsl(190, 70%, 50%)",
        "donut": 81,
        "donutColor": "hsl(315, 70%, 50%)"
    },
    {
        "country": "AI",
        "hot dog": 112,
        "hot dogColor": "hsl(97, 70%, 50%)",
        "burger": 173,
        "burgerColor": "hsl(323, 70%, 50%)",
        "sandwich": 129,
        "sandwichColor": "hsl(149, 70%, 50%)",
        "kebab": 15,
        "kebabColor": "hsl(205, 70%, 50%)",
        "fries": 169,
        "friesColor": "hsl(22, 70%, 50%)",
        "donut": 67,
        "donutColor": "hsl(200, 70%, 50%)"
    }
];

const BarChartTopRate = (props) => {

    const { data,fcomma } = props;

    const [indexBy, setIndexBy] = useState("")

    useEffect(() => {
        if (data?.length > 0) {
            // setIndexBy(data[0]?.hub_code ? "hub_code" : "agency_code")
            setIndexBy("transportation_price")
        }
    }, [data])

    const styles = {
        fontFamily: "sans-serif",
        fontSize: "14px",
        textAlign: "center"
    };

    return (
            <ResponsiveBar
                colors={["#4360A8"]}
                colorBy="index"
                data={data?.length > 0 ? data : sampleData}
                layout="horizontal"
                keys={[
                    'transportation_price_item'
                ]}
                indexBy={indexBy}
                margin={{ top: 5, right: 20, bottom: 10, left: 80 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                // valueScale={{ type: "symlog", constant: 1e9 }}
                indexScale={{ type: 'band', round: true }}
                // colors={{ scheme: 'nivo' }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'fries'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'sandwich'
                        },
                        id: 'lines'
                    }
                ]}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={null}

                tooltip={(props) => {
                    // console.log("props", props)
                    return <div
                        style={{
                            padding: 5,
                            // color,
                            background: 'white',
                            border: "0.5px solid #EBECEC"
                        }}
                    >
                        {/* <strong> */}
                        {props.data.transportation_price} : <strong>{fcomma(props.data?.transportation_price_item)} </strong>
                        {/* </strong> */}
                    </div>
                }}

                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}

                labelSkipWidth={12}
                label={(d) => {
                    // console.log("labelFormat", d)
                    // return <tspan x={20}>{d.value}</tspan>
                    return <tspan fill="white">{d.value}</tspan>
                    // return d.value === 0 ? <tspan x="-15">{d.value}</tspan> : d.value
                }}
            // labelFormat={d => <tspan x={ (d + 5) * ((width-160) / 100) }>123</tspan>}
            // labelFormat={d => <tspan y={0}>{d}</tspan>}

            // axisLeft={{
            //     tickSize: 5,
            //     tickPadding: 5,
            //     tickRotation: 0,
            //     tickSize: 0,
            //     tickPadding: 25,
            //     tickRotation: 0,
            //     effects: [
            //         {
            //             on: 'hover',
            //             style: {
            //                 fill: "blue"
            //             }
            //         }
            //     ],
            //     renderTick: (props) => {
            //         const {
            //             opacity,
            //             textAnchor,
            //             textBaseline,
            //             textX,
            //             textY,
            //             theme,
            //             value,
            //             x,
            //             y
            //         } = props

            //         console.log("props", props)
            //         return (
            //             <g
            //                 transform={`translate(${x},${y})`}
            //                 style={{ opacity }}
            //             >
            //                 <text
            //                     alignmentBaseline={textBaseline}
            //                     // style={theme.axis.ticks.text}
            //                     style={{ fill: "red" }}
            //                     textAnchor={textAnchor}
            //                     transform={`translate(${textX},${textY})`}
            //                 >
            //                     <tspan >{value}</tspan>
            //                 </text>
            //             </g>
            //         )
            //     }

            // }}

            // legends={[
            //     {
            //         dataFrom: 'value',
            //         anchor: 'bottom-right',
            //         direction: 'column',
            //         justify: false,
            //         translateX: 120,
            //         translateY: 0,
            //         itemsSpacing: 2,
            //         itemWidth: 100,
            //         itemHeight: 20,
            //         itemDirection: 'left-to-right',
            //         itemOpacity: 0.85,
            //         symbolSize: 20,
            //         effects: [
            //             {
            //                 on: 'hover',
            //                 style: {
            //                     itemOpacity: 1
            //                 }
            //             }
            //         ]
            //     }
            // ]}
            // legends={[
            //     {
            //         dataFrom: 'keys',
            //         anchor: 'bottom-right',
            //         direction: 'column',
            //         justify: false,
            //         translateX: 120,
            //         translateY: 0,
            //         itemsSpacing: 2,
            //         itemWidth: 100,
            //         itemHeight: 20,
            //         itemDirection: 'left-to-right',
            //         itemOpacity: 0.85,
            //         symbolSize: 20,
            //         effects: [
            //             {
            //                 on: 'hover',
            //                 style: {
            //                     itemOpacity: 1
            //                 }
            //             }
            //         ]
            //     }
            // ]}
            // role="application"
            // ariaLabel="Nivo bar chart demo"
            // barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in country: " + e.indexValue }}

            />
    );
}

export default BarChartTopRate;