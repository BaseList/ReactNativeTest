import * as types from './ActionType';
import initialState from './InitialState';

export default function(state = initialState.members, action) {
  switch (action.type) {
    case types.RETRIEVE_LIST_SUCCESS:
      return {
        ...state,
        resultList: action.resultList,
      };
    case types.RETRIEVE_DETAILS_SUCCESS:
      return {
        ...state,
        resultDetail: action.resultDetail,
      };
    default:
      return state;
  }
}
