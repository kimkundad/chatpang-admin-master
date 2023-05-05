/* eslint-disable function-paren-newline */
import React from 'react';
import { useSelector } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import PageLayout from './layouts/Layout';
import LoginPage from './pages/Login';
import ExportPage from './pages/Export';
// import FirstLoginPage from './pages/FirstLogin';
import './css/App.css';
// import allAction from './app/actions/index';

const App = () => {
  const { auth } = useSelector((state) => state.authenReducer);

  // console.log('auth 555 : ', window.localStorage.getItem(
  //   'authen-token'));

  //   console.log('auth 123 : ', auth);
  
  // console.log('isFirstLogin 1234 : ', isFirstLogin);

  // console.log('auth 1234 : ', auth);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(allAction.authenAction.checkToken());
  // }, []);
  // if (!auth) {
  //   console.log('gggg 1234 : ');
  // }

  console.log("1234 : ",window.localStorage.getItem(
    'authen-token'));
  if (!window.localStorage.getItem(
    'authen-token')) {
    return <LoginPage />;
  }
  // if (isFirstLogin) {
  //   return <FirstLoginPage />;
  // }
  return (
    <HashRouter>
      <Route exact path="/export/:orderId" component={ExportPage} />
      <PageLayout />
    </HashRouter>
  );
};

export default App;
