import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Form,
  Container,
  Header,
  Segment,
  Message,
  Divider,
} from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const Login = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      context.login(userData);
      navigate("/", {
        replace: true,
      });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <Container text>
      <div
        className="form-container"
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <Segment
          raised
          padded
          style={{
            background: "#F5F8FC",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <Header as="h1" textAlign="center" style={{ color: "#0D2B4B" }}>
            Login to Your Account
            <Divider
              style={{
                borderColor: "#FF7A45",
                width: "60px",
                margin: "0.5rem auto",
              }}
            />
          </Header>
          <Form
            size="large"
            onSubmit={onSubmit}
            noValidate
            className={loading ? "loading" : ""}
          >
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              label="Username"
              placeholder="Username..."
              name="username"
              type="text"
              value={values.username}
              error={errors.username ? true : false}
              onChange={onChange}
            />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              label="Password"
              placeholder="Password..."
              name="password"
              type="password"
              value={values.password}
              error={errors.password ? true : false}
              onChange={onChange}
            />
            <Button
              type="submit"
              fluid
              size="large"
              style={{
                backgroundColor: "#0D2B4B",
                color: "white",
              }}
              disabled={loading}
            >
              Login
            </Button>
          </Form>

          {Object.keys(errors).length > 0 && (
            <Message error>
              <ul className="list" style={{ padding: 0 }}>
                {Object.values(errors).map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </Message>
          )}

          <Message>
            New to us?{" "}
            <Link to="/register" style={{ color: "#FF7A45" }}>
              Sign Up
            </Link>
          </Message>
        </Segment>
      </div>
    </Container>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
