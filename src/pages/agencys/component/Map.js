import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

import { EnvironmentFilled } from '@ant-design/icons';

import { useSelector } from 'react-redux';
import SearchBox from './SearchBox';

const AnyReactComponent = () => (
  <EnvironmentFilled
    onChildClick={(e) => console.log('ab', e)}
    style={{ cursor: 'default', color: 'red', fontSize: '28px' }}
  />
);

const Map = (props) => {
  const { actionPage } = useSelector((state) => state.hubReducer);
  const {
    match: {
      params: { agencyId },
    },
    onSearchMap,
  } = props;

  const { LatLng } = props;

  const [state, setState] = useState({
    center: {
      lat: LatLng?.lat,
      lng: LatLng?.lng,
    },
    zoom: 16,
    draggable: true,
    lat: LatLng?.lat,
    lng: LatLng?.lng,
    address: '',
  });

  useEffect(() => {
    setState({
      ...state,
      zoom: 16,
      center: {
        lat: LatLng?.lat,
        lng: LatLng?.lng,
      },
      lat: LatLng?.lat,
      lng: LatLng?.lng,
    });
  }, [LatLng]);

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
    console.log('onCircleInteraction3', childProps, mouse.lat);
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
  if (actionPage === 'view' && agencyId !== 'create') {
    return (
      <div>
        <div style={{ height: '400px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
            center={state.center}
            zoom={state.zoom}
          >
            <AnyReactComponent
              lat={state.lat}
              lng={state.lng}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      </div>
    );
  } else
    return (
      // Important! Always set the container height explicitly
      <div>
        <div style={{ position: 'absolute', zIndex: 10, width: '950px' }}>
          <SearchBox onSearch={onSearch} />
        </div>
        <div style={{ paddingTop: 50, height: '400px', width: '100%' }}>
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
              lat={state.lat}
              lng={state.lng}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      </div>
    );
};

export default Map;
