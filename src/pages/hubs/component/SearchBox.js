import React, { useState } from 'react';

import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useTranslation } from 'react-i18next';

import {
  Input,
} from 'antd';

const PlacesAutocomplete = (props) => {
  const { t } = useTranslation();

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { /* Define search scope here */ },
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter as "false"
    setValue(description, false);
    clearSuggestions();
    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
      .then((results) => {
        console.log('result', results[0]);
        return getLatLng(results[0]);
      })
      .then(({ lat, lng }) => {
        console.log('📍 Coordinates: ', { lat, lng });
        console.log('data', description, lat, lng);
        props.onSearch({ description, lat, lng });
      }).catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      id,
      structured_formatting: { main_text, secondary_text },
    } = suggestion;

    return (
      <li
        key={id}
        onClick={handleSelect(suggestion)}
        style={{ cursor: 'pointer' }}
      >
        <strong>{main_text}</strong>
        {' '}
        <small>{secondary_text}</small>
      </li>
    );
  });

  return (
    <div>
      <Input
        value={value}
        allowClear
        onChange={handleInput}
        disabled={!ready}
        placeholder={t('search-map')}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <ul style={{ backgroundColor: 'white' }}>{renderSuggestions()}</ul>}
    </div>
  );
};

export default PlacesAutocomplete;
