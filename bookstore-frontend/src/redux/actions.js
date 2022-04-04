import { } from "constants/actionTypes";
import {
    GET_ALL_BOOKS_REQUEST,
    GET_ALL_BOOKS_SUCCESS,
    GET_ALL_BOOKS_FAILURE,
    GET_BOOK_DETAILS_REQUEST,
    GET_BOOK_DETAILS_SUCCESS,
    GET_BOOK_DETAILS_FAILURE,
    SET_FAVORITE
} from "constants/actionTypes";

export const getAllBooksRequest = () => ({
    type: GET_ALL_BOOKS_REQUEST,
    payload: {},
});

export const getAllBooksSuccess = (books) => ({
    type: GET_ALL_BOOKS_SUCCESS,
    payload: { books }
})

export const getAllBooksFailure = (error) => ({
    type: GET_ALL_BOOKS_FAILURE,
    payload: { error }
})

export const getBookDetailsRequest = (isbn) => ({
    type: GET_BOOK_DETAILS_REQUEST,
    payload: { isbn }
})

export const getBookDetailsSuccess = (book) => ({
    type: GET_BOOK_DETAILS_SUCCESS,
    payload: { book }
})

export const getBookDetailsFailure = (error) => ({
    type: GET_BOOK_DETAILS_FAILURE,
    payload: { error }
})

export const setFavorite = (isbn) => ({
    type: SET_FAVORITE,
    payload: { isbn }
})