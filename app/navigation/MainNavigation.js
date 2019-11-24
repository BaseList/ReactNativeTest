import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {BaseColor, BaseStyle} from '@config';
import {Icon} from '@components';
import * as Utils from '@utils';

import Main from '@screens/Main';
import Detail from '@screens/Detail';

// Transition for navigation by screen name
const handleCustomTransition = ({scenes}) => {
  const nextScene = scenes[scenes.length - 1].route.routeName;
  switch (nextScene) {
    case 'PreviewImage':
      Utils.enableExperimental();
      return Utils.zoomIn();
    default:
      return false;
  }
};

// Config for bottom navigator
const bottomTabNavigatorConfig = {
  initialRouteName: 'Home',
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    activeTintColor: BaseColor.primaryColor,
    inactiveTintColor: BaseColor.grayColor,
    style: BaseStyle.tabBar,
    labelStyle: {
      fontSize: 12,
    },
  },
};

const routeConfigs = {
  Home: {
    screen: Main,
    navigationOptions: ({navigation}) => ({
      title: 'Home',
      tabBarIcon: ({focused, tintColor}) => {
        return <Icon color={tintColor} name="home" size={20} solid />;
      },
    }),
  },
};

// Define bottom navigator as a screen in stack
const BottomTabNavigator = createBottomTabNavigator(
  routeConfigs,
  bottomTabNavigatorConfig,
);

//Main Stack View App
const StackNavigator = createStackNavigator(
  {
    BottomTabNavigator: {
      screen: BottomTabNavigator,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'BottomTabNavigator',
  },
);

// Define Root Stack support Modal Screen
const RootStack = createStackNavigator(
  {
    StackNavigator: {
      screen: StackNavigator,
    },
    Detail: {
      screen: Detail
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: 'StackNavigator',
    transitionConfig: screen => {
      return handleCustomTransition(screen);
    },
  },
);

export default RootStack;
