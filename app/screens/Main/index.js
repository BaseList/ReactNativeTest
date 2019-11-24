import React, {Component} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Animated,
  Dimensions,
  PermissionsAndroid,
  BackAndroid,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as memberActions from './../../store/reducers/MemberAction';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, MainItem, FilterSort} from '@components';
import styles from './styles';
import * as Utils from '@utils';

// Load sample data
var {height, width} = Dimensions.get('window');
const ASPECT_RATIO = width / height;

class Main extends Component {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    // Temp data define
    this.state = {
      refreshing: false,
      loading: false,
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        40,
      ),
      modeView: 'grid',
      term: '',
    };

    this.onChangeView = this.onChangeView.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
  }

  componentDidMount() {
    // this.props.actions.retriveList(this.state.term, '-122.399972', '37.786882');
    try {
      const granted = (async () => {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'Aplikasi Membutuhkan akses lokasi Anda, ' +
              'sehingga kamu dapat menggunakan aplikasi ini.',
            buttonNeutral: 'Nanti',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      })();
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            this.props.actions.retriveList(
              this.state.term,
              position.coords.longitude,
              position.coords.latitude,
            );
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  onChangeSort() {}
  onFilter() {
    const {navigation} = this.props;
    navigation.navigate('Filter');
  }
  onChangeView() {
    let {modeView} = this.state;
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        this.setState({
          modeView: 'grid',
        });
        break;
      case 'grid':
        this.setState({
          modeView: 'list',
        });
        break;
      case 'list':
        this.setState({
          modeView: 'block',
        });
        break;
      default:
        this.setState({
          modeView: 'block',
        });
        break;
    }
  }

  _viewDetail = info => {
    const {navigation} = this.props;
    // alert(infoProvider.id);
    navigation.navigate('Detail', {
      item: info.id,
    });
  }

  renderContent() {
    const {modeView, refreshing, clampedScroll} = this.state;
    const {navigation, resultList} = this.props;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingBottom: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[BaseColor.primaryColor]}
                  tintColor={BaseColor.primaryColor}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: this.state.scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={resultList}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <MainItem
                  block
                  image={item.image_url}
                  name={item.name}
                  location=""
                  price={item.price}
                  available=""
                  rate={item.rating}
                  rateStatus=""
                  numReviews={item.review_count}
                  services=""
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => this._viewDetail(item)}
                  onPressTag={() => navigation.navigate('Review')}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}
            />
          </View>
        );
      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingBottom: 20,
              }}
              columnWrapperStyle={{
                marginHorizontal: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[BaseColor.primaryColor]}
                  tintColor={BaseColor.primaryColor}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: this.state.scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              numColumns={2}
              data={resultList}
              key={'grid'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <MainItem
                  grid
                  image={item.image_url}
                  name={item.name}
                  location=""
                  price={item.price}
                  available=""
                  rate={item.rating}
                  rateStatus=""
                  numReviews={item.review_count}
                  services=""
                  onPress={() => this._viewDetail(item)}
                  style={{
                    marginBottom: 10,
                    marginLeft: index % 2 ? 15 : 0,
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}
            />
          </View>
        );
      case 'list':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingBottom: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[BaseColor.primaryColor]}
                  tintColor={BaseColor.primaryColor}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: this.state.scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={resultList}
              key={'list'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <MainItem
                  list
                  image={item.image_url}
                  name={item.name}
                  location=""
                  price={item.price}
                  available=""
                  rate={item.rating}
                  rateStatus=""
                  numReviews={item.review_count}
                  services=""
                  rateCount=""
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 20,
                  }}
                  onPress={() => {
                    this._viewDetail(item);
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}
            />
          </View>
        );
      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingBottom: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[BaseColor.primaryColor]}
                  tintColor={BaseColor.primaryColor}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: this.state.scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={resultList}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <MainItem
                  block
                  image={item.image}
                  name={item.name}
                  location=""
                  price={item.price}
                  available={item.available}
                  rate={item.rate}
                  rateStatus={item.rateStatus}
                  numReviews={item.numReviews}
                  services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => this._viewDetail(item)}
                  onPressTag={() => navigation.navigate('Preview')}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}
            />
          </View>
        );
    }
  }

  onSearch(keyword) {
    this.props.actions.retriveList(keyword, '-122.399972', '37.786882');
  }

  render() {
    const {term} = this.state;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
        <Header title="Yulp Fusion" subTitle="M. Adi Putra" />
        <View style={{padding: 20}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={BaseStyle.textInput}
              onChangeText={text => this.setState({term: text})}
              autoCorrect={false}
              placeholder="Search..."
              placeholderTextColor={BaseColor.grayColor}
              value={term}
              selectionColor={BaseColor.primaryColor}
              onSubmitEditing={() => {
                this.onSearch(term);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  term: '',
                });
              }}
              style={styles.btnClearSearch}>
              <Icon name="times" size={18} color={BaseColor.grayColor} />
            </TouchableOpacity>
          </View>
        </View>
        {this.renderContent()}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    resultList: state.members.resultList,
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
)(Main);
