/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *    - Preloading any specified app content
 *    - Checking if user is logged in, and redirects from there
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Alert,
  StatusBar,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as appdataActions from '@redux/appdata/actions';
// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  launchImage: {
    width: AppSizes.screen.width,
    height: AppSizes.screen.height,
  },
});






/* Component ==================================================================== */
class AppLaunch extends Component {
  static componentName = 'AppLaunch';


  componentDidMount = () => {
    // Show status bar on app launch
    StatusBar.setHidden(false, true);

    AsyncStorage.getItem("userdetail").then((value) => {
      if (value != null) {
        val = JSON.parse(value); 
        if (val.islogin == '1') {
          this
            .props
            .dispatch({
              type: 'USER', user: val
            });
            Actions.app({ type: 'reset' });
        }
        else {
          Actions.authenticate({ type: 'reset' })
        }
      }
      else {
        Actions.authenticate({ type: 'reset' })
      }
    });




  }

  render = () => (
    <View style={[AppStyles.container]}>
      <Image
        source={require('../../images/launch.jpg')}
        style={[styles.launchImage, AppStyles.containerCentered]}
      >
        <ActivityIndicator
          animating
          size={'large'}
          color={'#C1C5C8'}
        />
      </Image>
    </View>
  );
}

/* Export Component ==================================================================== */
export default AppLaunch;