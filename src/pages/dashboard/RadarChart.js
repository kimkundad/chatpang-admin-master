import React from "react";
import { ResponsiveRadar } from "@nivo/radar";
const data = [
  {
    "taste": "fruity",
    "chardonay": 108,
    "carmenere": 26,
    "syrah": 21
  },
  {
    "taste": "bitter",
    "chardonay": 67,
    "carmenere": 106,
    "syrah": 73
  },
  {
    "taste": "heavy",
    "chardonay": 82,
    "carmenere": 49,
    "syrah": 115
  },
  {
    "taste": "strong",
    "chardonay": 91,
    "carmenere": 73,
    "syrah": 87
  },
  {
    "taste": "sunny",
    "chardonay": 26,
    "carmenere": 106,
    "syrah": 49
  }
];
const MyResponsiveRadar = ({ data /* see data tab */ }) => (
    <ResponsiveRadar
        data={data}
        keys={[ 'chardonay', 'carmenere', 'syrah' ]}
        indexBy="taste"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)
const RadarChart = (props) => {
    return (
    <div style={{ width: 400, height: 300 }}>
      <MyResponsiveRadar data={data} />
    </div>
  );
}

export default RadarChart;