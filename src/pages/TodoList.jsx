import { useEffect, useRef, useState } from "react";

const API_URL = "https://todo-list-backend-two-tan.vercel.app/api";

function TodoList({ user, token, onLogout, onOpenPosts }) {
  const [taskInput, setTaskInput] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  const [savedName, setSavedName] = useState(user.name || "");
  const [nameInput, setNameInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(!user.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const nameInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [status, setStatus] = useState("null");
  const limit = 5;
  const [totalTasks, setTotalTasks] = useState(0);

  // GET: Load tasks with pagination, sorting and filtering
  useEffect(() => {
    async function getTasks() {
      try {
        const offset = (page - 1) * limit;

        const response = await fetch(
          `${API_URL}/tasks?offset=${offset}&limit=${limit}&sortBy=${sortBy}&order=${order}&status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load tasks");
        }

        setTasks(data.tasks);
        setHasMore(data.hasMore);
        setTotalTasks(data.totalTasks);
      } catch (error) {
        alert(error.message);
      }
    }

    getTasks();
  }, [token, page, refreshTasks, sortBy, order, status]);

  // Focus name input when popup or edit form opens
  useEffect(() => {
    if (showWelcome || isEditingName) {
      nameInputRef.current?.focus();
    }
  }, [showWelcome, isEditingName]);

  // Save or update name in MongoDB
  async function handleSaveName(event) {
    event.preventDefault();

    const name = nameInput.trim();

    if (name === "") return;

    try {
      const response = await fetch(`${API_URL}/auth/name`, {
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
      setNameInput("");
      setShowWelcome(false);
      setIsEditingName(false);
    } catch (error) {
      alert(error.message);
    }
  }

  // POST: Add new task
  async function addTask(event) {
    event.preventDefault();

    if (taskInput.trim() === "") return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskInput.trim(),
          description: description.trim(),
        }),
      });

      const newTask = await response.json();

      if (!response.ok) {
        throw new Error(newTask.message || "Task could not be added");
      }

      setPage(1);
      setRefreshTasks((prev) => prev + 1);
      setTaskInput("");
      setDescription("");
    } catch (error) {
      alert(error.message);
    }
  }

  // PATCH: Update task
  async function toggleTask(id, completed) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
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

  // DELETE: Soft delete task
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Task could not be deleted");
      }

      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setRefreshTasks((prev) => prev + 1);
      }
    } catch (error) {
      alert(error.message);
    }
  }
  async function getProfile() {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get profile");
      }

      setProfile(data);
      setShowProfile(true);
    } catch (error) {
      alert(error.message);
    }
  }
  const totalPages = Math.max(1, Math.ceil(totalTasks / limit));
  return (
    <>
      <div className="container todo-page">
        <h1>My Todo List</h1>

        <div className="name-section">
          <p>Welcome, {savedName || user.email}!</p>

          {!showWelcome && (
            <button
              type="button"
              onClick={() => {
                setNameInput(savedName);
                setIsEditingName(true);
              }}
            >
              Edit Name
            </button>
          )}
        </div>

        {isEditingName && (
          <form onSubmit={handleSaveName}>
            <input
              ref={nameInputRef}
              type="text"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Enter your new name"
              required
            />

            <button type="submit">Save Name</button>

            <button
              type="button"
              onClick={() => {
                setIsEditingName(false);
                setNameInput("");
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <p>Stay organized, get things done!</p>

        <div className="header-buttons">
          <button onClick={getProfile}>My Profile</button>
          <button onClick={onLogout}>Logout</button>
          <button onClick={onOpenPosts}>Open Posts Manager</button>
        </div>
        {showProfile && profile && (
          <div className="profile-box">
            <h2>My Profile</h2>

            <p>Name: {profile.name || "Not added"}</p>
            <p>Email: {profile.email}</p>
            <p>ID: {profile.id}</p>

            <button onClick={() => setShowProfile(false)}>Close Profile</button>
          </div>
        )}

        {/* Add Task Form */}
        <form onSubmit={addTask}>
          <input
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="Write a task..."
          />

          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write description..."
          />

          <button type="submit">Add Task</button>
        </form>

        {/* Sorting and Filtering */}
        <div className="task-filters">
          <label>
            Sort By:
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
            >
              <option value="title">Title</option>
              <option value="createdAt">Created At</option>
            </select>
          </label>

          <label>
            Order:
            <select
              value={order}
              onChange={(event) => {
                setOrder(event.target.value);
                setPage(1);
              }}
            >
              <option value="asc">Ascending (A-Z / Earliest)</option>
              <option value="desc">Descending (Z-A / Latest)</option>
            </select>
          </label>

          <label>
            Status:
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="null">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="todo">Todo</option>
            </select>
          </label>
        </div>

        {/* Display Tasks */}
        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-card" key={task._id}>
              <div className="task-details">
                <label className="task-heading">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id, task.completed)}
                  />

                  <span className={task.completed ? "completed" : ""}>
                    {task.title}
                  </span>
                </label>

                <p className="task-description">{task.description}</p>
              </div>

              <div className="task-meta">
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(task.createdAt).toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      task.completed ? "status-completed" : "status-todo"
                    }
                  >
                    {task.completed ? "Completed" : "Todo"}
                  </span>
                </p>
              </div>

              <button
                className="delete-task-btn"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Pagination Buttons */}
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button onClick={() => setPage(page + 1)} disabled={!hasMore}>
            Next
          </button>
        </div>
      </div>

      {/* Welcome Popup */}
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
