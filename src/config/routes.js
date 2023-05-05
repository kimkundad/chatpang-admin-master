/* eslint-disable react/react-in-jsx-scope */
import {
  UserSwitchOutlined,
  UserOutlined,
  ClusterOutlined,
  SolutionOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import AdminPage from '../pages/admin/Admin';
import AdminInputPage from '../pages/admin/AdminInput';
import ReviewPage from '../pages/review/Review';
import HistoryPage from '../pages/history/History';
import OptionPage from '../pages/option/Option';
import UserPage from '../pages/user/User';
import UserDetailPage from '../pages/user/UserDetail';
import PackagePage from '../pages/package/Package';
import PackageInputPage from '../pages/package/PackageInput';
import LinePage from '../pages/line/Line';
import LineInputPage from '../pages/line/LineInput';
import HistoryDetailPage from '../pages/history/HistoryDetail';
import ReviewInputPage from '../pages/review/ReviewInput';

const routes = [
  // example Type manu
  {
    path: '/user',
    name: 'user',
    type: 'menu',
    menu: {
      icon: <UserOutlined />,
      render: 'ลูกค้าผู้ใช้งาน',
    },
    route: { component: (props) => <UserPage {...props} /> },
  },
  {
    path: '/user/:userId',
    name: 'User Detail',
    type: 'route',
    route: {
      component: (props) => <UserDetailPage {...props} />,
    },
  },
  {
    path: '/history',
    name: 'History',
    type: 'menu',
    menu: {
      icon: <FieldTimeOutlined />,
      render: 'ประวัติการต่ออายุการใช้งาน',
    },
    route: { component: (props) => <HistoryPage {...props} /> },
  },
  {
    path: '/history/:historyId',
    name: 'History Detail',
    type: 'route',
    route: {
      component: (props) => <HistoryDetailPage {...props} />,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    type: 'menu',
    menu: {
      icon: <UserSwitchOutlined />,
      render: 'เเอดมินที่ใช้งาน',
    },
    route: { component: (props) => <AdminPage {...props} /> },
  },
  {
    path: '/admin/:adminId',
    name: 'Admin Detail',
    type: 'route',
    route: {
      component: (props) => <AdminInputPage {...props} />,
    },
  },
  {
    path: '/line',
    name: 'Line',
    type: 'menu',
    menu: {
      icon: <ClusterOutlined />,
      render: 'กลุ่ม Line Notify',
    },
    route: { component: (props) => <LinePage {...props} /> },
  },
  {
    path: '/line/:lineId',
    name: 'Line Detail',
    type: 'route',
    route: {
      component: (props) => <LineInputPage {...props} />,
    },
  },
  {
    path: '/option',
    name: 'Option',
    type: 'menu',
    menu: {
      icon: <AppstoreAddOutlined />,
      render: 'เพิ่ม / ลด วันใช้งาน',
    },
    route: { component: (props) => <OptionPage {...props} /> },
  },
  {
    path: '/package',
    name: 'Package',
    type: 'menu',
    menu: {
      icon: <SolutionOutlined />,
      render: 'จัดการเเพ็คเกจ',
    },
    route: { component: (props) => <PackagePage {...props} /> },
  },
  {
    path: '/package/:packageId',
    name: 'Package Detail',
    type: 'route',
    route: {
      component: (props) => <PackageInputPage {...props} />,
    },
  },
  {
    path: '/review',
    name: 'Review',
    type: 'menu',
    menu: {
      icon: <SettingOutlined />,
      render: 'จัดการรีวิวลูกค้า',
    },
    route: { component: (props) => <ReviewPage {...props} /> },
  },
  {
    path: '/review/:reviewId',
    name: 'Review Detail',
    type: 'route',
    route: {
      component: (props) => <ReviewInputPage {...props} />,
    },
  },
];

export default routes;
