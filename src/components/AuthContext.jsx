import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const signup = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    setCurrentUser(userWithoutPassword);
    sessionStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    setCurrentUser(userWithoutPassword);
    sessionStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
