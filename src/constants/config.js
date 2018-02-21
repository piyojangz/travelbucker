/**
 * Global App Config
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
/* global __DEV__ */
import { AppColors, AppStyles, AppSizes } from '@theme/';

export default {
  // App Details
  appName: 'TravelBucker',

  // Build Configuration - eg. Debug or Release?
  DEV: __DEV__,

  // Google Analytics - uses a 'dev' account while we're testing
  gaTrackingId: (__DEV__)
    ? 'UA-84284256-2'
    : 'UA-84284256-1',

  // URLs
  urls: {},
api: 'https://www.servewellsolution.com/hpocket/',
imgaddress: 'https://www.servewellsolution.com/hpocket/public/uploads/trip_img/',
avatarblank: 'https://www.servewellsolution.com/hpocket/public/uploads/trip_img/avatar-blank.jpg',


  // api:'http://localhost/hangpocket/',
  // imgaddress: 'http://localhost/hangpocket/public/uploads/trip_img/',
  // avatarblank: 'http://localhost/hangpocket/public/uploads/trip_img/avatar-blank.jpg',

  // Navbar Props
  navbarProps: {
    hideNavBar: false,
    titleStyle: AppStyles.navbarTitle,
    navigationBarStyle: AppStyles.navbar,
    leftButtonIconStyle: AppStyles.navbarButton,
    rightButtonIconStyle: AppStyles.navbarButton,
    sceneStyle: {
      backgroundColor: AppColors.background,
      paddingTop: AppSizes.navbarHeight
    }
  },


};
