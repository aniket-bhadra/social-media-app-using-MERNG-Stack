// auth.js
import React, { useReducer, createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

// Define default values for all context properties
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  recentLike: [], // Make sure this is initialized as an empty array
  setRecentLike: () => {},
  addLikedPost: () => {},
  removeLikedPost: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize recentLike from localStorage if available
  const [recentLike, setRecentLike] = useState(() => {
    try {
      const savedLikes = localStorage.getItem("recentLikes");
      return savedLikes ? JSON.parse(savedLikes) : [];
    } catch (error) {
      console.error("Error loading recent likes from localStorage:", error);
      return []; // Return empty array if there's an error
    }
  });

  // Save recentLike to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("recentLikes", JSON.stringify(recentLike || []));
    } catch (error) {
      console.error("Error saving recent likes to localStorage:", error);
    }
  }, [recentLike]);

  function login(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("recentLikes"); // Clear liked posts on logout
    setRecentLike([]);
    dispatch({
      type: "LOGOUT",
    });
  }

  // Add new liked post
  function addLikedPost(post) {
    setRecentLike((prevLikes) => {
      const safeList = prevLikes || [];
      // Check if post already exists to avoid duplicates
      const exists = safeList.some((like) => like.postId === post.postId);
      if (!exists) {
        return [...safeList, post];
      }
      return safeList;
    });
  }

  // Remove liked post
  function removeLikedPost(postId) {
    setRecentLike((prevLikes) => {
      const safeList = prevLikes || [];
      return safeList.filter((like) => like.postId !== postId);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        recentLike: recentLike || [], // Ensure we always provide an array
        setRecentLike,
        addLikedPost,
        removeLikedPost,
      }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
