import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text
} from 'react-native';
import * as appdataActions from '@redux/appdata/actions';
import PropTypes from 'prop-types';
import { Card } from 'react-native-elements';

// Consts and Libs
import { AppSizes, AppColors, AppStyles } from '@theme/';


const mapStateToProps = state => ({
   _invitecount: state.appdataReducer.invitecount, 
});



/* Component ==================================================================== */
class CustomBadge extends Component {
  renderbadge() {
    const title = this.props.title; 
    switch (title) {
      case "NOTIFICATION":
        if (this.props._invitecount > 0) {
          return (<View style={{ position: 'absolute', top: 3, right: 11, backgroundColor: '#F00', width: 18, height: 18, borderRadius: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{
              fontSize: 8, color: '#fff'
            }}>
             {this.props._invitecount}
            </Text>
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
  render = () =>
    this.renderbadge()
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps)(CustomBadge);
