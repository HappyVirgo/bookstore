import {
  GET_ALL_BOOKS_REQUEST,
  GET_ALL_BOOKS_SUCCESS,
  GET_ALL_BOOKS_FAILURE,
  GET_BOOK_DETAILS_REQUEST,
  GET_BOOK_DETAILS_SUCCESS,
  GET_BOOK_DETAILS_FAILURE,
  SET_FAVORITE
} from "constants/actionTypes";

const INIT_STATE = {
  books: [],
  currentBook: {},
  loading: false,
  loadingDetails: {},
  error: '',
  errorDetails: {},
  favoriteList: [],
}

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALL_BOOKS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_ALL_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        books: action.payload.books,
        error: ''
      }
    case GET_ALL_BOOKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    case GET_BOOK_DETAILS_REQUEST:
      return {
        ...state,
        loadingDetails: { loading: true, isbn: action.payload.isbn }
      }
    case GET_BOOK_DETAILS_SUCCESS:
      return {
        ...state,
        loadingDetails: {},
        currentBook: action.payload.book,
        errorDetails: {}
      }
    case GET_BOOK_DETAILS_FAILURE:
      return {
        ...state,
        loadingDetails: {},
        errorDetails: action.payload.error,
      }
    case SET_FAVORITE:
      if (!state.favoriteList.includes(action.payload.isbn)) {
        return {
          ...state,
          favoriteList: [
            ...state.favoriteList,
            action.payload.isbn
          ]
        }
      } else {
        return {
          ...state,
          favoriteList: [
            ...state.favoriteList.filter(isbn => isbn !== action.payload.isbn),
          ]
        }
      }
    default:
      return {
        ...state
      }
  }
}

export default reducer;