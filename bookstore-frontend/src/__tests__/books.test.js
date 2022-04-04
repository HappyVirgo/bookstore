import { render, fireEvent, screen, cleanup } from 'utils/test-utils'
import { books, bookDetails } from 'constants/mockData'
import Books from 'pages/Books'
const isbn1 = `${books[0].isbn13}-details`
const title1 = books[0].title
const authors = bookDetails.authors
const desc1 = bookDetails.desc

describe("Books Page", () => {
  afterEach(cleanup)
  test("should show loading text while fetching data", async () => {
    render(<Books />)
    expect(screen.getByText('WELCOME TO MY BOOKSTORE!')).toBeTruthy()
    expect(screen.getByText('Loading...')).toBeTruthy()
    await screen.findByTestId(isbn1)
    expect(screen.getByText(title1)).toBeTruthy()
  })
  test("should show loading details modal when click Details button", async () => {
    render(<Books />)
    await screen.findByTestId(isbn1)
    fireEvent.click(screen.getByTestId(isbn1))
    expect(screen.getByText('Loading Details...')).toBeTruthy()
  })
  test("should show loading details modal when click Details button", async () => {
    render(<Books />)
    await screen.findByTestId(isbn1)
    fireEvent.click(screen.getByTestId(isbn1))
    await screen.findByText(authors)
    expect(screen.getByText(desc1)).toBeTruthy()
  })
})