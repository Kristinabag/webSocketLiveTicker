import { combineReducers } from "redux";
import dataReducer from "./bookData";

const rootReducer = combineReducers({
  bookData: dataReducer,
});

export default rootReducer;
