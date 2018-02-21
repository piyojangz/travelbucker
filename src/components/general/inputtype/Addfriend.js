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
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
import NavigationBar from 'react-native-navigation-bar';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { AppConfig } from '@constants/';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
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
  ToastAndroid
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

const mapStateToProps = state => ({
  _user: state.appdataReducer.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
};



var radio_props = [
  { label: 'Email', value: 0 },
  { label: 'Name', value: 1 }
];

/* Component ==================================================================== */
class Addfriend extends Component {

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
      + ('0' + d.getMonth()).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
    console.log(n);
    this.setState({ isDateTimePickerVisibleFrom: false, startdate: n })

    this._hideDateTimePickerFrom();
  };


  _handleDatePickedEnd = (date) => {
    console.log('A date has been picked: ', date);
    var d = new Date(date);
    console.log(d.toDateString());
    var n = (d.getFullYear()) + "-"
      + ('0' + d.getMonth()).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
    console.log(n);
    this.setState({ isDateTimePickerVisibleEnd: false, enddate: n })
    this._hideDateTimePickerEnd();
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      displayfriend: [],
      searchtype: 0,
      searchtext: ''
    };
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  componentDidMount = () => {
    // Wait until interaction has finished before loading the webview in
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loading: false });
      

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

  submit() {
    if (this.state.title != ''
      && this.state.description != ''
      && this.state.startdate != ''
      && this.state.enddate != '') {

    }
    else {
      Alert.alert(
        'TravelPocket Message',
        'คุณต้องการออกจากระบบ?',
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

  handleKeyDown = (e) => {
    if (e.nativeEvent.key == "Enter") {
      this.setState({ loading: true, });
      this.serch();
    }
  }

  renderaddfriend() {
    if (this.state.displayfriend.id == this.props._user.id) {
      return (
        <View>
          <Text style={{ fontSize: 14, padding: 5, color: '#666' }}>You can't add yourself as a friend.</Text>
        </View>
      )
    }
    else {
      if (this.state.displayfriend.isfriend == '1') {
        if (this.state.displayfriend.isactive == '1') {
          return (
            <View>
              <Text style={{ fontSize: 14, padding: 5, color: '#666' }}>is already your friend.</Text>
            </View>
          )
        }
        else {
          return (
            <View>
              <Text style={{ fontSize: 14, padding: 5, color: '#666' }}>pending approve.</Text>
            </View>
          )
        }

      }
      else {
        return (
          <View>
            <Button
              style={{ width: 160 }}
              title={'Add friend'}
              onPress={() => this.sendrequest()}
            />
          </View>
        )
      }
    }

  }

  sendrequest() {
    this.setState({ loading: true, });
    var params = {
      userid: this.state.displayfriend.id,
      requester: this.props._user.id,
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

    fetch(AppConfig.api + 'api/sendrequest', request).then((response) => {
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


  renderuser() {
    if (this.state.displayfriend.length != []) {
      if (this.state.displayfriend.userimg != '') {
        var profileimg = AppConfig.imgaddress + this.state.displayfriend.userimg;
      }
      else {
        var profileimg = (this.state.displayfriend.fbid == '' || this.state.displayfriend.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + this.state.displayfriend.fbid + '/picture?width=250&height=250');
      }
      return (
        <View>
          <View style={{ alignContent: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <Image
              style={{
                height: 90,
                width: 90,
                borderRadius: 45
              }}
              resizeMode={'cover'}
              source={{
                uri: profileimg
              }} />
          </View>
          <View style={{ alignContent: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, padding: 5, color: '#242424' }}>{this.state.displayfriend.name}</Text>
          </View>
          <View style={{ alignContent: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            {this.renderaddfriend()}
          </View>
        </View>
      )
    }
    else {
      return (
        <View />
      )
    }

  }

  serch() {
    if (this.state.searchtext != "") {
      this.setState({ loading: true })
      var params = {
        userid: this.props._user.id,
        serchtype: this.state.searchtype,
        searchtext: this.state.searchtext,
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

      fetch(AppConfig.api + 'api/serchfriend', request).then((response) => {
        return response.json() // << This is the problem
      })
        .then((responseData) => { // responseData = undefined
          return responseData;
        })
        .then((data) => {
          if (data.result) {
            if (data.result != "") {
              console.log(data.result);
              this.setState({ displayfriend: data.result });
            }
            else {
              this.setState({ displayfriend: [] });
              this.alertmsg('ไม่พบข้อมูล');
            }
          }
          else {
            this.setState({ displayfriend: [] });
            this.alertmsg('ไม่พบข้อมูล');
          }


        }).done(() => {
          this.setState({ loading: false, });
        });
    }
    else{
      this.alertmsg('กรุณาระบุข้อมูลในกล่องข้อความ');
    }
  }


  alertmsg(msg) {
    if (Platform.OS === "ios") {
      Alert.alert(
        'Warning!',
        msg
      );
    }
    else {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  }

  render = () => {
    const { loading } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#F2F1EF' }}>
        <NavigationBar
          title={'ค้นหาเพื่อน'}
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
                <View style={{ padding: 20, }}>
                  <RadioForm
                    labelStyle={{ fontSize: 12, marginRight: 20 }}
                    buttonOuterColor={'#00B16A'}
                    buttonSize={10}
                    buttonOuterSize={20}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#00B16A'}
                    radio_props={radio_props}
                    initial={0}
                    onPress={(searchtype) => { this.setState({ searchtype: searchtype }) }}
                  />
                </View>
                <FormInput returnKeyType={'search'} onKeyPress={this.handleKeyDown} placeholder={'Enter your friend\'s  Email'} onChangeText={(searchtext) => this.setState({ searchtext })} value={this.state.searchtext} />
              </View>
              <View style={[AppStyles.paddingHorizontal]}>
                <View style={{ padding: 20, }}>
                  <Button onPress={() => this.serch()}
                    title="ค้นหา"
                    color="#fff"
                  />
                </View>
              </View>
              <Spacer size={50} />
              {this.renderuser()}
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
export default connect(mapStateToProps, mapDispatchToProps)(Addfriend);