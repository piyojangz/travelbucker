/**
 * Placeholder Scene
 *
    <Placeholder text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import {AppConfig} from '@constants/';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ListView,
  TouchableWithoutFeedback
} from 'react-native';
import {TabViewAnimated, TabBar} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
// Consts and Libs
import {AppColors, AppStyles, AppSizes} from '@theme/';
//Action
import * as appdataActions from '@redux/appdata/actions';
// Components
import {Card, Spacer, Text} from '@ui/';

import {Actions} from 'react-native-router-flux';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
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
  floatbutton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1C40F',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 70,
    right: 20
  }
});

function numberWithCommas(x) {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  stotal: numberWithCommas(state.appdataReducer.total)
});

// Any actions to map to the component?
const mapDispatchToProps = {
  total: appdataActions.total
};

/* Component ==================================================================== */
class Home extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
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
      dataSource: ds.cloneWithRows([
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
          img: '',
          id: 0
        }
      ]),
      HistorydataSource: ds.cloneWithRows([
        {
          outcometype: 1,
          title: 'กินข้าวร้านร่มไม้'
        }, {
          outcometype: 2,
          title: 'ซื้อเครื่องดื่ม'
        }, {
          outcometype: 2,
          title: 'ซื้อเครื่องดื่ม'
        }, {
          outcometype: 3,
          title: 'จ่ายค่าที่พักคืนแรก'
        }, {
          outcometype: 4,
          title: 'เติมน้ำมันรถ'
        }
      ])

    };

  }

  componentDidUpdate = () => {}

  onItemClicked = (_type, _title) => {
    Actions.inputdetail({outcometype: _type, title: _title,parent:this});
  }

  onchildclick=()=>{
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

  addmember = () => {}

  floatbutton = () => {
    if (this.state.floatshow) {
      return (
        <TouchableWithoutFeedback onPress={() => this.addmember()}>
          <Animatable.View
            style={styles.floatbutton}
            animation="zoomIn"
            duration={200}
            easing="ease-out">
            <Icon name={'md-add'} size={30} color={'#FFFFFF'}/>
          </Animatable.View>
        </TouchableWithoutFeedback>
      )
    }
  }

  renderRow(rowData) {
    if (rowData.id != 0) {
      return (<Image
        style={{
        height: 30,
        width: 30,
        justifyContent: 'space-between',
        margin: 3,
        borderRadius: 15
      }}
        resizeMode={"cover"}
        source={{
        uri: rowData.img
      }}/>)
    } else {
      return (<Image
        style={{
        height: 30,
        width: 30,
        justifyContent: 'space-between',
        margin: 3,
        borderRadius: 15
      }}
        resizeMode={"cover"}
        source={require('../../images/icons/ic_add_user.png')}/>)
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
          source={this.state.outcomeimg.food}/>)

      case 2:
        return (<Image
          style={{
          height: 50,
          width: 50
        }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.drink}/>)

      case 3:
        return (<Image
          style={{
          height: 50,
          width: 50
        }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.rest}/>)

      case 4:
        return (<Image
          style={{
          height: 50,
          width: 50
        }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.power}/>)

      case 5:
        return (<Image
          style={{
          height: 50,
          width: 50
        }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.ticket}/>)

      case 6:
        return (<Image
          style={{
          height: 50,
          width: 50
        }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.activity}/>)

      default:
        return (<Image
          style={{
          height: 50,
          width: 50
        }}
          resizeMode={"cover"}
          source={this.state.outcomeimg.more}/>)
    }

  }
  renderHistoryRow(rowData) {
    if (rowData.id != 0) {
      return (
    
          <TouchableOpacity
          onPress={Actions.comingSoon}
          style={{
          padding: 16, 
          flexDirection: 'row',
          backgroundColor: '#FFFFFF'
        }}>
        
          {this.renderOutcomeImg(rowData.outcometype)}

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
            }}>{rowData.title}</Text>
            <Text
              style={{
              fontFamily: 'Roboto-Bold',
              fontWeight: 'bold',
              color: '#575454'
            }}>
              - ฿9,999.00</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return null
    }

  }
  renderUserRow(rowData) {
    if (rowData.id != 0) {
      return (
        <TouchableOpacity
          onPress={Actions.comingSoon}
          style={{
          padding: 16, 
          flexDirection: 'row',
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
            <Text style={{
              fontSize: 16
            }}>{rowData.name}</Text>
            <Text style={{
              color: '#2CAA61'
            }}>฿9,999.00</Text>
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
          }}/>
        </TouchableOpacity>

      )
    } else {
      return null
    }

  }
  renderScene = ({route}) => {
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
                horizontal={true}
                contentContainerStyle={{
                flex: 1,
                justifyContent: 'center'
              }}
                style={{
                flex: 1
              }}
                dataSource={this.state.dataSource}
                renderRow={this
                .renderRow
                .bind(this)}/>
            </View>
            <ScrollView style={[AppStyles.container]}>
              <View style={styles.rowcard}>
                <TouchableOpacity
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('FOOD', 'อาหาร')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                      height: 50,
                      width: 50
                    }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.food}/>
                    <Text
                      style={{
                      fontSize: 14,
                      paddingTop: 10
                    }}>อาหาร</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('DRINK', 'เครื่องดื่ม')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                      height: 50,
                      width: 50
                    }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.drink}/>
                    <Text
                      style={{
                      fontSize: 14,
                      paddingTop: 10
                    }}>เครื่องดื่ม</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('REST', 'ที่พัก')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                      height: 50,
                      width: 50
                    }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.rest}/>
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
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('POWER', 'น้ำมัน/แก๊ส')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                      height: 50,
                      width: 50
                    }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.power}/>
                    <Text
                      style={{
                      fontSize: 14,
                      paddingTop: 10
                    }}>น้ำมัน/แก๊ส</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('TICKET', 'ตั๋ว/บริการ')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                      height: 50,
                      width: 50
                    }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.ticket}/>
                    <Text
                      style={{
                      fontSize: 14,
                      paddingTop: 10
                    }}>ตั๋ว/บริการ</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('ACTIVITY', 'กิจกรรม')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                      height: 50,
                      width: 50
                    }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.activity}/>
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
                  style={styles.iconcard}
                  onPress={() => this.onItemClicked('OTHER', 'อื่นๆ')}>
                  <View style={styles.contentcard}>
                    <Image
                      style={{
                      height: 50,
                      width: 50
                    }}
                      resizeMode={"cover"}
                      source={this.state.outcomeimg.more}/>
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
                    resizeMode={"cover"}/>
                </View>
                <View style={styles.iconcardhidden}>
                  <Image
                    style={{
                    height: 40,
                    width: 40
                  }}
                    resizeMode={"cover"}/>

                </View>
              </View>
              <Spacer size={50}/>
            </ScrollView>
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
              .bind(this)}/> 
  <Spacer size={50}/>
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
              .bind(this)}/> 

                   <Spacer size={50}/>
          </View>
        );
    }
  }

  render = () => {
    return (
      <View style={[AppStyles.container]}>
        <View
          style={{
          backgroundColor: '#27AE60',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <Text
            style={{
            marginTop: 10,
            backgroundColor: '#27AE60',
            fontSize: 18,
            color: '#FFFFFF',
            textDecorationLine: "underline",
            paddingTop: 4
          }}>ล่องแพรกาญฯ</Text>
        </View>
        <View
          style={{
          backgroundColor: '#27AE60',
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
            marginTop: 5,
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
                  paddingTop: 4
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
                  paddingTop: 4
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
                  paddingTop: 4
                }}>รายจ่าย</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
            alignItems: 'center',
            paddingTop: 0
          }}>
            <Text
              style={{
              fontSize: 18,
              color: '#ffffff'
            }}>ยอดเงินคงเหลือ</Text>
            <Text
              style={{
              fontFamily: 'Roboto-Black',
              fontWeight: 'bold',
              fontSize: 24, 
              paddingTop: 10,
              color: '#ffffff'
            }}>฿{this.props.stotal}
              <Text
                style={{
                fontFamily: 'Roboto-Black',
                fontWeight: 'bold',
                color: '#ffffff',
                fontSize: 24
              }}>.00</Text>
            </Text>
          </View>

        </View>
        <TabViewAnimated
          style={[styles.tabContainer]}
          renderScene={this.renderScene}
          navigationState={this.state.navigation}
          onRequestChangeTab={this.handleChangeTab}/>

        <View>
          {this.floatbutton()}
        </View>

      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
