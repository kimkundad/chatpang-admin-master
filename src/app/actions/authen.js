// import jwt from 'jsonwebtoken';
import { fetch } from '../../utils/fetch';

// actions
const toLogin = (username, password) => (dispatch) => {
  dispatch(onLoading(true));

  return new Promise((resolve, reject) => {
    fetch({
      method: 'post',
      url: '/public/admins/login',
      data: { username, password },
    })
      .then(async (res) => {
        if (res.data.message === 'done') {
          // eslint-disable-next-line camelcase
          const { data, access_token } = res.data;

          window.localStorage.setItem(
            'authen-token',
            access_token,
          );
            fetch({
              method: 'get',
              url: `/admins/${data.sub}`,
          })
              .then((resData) => {
                  dispatch(onLogin(access_token,
                        data.username,
                        data.sub,
                        resData.data.data.picture,
                        resData.data.data.first_name,
                        resData.data.data.last_name,
                        resData.data.data.tel,
                        resData.data.data.status,
                        resData.data.data.role));
                  dispatch(onVerify({ auth: true, isLoading: false }));
                  dispatch(onLoading(false));
                  resolve(true);
              })
              .catch((error) => {
                dispatch(onLoading(false));
                reject(error);
              });
        } else {
          dispatch(onLoading(false));
          reject(res.data);
        }
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

// const getAdminDetail = () => (dispatch) => {
//   dispatch(onLoading(true));
//   return new Promise((resolve, reject) => {
//       fetch({
//           method: 'get',
//           url: '/admins',
//       })
//           .then((res) => {
//               if (res.data.message === 'done') {
//                   dispatch(onLoading(false));
//                   dispatch(setAdminData(res.data.data.results));
//                 } else {
//                   dispatch(onLoading(false));
//                   reject(res.data);
//                 }
//           })
//           .catch((error) => {
//               console.log(error);
//           });
//   });
// };

const toLogout = () => (dispatch) => {
  dispatch(onLoading(true));
  window.localStorage.removeItem('authen-token');
  dispatch(onVerify({ auth: false, isLoading: false }));
  dispatch(onLoading(false));
};

const onVerify = (action) => ({
  type: 'VERIFY',
  auth: action.auth,
  isLoading: action.isLoading,
});
// eslint-disable-next-line max-len, camelcase
const onLogin = (access_token, username, userID, picture, first_name, last_name, tel, status, role) => ({
  type: 'LOGIN',
  access_token,
  username,
  userID,
  picture,
  first_name,
  last_name,
  tel,
  status,
  role,
});

const onLogout = () => ({
  type: 'LOGOUT',
  access_token: '',
  username: '',
  userID: '',
  picture: '',
  first_name: '',
  last_name: '',
  tel: '',
  status: '',
  role: '',
});

const onLoading = (action) => ({
  type: 'LOADING',
  isLoading: action,
});

export default {
  toLogin,
  toLogout,
  onLogout,
  onVerify,
};
