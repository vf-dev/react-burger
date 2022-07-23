import { combineReducers } from 'redux';
import { ingredientsReducer } from './ingredientsReducer';
import { burgerConstructorReducer } from './burgerConstructorReducer';
import { authReducer } from './authReducer';
import { orderFeedReducer } from './orderFeedReducer';

export const RootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burger: burgerConstructorReducer,
  auth: authReducer,
  feed: orderFeedReducer
})
