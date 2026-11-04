import { useEffect, useRef, useState } from "react";

function TodoList({ user, token, onLogout, onOpenPosts }) {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const [savedName, setSavedName] = useState(user.name || "");
  const [nameInput, setNameInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(!user.name);

  const nameInputRef = useRef(null);

  // GET: Load tasks from MongoDB
  useEffect(() => {
    async function getTasks() {
      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load tasks");
        }

        setTasks(data);
      } catch (error) {
        alert(error.message);
      }
    }

    getTasks();
  }, [token]);

  useEffect(() => {
    if (showWelcome) {
      nameInputRef.current?.focus();
    }
  }, [showWelcome]);

  // Save name in MongoDB
  async function handleSaveName(event) {
    event.preventDefault();

    const name = nameInput.trim();

    if (name === "") return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/name", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Name could not be saved");
      }

      setSavedName(data.name);
      setShowWelcome(false);
    } catch (error) {
      alert(error.message);
    }
  }

  // POST: Add new task
  async function addTask(event) {
    event.preventDefault();

    if (taskInput.trim() === "") return;

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskInput.trim() }),
      });

      const newTask = await response.json();

      if (!response.ok) {
        throw new Error(newTask.message || "Task could not be added");
      }

      setTasks([...tasks, newTask]);
      setTaskInput("");
    } catch (error) {
      alert(error.message);
    }
  }

  // PATCH: Update task
  async function toggleTask(id, completed) {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      const updatedTask = await response.json();

      if (!response.ok) {
        throw new Error(updatedTask.message || "Task could not be updated");
      }

      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      alert(error.message);
    }
  }

  // DELETE: Remove task
  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Task could not be deleted");
      }

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <div className="container todo-page">
        <h1>My Todo List</h1>

        <p>Welcome, {savedName || user.email}!</p>
        <p>Stay organized, get things done!</p>

        <div className="header-buttons">
          <button onClick={onLogout}>Logout</button>
          <button onClick={onOpenPosts}>Open Posts Manager</button>
        </div>

        <form onSubmit={addTask}>
          <input
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="Write a task..."
          />

          <button type="submit">Add Task</button>
        </form>

        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id, task.completed)}
                />

                <span className={task.completed ? "completed" : ""}>
                  {task.title}
                </span>
              </label>

              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {showWelcome && (
        <div className="modal-overlay">
          <div className="welcome-modal">
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowWelcome(false)}
              aria-label="Close popup"
            >
              ×
            </button>

            <div className="welcome-icon">✓</div>

            <h1>
              Welcome to <span>Todo List!</span>
            </h1>

            <p>What's your name? It helps us personalize your experience.</p>

            <form onSubmit={handleSaveName}>
              <input
                ref={nameInputRef}
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Enter your name"
                required
              />

              <div className="modal-buttons">
                <button type="submit">Save</button>

                <button
                  type="button"
                  className="close-button"
                  onClick={() => setShowWelcome(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default TodoList;
