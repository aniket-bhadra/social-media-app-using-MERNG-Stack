import { Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MenuBar from "./components/MenuBar";
import SinglePost from "./pages/SinglePost";

function App() {
  return (
    <AuthProvider>
      <Container>
        <MenuBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route path="/posts/:postId" element={<SinglePost />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
    </AuthProvider>
  );
}

export default App;
