/**
 * Placeholder Scene
 *
    <Placeholder text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { AppConfig } from '@constants/';
import PropTypes, { array } from 'prop-types';
import * as appdataActions from '@redux/appdata/actions';
import LoadingContainer from 'react-native-loading-container';
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import ActionSheet from '@yfuks/react-native-action-sheet';
import Piechart from '../general/Piechart';
import {
  View,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ListView,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import NavigationBar from 'react-native-navigation-bar';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
// Components
import { Card, Spacer, Text } from '@ui/';

import { Actions } from 'react-native-router-flux';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
    backgroundColor: '#F7F9FB'
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary
  },
  tabbarIndicator: {
    backgroundColor: '#FFF'
  },
  tabbar_text: {
    color: '#FFF'
  },
  rowcard: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 7,
    paddingBottom: 3.5
  },
  contentcard: {
    alignItems: 'center'
  },
  iconcard: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    height: 110,
    margin: 7,
    marginBottom: 0
  },
  iconcardhidden: {
    backgroundColor: '#F7F9FB',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    height: 130,
    margin: 7,
    marginBottom: 0
  },
  swipeupchart: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    left: (Dimensions.get('window').width / 2) - 30,
  },
  chartview: {
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 45,
    bottom: 0,
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
    bottom: 60,
    right: 20
  },
  floatbuttonhome: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.brand.primary,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 60,
    right: 20
  }
});

function numberWithCommas(x) {
  // return x
  //   .toString()
  //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parseFloat(x).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  _user: state.appdataReducer.user,
  _symbol: state.appdataReducer.symbol,
  _total: numberWithCommas(state.appdataReducer.total),
});

// Any actions to map to the component?
const mapDispatchToProps = {
  total: appdataActions.total,
  symbol: appdataActions.symbol,
  invitecount: appdataActions.invitecount,
};


// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
  // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
  if (notif.local_notification) {
    //this is a local notification
  }
  if (notif.opened_from_tray) {
    //iOS: app is open/resumed because user clicked banner
    //Android: app is open/resumed because user clicked banner or tapped app icon
  }
  // await someAsyncCall();

  if (Platform.OS === 'ios') {
    //optional
    //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
    //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
    //notif._notificationType is available for iOS platfrom
    switch (notif._notificationType) {
      case NotificationType.Remote:
        notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
        break;
      case NotificationType.NotificationResponse:
        notif.finish();
        break;
      case NotificationType.WillPresent:
        notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
        break;
    }
  }
});
FCM.on(FCMEvent.RefreshToken, (token) => {
  console.log(token)
  // fcm token may not be available on first load, catch it here
});

/* Component ==================================================================== */
class Home extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });



    this.state = {
      charttotal: 0,
      chartdata: [],
      showchart: false,
      refreshing: false,
      activetrip: [],
      outcomeimg: {
        food: require('../../images/icons/ic_food.png'),
        drink: require('../../images/icons/ic_drink.png'),
        rest: require('../../images/icons/ic_rest.png'),
        power: require('../../images/icons/ic_power.png'),
        ticket: require('../../images/icons/ic_ticket.png'),
        activity: require('../../images/icons/ic_activity.png'),
        more: require('../../images/icons/ic_more.png')
      },
      activetabstyle: {
        floatshow: false,
        floathomeshow: false,
        tab1: {
          backgroundColor: '#FFFFFF',
          color: '#000000'
        },
        tab2: {
          backgroundColor: '#3DB670',
          color: '#FFFFFF'
        },
        tab3: {
          backgroundColor: '#3DB670',
          color: '#FFFFFF'
        }
      },
      navigation: {
        index: 0,
        routes: [
          {
            key: '0',
            title: 'ภาพรวม'
          }, {
            key: '1',
            title: 'สมาชิก'
          }, {
            key: '2',
            title: 'รายจ่าย'
          }
        ]
      },
      dataSource: ds,
      HistorydataSource: ds

    };

  }

  componentDidMount() {
    FCM.requestPermissions();

    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
      this.updatetoken(token);
    });

    FCM.getInitialNotification().then(notif => {
      console.log("INITIAL NOTIFICATION", notif)
    });

    this.notificationListner = FCM.on(FCMEvent.Notification, notif => {
      console.log("Notification", notif);
      if (notif.local_notification) {
        return;
      }
      if (notif.opened_from_tray) {
        return;
      }

      if (Platform.OS === 'ios') {
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
            break;
        }
      }
      this.showLocalNotification(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      console.log("TOKEN (refreshUnsubscribe)", token);
    });

    this.getinvitecnt(this.props._user.id);
    FCM.setBadgeNumber(0);

    this.setState({ floathomeshow: true });
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
        if (data.result) {
          this.props.dispatch({ type: 'INVITECOUNT', invitecount: data.result || 0 });
        }
      }).done();

  }

  showLocalNotification(notif) {
    FCM.presentLocalNotification({
      title: notif.title,
      body: notif.body,
      priority: "high",
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true
    });
  }

  componentWillMount = () => {

  }

  componentWillUnmount() {
    this.notificationListner.remove();
    this.refreshTokenListener.remove();
  }


  showActionSheet() {

    var DESTRUCTIVE_INDEX = 1;
    var CANCEL_INDEX = 2;

    var BUTTONSiOS = [
      'แก้ไข',
      'สิ้นสุดทริป',
      'Cancel'
    ];

    var BUTTONSandroid = [
      'แก้ไข',
      'สิ้นสุดทริป',
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
            Actions.addtrip({ tripdetail: this.state.activetrip });
            break
          case 1:
            Alert.alert(
              'TravelPocket Message',
              'คุณต้องการสิ้นสุดทริปนี้?',
              [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                  text: 'OK', onPress: () => {
                    this.setendtrip();
                  }
                },
              ]
            );
            break
          default: break;
        }
      });
  }

  setendtrip() {
    var params = {
      tripid: this.state.activetrip.id,
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

    fetch(AppConfig.api + 'api/setendtrip', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined 
        return responseData;
      })
      .then((data) => {
        if (data.result) {
          this.refresh();
        }
      }).done();
  }

  openHistoryDetail = (data) => {
    console.log(data);
    Actions.inputdetail({ parentData: data, title: 'ข้อมูลรายจ่าย' });
  }


  onItemClicked = (_typeid, _type, _title) => {
    Actions.inputdetail({ outcometypeid: _typeid, outcometype: _type, title: _title, parentObj: this.state.activetrip });
  }


  addMoney = (data) => {
    Actions.addmoney({ parentData: data, title: 'รายการเพิ่มเงิน', userid: data.id, tripid: this.state.activetrip.id, tripuserid: this.state.activetrip.userid, ispassed: this.state.activetrip.ispassed });
  }


  onchildclick = () => {
    console.log("CHILD CLICK");
  }

  onPressTab = (_index) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        index: _index
      }
    });
    this.settab(_index)
  }
  /**
    * On Change Tab
    */
  handleChangeTab = (index) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        index
      }
    });

    this.settab(index)
  }

  // settab color
  settab = (_index) => {
    switch (_index) {
      case 0:
        this.setState({
          floatshow: false,
          floathomeshow: true,
          activetabstyle: {
            tab1: {
              backgroundColor: '#FFFFFF',
              color: '#000000'
            },
            tab2: {
              backgroundColor: '#3DB670',
              color: '#FFFFFF'
            },
            tab3: {
              backgroundColor: '#3DB670',
              color: '#FFFFFF'
            }
          }
        });
        break;
      case 1:
        this.setState({
          floatshow: true,
          floathomeshow: false,
          activetabstyle: {
            tab1: {
              backgroundColor: '#3DB670',
              color: '#FFFFFF'
            },
            tab2: {
              backgroundColor: '#FFFFFF',
              color: '#000000'
            },
            tab3: {
              backgroundColor: '#3DB670',
              color: '#FFFFFF'
            }
          }
        });
        break;
      case 2:
        this.setState({
          floatshow: false,
          floathomeshow: false,
          activetabstyle: {
            tab1: {
              backgroundColor: '#3DB670',
              color: '#FFFFFF'
            },
            tab2: {
              backgroundColor: '#3DB670',
              color: '#FFFFFF'
            },
            tab3: {
              backgroundColor: '#FFFFFF',
              color: '#000000'
            }
          }
        });
        break;
      default:
        break;
    }
  };

  /**
    * Which component to show
    */

  addmember = () => {

    Actions.invitefriend({ parentObj: this.state.activetrip });

  }




  renderarrowdown() {
    if (this.state.activetrip.userid == this.props._user.id) {
      return (
        <TouchableWithoutFeedback onPress={() => this.setState({ showchart: !this.state.showchart })}>
          <Icon name={'ios-arrow-down-outline'} size={40} color={'#ddd'}
            style={{ left: (Dimensions.get('window').width / 2) - 20, top: - 5, backgroundColor: 'rgba(0,0,0,0)' }} />
        </TouchableWithoutFeedback>
      )
    }
  }

  renderchartview = () => {
    if (this.state.showchart || !(this.state.activetrip.userid == this.props._user.id)) {
      return (
        <Animatable.View
          style={styles.chartview}
          animation={"fadeInUpBig"}
          duration={200} >
          {this.renderarrowdown()}
          <View style={{ flex: 1 }}>
            <Piechart tripdata={this.state.activetrip}
              charttotal={numberWithCommas(this.state.charttotal)}
              charts={this.state.chartdata} />
          </View>
          <Spacer size={50} />
        </Animatable.View>);
    }
    else {
      return null;
    }

  }

  swipeupchart = () => {
    if (!this.state.showchart && (this.state.activetrip.userid == this.props._user.id)) {
      return (<TouchableWithoutFeedback onPress={() => this.setState({ showchart: !this.state.showchart })}>
        <Animatable.View
          style={styles.swipeupchart}
          animation="fadeInUpBig"
          duration={200} >
          <Icon name={'ios-arrow-up-outline'} size={40} color={'#ddd'} />
        </Animatable.View>
      </TouchableWithoutFeedback>);
    }
    else {
      return null;
    }

  }
  floatbutton = () => {
    if (this.state.floatshow && (this.state.activetrip.ispassed == '0')) {
      return (
        <TouchableWithoutFeedback onPress={() => this.addmember()}>
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
  floatbuttonhome = () => {
    if (this.state.floathomeshow) {
      return (
        <TouchableWithoutFeedback>
          <Animatable.View
            style={styles.floatbuttonhome}
            animation="zoomIn"
            duration={200}
            easing="ease-out">
            <Image
              style={{
                height: 50,
                width: 50,
                justifyContent: 'center',

              }}
              resizeMode={"cover"}
              source={require('@images/deerhome.png')} />
          </Animatable.View>
        </TouchableWithoutFeedback>
      )
    }
  }




  renderuserunactive(rowData) {
    if (rowData.isactive == '0') {
      return (<View style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .7,
        backgroundColor: '#000'
      }} >
        <Text numberOfLines={1} style={{
          color: '#fff',
          fontSize: 18
        }}>pending...</Text>
      </View>)
    }
    else {
      return (<View />)
    }
  }


  renderunactive(rowData) {
    if (rowData.isactive == '0') {
      return (<View style={{
        height: 30,
        width: 30,
        borderRadius: 15,
        margin: 3,
        marginLeft: 8,
        marginRight: 8,
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .7,
        backgroundColor: '#000'
      }} />)
    }
    else {
      return (<View />)
    }
  }

  renderRow(rowData) {
    console.log(rowData);
    if (rowData.userimg != '') {
      var profileimg = AppConfig.imgaddress + rowData.userimg;
    }
    else {
      var profileimg = (rowData.fbid == '' || rowData.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + rowData.fbid + '/picture?width=250&height=250');
    }
    if (rowData.id != null) {
      return (
        <View>
          <Image
            style={{
              height: 30,
              width: 30,
              justifyContent: 'space-between',
              margin: 3,
              marginLeft: 8,
              marginRight: 8,
              borderRadius: 15
            }}
            resizeMode={"cover"}
            source={{
              uri: profileimg
            }} />
          {this.renderunactive(rowData)}
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => this.addmember()}>
          <Image
            style={{
              height: 30,
              width: 30,
              justifyContent: 'space-between',
              margin: 3,
              marginLeft: 8,
              marginRight: 8,
              borderRadius: 15
            }}
            resizeMode={"cover"}
            source={require('../../images/icons/ic_add_user.png')} />
        </TouchableOpacity>
      )
    }

  }

  renderOutcomeImg(outcometype) {
    switch (outcometype) {
      case 1:
        return (<Image
          style={{
            height: 50,
            width: 50
          }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.food} />)

      case 2:
        return (<Image
          style={{
            height: 50,
            width: 50
          }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.drink} />)

      case 3:
        return (<Image
          style={{
            height: 50,
            width: 50
          }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.rest} />)

      case 4:
        return (<Image
          style={{
            height: 50,
            width: 50
          }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.power} />)

      case 5:
        return (<Image
          style={{
            height: 50,
            width: 50
          }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.ticket} />)

      case 6:
        return (<Image
          style={{
            height: 50,
            width: 50
          }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.activity} />)

      default:
        return (<Image
          style={{
            height: 50,
            width: 50
          }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.more} />)
    }

  }
  renderHistoryRow(rowData) {
    if (rowData.id != 0) {
      return (

        <TouchableOpacity
          onPress={(() => this.openHistoryDetail(rowData))}
          style={{
            padding: 16,
            flexDirection: 'row',
            backgroundColor: '#FFFFFF'
          }}>

          {this.renderOutcomeImg(Number(rowData.typeid.trim()))}

          <View
            style={{
              padding: 8,
              paddingTop: 16,
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between'
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24
              }}>{rowData.description}</Text>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontWeight: 'bold',
                color: '#575454'
              }}>
              - {this.props._symbol}{numberWithCommas(rowData.value)}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return null
    }

  }
  renderUserRow(rowData) {

    if (rowData.userimg != '') {
      var profileimg = AppConfig.imgaddress + rowData.userimg;
    }
    else {
      var profileimg = (rowData.fbid == '' || rowData.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + rowData.fbid + '/picture?width=250&height=250');
    }


    if (rowData.id != null) {
      return (
        <TouchableOpacity
          onPress={() => this.addMoney(rowData)}
          style={{
            padding: 16,
            flexDirection: 'row',
            backgroundColor: '#FFFFFF'
          }}>
          <Image
            style={{
              height: 50,
              width: 50,
              borderRadius: 25
            }}
            resizeMode={"cover"}
            source={{
              uri: profileimg
            }} />
          <View style={{
            paddingLeft: 10
          }}>
            <Text style={{
              fontSize: 16
            }}>{rowData.name}</Text>
            <Text style={{
              color: '#2CAA61'
            }}>{this.props._symbol}{numberWithCommas(rowData.total)}</Text>
          </View>
          <Icon
            name={'ios-arrow-forward-outline'}
            size={20}
            rot
            color={'#CBCBCB'}
            style={{
              position: 'absolute',
              right: 30,
              top: 30
            }} />

          {this.renderuserunactive(rowData)}
        </TouchableOpacity>

      )
    } else {
      return null
    }

  }
  renderScene = ({ route }) => {
    switch (route.key) {
      case '0':
        return (
          <View style={styles.tabContainer}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                padding: 5,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <ListView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ flex: 1 }}
                dataSource={this.state.dataSource}
                renderRow={this
                  .renderRow
                  .bind(this)} />
            </View>
            <ScrollView style={[AppStyles.container]}>
              <View style={styles.rowcard}>
                <TouchableOpacity
                  disabled={this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0' ? false : true}
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('1', 'FOOD', 'อาหาร')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.food} />
                    <Text
                      style={{
                        fontSize: 14,
                        paddingTop: 10
                      }}>อาหาร</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0' ? false : true}
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('2', 'DRINK', 'เครื่องดื่ม')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.drink} />
                    <Text
                      style={{
                        fontSize: 14,
                        paddingTop: 10
                      }}>เครื่องดื่ม</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0' ? false : true}
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('3', 'REST', 'ที่พัก')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.rest} />
                    <Text
                      style={{
                        fontSize: 14,
                        paddingTop: 10
                      }}>ที่พัก</Text>
                  </View>
                </TouchableOpacity>

              </View>
              <View style={styles.rowcard}>
                <TouchableOpacity
                  disabled={this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0' ? false : true}
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('4', 'POWER', 'น้ำมัน/แก๊ส')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.power} />
                    <Text
                      style={{
                        fontSize: 14,
                        paddingTop: 10
                      }}>น้ำมัน/แก๊ส</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0' ? false : true}
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('5', 'TICKET', 'ตั๋ว/บริการ')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.ticket} />
                    <Text
                      style={{
                        fontSize: 14,
                        paddingTop: 10
                      }}>ตั๋ว/บริการ</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0' ? false : true}
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('6', 'ACTIVITY', 'กิจกรรม')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.activity} />
                    <Text
                      style={{
                        fontSize: 14,
                        paddingTop: 10
                      }}>กิจกรรม</Text>
                  </View>
                </TouchableOpacity>

              </View>
              <View style={styles.rowcard}>
                <TouchableOpacity
                  disabled={this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0' ? false : true}
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('7', 'OTHER', 'อื่นๆ')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.more} />
                    <Text
                      style={{
                        fontSize: 14,
                        paddingTop: 10
                      }}>อื่นๆ</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.iconcardhidden}>
                  <Image
                    style={{
                      height: 50,
                      width: 50
                    }}
                    resizeMode={"cover"} />
                </View>
                <View style={styles.iconcardhidden}>
                  <Image
                    style={{
                      height: 40,
                      width: 40
                    }}
                    resizeMode={"cover"} />

                </View>
              </View>
              <Spacer size={50} />

            </ScrollView>
            {this.renderchartview()}
            {this.swipeupchart()}
          </View>
        );
      case '1':
        return (
          <View style={styles.tabContainer}>
            <ListView
              contentContainerStyle={{

              }}
              dataSource={this.state.dataSource}
              renderRow={this
                .renderUserRow
                .bind(this)} />
            <Spacer size={50} />
          </View>
        );

      case '2':
        return (
          <View style={styles.tabContainer}>
            <ListView
              contentContainerStyle={{

              }}
              dataSource={this.state.HistorydataSource}
              renderRow={this
                .renderHistoryRow
                .bind(this)} />

            <Spacer size={50} />
          </View>
        );
    }
  }
  renderheader() {
    if (this.props.tripdata) {
      return (

        <NavigationBar
          title={''}
          height={(Platform.OS === 'ios') ? 44 : 64}
          titleColor={'#fff'}
          backgroundColor={AppColors.brand.primary}
          leftButtonIcon={require('../../assets/images/ic_left-arrow.png')}
          backgroundColor={AppColors.brand.primary}
          leftButtonTitle={'ย้อนกลับ'}
          onLeftButtonPress={Actions.pop}
          leftButtonTitleColor={'#fff'}
        />

      )
    }
    else {
      return (

        <View />

      )
    }
  }

  renderheadertitle() {

    return (
      <Text
        style={{
          marginTop: (this.props.tripdata) ? -30 : 10,
          marginBottom: 10,
          backgroundColor: 'rgba(0,0,0,0)',
          fontSize: 18,
          color: '#FFFFFF',
          fontWeight: 'bold',
          paddingTop: 4
        }}>{(this.props.tripdata) ? this.props.tripdata.title : this.state.activetrip.title}</Text>
    )
  }

  refresh() {
    this.setState({ refreshing: true });
    this._loadInitialDataAsync().then((data) => {
      this._onReadyAsync(data).then(() => {
        this.setState({ refreshing: false });
      });
    });
  }

  rendermore() {
    if (this.state.activetrip.userid == this.props._user.id && this.state.activetrip.ispassed == '0') {
      return (<View
        style={{
          position: 'absolute',
          left: 20,
          top: (this.props.tripdata ? -5 : 35),
        }}>
        <TouchableOpacity onPress={() => this.showActionSheet()}>
          <Icon name={'md-create'} size={26} color={'#FFFFFF'} />
        </TouchableOpacity>
      </View>);
    }
    else {
      return null;
    }
  }

  renderactivetrip() {
    if (this.state.activetrip.length == 0) {
      return (
        <View style={{ marginTop: (Platform.OS === 'ios') ? -65 : -54, flex: 1, backgroundColor: '#F7F9FB' }}>
          <NavigationBar
            title={'TravelBucker'}
            height={(Platform.OS === 'ios') ? 44 : 64}
            titleColor={'#fff'}
            backgroundColor={AppColors.brand.primary}
          />

          <View style={{ marginTop: 64, flex: 1, backgroundColor: '#fff' }}>

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: (AppSizes.screen.height / 2) - 100, left: 0, right: 0 }}>
              <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: 'row', flex: 1, paddingBottom: 20 }}>
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    justifyContent: 'center',

                  }}
                  resizeMode={"cover"}
                  source={require('@images/logo_grey.png')} />
              </View>
              <Text style={{ textAlign: 'center', color: '#BFBFBF' }}>ไม่มีรายการ...ไปที่ Tab 'PROFILE' แล้วเริ่มทริปของคุณ</Text>
            </View>
          </View>

        </View>
      )
    }
    else {
      return (
        <View style={{ marginTop: (this.props.tripdata) ? 64 : -65, flex: 1, backgroundColor: '#F2F1EF' }}>
          <View style={{ flex: 1, }}>
            <View>
              <Image
                style={{
                  position: 'absolute',
                  flex: 1,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',

                }}
                resizeMode={"cover"}
                source={require('@images/bgx1.png')} />
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  alignItems: 'center',
                  flexDirection: 'column',
                  paddingTop: 20,
                }}>


                {this.rendermore()}


                {this.renderheadertitle()}

                <View
                  style={{
                    position: 'absolute',
                    right: 20,
                    top: (this.props.tripdata ? -5 : 35),
                  }}>
                  <TouchableOpacity onPress={() => this.refresh()}>
                    <Icon name={'md-refresh'} size={30} color={'#FFFFFF'} />
                  </TouchableOpacity>
                </View>


              </View>

              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  paddingBottom: 20,
                  alignItems: 'center',
                  flexDirection: 'column'
                }}>

                <View
                  style={{
                    height: 50,
                    backgroundColor: '#3DB670',
                    flexDirection: 'row',
                    margin: 20,
                    marginTop: 15,
                    opacity: 1,
                    borderRadius: 100
                  }}>

                  <View
                    style={{
                      flex: 1,
                      backgroundColor: this.state.activetabstyle.tab1.backgroundColor,
                      borderRadius: 100,
                      opacity: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <TouchableOpacity onPress={() => this.onPressTab(0)}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: this.state.activetabstyle.tab1.color,
                          paddingTop: (Platform.OS === 'ios') ? 4 : -4
                        }}>ภาพรวม</Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      backgroundColor: this.state.activetabstyle.tab2.backgroundColor,
                      flex: 1,
                      borderRadius: 100,
                      opacity: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <TouchableOpacity onPress={() => this.onPressTab(1)}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: this.state.activetabstyle.tab2.color,
                          paddingTop: (Platform.OS === 'ios') ? 4 : -4
                        }}>สมาชิก</Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      backgroundColor: this.state.activetabstyle.tab3.backgroundColor,
                      flex: 1,
                      borderRadius: 100,
                      opacity: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <TouchableOpacity onPress={() => this.onPressTab(2)}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: this.state.activetabstyle.tab3.color,
                          paddingTop: (Platform.OS === 'ios') ? 4 : -4
                        }}>รายจ่าย</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0)',
                    paddingTop: 0,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#ffffff'
                    }}>ยอดเงินคงเหลือ</Text>
                  <Text
                    key={this.state.activetrip.id}
                    style={{
                      fontFamily: 'Roboto-Black',
                      fontWeight: 'bold',
                      fontSize: (Platform.OS === 'ios') ? 32 : 24,
                      paddingTop: 10,
                      color: '#ffffff'
                    }}>{this.props._symbol}{this.props._total.substring(0, this.props._total.length - 3)}
                    <Text
                      key={this.state.activetrip.id * 99}
                      style={{
                        fontFamily: 'Roboto-Black',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        fontSize: 20
                      }}>{this.props._total.substring(this.props._total.length, this.props._total.length - 3)}</Text>
                  </Text>


                </View>

              </View>

            </View>
            <TabViewAnimated
              style={[styles.tabContainer]}
              renderScene={this.renderScene}
              navigationState={this.state.navigation}
              onRequestChangeTab={this.handleChangeTab} />

            <View>
              {this.floatbutton()}
              {/* {this.floatbuttonhome()} */}
            </View>
          </View>
        </View>
      )
    }

  }


  updatetoken = (_token) => {

    var params = {
      userid: this.props._user.id,
      token: _token
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

    fetch(AppConfig.api + 'api/setusertoken', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {

      }).done(() => {

      });

  }

  async _loadInitialDataAsync() {
    if (this.props.tripdata) {
      var params = {
        ispassed: this.props.tripdata.ispassed,
        userid: this.props._user.id,
        tripid: this.props.tripdata.id
      };
      console.log('params', params);
      var formData = new FormData();
      for (var k in params) {
        formData.append(k, params[k]);
      }
      var request = {
        method: 'POST',
        body: formData
      };

      let response = await fetch(AppConfig.api + 'api/get_activetrip', request);
      return response.json();
    }
    else {
      var params = {
        ispassed: '0',
        userid: this.props._user.id,
      };
      console.log('params', params);
      var formData = new FormData();
      for (var k in params) {
        formData.append(k, params[k]);
      }
      var request = {
        method: 'POST',
        body: formData
      };

      let response = await fetch(AppConfig.api + 'api/get_activetrip', request);
      return response.json();
    }

  }

  async _onReadyAsync(data) {
    console.log(data);
    if (data.result_trip.ishosted == '1' && data.result_trip.ispassed == '0') {
      data.result_member.splice(data.result_member.length, 0, {});
    }

    return new Promise((resolve) => {
      if (data.result_total.total != undefined) {
        this
          .props
          .dispatch({ type: 'TOTAL', total: data.result_total.total == '0' ? '00000' : data.result_total.total });
      }
      else {
        this
          .props
          .dispatch({ type: 'TOTAL', total: 0 });
      }

      var charts = [];
      var total = 0;

      if (data.result_chart.food != undefined) {
        charts.push({ value: parseFloat(data.result_chart.food), label: 'อาหาร' });
        total += parseFloat(data.result_chart.food);
      }
      if (data.result_chart.drink != undefined) {
        charts.push({ value: parseFloat(data.result_chart.drink), label: 'เครื่องดื่ม' });
        total += parseFloat(data.result_chart.drink);
      }
      if (data.result_chart.rest != undefined) {
        charts.push({ value: parseFloat(data.result_chart.rest), label: 'ที่พัก' });
        total += parseFloat(data.result_chart.rest);
      }
      if (data.result_chart.power != undefined) {
        charts.push({ value: parseFloat(data.result_chart.power), label: 'น้ำมัน/แก๊ส' });
        total += parseFloat(data.result_chart.power);
      }
      if (data.result_chart.ticket != undefined) {
        charts.push({ value: parseFloat(data.result_chart.ticket), label: 'ตั๋ว/บริการ' });
        total += parseFloat(data.result_chart.ticket);
      }
      if (data.result_chart.activity != undefined) {
        charts.push({ value: parseFloat(data.result_chart.activity), label: 'กิจกรรม' });
        total += parseFloat(data.result_chart.activity);
      }
      if (data.result_chart.other != undefined) {
        charts.push({ value: parseFloat(data.result_chart.other), label: 'อื่น' });
        total += parseFloat(data.result_chart.other);
      }

      this
        .props
        .dispatch({ type: 'SYMBOL', symbol: data.result_trip.symbol });

      this.setState({
        charttotal: total,
        chartdata: charts,
        activetrip: data.result_trip,
        dataSource: this.state.dataSource.cloneWithRows(data.result_member),
        HistorydataSource: this.state.HistorydataSource.cloneWithRows(data.result_spent),
      }, resolve);
    });
  }


  render = () => {
    return (

      <View style={{ flex: 1, }} >
        <LoadingContainer
          onError={e => console.log(e)}
          onLoadStartAsync={this._loadInitialDataAsync.bind(this)}
          onReadyAsync={this._onReadyAsync.bind(this)}>
          {this.renderheader()}
          {this.renderactivetrip()}
        </LoadingContainer>
        <SleekLoadingIndicator loading={this.state.refreshing} />
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
