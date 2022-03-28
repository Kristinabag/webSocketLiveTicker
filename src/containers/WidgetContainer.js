import { connect } from "react-redux";
import Widget from "../components/Widget";
import { loadBookData } from "../redux/actions/loadBookData";
import dataReducer from "../redux/reducers/bookData";

export default connect(
  (state) => ({
    bookData: dataReducer(state.bookData),
  }),
  {
    loadBookData: loadBookData,
  }
)(Widget);
