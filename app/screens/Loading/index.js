import React, {Component} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Images, BaseColor} from '@config';
import SplashScreen from 'react-native-splash-screen';
import {Image, Text} from '@components';
import styles from './styles';

export default class Loading extends Component {
  constructor(props) {
    super(props);
  }

  onProcess() {
    SplashScreen.hide();
    let {navigation} = this.props;
    setTimeout(() => {
      navigation.navigate('Main');
    }, 500);
  }

  componentDidMount() {
    this.onProcess();
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
        <View
          style={{
            position: 'absolute',
            top: 220,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text title1 whiteColor semibold>
            Project Test
          </Text>
          <ActivityIndicator
            size="large"
            color={BaseColor.whiteColor}
            style={{
              marginTop: 20,
            }}
          />
        </View>
      </View>
    );
  }
}
