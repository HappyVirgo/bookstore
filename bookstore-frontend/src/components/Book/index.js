import React from 'react'
import { connect } from 'react-redux'
import { Card, CardBody, Row, CardTitle, Col, Button } from 'reactstrap'
import { getBookDetailsRequest } from 'redux/actions'
import Favorite from './Favorite'
import './index.scss'

const Book = ({ book, errorDetails, getBookDetailsRequest, open, setOpen }) => {
  return (
    <Card className="card-stats mt-4 mb-xl-0 h-100">
      <CardBody>
        <Row>
          <Col className="col-auto">
            <img src={book.image} alt="book" />
            <Favorite isbn={book.isbn13} className="favorite" />
          </Col>
          <div className="col">
            <CardTitle
              tag="h2"
              className="text-uppercase mb-0"
            >
              {book.title}
            </CardTitle>
            <p className="h5 font-weight-bold mb-0">
              {book.subtitle}
            </p>
            <a
              className="h5 font-weight-bold mb-0"
              style={{ textDecoration: 'underline' }}
              href={book.url}>
              Book Link
            </a>
            <br />
            <Button
              className="my-4 align-self-end"
              color="primary"
              type="button"
              data-testid={`${book.isbn13}-details`}
              onClick={() => {
                setOpen(!open);
                if (!open) {
                  getBookDetailsRequest(book.isbn13)
                }
              }}>
              Details
            </Button>
          </div>
          {Object.keys(errorDetails).length > 0
            && errorDetails.isbn === book.isbn13 &&
            <div className="h5 font-weight-bold mb-0 alert alert-danger">
              Cannot fetch Data with the error: {errorDetails.message}
            </div>
          }
        </Row>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  const { errorDetails, currentBook } = state
  return {
    errorDetails,
    currentBook,
  }
}

export default connect(mapStateToProps, {
  getBookDetailsRequest,
})(Book);