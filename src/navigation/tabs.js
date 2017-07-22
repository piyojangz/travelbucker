/**
 * Tabs Scenes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import {connect} from 'react-redux';
import {Scene} from 'react-native-router-flux';
import {Text} from 'react-native';
// Consts and Libs
import {AppConfig} from '@constants/';
import {AppStyles, AppSizes} from '@theme/';

// Components
import {TabIcon} from '@ui/';
import {NavbarMenuButton} from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

// Scenes
import Placeholder from '@components/general/Placeholder';
import Privilege from '@components/general/Privilege';
import Profile from '@components/general/Profile';
import Home from '@components/general/Home';
import Error from '@components/general/Error';
import StyleGuide from '@containers/StyleGuideView';
import Recipes from '@containers/recipes/Browse/BrowseContainer';
import RecipeView from '@containers/recipes/RecipeView';
 


const navbarPropsTabs = {
  ...AppConfig.navbarProps
};

/* Routes ==================================================================== */
const scenes = (
  <Scene
    key={'tabBar'}
    tabs
    tabBarIconContainerStyle={AppStyles.tabbar}
    pressOpacity={0.95}>
    <Scene
      {...navbarPropsTabs}
      key={'mainpage'}
      title={'ONGOING'}
      component={Home}
      icon={props => TabIcon({
      ...props,
      icon: 'insert-invitation',
      title: 'ONGOING'
    })}/>

    <Scene
      key={'Privilege'}
      {...navbarPropsTabs}
      title={'PRIVILEGE'}
      component={Privilege}
      icon={props => TabIcon({
      ...props,
      icon: 'card-giftcard',
      title: 'PRIVILEGE'
    })}
      analyticsDesc={'Privilege: Privilege'}/>

    <Scene
      key={'error'}
      {...navbarPropsTabs}
      title={'NOTIFICATION'}
      component={Placeholder}
      icon={props => TabIcon({
      ...props,
      icon: 'alarm-on',
      title: 'NOTIFICATION'
    })}
      analyticsDesc={'Error: Example Error'}/>

    <Scene
      key={'Profile'}
      {...navbarPropsTabs}
      title={'PROFILE'}
      component={Profile}
      icon={props => TabIcon({
      ...props, 
      icon: 'face',
      title: 'PROFILE'
    })}
      analyticsDesc={'Profile:Profile'}/>
  </Scene>
);

export default scenes;