import * as ActionType from '../actions/api';

const defaultState = {
  formData: null,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionType.SET_FORMDATA:
      return Object.assign({}, state, {
        formData: action.formData,
      });
    default:
      return state;
  }
}

