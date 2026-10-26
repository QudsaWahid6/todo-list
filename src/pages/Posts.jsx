import { useEffect, useRef, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function Posts({ user, onBack }) {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({ title: "", body: "" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);

  const titleInputRef = useRef(null);

  // GET: API se posts lana
  useEffect(() => {
    async function fetchPosts() {
      try {
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Posts load nahi ho sakin.");
        }

        const data = await response.json();
        setPosts(data.slice(0, 10));

        console.log("GET response:", data);
      } catch (error) {
        setError(error.message);
        console.log("GET error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Input fields update karna
  function handleChange(event) {
    setPost({
      ...post,
      [event.target.name]: event.target.value,
    });
  }

  // POST: Nayi post add karna
  async function addPost(event) {
    event.preventDefault();

    if (!post.title.trim() || !post.body.trim()) {
      setError("Title aur description dono likho.");
      return;
    }

    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title.trim(),
          body: post.body.trim(),
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Post add nahi ho saki.");
      }

      const result = await response.json();

      setPosts([result, ...posts]);
      setPost({ title: "", body: "" });

      console.log("POST response:", result);
      titleInputRef.current?.focus();
    } catch (error) {
      setError(error.message);
      console.log("POST error:", error);
    }
  }

  // Edit button par post form mein lana
  function startEdit(item) {
    setEditingPostId(item.id);
    setPost({ title: item.title, body: item.body });
    setError("");
    titleInputRef.current?.focus();
  }

  // PATCH: Post update karna
  async function updatePost(event) {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(`${API_URL}/${editingPostId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error("Post update nahi ho saki.");
      }

      const result = await response.json();

      setPosts(
        posts.map((item) =>
          item.id === editingPostId ? { ...item, ...result } : item,
        ),
      );

      cancelEdit();
      console.log("PATCH response:", result);
    } catch (error) {
      setError(error.message);
      console.log("PATCH error:", error);
    }
  }

  // DELETE: Post delete karna
  async function deletePost(id) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Post delete nahi ho saki.");
      }

      setPosts(posts.filter((item) => item.id !== id));

      if (editingPostId === id) {
        cancelEdit();
      }

      console.log("DELETE response received for ID:", id);
    } catch (error) {
      setError(error.message);
      console.log("DELETE error:", error);
    }
  }

  function cancelEdit() {
    setEditingPostId(null);
    setPost({ title: "", body: "" });
  }

  return (
    <div className="container todo-page">
      <button onClick={onBack}>← Back to Todo List</button>

      <h1>Posts Manager</h1>
      <p>Logged in as: {user.email}</p>

      <form onSubmit={editingPostId !== null ? updatePost : addPost}>
        <input
          ref={titleInputRef}
          name="title"
          value={post.title}
          onChange={handleChange}
          placeholder="Post title"
          required
        />

        <textarea
          name="body"
          value={post.body}
          onChange={handleChange}
          placeholder="Post description"
          required
        />

        <button type="submit">
          {editingPostId !== null ? "Update Post" : "Add Post"}
        </button>

        {editingPostId !== null && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {error && <p role="alert">{error}</p>}

      <h2>Posts</h2>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>

            <button onClick={() => startEdit(item)}>Edit</button>
            <button onClick={() => deletePost(item.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Posts;
