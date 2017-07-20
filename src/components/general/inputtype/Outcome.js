/**
 * Web View
 *
 * <WebView url={"http://google.com"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import {
  View,
  StyleSheet,
  InteractionManager,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
// Components
import {
  Alerts,
  Button,
  Card,
  Spacer,
  Text,
  List,
  ListItem,
  FormInput,
  FormLabel
} from '@components/ui/';
import Icon from 'react-native-vector-icons/Ionicons';
// Consts and Libs
import {AppColors, AppStyles} from '@theme/';
// Actions
import * as appdataActions from '@redux/appdata/actions';
// Components
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background,
    flex: 1
  },
  floatbutton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1C40F',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 70,
    right: 20
  }
});

// What data from the store shall we send to the component?
const mapStateToProps = state => ({stotal: state.appdataReducer.total});

// Any actions to map to the component?
const mapDispatchToProps = {
  total: appdataActions.total
};

/* Component ==================================================================== */
class Outcome extends Component {

  static componentName = 'Outcome';

  static propTypes = {
    onNavigationStateChange: PropTypes.func
  }

  static defaultProps = {
    onNavigationStateChange: null
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      floatshow: true
    };
  }

  componentDidMount = () => {
    // Wait until interaction has finished before loading the webview in
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: false});
      this
        .props
        .dispatch({type: 'TOTAL', total: 700});

      console.log(this.props.stotal);
      console.log(this.props.parent);
    });
  }

  /**
    * Each time page loads, update the URL
    */
  onNavigationStateChange = (navState) => {
    this.state.webViewURL = navState.url;
    if (this.props.onNavigationStateChange) 
      this.props.onNavigationStateChange(navState.url);
    }
  
  floatbutton = () => {
    if (this.state.floatshow) {
      return (
        <TouchableWithoutFeedback>
          <Animatable.View
            style={styles.floatbutton}
            animation="zoomIn"
            duration={200}
            easing="ease-out">
            <Icon name={'md-checkmark'} size={30} color={'#FFFFFF'}/>
          </Animatable.View>
        </TouchableWithoutFeedback>
      )
    }
  }

  render = () => {
    const {loading} = this.state;

    if (loading) 
      return <Loading/>;
    return (
      <View style={styles.container}>
        <View
          style={{
          marginTop: 60,
          backgroundColor: '#26A65B',
          alignItems: 'center',
          padding: 30
        }}>
          <TextInput
            style={{
            height: 40,
            textAlign: 'center',
            fontSize: 50,
            color: '#FFF',
            borderWidth: 0
          }}
            keyboardType='numeric'
            value='0'/>
          <Text
            style={{
            color: '#FFFFFF',
            fontSize: 20
          }}>THB</Text>
        </View>
        <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView
            automaticallyAdjustContentInsets={true}
            style={[AppStyles.container]}>

            <View style={[AppStyles.paddingHorizontal]}>
              <FormLabel><Icon name={'md-create'} size={15} color={'#000000'}/> {' บันทึกเพิ่มเติม'}</FormLabel>
              <FormInput/>

              <Spacer size={10}/>

              <FormLabel><Icon name={'md-pin'} size={15} color={'#000000'}/> {' สถานที่'}</FormLabel>
              <FormInput/>

              <FormLabel><Icon name={'md-calendar'} size={15} color={'#000000'}/> {' วัน/เวลา'}</FormLabel>
              <FormInput/>

              <FormLabel><Icon name={'md-attach'} size={15} color={'#000000'}/> {' แนบรูปสลิป'}</FormLabel>
              <FormInput/>

            </View>

          </ScrollView>
        </KeyboardAvoidingView>
        {this.floatbutton()}
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Outcome);