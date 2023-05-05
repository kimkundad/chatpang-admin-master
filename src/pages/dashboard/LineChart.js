import React from "react";
import { ResponsiveLine } from "@nivo/line";
const data = [
  {
    "id": "japan",
    "color": "hsl(78, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 94
      },
      {
        "x": "helicopter",
        "y": 30
      },
      {
        "x": "boat",
        "y": 77
      },
      {
        "x": "train",
        "y": 90
      },
      {
        "x": "subway",
        "y": 20
      },
      {
        "x": "bus",
        "y": 294
      },
      {
        "x": "car",
        "y": 69
      },
      {
        "x": "moto",
        "y": 148
      },
      {
        "x": "bicycle",
        "y": 35
      },
      {
        "x": "horse",
        "y": 212
      },
      {
        "x": "skateboard",
        "y": 274
      },
      {
        "x": "others",
        "y": 10
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(47, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 12
      },
      {
        "x": "helicopter",
        "y": 207
      },
      {
        "x": "boat",
        "y": 42
      },
      {
        "x": "train",
        "y": 203
      },
      {
        "x": "subway",
        "y": 65
      },
      {
        "x": "bus",
        "y": 292
      },
      {
        "x": "car",
        "y": 91
      },
      {
        "x": "moto",
        "y": 43
      },
      {
        "x": "bicycle",
        "y": 23
      },
      {
        "x": "horse",
        "y": 81
      },
      {
        "x": "skateboard",
        "y": 92
      },
      {
        "x": "others",
        "y": 196
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(47, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 290
      },
      {
        "x": "helicopter",
        "y": 259
      },
      {
        "x": "boat",
        "y": 43
      },
      {
        "x": "train",
        "y": 177
      },
      {
        "x": "subway",
        "y": 226
      },
      {
        "x": "bus",
        "y": 267
      },
      {
        "x": "car",
        "y": 265
      },
      {
        "x": "moto",
        "y": 123
      },
      {
        "x": "bicycle",
        "y": 51
      },
      {
        "x": "horse",
        "y": 280
      },
      {
        "x": "skateboard",
        "y": 39
      },
      {
        "x": "others",
        "y": 172
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(151, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 176
      },
      {
        "x": "helicopter",
        "y": 50
      },
      {
        "x": "boat",
        "y": 272
      },
      {
        "x": "train",
        "y": 91
      },
      {
        "x": "subway",
        "y": 206
      },
      {
        "x": "bus",
        "y": 142
      },
      {
        "x": "car",
        "y": 106
      },
      {
        "x": "moto",
        "y": 163
      },
      {
        "x": "bicycle",
        "y": 128
      },
      {
        "x": "horse",
        "y": 235
      },
      {
        "x": "skateboard",
        "y": 96
      },
      {
        "x": "others",
        "y": 123
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(15, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 254
      },
      {
        "x": "helicopter",
        "y": 16
      },
      {
        "x": "boat",
        "y": 202
      },
      {
        "x": "train",
        "y": 277
      },
      {
        "x": "subway",
        "y": 255
      },
      {
        "x": "bus",
        "y": 284
      },
      {
        "x": "car",
        "y": 144
      },
      {
        "x": "moto",
        "y": 207
      },
      {
        "x": "bicycle",
        "y": 132
      },
      {
        "x": "horse",
        "y": 157
      },
      {
        "x": "skateboard",
        "y": 210
      },
      {
        "x": "others",
        "y": 108
      }
    ]
  }
];
const MyResponsiveLine = ({ data /* see data tab */ }) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 80, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)
const LineChart = (props) => {
    return (
    <div style={{ width: 400, height: 300 }}>
      <MyResponsiveLine data={data} />
    </div>
  );
}

export default LineChart;