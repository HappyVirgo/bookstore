import { GET_ALL_BOOKS_REQUEST, GET_BOOK_DETAILS_REQUEST } from "constants/actionTypes";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
  getBooksAPI,
  getDetailsAPI
} from "services/axios/api";

import {
  getAllBooksSuccess,
  getAllBooksFailure,
  getBookDetailsSuccess,
  getBookDetailsFailure,
} from "./actions";

const getAllBooksAsync = async () =>
  await getBooksAPI()
    .then((result) => result)

const getDetailsAsync = async (isbn) =>
  await getDetailsAPI(isbn)
    .then(result => result)

function* getAllBooks() {
  try {
    const result = yield call(getAllBooksAsync)
    if (result.status === 200) {
      yield put(getAllBooksSuccess(result.data.books))
    }
  } catch (error) {
    yield put(getAllBooksFailure(error.message))
  }
}

function* getDetails({ payload }) {
  const { isbn } = payload
  try {
    const result = yield call(getDetailsAsync, isbn)
    if (result.status === 200) {
      yield put(getBookDetailsSuccess(result.data))
    }
  } catch (error) {
    yield put(getBookDetailsFailure({
      message: error.message,
      isbn
    }))
  }
}

export function* watchGetAllBooks() {
  yield takeEvery(GET_ALL_BOOKS_REQUEST, getAllBooks)
}

export function* watchGetBookDetails() {
  yield takeEvery(GET_BOOK_DETAILS_REQUEST, getDetails)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAllBooks),
    fork(watchGetBookDetails),
  ]);
}