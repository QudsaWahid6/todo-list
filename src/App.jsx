import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user, login, logout } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [taskInput, setTaskInput] = useState("");

  const [showWelcome, setShowWelcome] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savedName, setSavedName] = useState(
    () => localStorage.getItem("todoUserName") || "",
  );

  const nameInputRef = useRef(null);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("todoTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (user && showWelcome) {
      nameInputRef.current?.focus();
    }
  }, [user, showWelcome]);

  function handleLogin(event) {
    event.preventDefault();
    login(email, password);
    setShowWelcome(true);
  }

  function handleSaveName(event) {
    event.preventDefault();

    const name = nameInput.trim();

    if (name === "") return;

    localStorage.setItem("todoUserName", name);
    setSavedName(name);
    setShowWelcome(false);
  }

  function handleCloseWelcome() {
    setShowWelcome(false);
  }

  function addTask(event) {
    event.preventDefault();

    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: taskInput,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskInput("");
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  if (!user) {
    return (
      <div className="container">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="container welcome-popup">
        <h1>Welcome to Todo List!</h1>

        <p>Please enter your name to continue.</p>

        <form onSubmit={handleSaveName}>
          <input
            ref={nameInputRef}
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Enter your name"
            required
          />

          <button type="submit">Save</button>

          <button type="button" onClick={handleCloseWelcome}>
            Close
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Todo List</h1>

      <p>Welcome, {savedName || user.email}!</p>
      <p>Logged in as: {user.email}</p>

      <button onClick={logout}>Logout</button>

      <form onSubmit={addTask}>
        <input
          type="text"
          value={taskInput}
          onChange={(event) => setTaskInput(event.target.value)}
          placeholder="Write a task"
        />

        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />

              <span className={task.completed ? "completed" : ""}>
                {task.title}
              </span>
            </label>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
