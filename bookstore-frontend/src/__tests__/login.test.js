import { render, fireEvent, screen } from 'utils/test-utils'
import Login from 'pages/Login'

describe("Login Page", () => {
    test("Emial is required", () => {
        render(<Login />)
        fireEvent.click(screen.getByText('Sign in'))
        expect(screen.getByText('*Invalid Email')).toBeTruthy()
    })
    test("Valid Emial is required", () => {
        render(<Login />)
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'abcd' } })
        fireEvent.click(screen.getByText('Sign in'))
        expect(screen.getByText('*Invalid Email')).toBeTruthy()
    })
    test("Password must be at least 8 characters", () => {
        render(<Login />)
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } })
        fireEvent.click(screen.getByText('Sign in'))
        expect(screen.getByText('*Password must be at least 8 characters')).toBeTruthy()
    })
    test("Password must contain at least 1 letter and 1 number", () => {
        render(<Login />)
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'abcdefgh' } })
        fireEvent.click(screen.getByText('Sign in'))
        expect(screen.getByText('*Password must contain at least 1 letter and 1 number')).toBeTruthy()
    })
})