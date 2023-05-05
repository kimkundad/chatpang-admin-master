import { combineReducers } from 'redux';
import authenReducer from './authen';
import mainReducer from './main';
// import superAdminReducer from './super-admin';
// import companyReducer from './company';
// import customerReducer from './customer';
// import userManagementReducer from './user-management';
// import roleManagementReducer from './role-management';
// import settingAgencyReducer from './setting-agency';
// import settingLevelReducer from './setting-level';
// import settingBankReducer from './setting-bank';
// import agencyReducer from './agency';
// import hubReducer from './hub';
// import settingAreaReducer from './setting-area';
// import settingParcelTypeReducer from './setting-parcel-type';
// import settingTransportReducer from './setting-transport';
// import settingMorePriceReducer from './setting-more-price';
// import manageDriverReducer from './manage-driver';
// import storeCustomeReducer from './store-custome';
// import settingCustomeTypeReducer from './setting-custome-type';
// import storeSellReducer from './store-sell';
// import storeListSellReducer from './store-list-sell';
// import storeSettingReducer from './store-setting';
// import hubProductReducer from './hub-product';
// import hubListSellReducer from './hub-list-sell';
// import hubSaleOrder from './hub-sale-order';
// import hubReturn from './hub-return';
// import storeSellOrderReducer from './store-sell-order';
// import storeWalletReducer from './store-wallet';
// import reportReducer from './report';
// import reportBalanceReducer from './report-balance';
// import listSellReducer from './list-sell';
// // import { apiSlice } from '../../api/apiSlice'
// import orderItemImportReducer from '../slice/orderItemImportSlice';
// import { orderItemsApi } from '../api/orderItemsApi';

// import { walletApi } from '../api/walletApi';

// import dashboardReducer from '../slice/dashboardSlice';
// import { dashboardApi } from '../api/dashboardApi';

// import kaiUtilsReducer from '../slice/kaiUtilsSlice';

import lineReducer from './line';
import historyReducer from './history';
import adminReducer from './admin';
import userReducer from './user';
import packageReducer from './package';
import reviewReducer from './review';

const rootReducer = combineReducers({
  authenReducer,
  mainReducer,
  // superAdminReducer,
  // companyReducer,
  // customerReducer,
  // userManagementReducer,
  // roleManagementReducer,
  // settingAgencyReducer,
  // settingLevelReducer,
  // settingBankReducer,
  // agencyReducer,
  // hubReducer,
  // settingAreaReducer,
  // settingParcelTypeReducer,
  // settingTransportReducer,
  // settingMorePriceReducer,
  // manageDriverReducer,
  // storeCustomeReducer,
  // settingCustomeTypeReducer,
  // storeSellReducer,
  // storeListSellReducer,
  // storeSettingReducer,
  // hubProductReducer,
  // hubListSellReducer,
  // hubSaleOrder,
  // hubReturn,
  // storeSellOrderReducer,
  // storeWalletReducer,
  // reportReducer,
  // reportBalanceReducer,
  // listSellReducer,
  // // [apiSlice.reducerPath]: apiSlice.reducer
  // [orderItemsApi.reducerPath]: orderItemsApi.reducer,
  // orderItemImportReducer,
  // [walletApi.reducerPath]: walletApi.reducer,
  // [dashboardApi.reducerPath]: dashboardApi.reducer,
  // dashboardReducer,
  // kaiUtilsReducer,
  lineReducer,
  historyReducer,
  adminReducer,
  userReducer,
  packageReducer,
  reviewReducer,
});

export default rootReducer;
