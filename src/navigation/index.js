/**
 * App Navigation
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

// Scenes
import AppLaunch from '@containers/Launch/LaunchContainer';
import Placeholder from '@components/general/Placeholder';
import WebView from '@components/general/WebView';
import Home from '@components/general/Home';
import Outcome from '@components/general/inputtype/Outcome';
import Addtrip from '@components/general/inputtype/Addtrip';
import Invite from '@components/general/inputtype/Invite';
import Addfriend from '@components/general/inputtype/Addfriend';
import Addmoney from '@components/general/inputtype/Addmoney';
import Addmoneydetail from '@components/general/inputtype/Addmoneydetail';
import Invitefriend from '@components/general/inputtype/Invitefriend';

import Login from '@containers/auth/Forms/Login';
import Register from '@containers/auth/Forms/Register';
import TabsScenes from './tabs';

/* Routes ==================================================================== */
export default Actions.create(
  <Scene key={'root'} {...AppConfig.navbarProps}>

    {/* Auth */}
    <Scene
      hideNavBar
      key={'AppLaunch'}
      component={AppLaunch}
      analyticsDesc={'AppLaunch: Launching App'}
    />

    <Scene key={'authenticate'}>
      <Scene
        {...AppConfig.navbarProps}
        hideNavBar={true}
        key={'login'}
        title={'Login'}
        clone
        component={Login}
        analyticsDesc={'Login'}
      />
      <Scene
        {...AppConfig.navbarProps}
        hideNavBar={true}
        key={'register'}
        title={'Register'}
        clone
        component={Register}
        analyticsDesc={'Register'}
      />
    </Scene>

    {/* Main App */}
    <Scene key={'app'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
      {/* Drawer Side Menu */}
      <Scene key={'home'} initial={'tabBar'}>
        {/* Tabbar */}
        {TabsScenes}
      </Scene>

      {/* General */}
      <Scene
        clone
        key={'comingSoon'}
        title={'Coming Soon'}
        component={Placeholder}
        analyticsDesc={'Placeholder: Coming Soon'}
      />


      <Scene
        clone
        hideNavBar={true}
        key={'invite'}
        component={Invite}
      />

      <Scene
        clone
        hideNavBar={true}
        key={'addtrip'}
        component={Addtrip}
      />

      <Scene
        clone
        hideNavBar={true}
        key={'addmoney'}
        component={Addmoney}
      />


      <Scene
        clone
        hideNavBar={true}
        key={'addmoneydetail'}
        component={Addmoneydetail}
      />

      <Scene
        clone
        hideNavBar={true}
        key={'tripdetail'}
        component={Home}
      />


      <Scene
        clone
        hideNavBar={true}
        key={'addfriend'}
        component={Addfriend}
      />



      <Scene
        clone
        hideNavBar={true}
        key={'invitefriend'}
        component={Invitefriend}
      />




      <Scene
        clone
        key={'inputdetail'}
        component={Outcome}
        analyticsDesc={'Placeholder: Coming Soon'}
      />


    </Scene>
  </Scene>,
);
