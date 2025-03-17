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

const Register = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { register: userData } }) {
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

  function registerUser() {
    addUser();
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
            Create New Account
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
              icon="mail"
              iconPosition="left"
              label="Email"
              placeholder="Email..."
              name="email"
              type="email"
              value={values.email}
              error={errors.email ? true : false}
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
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              label="Confirm Password"
              placeholder="Confirm Password..."
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              error={errors.confirmPassword ? true : false}
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
              Register
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
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#FF7A45" }}>
              Sign In
            </Link>
          </Message>
        </Segment>
      </div>
    </Container>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
