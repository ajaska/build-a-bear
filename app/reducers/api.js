import * as ActionType from '../actions/api';

let defaultState =  {
  formData: null,
  isAddingToShoppingCart: false,
}

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_FORMDATA:
      return Object.assign({}, state, {
        formData: action.formData
      })
    case ActionType.REQUEST_SECTIONS:
      return Object.assign({}, state, {
        isAddingToShoppingCart: true
      })
    case ActionType.RECEIVE_COURSE_ADD:
      return Object.assign({}, state, {
        isAddingToShoppingCart: false
      })
    case ActionType.CANCELED_CART_ADD:
      return Object.assign({}, state, {
        isAddingToShoppingCart: false
      })
    default:
      return state
  }
}

