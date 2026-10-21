import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import TodoList from "./pages/TodoList";
import Posts from "./pages/Posts";
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
  if (user && page === "posts") {
    return <Posts user={user} onBack={() => setPage("todo")} />;
  }
  if (user && page === "todo") {
    return (
      <TodoList
        user={user}
        onLogout={handleLogout}
        onOpenPosts={() => setPage("posts")}
      />
    );
  }

  if (page === "login") {
    return <Login onLogin={handleLogin} />;
  }

  return <Landing onGetStarted={() => setPage("login")} />;
}

export default App;
