import { useEffect, useRef, useState } from "react";

function TodoList({ user, onLogout, onOpenPosts }) {
  const taskStorageKey = `todoTasks_${user.email.toLowerCase()}`;
  const nameStorageKey = `todoUserName_${user.email.toLowerCase()}`;

  const [taskInput, setTaskInput] = useState("");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(taskStorageKey);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [savedName, setSavedName] = useState(
    () => localStorage.getItem(nameStorageKey) || "",
  );

  const [nameInput, setNameInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem(nameStorageKey),
  );

  const nameInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
  }, [tasks, taskStorageKey]);

  useEffect(() => {
    if (showWelcome) {
      nameInputRef.current?.focus();
    }
  }, [showWelcome]);

  function handleSaveName(event) {
    event.preventDefault();

    const name = nameInput.trim();

    if (name === "") return;

    localStorage.setItem(nameStorageKey, name);
    setSavedName(name);
    setShowWelcome(false);
  }

  function addTask(event) {
    event.preventDefault();

    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: taskInput.trim(),
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

  return (
    <>
      <div className="container todo-page">
        <h1>My Todo List</h1>

        <p>Welcome, {savedName || user.email}!</p>

        <p>Stay organized, get things done!</p>

        <button onClick={onLogout}>Logout</button>

        <button onClick={onOpenPosts}>Open Posts Manager</button>

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
