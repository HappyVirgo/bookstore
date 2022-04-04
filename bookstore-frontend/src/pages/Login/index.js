import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  CardText,
} from "reactstrap";

const Login = () => {
  const history = useHistory();
  // State variables
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const style = {
    color: '#D8000C',
    padding: '5px 15px',
    marginBottom: '1rem',
    borderRadius: '5px',
    fontSize: '13px'
  }

  // validation
  const validate = () => {
    if (!email.match(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)) {
      setErrors({
        email: "Invalid Email"
      })
      return false
    }
    if (password.length < 8) {
      setErrors({
        password: 'Password must be at least 8 characters'
      });
      return false
    } else if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
      setErrors({
        password: 'Password must contain at least 1 letter and 1 number'
      });
      return false
    }
    setErrors({})
    return true
  }
  const signIn = () => {
    if (validate()) {
      history.push('/books')
    }
  }
  return (
    <div className="w-100 d-flex align-items-center justify-content-center bg-primary bg-gradient" style={{ height: '100vh' }}>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    data-testid="email-input"
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </InputGroup>
                {errors.email && <div style={style}>*{errors.email}</div>}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    data-testid="password-input"
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </InputGroup>
                {errors.password && <div style={style}>*{errors.password}</div>}
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={signIn}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
