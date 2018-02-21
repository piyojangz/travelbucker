/**
 * Tabbar Icon
 *
    <TabIcon icon={'search'} selected={false} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Text, View
} from 'react-native';
import CustomBadge from '../../badge/Badge';
import { AppColors } from '@theme/';

/* Component ==================================================================== */
const TabIcon = ({ icon, title, selected }) => (
  <View style={{ justifyContent: 'center', alignContent: 'center',  flex: 1 }}>
    <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection:'row',marginBottom:2}}>
      <Icon
        name={icon}
        title={title}
        size={22}
        color={selected
          ? AppColors.tabbar.iconSelected
          : AppColors.tabbar.iconDefault} />
    </View>
    <Text style={{
      fontSize: 9, color: selected
        ? AppColors.tabbar.iconSelected
        : AppColors.tabbar.iconDefault
    }}>
      {title}
    </Text>
    <CustomBadge title={title} />
  </View>);

TabIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  selected: PropTypes.bool
};
TabIcon.defaultProps = {
  icon: 'search',
  selected: false
};

/* Export Component ==================================================================== */
export default TabIcon;
