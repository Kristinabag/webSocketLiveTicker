import { LOAD_BOOK_DATA } from "../types/loadBookData";

const loadBookData = (data) => ({
  type: LOAD_BOOK_DATA,
  payload: data,
});

export { loadBookData };
