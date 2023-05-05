import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

import {
  EnvironmentFilled,
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import SearchBox from './SearchBox';

const AnyReactComponent = () => (
  <EnvironmentFilled
    onChildClick={(e) => console.log('ab', e)}
    style={{ cursor: 'default', color: 'red', fontSize: '28px' }}
  />
);

const Map = (props) => {
  const { companyDetail, actionPage } = useSelector((state) => state.companyReducer);
  const { match: { params: { companyId } }, onSearchMap } = props;

  const currentLat = companyId === 'create' ? 13.736717 : Number(companyDetail?.lat || '13.00');
  const currentLng = companyId === 'create' ? 100.523186 : Number(companyDetail?.lng || '100.00');
  const [state, setState] = useState({
    center: {
      lat: currentLat,
      lng: currentLng,
    },
    zoom: 16,
    draggable: true,
    lat: currentLat,
    lng: currentLng,
    address: '',
  });

  const onCircleInteraction = (childKey, childProps, mouse) => {
    // function is just a stub to test callbacks
    // console.log('onCircleInteraction', childKey, childProps, mouse);

    setState({
      draggable: false,
      lat: mouse.lat,
      lng: mouse.lng,
    });
  };
  const onCircleInteraction3 = (childKey, childProps, mouse) => {
    setState({
      draggable: true,
      lat: mouse.lat,
      lng: mouse.lng,
    });
    // function is just a stub to test callbacks
    // console.log('onCircleInteraction3', childProps, mouse.lat);
  };

  const onChildClicks = (e) => {
    const data = {
      lat: state.lat,
      lng: state.lng,
    };

    onSearchMap(data);
  };

  const onSearch = (data) => {
    setState({
      center: {
        lat: data.lat,
        lng: data.lng,
      },
      lat: data.lat,
      lng: data.lng,
      zoom: 16,
      draggable: true,
      address: data.description,
    });
    onSearchMap(data);
  };
  if (actionPage === 'view' && companyId !== 'create') {
    return (
      <div style={{ height: '400px', width: '100%' }}>
        <br />
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
          defaultCenter={{
            lat: 13,
            lng: 100,
          }}
          center={{ lat: currentLat, lng: currentLng }}
          defaultZoom={16}
        >
          <AnyReactComponent
            lat={currentLat}
            lng={currentLng}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '400px', width: '100%' }}>
      <SearchBox onSearch={onSearch} />

      <br />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
        center={state.center}
        zoom={state.zoom}
        draggable={state.draggable}
        onChildClick={onChildClicks}
        onChildMouseDown={onCircleInteraction}
        onChildMouseUp={onCircleInteraction3}
        onChildMouseMove={onCircleInteraction}
      >
        <AnyReactComponent
          lat={state.lat || currentLat}
          lng={state.lng || currentLng}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
