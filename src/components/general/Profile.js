/**
 * Style Guide
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import {
  View,
  Alert,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Image,
  RefreshControl,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import LoadingContainer from 'react-native-loading-container';
import { connect } from 'react-redux';
import NavigationBar from 'react-native-navigation-bar';
import * as appdataActions from '@redux/appdata/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import * as Animatable from 'react-native-animatable';
import { SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { FBLoginManager } from 'react-native-facebook-login';
import { AppSizes } from '@theme/';
import GridView from 'react-native-easy-gridview';
import Timeline from 'react-native-timeline-listview'
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
import { AppConfig } from '@constants/';
// Components
import {
  Button,
  Card,
  Spacer,
  Text,
  List,
  ListItem,
  FormInput,

  FormLabel
} from '@components/ui/';
// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
    marginBottom: 15
  },
  Container: {
    flex: 1, 
  },
  tabbar: {
    backgroundColor: '#F9F8F8'
  },
  tabbarIndicator: {
    backgroundColor: AppColors.brand.primary
  },
  tabbar_text: {
    color: '#000',
    fontSize: 14
  },
  backgroundImage: {
    flex: 1,
    width: AppSizes.screen.width,
    height: 120,
    resizeMode: 'cover', // or 'stretch'
  },
  floatbutton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3C42C',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: (Platform.OS === 'ios') ? 60 : 60,
    right: 10,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray'
  }
});




const mapStateToProps = state => ({
  _user: state.appdataReducer.user
});

// Any actions to map to the component?
const mapDispatchToProps = {
  user: appdataActions.user
};


/* Component ==================================================================== */
class Profile extends Component {
  static componentName = 'Privilege';

  constructor(props) {
    super(props);

    // Setup ListViews 
    const dsfriends = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      loading: false,
      refreshing: false,
      isRefreshing: false,
      friendata: [],
      upcomming: [],
      past: [],
      dsfriends: [],
      navigation: {
        index: 0,
        routes: [
          {
            key: '0',
            title: 'ทริป'
          }, {
            key: '1',
            title: 'ที่ผ่านมา'
          }, {
            key: '2',
            title: 'เพื่อน'
          }
        ]
      },
      friendsdataSource: dsfriends
    };
  }


  componentWillMount = () => {
    console.log('this.props._user', this.props._user);

  }


  onRefresh() {
    //set initial data
  }


  // gettrips = (userid) => {

  //   var params = {
  //     userid: userid,
  //   };
  //   var formData = new FormData();
  //   for (var k in params) {
  //     formData.append(k, params[k]);
  //   }
  //   var request = {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //     },
  //     body: formData
  //   };

  //   fetch(AppConfig.api + 'api/get_trips', request).then((response) => {
  //     return response.json() // << This is the problem
  //   })
  //     .then((responseData) => { // responseData = undefined 
  //       return responseData;
  //     })
  //     .then((data) => {
  //       console.log('trips',data);
  //       if (data.result) {

  //       }
  //     }).done();

  // }


  handleChangeTab = (index) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        index
      }
    });
  }


  logout = () => {

    // // Works on both iOS and Android
    Alert.alert(
      'Message',
      'คุณต้องการออกจากระบบ?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'OK', onPress: () => {
            this.setState({ loading: true, });
            FBLoginManager.logout(function (error, data) {
              if (!error) {
              } else {
                console.log(error, data);
              }
            });

            this.setState({
              loading: false,
            });

            AsyncStorage.setItem("userdetail", JSON.stringify({
              email: ''
              , name: ''
              , userimg: ''
              , islogin: 0
              , id: ''
              , fbid: ''
            })).then(() => {
              this
                .props
                .dispatch({
                  type: 'USER', user: undefined
                });
              Actions.AppLaunch();
            });



          }
        },
      ],
      { cancelable: false }
    )
  }

  renderRow = (data, sectionID) => (

    <TouchableOpacity
      onPress={Actions.comingSoon}
      style={{
      }}>

      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#000',
            backgroundColor: 'rgba(0,0,0,0)'
          }}>{data.title}</Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: '#000',
            backgroundColor: 'rgba(0,0,0,0)'
          }}>{data.datetime}</Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            color: '#000',
            backgroundColor: 'rgba(0,0,0,0)'
          }}>{data.budget}</Text>
      </View>
      <Icon
        name={'ios-arrow-forward-outline'}
        size={35}
        rot
        color={'#000'}
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0)',
          right: 10,
          top: 45
        }} />


    </TouchableOpacity>
  )

  onEventPress(data) {
    Actions.tripdetail({ tripdata: data });
    //console.log(data);
  }

  rendernodatapast() {
    if (this.state.past.length == 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: 150, left: 0, right: 0 }}>
          <Text style={{ textAlign: 'center', color: '#BFBFBF' }}>ไม่มีรายการ...</Text>
        </View>
      )
    }
    else {
      return (<View />);
    }
  }

  rendernodata() {
    if (this.state.upcomming.length == 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: 150, left: 0, right: 0 }}>
          <Text style={{ textAlign: 'center', color: '#BFBFBF' }}>ไม่มีรายการ...</Text>
        </View>
      )
    }
    else {
      return (<View />);
    }
  }

  rendernofriend() {
    if (this.state.friendata.length == 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: 150, left: 0, right: 0 }}>
          <Text style={{ textAlign: 'center', color: '#BFBFBF' }}>ไม่มีรายการ...</Text>
        </View>
      )
    }
    else {
      return (<View />);
    }
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this._loadInitialDataAsync().then((data) => {
      this._onReadyAsync(data).then(() => {
        this.setState({ refreshing: false });
      });
    });
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case '0':
        return (
          <View style={[styles.tabContainer, { backgroundColor: '#fff' }]}>

            <Timeline
              timeContainerStyle={{ minWidth: 72 }}
              circleColor={AppColors.brand.primary}
              lineColor={AppColors.brand.primary}
              timeStyle={{ fontSize: 12, }}
              titleStyle={{ lineHeight: 22, fontSize: 16 }}
              descriptionStyle={{ lineHeight: 16, color: '#666' ,marginBottom:10}}
              onEventPress={this.onEventPress}
              options={{
                refreshControl: (
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                ),
                style: { padding: 15, marginTop: Platform.OS == 'ios' ? 0 : 15, marginLeft: Platform.OS == 'ios' ? 0 : 15, marginRight: Platform.OS == 'ios' ? 0 : 15 }
              }}
              data={this.state.upcomming}
              enableEmptySections={true}
            />
            {this.rendernodata()}
            <Spacer size={20} />
            <TouchableWithoutFeedback onPress={Actions.addtrip} >
              <Animatable.View style={styles.floatbutton} animation="zoomIn" duration={200} easing="ease-out" >
                <Icon
                  name={'md-add'}
                  size={30}
                  rot
                  color={'#FFFFFF'} />
              </Animatable.View>
            </TouchableWithoutFeedback>

            <Spacer size={35} />
          </View>
        );
      case '1':
        return (
          <View style={[styles.tabContainer, { backgroundColor: '#fff' }]}>

            <Timeline
              timeContainerStyle={{ minWidth: 72 }}
              circleColor={'#aaa'}
              lineColor={'#aaa'}
              timeStyle={{ fontSize: 12, }}
              titleStyle={{ lineHeight: 22, fontSize: 16, color: '#aaa' }}
              descriptionStyle={{ lineHeight: 16, color: '#aaa',marginBottom:10 }}
              timeStyle={{ color: '#aaa' }}
              onEventPress={this.onEventPress}
              options={{
                refreshControl: (
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                ),
                style: { padding: 15,marginTop: Platform.OS == 'ios' ? 0 : 15, marginLeft: Platform.OS == 'ios' ? 0 : 15, marginRight: Platform.OS == 'ios' ? 0 : 15 }
              }}
              data={this.state.past}
              enableEmptySections={true}
            />
            {this.rendernodatapast()}
            <Spacer size={35} />

          </View>
        );
      case '2':
        return (
          <View style={[styles.tabContainer]}>
            <ScrollView style={[styles.Container]}>
              <GridView
                enableEmptySections={true}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                }
                style={{ height: AppSizes.screen.height - ((Platform.OS === 'ios') ? 44 : 64), }}
                dataSource={this.state.friendsdataSource}
                renderRow={this
                  .renderFriends
                  .bind(this)}
                numberOfItemsPerRow={3}
                removeClippedSubviews={false}
                initialListSize={1}
                pageSize={5} />
            </ScrollView>
            <TouchableWithoutFeedback onPress={Actions.addfriend} >
              <Animatable.View style={[styles.floatbutton, { backgroundColor: AppColors.brand.primary }]} animation="zoomIn" duration={200} easing="ease-out" >
                <Icon
                  name={'md-add'}
                  size={30}
                  rot
                  color={'#FFFFFF'} />
              </Animatable.View>
            </TouchableWithoutFeedback>
            {this.rendernofriend()}
          </View >
        )
      default:
        return (<View />);
    }
  }

  renderFriends(rowData) {
    if (rowData.userimg != '') {
      var profileimg = AppConfig.imgaddress + rowData.userimg;
    }
    else {
      var profileimg = (rowData.fbid == '' || rowData.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + rowData.fbid + '/picture?width=250&height=250');
    }
    return (
      <TouchableOpacity
        // onPress={Actions.comingSoon}
        style={{
          margin: 1,
          padding: 5,
          paddingTop: 20,
          paddingBottom: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF'
        }}>
        <Image
          style={{
            height: 40,
            width: 40,
            borderRadius: 20
          }}
          resizeMode={"cover"}
          source={{
            uri: profileimg
          }} />
        <View style={{
          paddingLeft: 10
        }}>
          <Text numberOfLines={1} style={{
            fontSize: 14
          }}>{rowData.name}</Text>

        </View>
        {this.renderunapprove(rowData)}

      </TouchableOpacity>
    )
  }


  renderunapprove(rowData) {
    if (rowData.isactive == '0') {
      return (
        <View
          style={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: .2,
            backgroundColor: '#000'
          }}
        >
          <Text numberOfLines={1} style={{
            color: '#fff',
            fontSize: 18
          }}>pending...</Text>
        </View>
      )
    }
    else {
      return (
        <View />
      )
    }
  }

  renderHeader = props => {
    return (
      <TabBar
        {...props}
        style={styles.tabbar}
        indicatorStyle={styles.tabbarIndicator}
        renderLabel={scene => (
          <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
        )} />
    );
  }


  async _loadInitialDataAsync() {
    var params = {
      userid: this.props._user.id,
    };
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    var request = {
      method: 'POST',
      body: formData
    };

    let response = await fetch(AppConfig.api + 'api/get_tripsandfriends', request);
    return response.json();
  }

  async _onReadyAsync(data) {
    console.log(data);
    return new Promise((resolve) => {
      this.setState({
        past: data.result_pasttrips,
        upcomming: data.result_trips,
        friendata: data.result_friends,
        friendsdataSource: this.state.friendsdataSource.cloneWithRows(data.result_friends),
      }, resolve);
    });
  }

  render = () => {
    if (this.props._user) {
      if (this.props._user.userimg != '') {
        var profileimg = AppConfig.imgaddress + this.props._user.userimg;
      }
      else {
        var profileimg = (this.props._user.fbid == '' || this.props._user.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + this.props._user.fbid + '/picture?width=250&height=250');
      }
    }
    else {
      var profileimg = AppConfig.avatarblank;
    }


    return (
      <View style={{ marginTop: (Platform.OS === 'ios') ? -65 : -54, flex: 1, backgroundColor: '#F7F9FB' }}>
        <NavigationBar
          title={'Profile'}
          height={(Platform.OS === 'ios') ? 44 : 64}
          titleColor={'#fff'}
          backgroundColor={AppColors.brand.primary}
          rightButtonTitle={'Logout'}
          onRightButtonPress={() => this.logout()}
          rightButtonTitleColor={'#fff'}
        />
        <View style={{ marginTop: 64, flex: 1, }}>
          <View
            style={{
              height: 110,
            }}>
            <View
              style={{
                backgroundColor: AppColors.brand.primary,
                flex: 1,
                padding: 25,
                flexDirection: 'row',
              }}
            >
              <Image
                style={{
                  borderColor: '#fff',
                  borderWidth: 1,
                  height: 50,
                  width: 50,
                  justifyContent: 'space-between',
                  margin: 3,
                  borderRadius: 25
                }}
                resizeMode={"cover"}
                source={{
                  uri: profileimg
                }} />
              <View style={{ paddingLeft: 10, backgroundColor: 'rgba(0,0,0,0)' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    paddingTop: 4
                  }}>{this.props._user ? this.props._user.name : 'Name'}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#FFFFFF',
                  }}>{this.props._user ? this.props._user.email : 'Email'}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <LoadingContainer
              onError={e => console.log(e)}
              onLoadStartAsync={this._loadInitialDataAsync.bind(this)}
              onReadyAsync={this._onReadyAsync.bind(this)}>
              <TabViewAnimated
                style={[{ flex: 1 }]}
                renderScene={this.renderScene}
                renderHeader={this.renderHeader}
                navigationState={this.state.navigation}
                onRequestChangeTab={this.handleChangeTab} />
            </LoadingContainer>
          </View>
        </View>
        <SleekLoadingIndicator loading={this.state.loading} />
      </View>
    )
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Profile);