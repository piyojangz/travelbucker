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
import * as Animatable from 'react-native-animatable';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PhotoUpload from 'react-native-photo-upload'
import NavigationBar from 'react-native-navigation-bar';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { AppConfig } from '@constants/';
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
import ModalPicker from 'react-native-modal-picker'
import {
  View,
  Alert,
  StyleSheet,
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
  }, selector: {
    marginTop: 15,
    flex: 1
  },

});

const mapStateToProps = state => ({
  _user: state.appdataReducer.user,
});

const mapDispatchToProps = {
};

/* Component ==================================================================== */
class Addtrip extends Component {

  static componentName = 'Outcome';

  static propTypes = {
    onNavigationStateChange: PropTypes.func
  }

  static defaultProps = {
    onNavigationStateChange: null
  }

  _showDateTimePickerFrom = () => this.setState({ isDateTimePickerVisibleFrom: true });

  _hideDateTimePickerFrom = () => this.setState({ isDateTimePickerVisibleFrom: false });

  _showDateTimePickerEnd = () => this.setState({ isDateTimePickerVisibleEnd: true });

  _hideDateTimePickerEnd = () => this.setState({ isDateTimePickerVisibleEnd: false });

  _handleDatePickedFrom = (date) => {
    console.log('A date has been picked: ', date);
    var d = new Date(date);
    console.log(d.toDateString());
    var n = (d.getFullYear()) + "-"
      + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
    console.log(n);
    this.setState({ isDateTimePickerVisibleFrom: false, startdate: n })

    this._hideDateTimePickerFrom();
  };


  _handleDatePickedEnd = (date) => {
    console.log('A date has been picked: ', date);
    var d = new Date(date);
    console.log(d.toDateString());
    var n = (d.getFullYear()) + "-"
      + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
    console.log(n);
    this.setState({ isDateTimePickerVisibleEnd: false, enddate: n })
    this._hideDateTimePickerEnd();
  };
  constructor(props) {
    super(props);

    this.state = {
      symbol: '฿',
      currency: 'Thai bath - ฿',
      loading: false,
      floatshow: true,
      amount: '',
      note: '',
      imgsrc: '',
      isDateTimePickerVisibleFrom: false,
      isDateTimePickerVisibleEnd: false,
      title: '',
      description: '',
      startdate: undefined,
      enddate: undefined,
    };
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  componentDidMount = () => {
    // Wait until interaction has finished before loading the webview in
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loading: false });


      // console.log(this.props.tripdetail);
      // console.log(this.props.parent);

      if (this.props.tripdetail) {

        this.setState({
          title: this.props.tripdetail.title,
          currency: this.props.tripdetail.currency,
          description: this.props.tripdetail.description,
          startdate: this.props.tripdetail.startdate.slice(0, 10),
          enddate: this.props.tripdetail.enddate.slice(0, 10),
        });
      }
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

  submit() {
    if (this.state.title != ''
      && this.state.description != ''
      && this.state.startdate != undefined
      && this.state.enddate != undefined) {
      this.setState({ loading: true, });
      var params = {
        tripid: this.props.tripdetail ? this.props.tripdetail.id : '',
        userid: this.props._user.id,
        title: this.state.title,
        description: this.state.description,
        startdate: this.state.startdate,
        enddate: this.state.enddate,
        currency: this.state.currency,
        symbol: this.state.symbol,
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

      fetch(AppConfig.api + 'api/addtrip', request).then((response) => {
        return response.json() // << This is the problem
      })
        .then((responseData) => { // responseData = undefined
          return responseData;
        })
        .then((data) => {
          console.log(data);
        }).done(() => {
          this.setState({ loading: false, });
          Actions.Profile();
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
    if (this.state.floatshow) {
      return (
        <TouchableWithoutFeedback onPress={() => this.submit()}>
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
    let index = 0;
    const data = [
      { key: index++, label: 'Thai bath - ฿', symbol: '฿' },
      { key: index++, label: 'Dollar - $', symbol: '$' },
      { key: index++, label: 'Japan Yen ¥', symbol: '¥' },
      { key: index++, label: 'Peso - 	₱', symbol: '₱' },
      { key: index++, label: 'Pound - £', symbol: '£' },
      { key: index++, label: 'Rupiah - Rp', symbol: 'Rp' },
      { key: index++, label: 'Korea Won -	₩', symbol: '₩' },
      { key: index++, label: 'Laos Kip -	₭', symbol: '₭' },
      { key: index++, label: 'Malaysia Ringgit - RM', symbol: 'RM' },
      { key: index++, label: 'Rupee - ₨', symbol: '₨' }
    ];

    return (
      <View style={{ flex: 1, backgroundColor: '#F2F1EF' }}>
        <NavigationBar
          title={this.props.tripdetail ? 'แก้ไขทริป' : 'เพิ่มทริป'}
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



              <View style={[AppStyles.paddingHorizontal]}>
                <FormLabel><Icon name={'md-create'} size={15} color={'#000000'} /> {' ชื่อเรื่อง'}</FormLabel>
                <FormInput placeholder={'ระบุชื่อทริป'} onChangeText={(title) => this.setState({ title })} value={this.state.title} />

                <Spacer size={10} />


                <FormLabel><Icon name={'md-create'} size={15} color={'#000000'} /> {' รายละเอียดเพิ่มเติม'}</FormLabel>
                <FormInput placeholder={'ระบุรายละเอียดทริป'} onChangeText={(description) => this.setState({ description })} value={this.state.description} />
                <Spacer size={20} />


                <FormLabel><Icon name={'md-calendar'} size={15} color={'#000000'} /> {' วันที่เริ่ม'}</FormLabel>
                <TouchableOpacity onPress={this._showDateTimePickerFrom}>
                  <View style={{ borderBottomColor: '#F2F1EF', borderBottomWidth: 1, paddingBottom: 8, paddingTop: 8 }}>
                    <Text onChangeText={(startdate) => this.setState({ startdate })}  >{this.state.startdate}</Text>
                  </View>
                </TouchableOpacity>

                <Spacer size={20} />

                <FormLabel><Icon name={'md-calendar'} size={15} color={'#000000'} /> {' วันที่สิ้นสุด'}</FormLabel>
                <TouchableOpacity onPress={this._showDateTimePickerEnd}>
                  <View style={{ borderBottomColor: '#F2F1EF', borderBottomWidth: 1, paddingBottom: 8, paddingTop: 8 }}>
                    <Text onChangeText={(enddate) => this.setState({ enddate })} >{this.state.enddate} </Text>
                  </View>
                </TouchableOpacity>
                <Spacer size={20} />
                <FormLabel><Icon name={'md-create'} size={15} color={'#000000'} /> {' สกุลเงิน'}</FormLabel>
                <ModalPicker
                  style={styles.selector}
                  data={data}
                  initValue={this.state.currency}
                  onChange={(option) => { this.setState({ currency: option.label, symbol: option.symbol }) }} />





                <Spacer size={50} />
                <View style={{ flex: 1 }}>
                  <DateTimePicker
                    mode={'date'}
                    datePickerModeAndroid={'calendar'}
                    titleIOS={'ระบุวันเริ่มต้น'}
                    date={this.state.startdate != undefined ? new Date(this.state.startdate) : new Date()}
                    isVisible={this.state.isDateTimePickerVisibleFrom}
                    onConfirm={this._handleDatePickedFrom}
                    onCancel={this._hideDateTimePickerFrom}
                  />

                  <DateTimePicker
                    mode={'date'}
                    datePickerModeAndroid={'calendar'}
                    titleIOS={'ระบุวันสิ้นสุด'}
                    date={this.state.enddate != undefined ? new Date(this.state.enddate) : new Date()}
                    isVisible={this.state.isDateTimePickerVisibleEnd}
                    onConfirm={this._handleDatePickedEnd}
                    onCancel={this._hideDateTimePickerEnd}
                  />
                </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(Addtrip);