/**
 * Style Guide
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { AppConfig } from '@constants/';
import PropTypes from 'prop-types';
import * as appdataActions from '@redux/appdata/actions';
import LoadingContainer from 'react-native-loading-container';
import { Actions } from 'react-native-router-flux';
import CustomBadge from '../../badge/Badge';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

import {
  View,
  Alert,
  ListView,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { SocialIcon } from 'react-native-elements';
import NavigationBar from 'react-native-navigation-bar';
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
import Icon from 'react-native-vector-icons/Ionicons';
// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
    marginBottom: 15,
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary,
  },
  tabbarIndicator: {
    backgroundColor: '#FFF',
  },
  tabbar_text: {
    color: '#FFF',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    height: 120,
    resizeMode: 'cover', // or 'stretch'
  },
});



const mapStateToProps = state => ({
  _user: state.appdataReducer.user,
  _invitecount: state.appdataReducer.invitecount,
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

/* Component ==================================================================== */
class Noti extends Component {
  static componentName = 'Privilege';

  constructor(props) {
    super(props);

    // Setup ListViews
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dnotis = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      waiting: false,
      offset: 0,
      limit: 10,
      refreshing: false,
      data: [],
      datanoti: [],
      dataSourcenoti: dnotis,
      dataSource: ds,
      navigation: {
        index: 0,
        routes: [
          {
            key: '0',
            title: 'แจ้งเตือน'
          }, {
            key: '1',
            title: 'เชิญชวน'
          }
        ]
      },
    };
  }

  componentDidMount() {
    FCM.setBadgeNumber(0);
  }

  renderRowNoti = (rowData, sectionID) => {
    console.log('rowData', rowData);
    var iconname = 'alarm';
    if (rowData.type == 'ADDMONEY') {
      iconname = 'tag-faces';
    }
    if (rowData.type == 'EXPENSE') {
      iconname = 'credit-card';
    }
    return (
      <ListItem
        key={sectionID}
        subtitleNumberOfLines={3}
        rightIcon={{ color: 'rgba(0,0,0,0)' }}
        leftIcon={{ name: iconname }}
        title={rowData.title}
        subtitle={rowData.message}
        rightTitle={rowData.dateadd}
        rightTitleStyle={{ fontSize: 10 }}
        rightTitleNumberOfLines={2}
      />
    )

  }


  renderRow = (rowData, sectionID) => {
    if (rowData.userimg != '') {
      var profileimg = AppConfig.imgaddress + rowData.userimg;
    }
    else {
      var profileimg = (rowData.fbid == '' || rowData.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + rowData.fbid + '/picture?width=250&height=250');
    }
    return (

      <ListItem
        onPress={() => Actions.invite({ parentObj: rowData })}
        key={sectionID}
        roundAvatar
        avatar={{ uri: profileimg }}
        subtitleNumberOfLines={3}
        title={rowData.inviter}
        subtitle={'ได้เชิญคุณเข้าร่วม ' + rowData.title}
        rightTitle={rowData.dateadd}
        rightTitleStyle={{ fontSize: 10 }}
        rightTitleNumberOfLines={2}
      />


    )

  }

  async _loadInitialDataAsync() {
    var params = {
      userid: this.props._user.id,
      offset: this.state.offset,
      limit: this.state.limit,
    };
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    var request = {
      method: 'POST',
      body: formData
    };

    let response = await fetch(AppConfig.api + 'api/get_notification', request);
    return response.json();
  }

  async _onReadyAsync(data) {
    //console.log(data);
    return new Promise((resolve) => {
      this.setState({
        data: data.result,
        datanoti: data.resultnoti,
        dataSource: this.state.dataSource.cloneWithRows(data.result),
        dataSourcenoti: this.state.dataSourcenoti.cloneWithRows(data.resultnoti),
      }, resolve);
    });
  }

  _onRefresh() {
    this.setState({ refreshing: true, limit: 10, });
    this._loadInitialDataAsync().then((data) => {
      this._onReadyAsync(data).then(() => {
        this.setState({ refreshing: false });
      });
    });
  }

  rendernodatanoti() {
    if (this.state.datanoti.length == 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: (AppSizes.screen.height / 2) - 100, left: 0, right: 0 }}>
          <Text style={{ textAlign: 'center', color: '#BFBFBF' }}>ไม่มีรายการแจ้งเตือนใดๆ</Text>
        </View>
      )
    }
    else {
      return (<View />);
    }
  }

  rendernodata() {
    if (this.state.data.length == 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: (AppSizes.screen.height / 2) - 100, left: 0, right: 0 }}>
          <Text style={{ textAlign: 'center', color: '#BFBFBF' }}>ไม่มีรายการเชิญชวนใดๆ</Text>
        </View>
      )
    }
    else {
      return (<View />);
    }
  }

  handleChangeTab = (index) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        index
      }
    });
  }
  rendernoti() {
    return (
      <View style={{ flex: 1, }}>

        <ListView
          renderRow={this.renderRowNoti.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={this.state.dataSourcenoti}
          renderFooter={this.renderFooter}
          onEndReached={this.onEndReached}
        />

        {this.rendernodatanoti()}
        <Spacer size={35} />
      </View>
    );
  }

  renderlist() {

    return (
      <View style={{ flex: 1, }}>

        <ListView
          renderRow={this.renderRow.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={this.state.dataSource}
        />

        {this.rendernodata()}
        <Spacer size={35} />
      </View>
    );
  }


  renderbadge(title) {
    switch (title) {
      case "เชิญชวน":
        if (this.props._invitecount > 0) {
          return (<View style={{ position: 'absolute', top: 0, right: -10, backgroundColor: '#F00', width: 10, height: 10, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          </View>);
        }
        else {
          return (<View></View>);
        }
        break;
      default:
        return (<View></View>);
        break;
    }
  }

  renderHeader = props => {
    return (
      <TabBar
        {...props}
        style={styles.tabbar}
        indicatorStyle={styles.tabbarIndicator}
        renderLabel={scene => (
          <View>
            <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
            {this.renderbadge(scene.route.title)}
          </View>
        )} />
    );
  }
  renderScene = ({ route }) => {
    switch (route.key) {
      case '0':
        return (
          <View style={[styles.tabContainer, { backgroundColor: '#fff' }]}>
            {this.rendernoti()}
          </View>
        );
      case '1':
        return (
          <View style={[styles.tabContainer, { backgroundColor: '#fff' }]}>
            {this.renderlist()}
          </View>
        );
      default:
        return (<View />);
    }
  }

  onEndReached = () => {
    if (!this.state.waiting) {
      this.setState({ waiting: false, limit: this.state.limit + 10, })
      console.log(this.state.limit);
      //this.fetchData() // fetching new data, ended with this.setState({waiting: false});
      this._loadInitialDataAsync().then((data) => {
        this._onReadyAsync(data).then(() => {
          if (data.length == undefined) {
            this.setState({ waiting: false });
          }
        });
      });
    }
  }

  renderFooter = () => {
    if (this.state.waiting) {
      return <View>
        <Spacer size={10} />
        <ActivityIndicator />
        <Spacer size={10} />
      </View>;
    } else {
      return null;
    }
  }

  render = () => (
    <View style={{ marginTop: (Platform.OS === 'ios') ? -65 : -54, flex: 1, backgroundColor: '#F7F9FB' }}>
      <NavigationBar
        title={'Notification'}
        height={(Platform.OS === 'ios') ? 44 : 64}
        titleColor={'#fff'}
        backgroundColor={AppColors.brand.primary}
      />

      <View style={{ marginTop: 64, flex: 1, backgroundColor: '#fff' }}>
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
  )
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Noti);
