import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import TodoList from "./pages/TodoList";

import "./App.css";

function App() {
  const { user, login, logout } = useContext(AuthContext);

  const [page, setPage] = useState("landing");

  function handleLogin(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    login(email, password);
    setPage("todo");
  }

  function handleLogout() {
    logout();
    setPage("landing");
  }

  if (user && page === "todo") {
    return <TodoList user={user} onLogout={handleLogout} />;
  }

  if (page === "login") {
    return <Login onLogin={handleLogin} />;
  }

  return <Landing onGetStarted={() => setPage("login")} />;
}

export default App;
