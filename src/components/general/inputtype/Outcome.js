/**
 * Web View
 *
 * <WebView url={"http://google.com"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
// import DateTimePicker from 'react-native-modal-datetime-picker';
import PhotoUpload from 'react-native-photo-upload'
import {
  View,
  StyleSheet,
  InteractionManager,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  TouchableOpacity,
  Image 
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
import { AppColors, AppStyles } from '@theme/';
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
    backgroundColor: '#2ECC71',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 70,
    right: 20
  }
});

// What data from the store shall we send to the component?
const mapStateToProps = state => ({ stotal: state.appdataReducer.total });

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

  // _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  // _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  // _handleDatePicked = (date) => {
  //   console.log('A date has been picked: ', date);
  //   this._hideDateTimePicker();
  // };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      floatshow: true,
      //isDateTimePickerVisible: false,
    };
  }

  componentDidMount = () => {
    // Wait until interaction has finished before loading the webview in
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loading: false });
      this
        .props
        .dispatch({ type: 'TOTAL', total: 700 });

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
            <Icon name={'md-checkmark'} size={30} color={'#FFFFFF'} />
          </Animatable.View>
        </TouchableWithoutFeedback>
      )
    }
  }

  render = () => {
    const { loading } = this.state;

    if (loading)
      return <Loading />;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="height" style={{flexGrow: 1}}>
          <ScrollView
            automaticallyAdjustContentInsets={true}
          style={styles.container}>

            <View
              style={{
                marginTop: (Platform.OS === 'ios') ? 60 : 50,
                backgroundColor: '#26A65B',
                alignItems: 'center',
                height:120,
                padding: 30
              }}>
              <TextInput
                style={{
                  fontFamily: 'Roboto-Black',
                  fontWeight: 'bold',
                  textAlign: 'center',  
                  fontSize: 50,
                  height:50,
                  color: '#FFF', 
                  borderWidth: 0
                }}
                keyboardType='numeric'
                value='1205000' />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 20
                }}>THB</Text>
            </View>


            <View style={[AppStyles.paddingHorizontal]}>
              <FormLabel><Icon name={'md-create'} size={15} color={'#000000'} /> {' บันทึกเพิ่มเติม'}</FormLabel>
              <FormInput />

              <Spacer size={10} />

              {/* <FormLabel><Icon name={'md-pin'} size={15} color={'#000000'} /> {' สถานที่'}</FormLabel>

              <FormInput /> */}


              {/* <FormLabel><Icon name={'md-calendar'} size={15} color={'#000000'} /> {' วัน/เวลา'}</FormLabel> */}
              {/* <TouchableOpacity onPress={this._showDateTimePicker}>
                <FormInput editable={false} />
              </TouchableOpacity> */}
              <FormLabel><Icon name={'md-attach'} size={15} color={'#000000'} /> {' แนบรูปสลิป'}</FormLabel>
                <Spacer size={20} />
              <PhotoUpload
                onPhotoSelect={avatar => {
                  if (avatar) {
                    console.log('Image base64 string: ', avatar)
                  }
                }}
              >
                <Image
                  style={{ 
                    width: 250,
                    height: 180,
                    borderRadius: 15,
                    backgroundColor:'silver'
                  }}
                  resizeMode='cover'
                  source={{
                    uri: 'https://via.placeholder.com/250x180'
                  }}
                />
              </PhotoUpload>
                <Spacer size={50} />
              {/* <View style={{ flex: 1 }}> */}
              {/* <DateTimePicker
                  mode={'datetime'}
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this._handleDatePicked}
                  onCancel={this._hideDateTimePicker}
                /> */}
              {/* </View> */}
            </View>
            <Spacer size={50} />
          </ScrollView>
        </KeyboardAvoidingView>
        {this.floatbutton()}
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Outcome);