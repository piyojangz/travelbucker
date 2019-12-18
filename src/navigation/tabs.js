/**
 * Tabs Scenes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { connect } from 'react-redux';
import { Scene } from 'react-native-router-flux';
import { Text } from 'react-native';
// Consts and Libs
import { AppConfig } from '@constants/';
import { AppStyles, AppSizes } from '@theme/';

// Components
import { TabIcon } from '@ui/';
// Scenes
import Placeholder from '@components/general/Placeholder';
import Privilege from '@components/general/Privilege';
import Profile from '@components/general/Profile';
import Home from '@components/general/Home';
import Error from '@components/general/Error';
import StyleGuide from '@containers/StyleGuideView';
import Noti from '@components/general/Noti';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

const navbarPropsTabs = {
  ...AppConfig.navbarProps
};

/* Routes ==================================================================== */
const scenes = (
  <Scene
    key={'tabBar'}
    tabs 
    tabBarIconContainerStyle={[AppStyles.tabbar]}
    pressOpacity={0.95}>
    <Scene
      {...navbarPropsTabs}
      key={'mainpage'}
      hideNavBar={true}
      title={'ONGOING'}  
      component={Home}
      icon={props => TabIcon({
        ...props,
        icon: 'flag-o',
        title: 'ONGOING'
      })} />

    {/* <Scene
      key={'Privilege'}
      {...navbarPropsTabs}
      title={'PRIVILEGE'}
      component={Privilege}
      icon={props => TabIcon({
      ...props,
      icon: 'card-giftcard',
      title: 'PRIVILEGE'
    })}
      analyticsDesc={'Privilege: Privilege'}/> */}

    <Scene
      key={'Noti'}
      {...navbarPropsTabs}
      hideNavBar={true}
      title={'NOTIFICATION'}
      component={Noti}
      icon={props => TabIcon({
        ...props,
        icon: 'bell-o',
        title: 'NOTIFICATION'
      })}
      analyticsDesc={'Error: Example Error'} />

    <Scene
      key={'Profile'}
      {...navbarPropsTabs}
      hideNavBar={true}
      title={'PROFILE'}
      component={Profile}
      icon={props => TabIcon({
        ...props,
        icon: 'ellipsis-h',
        title: 'PROFILE'
      })}
      analyticsDesc={'Profile:Profile'} />

      
  </Scene>
);

export default scenes;