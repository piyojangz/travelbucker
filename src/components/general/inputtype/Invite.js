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
import { Grid, Col, Row } from 'react-native-easy-grid';
import moment from 'moment';
import { AppConfig } from '@constants/'; 
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
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
  }
});

const mapStateToProps = state => ({
  _user: state.appdataReducer.user,
});

// Any actions to map to the component?
const mapDispatchToProps = { 
  invitecount: appdataActions.invitecount,
};


/* Component ==================================================================== */
class Invite extends Component {

  static componentName = 'Invite';

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
       
    };
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  componentDidMount = () => {
    console.log('xxxx',this.props.parentObj);
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


  getinvitecnt = (userid) => {

    var params = {
      userid: userid,
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

    fetch(AppConfig.api + 'api/getinvitecount', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined 
        return responseData;
      })
      .then((data) => {
        console.log(data.result);
 

        this.props.dispatch({ type: 'INVITECOUNT', invitecount: data.result || "0" });
      
      }).done(() => {
        this.setState({ loading: false, });
        Actions.Noti();
      });

  }

  reject(){
    this.setState({loading:true});
    var params = {
      userid: this.props._user.id,
      tripid: this.props.parentObj.trips_id, 
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

    fetch(AppConfig.api + 'api/rejecttrip', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {
        console.log(data);
        this.getinvitecnt(this.props._user.id);
        this.setState({ displayfriend: data.result });
      }).done();
   
  }


  accept(){
    this.setState({loading:true});
    var params = {
      userid: this.props._user.id,
      tripid: this.props.parentObj.trips_id, 
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

    fetch(AppConfig.api + 'api/accepttrip', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {
        console.log(data);
        this.getinvitecnt(this.props._user.id);
        this.setState({ displayfriend: data.result });
      }).done();
   
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

    return (
      <View style={{ flex: 1, backgroundColor: '#F2F1EF' }}>
        <NavigationBar
          title={'ตอบรับคำเชิญ'}
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

              <FormLabel><Icon name={'md-people'} size={15} color={'#000000'} /> {' ผู้ชวน'}</FormLabel>
                <Text style={{fontWeight:'normal'}}>{this.props.parentObj.inviter}</Text>
                <Spacer size={10} />


                <FormLabel><Icon name={'md-create'} size={15} color={'#000000'} /> {' ชื่อเรื่อง'}</FormLabel>
                <Text style={{fontWeight:'normal'}}>{this.props.parentObj.title}</Text>
                <Spacer size={10} />


                <FormLabel><Icon name={'md-create'} size={15} color={'#000000'} /> {' รายละเอียดเพิ่มเติม'}</FormLabel>
                <Text style={{fontWeight:'normal'}}>{this.props.parentObj.description}</Text>
                <Spacer size={20} />

                <FormLabel><Icon name={'md-calendar'} size={15} color={'#000000'} /> {' วันที่เริ่ม'}</FormLabel>
                <Text style={{fontWeight:'normal'}}>{this.props.parentObj.startdate}</Text>
                <Spacer size={20} />


                <FormLabel><Icon name={'md-calendar'} size={15} color={'#000000'} /> {' วันที่สิ้นสุด'}</FormLabel>
                <Text style={{fontWeight:'normal'}}>{this.props.parentObj.enddate}</Text>
                <Spacer size={20} />


                <View>
                  <Grid>
                    <Row>
                      <Col style={{margin:20,}}><Button
                      onPress={()=>this.accept()}
                        borderRadius={30}
                        borderColor={'#1E8BC3'}
                        backgroundColor={'#2ecc71'}
                        color={'#FFF'}
                        small 
                        title={'ตอบรับ'}
                      /></Col>
                      <Col style={{margin:20,}}><Button
                       onPress={()=>this.reject()}
                        borderRadius={30}
                        backgroundColor={'#ecf0f1'}
                        borderColor={'#ecf0f1'}
                        color={'#000'}
                        small 
                        title={'ปฏิเสธ'}
                      /></Col>
                    </Row>
                  </Grid>
                </View>

                <Spacer size={50} />

              </View>
              <Spacer size={50} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <SleekLoadingIndicator loading={this.state.loading} />
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Invite);