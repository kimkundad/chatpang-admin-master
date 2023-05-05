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
} from 'antd';

import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import truck from '../assets/truck.png';

const TestInput = (props) => {
  const {
    field,
    // remove,
    index,
    // fields,

    // pageCode,
  } = props;
  // console.log('list', field, index);

  const Test = React.useMemo(() => {
    console.log('TestInput:', field, index);
    const [state, setstate] = useState('');

    return (
      <>
        <Form.Item
          key={field?.key}
          name="aa"
        >
          <Input
            placeholder="passenger name"
            index={index}
            style={{ width: '60%' }}
            value={field?.key}
          // onChange={(e) => setstate({ ...state, e: e.target.value })}
          />
        </Form.Item>
      </>
    );
  }, [field]);

  return Test;
};

export default TestInput;
