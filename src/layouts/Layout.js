/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable semi */
/* eslint-disable prefer-template */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable block-spacing */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
/* eslint-disable quotes */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  Layout,
  Menu,
  Affix,
  Image,
  Modal,
  Spin,
  Avatar,
} from 'antd';
import {
  useHistory,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

import SideBar from './SideBar';
import routes from '../config/routes';
import allAction from '../app/actions/index';
import LOGO from '../assets/LOGO.png';

const { Header, Content, Sider } = Layout;

const PageLayout = () => {
  const {
    verifyLoading, picture, userID,
  } = useSelector((state) => state.authenReducer);
  const { collapsedSider, isMobile } = useSelector(
    (state) => state.mainReducer,
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const confirmLogout = () => {
    Modal.confirm({
      title: 'คุณต้องการออกจากระบบ?',
      icon: <LogoutOutlined />,
      onOk() {
        dispatch(allAction.authenAction.toLogout());
        history.push('/');
      },
      onCancel() {
      },
      okText: 'YES',
      cancelText: 'NO',
    });
  };

  const onCollapsedChange = (action) => {
    dispatch(allAction.mainAction.onCollapsed(action));
  };

  const paths = routes
    .map((route) => {
      const generateRegex = (path) => {
        const regexp = path
          .split('/')
          .map((p) => {
            if (p.startsWith(':')) return '\\S+';
            return p;
          })
          .join('/');
        return new RegExp(`${regexp}$`, 'g');
      };

      const build = (p) => ({
        path: p?.path,
        pageCode: p?.pageCode,
        render: p?.route?.component,
        regex: generateRegex(p?.path),
      });

      if (route.type === 'subMenu') {
        return route.children.map((children) => ({
          ...build(children),
          parent: route?.key,
        }));
      }
      return build(route);
    })
    .flat(1);

  return (
    <>
      <Spin
        spinning={verifyLoading}
        tip="Loading ..."
        style={{ verticalAlign: 'middle', minHeight: '80vh' }}
      >
        <Layout className="layout" style={{ minHeight: '100vh' }}>
          <Affix offsetTop={0.1} style={{ height: '100vh' }}>
            <Sider
              breakpoint="lg"
              collapsible
              theme="light"
              width={isMobile ? 256 : 256}
              collapsedWidth={isMobile ? '0' : undefined}
              collapsed={collapsedSider || undefined}
              onCollapse={(collapsed) => {
                onCollapsedChange(collapsed);
              }}
              onBreakpoint={(broken) => {
                dispatch(allAction.mainAction.onMobile(broken));
              }}
              style={{
                height: '100%',
                zIndex: 100,
                position: isMobile ? 'absolute' : 'static',
                overflowY: isMobile ? null : 'scroll',
              }}
              trigger={isMobile ? '' : null}
            >
              <Image style={{ padding: 10 }} src={LOGO} preview={false} />
              <SideBar />
            </Sider>
          </Affix>
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{
                padding: 0,
                background: '#fff',
                borderWidth: 1,
                display: 'flex',
              }}
            >
              {!isMobile && (
                <span
                  style={{ paddingLeft: 20, cursor: 'pointer' }}
                  onClick={() => onCollapsedChange(!collapsedSider)}
                  aria-hidden="true"
                >
                  {collapsedSider ? (
                    <MenuUnfoldOutlined style={{ color: '#ff7157' }} />
                  ) : (
                    <MenuFoldOutlined style={{ color: '#ff7157' }} />
                  )}
                </span>
              )}
              <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-end',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              >
                <Avatar
                  style={{
                    marginRight: !isMobile ? 10 : 10,
                    cursor: 'pointer',
                  }}
                  src={picture}
                  onClick={() => { history.push('/admin/' + userID) }}
                >
                  {/* {username.substr(0, 1)} */}
                </Avatar>
                <Menu mode="horizontal">
                  <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    onClick={() => confirmLogout()}
                  >
                    <span>ออกจากระบบ</span>
                  </Menu.Item>
                </Menu>
              </div>
            </Header>
            <Content
              style={{
                padding: 12,
                minHeight: '50vh',
              }}
            >
              <div className="site-layout-background">
                <Switch>
                  {paths.map((p, idx) => {
                    return (
                      <Route key={idx} exact path={p?.path} render={p?.render} />
                    );
                  })}

                  <Redirect from="*" to="/user" />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Spin>
    </>
  );
};
export default PageLayout;
