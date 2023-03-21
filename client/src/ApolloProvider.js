import React from "react";
import App from "./App";

import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/",
});

//there pass some opitions, where uri is pointing to our GraphQL server (endpoint for our server, in production it will be different)

//create client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

//cache value store any cached data

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
