const ENV = process.env.REACT_APP_ENV;
const endpoint = process.env[`REACT_APP_ENDPOINT_${process.env.REACT_APP_ENV}`];

const getHeader = () => {
  return {
    Authorization: `Bearer ${window.localStorage.getItem(`user-token-${ENV}`)}`,
  };
};

const apiConfig = {
  ENV,
  endpoint,
  extraOptions: { maxRetries: 5 },
  headers: getHeader,
};

export default apiConfig;
