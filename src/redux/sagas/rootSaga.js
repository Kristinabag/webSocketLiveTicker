import { all } from "redux-saga/effects";

// import loadBookDataSaga from './loadBookDataSaga';
import connect from "./loadBookDataSaga";

export default function* watcherAll() {
  yield all([connect()]);
}
