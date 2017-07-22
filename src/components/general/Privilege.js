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
  Image,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

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
import { AppColors, AppStyles } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
    marginBottom:15,
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary,
  },
  tabbarIndicator: {
    backgroundColor: '#FFF',
  },
  tabbar_text: {
    color: '#FFF',
    fontSize:16,
  },
  backgroundImage: {
    flex: 1,
    height: 120,
    resizeMode: 'cover', // or 'stretch'
  },
});

const dummyData1 = [
  {
    title: 'หัวหิน',
    img: 'https://wm.thaibuffer.com/o/image/Travel_1/sea/hunhun.jpg',
  },
  {
    title: 'ภูเก็ต',
    img: 'https://www.tmd.go.th/images/locations/564202.jpg',
  },
  {
    title: 'เชียงใหม่',
    img: 'https://fbi.dek-d.com/27/0349/3047/121543611?v=5.431',
  },
  {
    title: 'สมุย',
    img: 'https://images.trvl-media.com/hotels/3000000/2670000/2666000/2665914/dd737ebe_z.jpg',
  },
  {
    title: 'พัทยา / เกาะล้าน',
    img: 'https://img.kapook.com/u/sutasinee/15/6.02.56/14.jpg',
  },
];

/* Component ==================================================================== */
class Privilege extends Component {
  static componentName = 'Privilege';

  constructor(props) {
    super(props);

    // Setup ListViews
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      navigation: {
        index: 0,
        routes: [
          { key: '0', title: 'ที่พัก' },
          { key: '1', title: 'ร้านอาหาร' },
          { key: '2', title: 'Ticket' },
        ],
      },
      dataSource: ds.cloneWithRows(dummyData1),
    };
  }

  /**
    * On Change Tab
    */
  handleChangeTab = (index) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  }



  renderRow = (data, sectionID) => (
    <TouchableOpacity
      onPress={Actions.comingSoon}
      style={{  
        marginBottom: 5, 
      }}>
      <Image
        style={styles.backgroundImage}
        resizeMode={"cover"}
        source={{
          uri: data.img
        }} >
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center', 
        }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0)',
          }}>{data.title}</Text>

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
          }} />
      </Image>

    </TouchableOpacity>

  )

  /**
    * Which component to show
    */
  renderScene = ({ route }) => {
    switch (route.key) {
      case '0':
        return (
          <View style={styles.tabContainer}>
            <Spacer size={-20} />
            <List>
              <ListView
                renderRow={this.renderRow.bind(this)}
                dataSource={this.state.dataSource}
              /> 
            </List>   
          </View>
        );


      default:
        return (
          <View />
        );
    }
  }

  /**
    * Header Component
    */
  renderHeader = props => (
    <TabBar
      {...props}
      style={styles.tabbar}
      indicatorStyle={styles.tabbarIndicator}
      renderLabel={scene => (
        <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
      )}
    />
  )

  render = () => (
    <TabViewAnimated
      style={[styles.tabContainer]}
      renderScene={this.renderScene}
      renderHeader={this.renderHeader}
      navigationState={this.state.navigation}
      onRequestChangeTab={this.handleChangeTab}
    /> 
  )
}

/* Export Component ==================================================================== */
export default Privilege;
