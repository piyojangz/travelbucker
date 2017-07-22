/**
 * Style Guide
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, {Component} from 'react';
import {
  View,
  Alert,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import {TabViewAnimated, TabBar} from 'react-native-tab-view';
import {SocialIcon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import {AppSizes} from '@theme/';
import GridView from 'react-native-easy-gridview';
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
import {AppColors, AppStyles} from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
    marginBottom: 15
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary
  },
  tabbarIndicator: {
    backgroundColor: '#FFF'
  },
  tabbar_text: {
    color: '#FFF',
    fontSize: 14
  },
  backgroundImage: {
    flex: 1,
    width: AppSizes.screen.width,
    height: 120,
    resizeMode: 'cover', // or 'stretch'
  }
});

const dummyData1 = [
  {
    title: 'ล่องแพรกาญฯ',
    budget: '35,700.00',
    datetime: '17/07/2559',
    img: require('../../assets/images/bgupcomming1.png')
  }, {
    title: 'ปรสิตทัวร์เชียงราย',
    budget: '35,700.00',
    datetime: '17/07/2559',
    img: require('../../assets/images/bgupcomming2.png')
  }, {
    title: 'ทริปเขาใหญ่',
    budget: '35,700.00',
    datetime: '17/07/2559',
    img: require('../../assets/images/bgupcomming3.png')
  }
];

/* Component ==================================================================== */
class Profile extends Component {
  static componentName = 'Privilege';

  constructor(props) {
    super(props);

    // Setup ListViews
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const dsFrienss = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      navigation: {
        index: 0,
        routes: [
          {
            key: '0',
            title: 'UPCOMMING'
          }, {
            key: '1',
            title: 'FRIENDS'
          }
        ]
      },
      dataSource: ds.cloneWithRows(dummyData1),
      friendsdataSource: dsFrienss.cloneWithRows([
        {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/17951974_10209166209418' +
              '600_2570895280591768149_n.jpg?oh=068031dd46a0abe290dd2698937ed146&oe=59CCEDC2',
          id: 1,
          name: 'Breeshy Sama'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/16299342_10202411016393' +
              '042_2838505399580246052_n.jpg?oh=7d665d0985f500fb4c19663f05d11c65&oe=59CC3419',
          id: 2,
          name: 'Zippy Jantaban'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/12718016_10156713327080' +
              '109_5014114178575552522_n.jpg?oh=d596efeb29b0ba5daee14c8626e311ad&oe=59CE6675',
          id: 3,
          name: 'Chunnamon Sung'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/17952758_15553478544892' +
              '12_4415242171106257259_n.jpg?oh=432404d91c22321836fa908fda1cbf05&oe=5A0AB37E',
          id: 4,
          name: 'Peijang Kyo'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/18447040_10203440131920' +
              '820_600142454750478436_n.jpg?oh=8fd391d499fa20bf7180f81fb1aa214d&oe=59C9F2D0',
          id: 5,
          name: 'Medsine'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/16299342_10202411016393' +
              '042_2838505399580246052_n.jpg?oh=7d665d0985f500fb4c19663f05d11c65&oe=59CC3419',
          id: 2,
          name: 'Zippy Jantaban'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/12718016_10156713327080' +
              '109_5014114178575552522_n.jpg?oh=d596efeb29b0ba5daee14c8626e311ad&oe=59CE6675',
          id: 3,
          name: 'Chunnamon Sung'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/17952758_15553478544892' +
              '12_4415242171106257259_n.jpg?oh=432404d91c22321836fa908fda1cbf05&oe=5A0AB37E',
          id: 4,
          name: 'Peijang Kyo'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/18447040_10203440131920' +
              '820_600142454750478436_n.jpg?oh=8fd391d499fa20bf7180f81fb1aa214d&oe=59C9F2D0',
          id: 5,
          name: 'Medsine'
        }
        , {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/16299342_10202411016393' +
              '042_2838505399580246052_n.jpg?oh=7d665d0985f500fb4c19663f05d11c65&oe=59CC3419',
          id: 2,
          name: 'Zippy Jantaban'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/12718016_10156713327080' +
              '109_5014114178575552522_n.jpg?oh=d596efeb29b0ba5daee14c8626e311ad&oe=59CE6675',
          id: 3,
          name: 'Chunnamon Sung'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/17952758_15553478544892' +
              '12_4415242171106257259_n.jpg?oh=432404d91c22321836fa908fda1cbf05&oe=5A0AB37E',
          id: 4,
          name: 'Peijang Kyo'
        }, {
          img: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/18447040_10203440131920' +
              '820_600142454750478436_n.jpg?oh=8fd391d499fa20bf7180f81fb1aa214d&oe=59C9F2D0',
          id: 5,
          name: 'Medsine'
        }
      ])
    };
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
  }

  renderRow = (data, sectionID) => (

    <TouchableOpacity
      onPress={Actions.comingSoon}
      style={{
      marginBottom: 5
    }}>
      <Image style={styles.backgroundImage} resizeMode={"cover"} source={data.img}>
        <View
          style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Text
            style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0)'
          }}>{data.title}</Text>
          <Text
            style={{
            textAlign: 'center',
            fontSize: 16,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0)'
          }}>{data.datetime}</Text>
          <Text
            style={{
            textAlign: 'center',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0)'
          }}>{data.budget}</Text>
        </View>
        <Icon
          name={'ios-arrow-forward-outline'}
          size={35}
          rot
          color={'#FFFFFF'}
          style={{
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0)',
          right: 10,
          top: 45
        }}/>
      </Image>

    </TouchableOpacity>
  )

  /**
    * Which component to show
    */
  renderScene = ({route}) => {
    switch (route.key) {
      case '0':
        return (
          <View style={styles.tabContainer}>
            <Spacer size={-20}/>
            <List>
              <ListView
                renderRow={this
                .renderRow
                .bind(this)}
                dataSource={this.state.dataSource}/>
            </List>
          </View>
        );
      case '1':
        return (
          <View style={styles.tabContainer}>
            <GridView  
            style={{marginBottom:20,}}
              dataSource={this.state.friendsdataSource}
              renderRow={this
              .renderFriends
              .bind(this)}
              numberOfItemsPerRow={3}
              removeClippedSubviews={false}
              initialListSize={1}
              pageSize={5}/> 
          </View>
        )
      default:
        return (<View/>);
    }
  }

  renderFriends(rowData) {
    return (
      <TouchableOpacity
        onPress={Actions.comingSoon}
        style={{
          margin:1,
        padding: 5,
        paddingTop:20,
        paddingBottom:20, 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <Image
          style={{
          height: 50,
          width: 50,
          borderRadius: 30
        }}
          resizeMode={"cover"}
          source={{
          uri: rowData.img
        }}/>
        <View style={{
          paddingLeft: 10
        }}>
          <Text numberOfLines={1} style={{
            fontSize: 14
          }}>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  /**
    * Header Component
    */
  renderHeader = props => (<TabBar
    {...props}
    style={styles.tabbar}
    indicatorStyle={styles.tabbarIndicator}
    renderLabel={scene => (
    <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
  )}/>)

  render = () => (
    <View style={[AppStyles.container]}>
      <View
        style={{
        backgroundColor: '#27AE60',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Image
          style={{
          height: 80,
          width: 80,
          justifyContent: 'space-between',
          margin: 3,
          borderRadius: 40
        }}
          resizeMode={"cover"}
          source={{
          uri: 'https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-1/p320x320/17951974_10209166209418' +
              '600_2570895280591768149_n.jpg?oh=068031dd46a0abe290dd2698937ed146&oe=59CCEDC2'
        }}/>
        <Text
          style={{
          backgroundColor: '#27AE60',
          fontSize: 18,
          color: '#FFFFFF',
          paddingTop: 4
        }}>Breeshy Sama</Text>
        <TouchableOpacity onPress={Actions.comingSoon}>
          <View
            style={{
            backgroundColor: '#F1C40F',
            paddingLeft: 25,
            paddingRight: 25,
            paddingTop: 8,
            paddingBottom: 3,
            borderRadius: 20
          }}>
            <Text
              style={{
              color: '#fff',
              fontSize: 16
            }}>แก้ไขข้อมูลส่วนตัว</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TabViewAnimated
        style={[styles.tabContainer]}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        navigationState={this.state.navigation}
        onRequestChangeTab={this.handleChangeTab}/>
    </View>
  )
}

/* Export Component ==================================================================== */
export default Profile;
