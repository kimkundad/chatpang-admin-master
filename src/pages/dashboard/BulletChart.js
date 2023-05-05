import React from "react";
// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bullet
import { ResponsiveBullet } from '@nivo/bullet'

const data = [
  {
    "id": "temp.",
    "ranges": [
      58,
      17,
      37,
      0,
      120
    ],
    "measures": [
      113
    ],
    "markers": [
      72
    ]
  },
  {
    "id": "power",
    "ranges": [
      0.16635691318583457,
      1.2351214955850327,
      0.6076947491920253,
      0,
      2
    ],
    "measures": [
      1.410624146556718,
      1.7855172606625977
    ],
    "markers": [
      1.940779282048929
    ]
  },
  {
    "id": "volume",
    "ranges": [
      50,
      22,
      52,
      3,
      1,
      79,
      0,
      80
    ],
    "measures": [
      49
    ],
    "markers": [
      80
    ]
  },
  {
    "id": "cost",
    "ranges": [
      414161,
      62803,
      100744,
      0,
      500000
    ],
    "measures": [
      73200,
      165666
    ],
    "markers": [
      317547
    ]
  },
  {
    "id": "revenue",
    "ranges": [
      7,
      3,
      8,
      0,
      11
    ],
    "measures": [
      5
    ],
    "markers": [
      10.312538528200463,
      7.435458728489541
    ]
  }
];
const MyResponsiveBullet = ({ data /* see data tab */ }) => (
    <ResponsiveBullet
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 90 }}
        spacing={46}
        titleAlign="start"
        titleOffsetX={-70}
        measureSize={0.2}
    />
)

const BulletChart = (props) => {
    return (
    <div style={{ width: 450, height: 300 }}>
      <MyResponsiveBullet data={data} />
    </div>
  );
}

export default BulletChart;