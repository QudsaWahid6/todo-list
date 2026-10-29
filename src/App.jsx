import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TodoList from "./pages/TodoList";
import Posts from "./pages/Posts";

import "./App.css";

function App() {
  const { user, signup, login, logout } = useContext(AuthContext);

  const [page, setPage] = useState("landing");

  async function handleSignup(event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    try {
      await signup(email, password);
      alert("Signup successful! Now login with your account.");
      setPage("login");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    try {
      await login(email, password);
      setPage("todo");
    } catch (error) {
      alert(error.message);
    }
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

  if (page === "signup") {
    return <Signup onSignup={handleSignup} onLogin={() => setPage("login")} />;
  }

  if (page === "login") {
    return <Login onLogin={handleLogin} onSignup={() => setPage("signup")} />;
  }

  return <Landing onGetStarted={() => setPage("signup")} />;
}

export default App;
