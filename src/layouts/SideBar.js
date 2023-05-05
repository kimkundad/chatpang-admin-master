import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import routes from '../config/routes';

import allAction from '../app/actions/index';

const SideBar = () => {
  const {
    collapsedSider, selectedKey, openKey, isMobile,
  } = useSelector(
    (state) => state.mainReducer,
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(allAction.mainAction.onSelectedKey([history?.location?.pathname]));
  }, []);

  useEffect(() => {
  }, [collapsedSider]);

  const onOpenChange = (keys) => {
    // console.log('eekey', keys[keys.length - 1]);
    dispatch(allAction.mainAction.onOpenKey([keys[keys.length - 1]]));
  };

  // eslint-disable-next-line arrow-body-style
  const renderMenu = (route) => {
    return (
      <Menu.Item
        style={
          !collapsedSider
            ? {
              whiteSpace: 'normal',
              height: 'auto',
              margin: 0,
              fontSize: 16,
              // backgroundColor: '',
            }
            : { }
        }
        key={route.path}
        icon={route.menu?.icon}
        onClick={async () => {
          if (isMobile) {
            onCollapsedChange(true);
          }
        }}
      >
        <Link to={route.path}>{t(route.menu?.render)}</Link>
      </Menu.Item>
    );
  };

  const onCollapsedChange = (action) => {
    dispatch(allAction.mainAction.onCollapsed(action));
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      inlineIndent={18}
      selectedKeys={selectedKey}
      defaultSelectedKeys={selectedKey}
      defaultOpenKeys={openKey}
      openKeys={openKey}
      onOpenChange={onOpenChange}
      onSelect={(e) => {
        dispatch(allAction.mainAction.onSelectedKey(e.key));
        dispatch(allAction.mainAction.onSelectedHeaderKey([]));
      }}
    >
      {
        routes.map((route) => {
          if (route?.type === 'menu') return renderMenu(route);
          return <></>;
        })
      }
    </Menu>
  );
};

export default SideBar;
