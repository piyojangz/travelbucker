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
import {
  StyleSheet,
  InteractionManager,
  Image,
  View,
  Input,
  InputGroup,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  Platform,
  Alert,
  ToastAndroid
} from 'react-native';
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
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
  FormLabel,
} from '@components/ui/';
import { AppConfig } from '@constants/';
import NavigationBar from 'react-native-navigation-bar';
import { FBLoginManager } from 'react-native-facebook-login';
// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { Grid, Col, Row } from 'react-native-easy-grid';
// Components
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';
import Icon from 'react-native-vector-icons/Ionicons';
import * as appdataActions from '@redux/appdata/actions';

import { Actions } from 'react-native-router-flux';
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background,
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
  }, row: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
    alignItems: 'center'
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});


/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
};




/* Component ==================================================================== */
class Register extends Component {
  static componentName = 'Register';


  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      email: '',
      loading: false,
      password: '',
      repassword: '',
      gender: '',
      fbid: '',
    };

    console.log(this.props);
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };


  dologin() {
    var params = {
      email: this.state.email,
      password: this.state.password,
      fbid: this.state.fbid,
    };
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
    fetch(AppConfig.api + 'api/login', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {
        if (data.result != null) {
          AsyncStorage.setItem("userdetail", JSON.stringify({
            email: data.result.email
            , islogin: 1
            , userimg: data.result.userimg
            , name: data.result.name
            , id: data.result.id
            , fbid: data.result.fbid
          }));

          this.setState({ loading: false, });
          Actions.AppLaunch({ type: 'reset' });


        }
        else {
          this.setState({ loading: false, });
        }
      }).done();
  }


  register() {

    if (this.state.name != ''
      && this.state.email != ''
      && this.state.password != ''
      && this.state.repassword != '') {
      if (this.state.password == this.state.repassword) {
        if (this.validateEmail(this.state.email)) {
          // do register
          this.setState({ loading: true, });
          var params = {
            password: this.state.password,
            email: this.state.email,
            gender: this.state.gender,
            fbid: this.state.fbid,
            name: this.state.name,
          };
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
          fetch(AppConfig.api + 'api/register', request).then((response) => {
            return response.json() // << This is the problem
          })
            .then((responseData) => { // responseData = undefined
              return responseData;
            })
            .then((data) => {
              this.setState({ loading: false, });
              if (data.result == 'success') {
                this.dologin();
              }
              else {
                this.setState({ loading: false, });
                this.alertmsg('อีเมลล์ซ้ำในระบบ');
              }
            }).done();
        }
        else {
          this.alertmsg('กรุณากรอกอีเมลล์ให้ถูกต้อง');
        }
      }
      else {
        this.alertmsg('รหัสผ่านไม่ตรงกัน');
      }
    }
    else {
      this.alertmsg('กรุณากรอกข้อมูลให้ครบ');
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

  componentWillMount = () => {
    if (this.props.prms) {
      this.setState({
        name: this.props.prms.name,
        email: this.props.prms.email,
        fbid: this.props.prms.fbid,
        gender: this.props.prms.gender,
      });
    }
  }

  render = () => {
    return (
      <View style={{ marginTop: -65, flex: 1, backgroundColor: '#FFF' }}>
        <NavigationBar
          title={'ข้อมูลสมัครสมาชิก'}
          height={(Platform.OS === 'ios') ? 44 : 64}
          titleColor={'#fff'}
          leftButtonIcon={require('../../../assets/images/ic_left-arrow.png')}
          backgroundColor={AppColors.brand.primary}
          leftButtonTitle={'ย้อนกลับ'}
          onLeftButtonPress={Actions.pop}
          leftButtonTitleColor={'#fff'}
        />
        <Spacer size={64} />
        <ScrollView style={{ flexGrow: 1, height: AppSizes.screen.height, }}>
          <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center', marginTop: 25, }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
              <View style={{ width: (AppSizes.screen.width - 60), }}>

                <View style={[AppStyles.paddingHorizontal]}>
                  <FormLabel>ชื่อเรียก</FormLabel>
                  <FormInput autoCorrect={false} autoFocus={true} placeholder='ชื่อเรียก' value={this.state.name} onChangeText={name => this.setState({ name })} />
                </View>


                <View style={[AppStyles.paddingHorizontal]}>
                  <FormLabel>อีเมลล์</FormLabel>
                  <FormInput autoCorrect={false} keyboardType="email-address" placeholder='อีเมลล์' value={this.state.email} validateEmail={true} onChangeText={email => this.setState({ email })} />
                </View>
                <View style={[AppStyles.paddingHorizontal]}>
                  <FormLabel>รหัสผ่าน</FormLabel>
                  <FormInput autoCorrect={false} secureTextEntry={true} placeholder='รหัสผ่าน' onChangeText={password => this.setState({ password })} />
                </View>
                <View style={[AppStyles.paddingHorizontal]}>
                  <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                  <FormInput autoCorrect={false} secureTextEntry={true} placeholder='ยืนยันรหัสผ่าน' onChangeText={repassword => this.setState({ repassword })} />
                </View>
              </View>

              <TouchableOpacity onPress={() => this.register()} >
                <View style={{ backgroundColor: '#F3C42C', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, padding: 8, width: 300, borderRadius: 25 }}>
                  <Text
                    style={{
                      color: "rgba(255,255,255,1)",
                      fontSize: 14,
                      fontWeight: "normal",
                      fontFamily: 'Helvetica Neue',
                    }}>ยืนยันการสมัคร</Text>
                </View>
              </TouchableOpacity>



            </View>

          </View>
        </ScrollView>
        <SleekLoadingIndicator loading={this.state.loading} />
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Register);