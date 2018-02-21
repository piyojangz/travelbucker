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
import LoadingContainer from 'react-native-loading-container';
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
import Swipeout from 'react-native-swipeout';
import {
  NativeModules,
  View,
  StyleSheet,
  ListView,
  Alert,
  RefreshControl,
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
class Addmoney extends Component {

  static componentName = 'Outcome';

  static propTypes = {
    onNavigationStateChange: PropTypes.func
  }

  static defaultProps = {
    onNavigationStateChange: null
  }



  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      refreshing: false,
      data: [],
      dataSource: ds,
      floatshow: true,
    };
  }


  componentDidMount = () => {
    console.log(this.props.parentData);
  }

  componentWillReceiveProps(props) {
    if (props.reload) {
      setTimeout(
        () => { this._onRefresh(); },
        500
      );
    }
  }


  addmoneydetail() {
    Actions.addmoneydetail({
      title: 'เพิ่มเงิน', userid: this.props.userid,
      tripid: this.props.tripid,
    });
  }

  floatbutton = () => {
    //console.log(this.props.tripuserid);
    if (this.props.tripuserid == this.props._user.id && this.props.ispassed == '0') {
      return (
        <TouchableWithoutFeedback onPress={() => this.addmoneydetail()}>
          <Animatable.View
            style={styles.floatbutton}
            animation="zoomIn"
            duration={200}
            easing="ease-out">
            <Icon name={'md-add'} size={30} color={'#FFFFFF'} />
          </Animatable.View>
        </TouchableWithoutFeedback>
      )
    }
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  renderRow(rowData) {
    var item = this.props.parentData;
    //console.log(item);
    var profileimg = (item.fbid == '' || item.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + item.fbid + '/picture?width=250&height=250');
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      onPress: () => { this.deleteitem(rowData) }
    }];
    return (
      <View>
        <Swipeout right={swipeBtns}
          autoClose='true'
          backgroundColor='transparent'>
          <ListItem
            subtitleNumberOfLines={3}
            rightTitle={'+ ' + this.props._symbol + this.numberWithCommas(rowData.value)}
            roundAvatar
            avatar={{ uri: profileimg }}
            rightIcon={{ color: 'rgba(0,0,0,0)' }}
            title={rowData.description}
            rightTitleStyle={{ color: '#3FC380', fontSize: 18 }}
            subtitle={rowData.dateadd || null}
          />
        </Swipeout>
      </View>
    )
  }

  deleteitem(rowData) {
    Alert.alert(
      'TravelPocket Message',
      'คุณต้องการลบรายการนี้?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'OK', onPress: () => {
            var params = {
              id: rowData.id,
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

            fetch(AppConfig.api + 'api/removeincome', request).then((response) => {
              return response.json() // << This is the problem
            })
              .then((responseData) => { // responseData = undefined 
                return responseData;
              })
              .then((data) => {
                if (data.result) {
                  setTimeout(
                    () => { this._onRefresh(); },
                    100
                  );
                }
              }).done();
          }
        },
      ]
    );

  }

  rendernodata() {
    if (this.state.data.length == 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: (AppSizes.screen.height / 2) - 100, left: 0, right: 0 }}>
          <Text style={{ textAlign: 'center', color: '#BFBFBF' }}>ไม่มีรายการ</Text>
        </View>
      )
    }
    else {
      return (<View />);
    }
  }


  async _loadInitialDataAsync() {
    var params = {
      userid: this.props.userid,
      tripid: this.props.tripid,
    };

    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    var request = {
      method: 'POST',
      body: formData
    };

    let response = await fetch(AppConfig.api + 'api/get_useraddmoney', request);
    return response.json();
  }

  async _onReadyAsync(data) {
    console.log(data);
    return new Promise((resolve) => {
      this.setState({
        data: data.result,
        dataSource: this.state.dataSource.cloneWithRows(data.result),
      }, resolve);
    });
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this._loadInitialDataAsync().then((data) => {
      this._onReadyAsync(data).then(() => {
        this.setState({ refreshing: false });
      });
    });
  }


  render = () => {
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
          <LoadingContainer
            onError={e => console.log(e)}
            onLoadStartAsync={this._loadInitialDataAsync.bind(this)}
            onReadyAsync={this._onReadyAsync.bind(this)}>
            <ListView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
              style={{ flex: 1 }}
              dataSource={this.state.dataSource}
              renderRow={this
                .renderRow
                .bind(this)} />
            {this.rendernodata()}
          </LoadingContainer>
        </View>
        {this.floatbutton()}
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Addmoney);