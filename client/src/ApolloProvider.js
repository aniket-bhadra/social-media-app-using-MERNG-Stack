import React from "react";
import App from "./App";

import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/",
});

//there pass some opitions, where uri is pointing to our GraphQL server (endpoint for our server, in production it will be different)

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");

  //this return will modify the current request.

  // this kind of merge the existing headers of the request with this headers object we gave. so it will just add this authorization header
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

//afterthat concatenate it to httpLink but it needs to go before httpLink, this will actually add the token to our request and allow us to successfully send any protected api calls

//create client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

//cache value store any cached data

export default (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
