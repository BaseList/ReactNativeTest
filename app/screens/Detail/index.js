import React, {Component} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as memberActions from './../../store/reducers/MemberAction';

import {BaseStyle, BaseColor, Images} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  Button,
} from '@components';
import * as Utils from '@utils';
import styles from './styles';

class Detail extends Component {
  constructor(props) {
    super(props);

    // Temp data define
    this.state = {
      heightHeader: Utils.heightHeader(),
    };
    this._deltaY = new Animated.Value(0);
  }

  componentDidMount() {
    const {navigation} = this.props;
    const id = navigation.getParam('item');
    this.props.actions.retrieveDetail(id);
  }

  render() {
    const {navigation, resultDetail} = this.props;
    const {heightHeader} = this.state;
    const heightImageBanner = Utils.scaleWithPixel(250, 1);
    const marginTopBanner = heightImageBanner - heightHeader - 40;

    return (
      <View style={{flex: 1}}>
        <Animated.Image
          source={{uri: resultDetail.image_url}}
          style={[
            styles.imgBanner,
            {
              height: this._deltaY.interpolate({
                inputRange: [
                  0,
                  Utils.scaleWithPixel(200),
                  Utils.scaleWithPixel(200),
                ],
                outputRange: [heightImageBanner, heightHeader, heightHeader],
              }),
            },
          ]}
        />
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          forceInset={{top: 'always'}}>
          {/* Header */}
          <Header
            title=""
            renderLeft={() => {
              return (
                <Icon
                  name="arrow-left"
                  size={20}
                  color={BaseColor.whiteColor}
                />
              );
            }}
            renderRight={() => {
              return (
                <Icon name="images" size={20} color={BaseColor.whiteColor} />
              );
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
            onPressRight={() => {
              // navigation.navigate('PreviewImage');
            }}
          />
          <ScrollView
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {y: this._deltaY},
                },
              },
            ])}
            onContentSizeChange={() =>
              this.setState({
                heightHeader: Utils.heightHeader(),
              })
            }
            scrollEventThrottle={8}>
            {/* Main Container */}
            <View style={{paddingHorizontal: 20}}>
              {/* Information */}
              <View
                style={[styles.contentBoxTop, {marginTop: marginTopBanner}]}>
                <Text title2 semibold style={{marginBottom: 7}}>
                  {resultDetail.name}
                </Text>
                <StarRating
                  disabled={true}
                  starSize={14}
                  maxStars={5}
                  rating={resultDetail.rating}
                  selectedStar={rating => {}}
                  fullStarColor={BaseColor.yellowColor}
                />
                <Text
                  body2
                  style={{
                    marginTop: 7,
                    textAlign: 'center',
                  }}>
                  {resultDetail.review_count}
                </Text>
                <View>
                  <Text title3 primaryColor semibold>
                    {resultDetail.price}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    resultDetail: state.members.resultDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Detail);
