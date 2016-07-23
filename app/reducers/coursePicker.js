import * as ActionType from '../actions/shoppingCart';
import Immutable from 'immutable';

let defaultState = Immutable.fromJS({
  ccn: "",
  sections: [],
  dept: "",
  dept_number: "",
})

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_CCN:
      return state.set('ccn', action.ccn)
    default:
      return state
  }
}

