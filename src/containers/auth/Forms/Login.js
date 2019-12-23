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
  View,
  Input,
  Image,
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

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { Grid, Col, Row } from 'react-native-easy-grid';
// Components
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';
import Icon from 'react-native-vector-icons/Ionicons';
import * as appdataActions from '@redux/appdata/actions';
import { Actions } from 'react-native-router-flux';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;

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
  _user: state.appdataReducer.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  user: appdataActions.user,
};




/* Component ==================================================================== */
class Login extends Component {
  static componentName = 'Login';


  constructor(props) {
    super(props);
    this.state = {
      userdetail: null,
      password: '',
      loading: false,
      name: '',
      email: '',
      fbid: '',
    };
  }



  fblogin = () => {
    var _this = this;
    this.setState({ loading: true, });
    LoginManager.logInWithPermissions(["email", "public_profile"]).then(
      function (result) {
        if (result.isCancelled) {
          _this.setState({ loading: false, });
          alert('Login was cancelled');
        } else {
          // alert('Login was successful with permissions: '
          //   + result.grantedPermissions.toString()); 
          console.log('datadatadata', result);
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              console.log(data)
              var api = 'https://graph.facebook.com/v2.3/' + data.userID + '?fields=email,name,gender&edirect=false&access_token=' + data.accessToken + '';
              fetch(api)
                .then((response) => response.json())
                .then((responseData) => {
                  _this.setState({
                    fbid: responseData.id,
                    name: responseData.name,
                    gender: responseData.gender,
                    email: responseData.email,
                  });
                  _this.registeruser();
                })
                .done();
            }
          )
        }
      },
      function (error) {
        console.log("Error: ", error);
        _this.setState({ loading: false, });
      }
    );
  }

  registeruser = () => {
    var params = {
      name: this.state.name,
      gender: this.state.gender,
      email: this.state.email,
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

    fetch(AppConfig.api + 'api/register', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {
        this.setState({ loading: false, });
        if (data.result == 'success') {
          if (this.state.fbid) {
            this.login(this.state.fbid);
          }

        }
        else {
          if (data.result == 'register') {
            Actions.register({ prms: params });
          }
          else {
            this.alertmsg('อีเมลล์ซ้ำในระบบ');
          }

        }
      }).done();

  }


  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  login(fbid) {

    var params = {
      fbid: fbid,
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

    console.log('requestrequest', request);
    fetch(AppConfig.api + 'api/login', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {
        console.log(data);
        if (data.result != null) {
          AsyncStorage.setItem("userdetail", JSON.stringify({
            email: data.result.email
            , islogin: 1
            , userimg: data.result.userimg
            , name: data.result.name
            , id: data.result.id
            , fbid: data.result.fbid
          })).then(() => {
            this.setState({ loading: false, });
            Actions.AppLaunch({ type: 'reset' });
          });
        }
        else {
          this.setState({ loading: false, });
        }
      }).done();


  }

  dologin() {
    if (this.state.email != ''
      && this.state.password != '') {
      if (this.validateEmail(this.state.email)) {
        this.setState({ loading: true, });
        var params = {
          email: this.state.email,
          password: this.state.password,
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
        console.log(AppConfig.api + 'api/login')
        fetch(AppConfig.api + 'api/login', request).then((response) => {
          return response.json() // << This is the problem
        })
          .then((responseData) => { // responseData = undefined
            return responseData;
          })
          .then((data) => {
            console.log(data);
            if (data.result != null) {
              AsyncStorage.setItem("userdetail", JSON.stringify({
                email: data.result.email
                , islogin: 1
                , userimg: data.result.userimg
                , name: data.result.name
                , id: data.result.id
                , fbid: data.result.fbid
              })).then(() => {
                this.setState({ loading: false, });
                Actions.AppLaunch({ type: 'reset' });
              });
            }
            else {
              this.setState({ loading: false, });
              this.alertmsg('Username หรือ Password ไม่ถูกต้อง');
            }
          }).done();
      }
      else {
        this.alertmsg('กรุณากรอกอีเมลล์ให้ถูกต้อง');
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



  render = () => {
    return (
      <View style={{ marginTop: -65, flex: 1, backgroundColor: AppColors.brand.primary }}>

        <ScrollView style={{ flexGrow: 1, height: AppSizes.screen.height, }}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
              <View style={{ width: (AppSizes.screen.width - 60), }}>
                <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: 'row', flex: 1, padding: 20, marginTop: 25, }}>
                  <Image
                    style={{
                      height: 130,
                      width: 130,
                      justifyContent: 'center',

                    }}
                    resizeMode={"cover"}
                    source={require('@images/applogo.png')} />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: "bold",
                    fontFamily: 'Helvetica Neue',
                  }}>เงินกองกลางไม่ใช่เรื่องยากอีกต่อไป</Text>
                <Spacer size={20} />
                <View style={[AppStyles.paddingHorizontal]}>
                  <FormLabel>Username</FormLabel>
                  <FormInput autoCorrect={false} placeholder='อีเมลล์' onChangeText={email => this.setState({ email })} />

                  <Spacer size={10} />

                  <FormLabel>Password</FormLabel>
                  <FormInput placeholder='รหัสผ่าน' secureTextEntry={true} onChangeText={password => this.setState({ password })} />
                </View>
              </View>

              <TouchableOpacity onPress={() => this.dologin()} >
                <View style={{ height: 40, backgroundColor: '#F3C42C', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, padding: 10, width: 300, borderRadius: 25 }}>
                  <Text
                    style={{
                      color: "rgba(255,255,255,1)",
                      fontSize: 14,
                      fontWeight: "normal",
                      fontFamily: 'Helvetica Neue',
                    }}>เข้าสู่ระบบ </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.fblogin()} >
                <View style={{ height: 40, backgroundColor: '#4267b2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, padding: 10, width: 300, borderRadius: 25 }}>
                  <Icon name="logo-facebook" style={{ color: "#FFF" }} />
                  <Text
                    style={{
                      color: "rgba(255,255,255,1)",
                      fontSize: 14,
                      fontWeight: "normal",
                      fontFamily: 'Helvetica Neue',
                    }}>     Log in with Facebook</Text>
                </View>
              </TouchableOpacity>


              <TouchableOpacity onPress={Actions.register} >
                <Text
                  style={{
                    marginTop: 24,
                    textDecorationLine: 'underline',
                    color: 'black',
                    fontSize: 14,
                    fontWeight: 'normal',
                    fontFamily: 'Helvetica Neue',
                  }}>
                  สมัครสมาชิกเพื่อใช้บริการ
                  </Text>
              </TouchableOpacity>
            </View>
            <Spacer size={100} />
            <SleekLoadingIndicator loading={this.state.loading} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Login);