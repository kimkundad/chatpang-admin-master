import React from "react";
import { ResponsiveHeatMap } from '@nivo/heatmap'

const data = [
  {
    "id": "Japan",
    "data": [
      {
        "x": "Train",
        "y": -80839
      },
      {
        "x": "Subway",
        "y": -84034
      },
      {
        "x": "Bus",
        "y": 80209
      },
      {
        "x": "Car",
        "y": 43038
      },
      {
        "x": "Boat",
        "y": -58400
      },
      {
        "x": "Moto",
        "y": 55781
      },
      {
        "x": "Moped",
        "y": -58291
      },
      {
        "x": "Bicycle",
        "y": 61128
      },
      {
        "x": "Others",
        "y": 40848
      }
    ]
  },
  {
    "id": "France",
    "data": [
      {
        "x": "Train",
        "y": 69417
      },
      {
        "x": "Subway",
        "y": 46676
      },
      {
        "x": "Bus",
        "y": -44044
      },
      {
        "x": "Car",
        "y": -43638
      },
      {
        "x": "Boat",
        "y": -50866
      },
      {
        "x": "Moto",
        "y": 60157
      },
      {
        "x": "Moped",
        "y": -65571
      },
      {
        "x": "Bicycle",
        "y": -62492
      },
      {
        "x": "Others",
        "y": -46931
      }
    ]
  },
  {
    "id": "US",
    "data": [
      {
        "x": "Train",
        "y": 88139
      },
      {
        "x": "Subway",
        "y": -61387
      },
      {
        "x": "Bus",
        "y": 83995
      },
      {
        "x": "Car",
        "y": -95312
      },
      {
        "x": "Boat",
        "y": 5118
      },
      {
        "x": "Moto",
        "y": 46955
      },
      {
        "x": "Moped",
        "y": 36274
      },
      {
        "x": "Bicycle",
        "y": 52129
      },
      {
        "x": "Others",
        "y": 94963
      }
    ]
  },
  {
    "id": "Germany",
    "data": [
      {
        "x": "Train",
        "y": 91752
      },
      {
        "x": "Subway",
        "y": -99632
      },
      {
        "x": "Bus",
        "y": 40855
      },
      {
        "x": "Car",
        "y": 66146
      },
      {
        "x": "Boat",
        "y": -58791
      },
      {
        "x": "Moto",
        "y": -86792
      },
      {
        "x": "Moped",
        "y": 52616
      },
      {
        "x": "Bicycle",
        "y": 60236
      },
      {
        "x": "Others",
        "y": -45661
      }
    ]
  },
  {
    "id": "Norway",
    "data": [
      {
        "x": "Train",
        "y": 90283
      },
      {
        "x": "Subway",
        "y": -27152
      },
      {
        "x": "Bus",
        "y": -42165
      },
      {
        "x": "Car",
        "y": -1695
      },
      {
        "x": "Boat",
        "y": 93722
      },
      {
        "x": "Moto",
        "y": 46621
      },
      {
        "x": "Moped",
        "y": -61901
      },
      {
        "x": "Bicycle",
        "y": 24254
      },
      {
        "x": "Others",
        "y": 23862
      }
    ]
  },
  {
    "id": "Iceland",
    "data": [
      {
        "x": "Train",
        "y": -8500
      },
      {
        "x": "Subway",
        "y": -82759
      },
      {
        "x": "Bus",
        "y": -16320
      },
      {
        "x": "Car",
        "y": -75134
      },
      {
        "x": "Boat",
        "y": 66997
      },
      {
        "x": "Moto",
        "y": -96804
      },
      {
        "x": "Moped",
        "y": -59916
      },
      {
        "x": "Bicycle",
        "y": -4158
      },
      {
        "x": "Others",
        "y": -45277
      }
    ]
  },
  {
    "id": "UK",
    "data": [
      {
        "x": "Train",
        "y": 77559
      },
      {
        "x": "Subway",
        "y": -16573
      },
      {
        "x": "Bus",
        "y": 70361
      },
      {
        "x": "Car",
        "y": -15173
      },
      {
        "x": "Boat",
        "y": -19697
      },
      {
        "x": "Moto",
        "y": -58921
      },
      {
        "x": "Moped",
        "y": 38111
      },
      {
        "x": "Bicycle",
        "y": 26111
      },
      {
        "x": "Others",
        "y": -47232
      }
    ]
  },
  {
    "id": "Vietnam",
    "data": [
      {
        "x": "Train",
        "y": -32317
      },
      {
        "x": "Subway",
        "y": -67068
      },
      {
        "x": "Bus",
        "y": 6894
      },
      {
        "x": "Car",
        "y": 85996
      },
      {
        "x": "Boat",
        "y": 18370
      },
      {
        "x": "Moto",
        "y": -9602
      },
      {
        "x": "Moped",
        "y": 66153
      },
      {
        "x": "Bicycle",
        "y": -81578
      },
      {
        "x": "Others",
        "y": -61269
      }
    ]
  }
];
const MyResponsiveHeatMap = ({ data /* see data tab */ }) => (
    <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 60, bottom: 60, left: 90 }}
        valueFormat=">-.2s"
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: '',
            legendOffset: 46
        }}
        axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 70
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: -72
        }}
        colors={{
            type: 'diverging',
            scheme: 'red_yellow_blue',
            divergeAt: 0.5,
            minValue: -100000,
            maxValue: 100000
        }}
        emptyColor="#555555"
        legends={[
            {
                anchor: 'bottom',
                translateX: 0,
                translateY: 30,
                length: 400,
                thickness: 8,
                direction: 'row',
                tickPosition: 'after',
                tickSize: 3,
                tickSpacing: 4,
                tickOverlap: false,
                tickFormat: '>-.2s',
                title: 'Value →',
                titleAlign: 'start',
                titleOffset: 4
            }
        ]}
    />
);
const HeatMapChart = (props) => {
    return (
    <div style={{ width: 450, height: 300 }}>
      <MyResponsiveHeatMap data={data} />
    </div>
  );
}

export default HeatMapChart;