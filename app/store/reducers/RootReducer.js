import {persistCombineReducers} from 'redux-persist';
import members from './MemberReducer';
import AsyncStorage from '@react-native-community/async-storage';

const config = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = persistCombineReducers(config, {
  members,
});

export default rootReducer;
