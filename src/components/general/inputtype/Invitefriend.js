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
import AtoZListView from 'react-native-atoz-listview';
import Search from 'react-native-search-box';
import SleekLoadingIndicator from 'react-native-sleek-loading-indicator';
import LoadingContainer from 'react-native-loading-container';
import { AppConfig } from '@constants/';
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
  TouchableHightLight,
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
  rowContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
  },
  rowTextContainer: {
    justifyContent: 'center',
    paddingLeft: 10
  },
  rowText: {
    fontSize: 18,
    fontWeight: '300'
  },
  rowSubText: {
    fontSize: 14,
    fontWeight: '300'
  },
  rowSeparator: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  sectionHeader: {
    height: 30,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    paddingLeft: 15
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '300'
  },

});

const rowHeight = 40;


const mapStateToProps = state => ({
  _user: state.appdataReducer.user
});

// Any actions to map to the component?
const mapDispatchToProps = {
  user: appdataActions.user
};


/* Component ==================================================================== */
class Invitefriend extends Component {

  static componentName = 'Outcome';

  static propTypes = {
    onNavigationStateChange: PropTypes.func
  }

  static defaultProps = {
    onNavigationStateChange: null
  }


  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchtype: 0,
      data: [],
      x: "",
    };
  }



  componentDidMount = () => {

  }

  handleEdit() {
    console.log(this);
  }

  renderSectionHeader = (sectionId, rowId) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={{ fontSize: 18 }}>{rowId}</Text>
      </View>
    );
  }

  sendrequest(data) {
    this.setState({ loading: true });
    var params = {
      userid: data.id,
      tripid: this.props.parentObj.id,
      inviter: this.props._user.id,
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

    fetch(AppConfig.api + 'api/invitetrip', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {
        console.log(data);

      }).done(() => {
        this.setState({ loading: false });
        this.serchval(this.state.x);
      });
  }



  renderbutton(item) {
    console.log('item', item);
    if (item.ismember == '1') {
      return (
        <View>

          <Image
            style={{
              height: 30,
              width: 30,
              justifyContent: 'space-between',
              borderRadius: 15
            }}
            resizeMode={"cover"}
            source={require('../../../images/icons/ic_checked.png')} />

        </View>
      );
    }
    else {
      return (
        <View>
          <TouchableOpacity onPress={() => this.sendrequest(item)}>
            <Image
              style={{
                height: 30,
                width: 30,
                justifyContent: 'space-between',
                borderRadius: 15
              }}
              resizeMode={"cover"}
              source={require('../../../images/icons/ic_add_user.png')} />
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderRow = (item, sectionId, index) => {
    if (item.userimg != '') {
      var profileimg = AppConfig.imgaddress + item.userimg;
    }
    else {
      var profileimg = (item.fbid == '' || item.fbid == '0' ? AppConfig.avatarblank : 'https://graph.facebook.com/' + item.fbid + '/picture?width=250&height=250');
    }
    return (
      <TouchableOpacity
        underlayColor={styles.rowUnderlayColor}
        onPress={() => this.refs.search_bar.focus(item.name)}
      >
        <View style={styles.rowContainer}>
          <Image
            source={{ uri: profileimg }}
            style={styles.avatar}
          />
          <View style={styles.rowTextContainer}>
            <View style={{ width: AppSizes.screen.width - 80, justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              {this.renderbutton(item)}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderSeparator = (sectionId, rowId) => {
    return <View style={styles.rowSeparator} key={`${sectionId}${rowId}`} />;
  }

  renderHeader = () => {
    return (
      <View>

      </View>
    );
  }

  renderFooter = () => {
    return (
      <View>

      </View>
    );
  }

  beforeFocus = () => {
    return new Promise((resolve, reject) => {
      console.log('beforeFocus');
      resolve();
    });
  }

  onFocus = (text) => {
    return new Promise((resolve, reject) => {
      console.log('onFocus', text);
      resolve();
    });
  }

  afterFocus = () => {
    return new Promise((resolve, reject) => {
      console.log('afterFocus');
      resolve();
    });
  }

  onCancel = () => {
    return new Promise((resolve, reject) => {
      console.log('onCancel');
      resolve();
    });
  }

  afterDelete = () => {
    return new Promise((resolve, reject) => {
      console.log('afterDelete => toggle keyboard');
      this.refs.search_bar.focus();
      resolve();
    });
  }

  onSearch = (text) => {
    return new Promise((resolve, reject) => {
      this.serchval(text);
      resolve();
    });
  }

  onChangeText = (text) => {
    return new Promise((resolve, reject) => {
      if (text.length >= 3) {
        this.serchval(text);
      }
      if (text.length == 0) {
        this.serchval(text);
      }

      resolve();
    });
  }


  serchval(x) {
    var params = {
      userid: this.props._user.id,
      serchwith: x,
      tripid: this.props.parentObj.id,
    };
 
    this.setState({ x: x }); 
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

    fetch(AppConfig.api + 'api/get_friends', request).then((response) => {
      return response.json() // << This is the problem
    })
      .then((responseData) => { // responseData = undefined
        return responseData;
      })
      .then((data) => {
        if (data.result) {
          return new Promise((resolve) => {
            this.setState({
              data: data.result
            }, resolve);
          });
        }

      }).done(() => {
      });
  }

  async _loadInitialDataAsync() {
    var params = {
      userid: this.props._user.id,
      tripid: this.props.parentObj.id,
    };
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    var request = {
      method: 'POST',
      body: formData
    };

    let response = await fetch(AppConfig.api + 'api/get_friends', request);
    return response.json();
  }

  async _onReadyAsync(data) {
    console.log(data);
    return new Promise((resolve) => {
      this.setState({
        data: data.result == null ? [] : data.result
      }, resolve);
    });
  }

  render = () => {
    const { loading } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <NavigationBar
          title={'ชวนเพื่อน'}
          height={(Platform.OS === 'ios') ? 44 : 64}
          titleColor={'#fff'}
          backgroundColor={AppColors.brand.primary}
          leftButtonIcon={require('../../../assets/images/ic_left-arrow.png')}
          backgroundColor={AppColors.brand.primary}
          leftButtonTitle={'ย้อนกลับ'}
          onLeftButtonPress={Actions.pop}
          leftButtonTitleColor={'#fff'}
          rightButtonTitle={'เพิ่ม'}
          onRightButtonPress={Actions.addfriend}
          rightButtonTitleColor={'#fff'}
        />
        <View style={{ marginTop: 64, flex: 1, }}>

          <Search
            ref="search_bar"
            titleSearch=""
            titleCancel=""
            onSearch={this.onSearch}
            onChangeText={this.onChangeText}
            onDelete={() => console.log('onDelete')}
            afterDelete={this.afterDelete}
            beforeFocus={this.beforeFocus}
            onFocus={this.onFocus}
            afterFocus={this.afterFocus}
            onCancel={this.onCancel}
            backgroundColor="#ECECEC"
            placeholderTextColor="#ddd"
            tintColorSearch="#000"
            tintColorDelete="#ddd"
          />

          <View style={{ flex: 1 }}>
            <LoadingContainer
              onError={e => console.log(e)}
              onLoadStartAsync={this._loadInitialDataAsync.bind(this)}
              onReadyAsync={this._onReadyAsync.bind(this)}>
              <AtoZListView
                enableEmptySections
                data={this.state.data}
                renderRow={this.renderRow}
                rowHeight={50}
                renderSectionHeader={this.renderSectionHeader}
                sectionHeaderHeight={40}
                renderSeparator={this.renderSeparator}
                renderHeader={this.renderHeader}
                headerHeight={50}
                renderFooter={this.renderFooter}
                footerHeight={50}
                style={{
                  top: this.atoZAnimated
                }}
              />
            </LoadingContainer>
          </View>


        </View>
        <Spacer size={50} />
        <SleekLoadingIndicator loading={this.state.loading} />
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Invitefriend);