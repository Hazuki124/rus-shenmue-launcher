import { all, fork } from 'redux-saga/effects';
import home from './home';

export default function* rootSaga() {
  yield all([fork(home)]);
}
