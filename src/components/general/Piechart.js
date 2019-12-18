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
import * as appdataActions from '@redux/appdata/actions';
import { connect } from 'react-redux'; 
import { AppConfig } from '@constants/';
import { StackNavigator, SafeAreaView } from 'react-navigation'; 
import {
  View,
  StyleSheet,
  Text,
  processColor,
} from 'react-native';
// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import LoadingContainer from 'react-native-loading-container';
// Components
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    width: AppSizes.screen.width,
    flex: 1
  }
});




// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  _chartdata: state.appdataReducer.chartdata,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  chartdata: appdataActions.chartdata,
};
/* Component ==================================================================== */
class Piechart extends Component {
  static componentName = 'Component';


  constructor(props) {
    super(props);

    this.state = {
      legend: {
        enabled: true,
        textSize: 8,
        form: 'CIRCLE',
        position: 'RIGHT_OF_CHART',
        wordWrapEnabled: true
      },
      data: {
        dataSets: [{
          values: this.props.charts,
          label: 'รายการใช้จ่าย',
          config: {
            colors: [processColor('#C0FF8C')
              , processColor('#FFF78C')
              , processColor('#FFD08C')
              , processColor('#8CEAFF')
              , processColor('#C5EFF7')
              , processColor('#EC644B')
              , processColor('#FF8C9D')],
            valueTextSize: 20,
            valueTextColor: processColor('green'),
            sliceSpace: 5,
            selectionShift: 13
          }
        }],
      },
      highlights: [{ x: 2 }],
      description: {
        text: this.props.tripdata.title,
        textSize: 15,
        textColor: processColor('darkgray'),

      }
    };

  }




  componentDidMount = () => {
    console.log('xxxx', this.props.rest == undefined);
  }



  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }

    console.log(event.nativeEvent)
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {/* <View>
            <Text>selected:</Text>
            <Text> {this.state.selectedEntry}</Text>
          </View> */}
        <View style={styles.container}>
          {/* <PieChart
            style={styles.chart}
            logEnabled={true}
            chartBackgroundColor={processColor('white')}
            chartDescription={this.state.description}
            data={this.state.data}
            legend={this.state.legend}
            highlights={this.state.highlights}
            entryLabelColor={processColor('black')}
            entryLabelTextSize={12}
            drawEntryLabels={true}
            rotationEnabled={true}
            rotationAngle={45}
            usePercentValues={false}
            centerTextRadiusPercent={100}
            holeRadius={40}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={45}
            transparentCircleColor={processColor('#f0f0f088')}
            styledCenterText={{ text: 'รวม:' + this.props.charttotal, color: processColor('grey'), size: 14 }}
            maxAngle={350}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          /> */}
          
        </View>
      </SafeAreaView>
    )
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Piechart);