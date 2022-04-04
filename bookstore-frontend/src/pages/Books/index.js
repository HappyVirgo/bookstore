import React, { useEffect, useState } from "react";
import { connect } from 'react-redux'
// reactstrap components
import { Row, Col, Container } from "reactstrap";
// core components
import Book from 'components/Book'
//
import { getAllBooksRequest } from 'redux/actions'
import './index.scss'

const Books = ({ books, loading, error, getAllBooksRequest, currentBook, loadingDetails }) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    getAllBooksRequest()
  }, [])

  return (
    <Container>
      <h2 className="text-center p-4">WELCOME TO MY BOOKSTORE!</h2>
      {loading
        ? <div>Loading...</div>
        : error
          ? <div>{error}</div>
          : <Row>
            {books.map((book, idx) =>
              <Col lg="4" md="6" sm="12" className="py-4" key={book.isbn13}>
                <Book idx={idx} book={book} open={open} setOpen={setOpen} />
              </Col>
            )}
          </Row>
      }
      {open && <div className="modalWrapper" onClick={() => setOpen(false)}>
        <div className="modalBody p-4" onClick={(e) => e.stopPropagation()}>
          {Object.keys(loadingDetails).length === 0 ? <div className="modalContent">
            <div className="mb-4 d-flex align-items-center justify-content-between border border-dark border-top-0 border-left-0 border-right-0">
              <h2 className="m-0 pr-2">{currentBook.title}</h2>
              <p className="text-right m-0" onClick={() => setOpen(false)}><i className="fas fa-times"></i></p>
            </div>
            <p><strong>{currentBook.authors}</strong>&nbsp;({currentBook.pages} pages, {currentBook.price})</p>
            <p>{currentBook.desc}</p>
          </div> : <div>Loading Details...</div>}
        </div>
      </div>}
    </Container>
  );
};

const mapStateToProps = (state) => {
  const { books, loading, error, currentBook, loadingDetails } = state
  return {
    books,
    loading,
    error,
    currentBook,
    loadingDetails
  }
}

export default connect(mapStateToProps, {
  getAllBooksRequest
})(Books);
