/**
 * Launch Screen Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';


// The component we're mapping to
import AppLaunchRender from './LaunchView';
import * as appdataActions from '@redux/appdata/actions';
const mapStateToProps = state => ({
  _user: state.appdataReducer.user
});


const mapDispatchToProps = {
  user: appdataActions.user
};


export default connect(mapStateToProps, mapDispatchToProps)(AppLaunchRender);
