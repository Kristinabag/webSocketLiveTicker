import { LOAD_BOOK_DATA } from "../types/loadBookData";

const dataReducer = (state = {}, action) => {
  switch (action?.type) {
    case LOAD_BOOK_DATA:
      return action.payload;

    default:
      return state;
  }
};

export default dataReducer;
