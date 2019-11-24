import axios from 'axios';
import * as types from './ActionType';
import {BaseSetting} from './../../config/setting';

const config = {
  headers: {Authorization: 'bearer ' + BaseSetting.apiKeyYelp},
};

export function retrieveListSuccess(res) {
  return {
    type: types.RETRIEVE_LIST_SUCCESS,
    resultList: res.data.businesses,
  };
}

export function retriveList(term, longitude, latitude) {
  console.log('test',`${BaseSetting.apiUrl}search?latitude=${latitude}&longitude=${longitude}&term=${term}`);
  return function(dispatch) {
    return axios
      .get(
        `${BaseSetting.apiUrl}search?latitude=${latitude}&longitude=${longitude}&term=${term}`,
        config,
      )
      .then(res => {
        dispatch(retrieveListSuccess(res));
      })
      .catch(error => {
        console.log('List', error);
      });
  };
}

// Detail
export function retrieveDetailSuccess(res) {
  return {
    type: types.RETRIEVE_DETAILS_SUCCESS,
    resultDetail: res.data,
  };
}

export function retrieveDetail(id) {
  console.log('test',`${BaseSetting.apiUrl}${id}`);
  return function(dispatch) {
    return axios
      .get(`${BaseSetting.apiUrl}${id}`, config,)
      .then(res => {
        dispatch(retrieveDetailSuccess(res));
      })
      .catch(error => {
        console.log('Detail', error);
      });
  };
}
