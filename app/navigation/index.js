import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import MainNavigation from './MainNavigation';
import Loading from '@screens/Loading';

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    Main: MainNavigation,
  },
  {
    initialRouteName: 'Loading',
  },
);

export default createAppContainer(AppNavigator);
