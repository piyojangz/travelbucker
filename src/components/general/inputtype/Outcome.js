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
import { AppSizes } from '@theme/';
import ActionSheet from '@yfuks/react-native-action-sheet';
import * as Animatable from 'react-native-animatable';
// import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import NavigationBar from 'react-native-navigation-bar';
import { Actions } from 'react-native-router-flux';
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
import {
  NativeModules,
  View,
  StyleSheet,
  Alert,
  InteractionManager,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
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
import { AppConfig } from '@constants/';
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
  },
  floateditbutton: {
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
const mapStateToProps = state => ({
  _user: state.appdataReducer.user,
  _symbol: state.appdataReducer.symbol,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  total: appdataActions.total,
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
      loading: false,
      floatshow: true,
      amount: this.props.parentData ? this.numberWithCommas(this.props.parentData.value) : '',
      note: this.props.parentData ? this.props.parentData.description : '',
      imgsrc: this.props.parentData ? { uri: AppConfig.imgaddress + this.props.parentData.img } : '',
      imgdata: ''
      //isDateTimePickerVisible: false,
    };
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  componentDidMount = () => {

  }

  /**
    * Each time page loads, update the URL
    */
  onNavigationStateChange = (navState) => {
    this.state.webViewURL = navState.url;
    if (this.props.onNavigationStateChange)
      this.props.onNavigationStateChange(navState.url);
  }

  submit(_editable) {
    if (this.state.amount != ''
      && this.state.note != '') {
      this.setState({ loading: true, });
      var params = {
        id: this.props.parentData ? this.props.parentData.id : 0,
        tripid: this.props.parentObj ? this.props.parentObj.id : this.props.parentData.tripid,
        typeid: this.props.outcometypeid ? this.props.outcometypeid : this.props.parentData.typeid,
        userid: this.props._user.id,
        description: this.state.note,
        amount: this.state.amount,
        imageData: this.state.imgdata,
        editable: _editable,
      };
      console.log(params);
      var formData = new FormData();

      for (var k in params) {
        formData.append(k, params[k]);
      }
      var request = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      };

      fetch(AppConfig.api + 'api/addexpenses', request).then((response) => {
        return response.json() // << This is the problem
      })
        .then((responseData) => { // responseData = undefined
          return responseData;
        })
        .then((data) => {
          console.log(data.result_total);
          this
            .props
            .dispatch({ type: 'TOTAL', total: data.result_total.total });
        }).done(() => {
          this.setState({ loading: false, });
          Actions.pop({ type: 'reset' });
        });
    }
    else {
      Alert.alert(
        'Message',
        'กรุณาระบุข้อมูลให้ครบถ้วน?',
        [
          { text: 'Dismiss', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
        ]
      );
    }
  }


  floatbutton = () => {
    if (this.state.floatshow && !this.props.parentData) {
      return (
        <TouchableWithoutFeedback onPress={() => this.submit(false)}>
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

    if (this.props.parentData && this.props.parentData.userid == this.props._user.id) {
      return (
        <TouchableWithoutFeedback onPress={() => this.submit(true)}>
          <Animatable.View
            style={styles.floateditbutton}
            animation="zoomIn"
            duration={200}
            easing="ease-out">
            <Icon name={'md-done-all'} size={30} color={'#FFFFFF'} />
          </Animatable.View>
        </TouchableWithoutFeedback>
      )
    }
  }

  checkselectimg() {
    if (!this.props.parentData) {
      this.showActionSheet();
    }
    else {
      if (this.props.parentData.userid == this.props._user.id) {
        this.showActionSheet();
      }
    }

  }


  showActionSheet() {

    var DESTRUCTIVE_INDEX = 3;
    var CANCEL_INDEX = 2;

    var BUTTONSiOS = [
      'คลังภาพ',
      'กล้องถ่ายรูป',
      'Cancel'
    ];

    var BUTTONSandroid = [
      'คลังภาพ',
      'กล้องถ่ายรูป',
      'Cancel'
    ];

    ActionSheet.showActionSheetWithOptions({
      options: (Platform.OS == 'ios') ? BUTTONSiOS : BUTTONSandroid,
      cancelButtonIndex: CANCEL_INDEX,
      destructiveButtonIndex: DESTRUCTIVE_INDEX,
      tintColor: '#6C7A89'
    },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.pickImage();
            break
          case 1:
            this.pickCamera();
            break
          default: break;
        }
      });
  }
  pickCamera() {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      console.log(image);
      let source = { uri: image.path };
      this.setState({
        imgsrc: source,
        imgdata: image.data
      });
    });
  }

  pickImage() {

    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      console.log(image);
      let source = { uri: image.path }; 
      this.setState({
        imgsrc: source,
        imgdata: image.data
      });
    });
 
  }

 

  render = () => {
    const { loading } = this.state;
    const imgsrc = this.state.imgsrc == '' ? require('../../../assets/images/img_add.png') : this.state.imgsrc;
    return (
      <View style={{ flex: 1, backgroundColor: '#F2F1EF' }}>
        <NavigationBar
          title={this.props.title}
          height={(Platform.OS === 'ios') ? 44 : 64}
          titleColor={'#fff'}
          backgroundColor={AppColors.brand.primary}
          leftButtonIcon={require('../../../assets/images/ic_left-arrow.png')}
          backgroundColor={AppColors.brand.primary}
          leftButtonTitle={'ย้อนกลับ'}
          onLeftButtonPress={Actions.pop}
          leftButtonTitleColor={'#fff'}
        />
        <View style={{ marginTop: 64, flex: 1, }}>
          <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
            <ScrollView
              automaticallyAdjustContentInsets={true}
              style={styles.container}>

              <View
                style={{
                  backgroundColor: '#26A65B',
                  alignItems: 'center',
                  height: 120,
                  padding: 30,
                  paddingTop: 20,
                }}>
                <TextInput
                  editable={this.props.parentData && !(this.props.parentData.userid == this.props._user.id) ? false : true}
                  style={{
                    width: AppSizes.screen.width - 60,
                    fontFamily: 'Roboto-Black',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: (Platform.OS === 'ios') ? 50 : 40,
                    height: 70,
                    color: '#FFF',
                    borderWidth: 0
                  }}
                  maxLength={7}
                  placeholderTextColor={'#FFF'}
                  placeholder={'0'}
                  keyboardType='numeric'
                  onChangeText={amount => this.setState({ amount: this.numberWithCommas(amount.replace(',', '')) })}
                  value={this.state.amount} />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 20
                  }}>{this.props._symbol}</Text>
              </View>


              <View style={[AppStyles.paddingHorizontal]}>
                <FormLabel><Icon name={'md-create'} size={15} color={'#000000'} /> {' บันทึกเพิ่มเติม'}</FormLabel>
                <FormInput placeholder={'ระบุรายละเอียดเพิ่มเติม'}
                  editable={this.props.parentData && !(this.props.parentData.userid == this.props._user.id) ? false : true}
                  onChangeText={(note) => this.setState({ note })} value={this.state.note} />

                <Spacer size={10} />

                {/* <FormLabel><Icon name={'md-pin'} size={15} color={'#000000'} /> {' สถานที่'}</FormLabel>

              <FormInput /> */}


                {/* <FormLabel><Icon name={'md-calendar'} size={15} color={'#000000'} /> {' วัน/เวลา'}</FormLabel> */}
                {/* <TouchableOpacity onPress={this._showDateTimePicker}>
                <FormInput editable={false} />
              </TouchableOpacity> */}
                <FormLabel><Icon name={'md-attach'} size={15} color={'#000000'} /> {' แนบรูปสลิป'}</FormLabel>
                <Spacer size={20} />
                <View
                  style={{
                    flex: 1,
                    borderRadius: 5,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.checkselectimg()}>
                    <Image
                      style={{
                        width: AppSizes.screen.width,
                        height: AppSizes.screen.width,
                        backgroundColor: 'silver'
                      }}
                      resizeMode='cover'
                      source={imgsrc}
                    />
                  </TouchableOpacity>
                </View>
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
        <SleekLoadingIndicator loading={this.state.loading} />
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Outcome);