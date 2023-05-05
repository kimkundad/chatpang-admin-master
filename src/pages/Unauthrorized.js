import { Result, Button } from 'antd';

const Unauthrorized = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
  />
);

export default Unauthrorized;
