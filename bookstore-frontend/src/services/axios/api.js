import { getClient } from "./apiConfig";

const getBooksAPI = () => {
    return getClient().get("/search/mongodb");
};

const getDetailsAPI = (isbn) => {
    return getClient().get(`/books/${isbn}`);
}

export {
    getBooksAPI,
    getDetailsAPI
}