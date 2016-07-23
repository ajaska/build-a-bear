import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';


const logger = createLogger({
  actionTransformer: (action) => (
    Object.assign({}, action, {
      type: String(action.type),
    })
  ),
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => true
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  logger
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(
    rootReducer,
    initialState
  );

  return store;
}
