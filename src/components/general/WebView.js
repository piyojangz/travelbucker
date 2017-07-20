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
import {
  WebView,
  StyleSheet,
  InteractionManager,
} from 'react-native';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';
// Actions
import * as RecipeActions from '@redux/recipes/actions';
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background,
  },
});


/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  meals: state.recipe.meals || [],
});

// Any actions to map to the component?
const mapDispatchToProps = {
  getMeals: RecipeActions.getMeals,
};



/* Component ==================================================================== */
class AppWebView extends Component {
  static componentName = 'AppWebView';

  static propTypes = {
    url: PropTypes.string.isRequired,
    onNavigationStateChange: PropTypes.func,
  }

  static defaultProps = {
    onNavigationStateChange: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      webViewURL: props.url || null,
    };
  }
  
 
    getThisMealsRecipes = (allRecipes) => {
     console.log("RECIEPT", this.props.outcometype);
  }

  componentDidMount = () => {

    this.getThisMealsRecipes(this.props.meals)

    // Wait until interaction has finished before loading the webview in
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loading: false });
    });
  }

  /**
    * Each time page loads, update the URL
    */
  onNavigationStateChange = (navState) => {
    this.state.webViewURL = navState.url;
    if (this.props.onNavigationStateChange) this.props.onNavigationStateChange(navState.url);
  }

  render = () => {
    const { webViewURL, loading } = this.state;

    if (loading) return <Loading />;
    if (!webViewURL) return <Error type={'URL not defined.'} />;

    return (
      <WebView
        scalesPageToFit
        startInLoadingState
        source={{ uri: webViewURL }}
        automaticallyAdjustContentInsets={false}
        style={[AppStyles.container, styles.container]}
        onNavigationStateChange={this.onNavigationStateChange}
      />
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(AppWebView);