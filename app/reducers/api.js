import * as ActionType from '../actions/api';

let defaultState =  {
  formData: null,
}

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_FORMDATA:
      return Object.assign({}, state, {
        formData: action.formData
      })
    default:
      return state
  }
}

