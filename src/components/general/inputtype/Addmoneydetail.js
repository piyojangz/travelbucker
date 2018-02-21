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
// import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker'
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
class Addmoneydetail extends Component {

  static componentName = 'Addmoneydetail';

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
      amount:'',
      note:'', 
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

  submit() {
    if (this.state.amount != ''
      && this.state.note != '') {
      this.setState({ loading: true, });
      var params = {
        tripid: this.props.tripid, 
        userid: this.props.userid,
        description: this.state.note,
        amount: this.state.amount, 
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

      fetch(AppConfig.api + 'api/addmoney', request).then((response) => {
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
          Actions.pop({ refresh: { reload: true } });
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
                  editable={this.props.parentData ? false : true}
                  style={{
                    width: AppSizes.screen.width - 60,
                    fontFamily: 'Roboto-Black',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 50,
                    height: 70,
                    color: '#FFF',
                    borderWidth: 0
                  }}
                  maxLength={8}
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
                <FormInput placeholder={'ระบุรายละเอียดเพิ่มเติม'}  onChangeText={(note) => this.setState({ note })} value={this.state.note} />
 
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
export default connect(mapStateToProps, mapDispatchToProps)(Addmoneydetail);