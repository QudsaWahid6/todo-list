import { useEffect, useRef, useState } from "react";

function Posts({ user, onBack }) {
  const storageKey = `posts_${user.email.toLowerCase()}`;

  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem(storageKey);
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);

  const titleInputRef = useRef(null);

  // Posts update karna aur user ke liye save karna
  function savePosts(updatedPosts) {
    setPosts(updatedPosts);
    localStorage.setItem(storageKey, JSON.stringify(updatedPosts));
  }

  // GET: Pehle saved posts check karo, warna API se lao
  useEffect(() => {
    async function fetchPosts() {
      const savedPosts = localStorage.getItem(storageKey);

      if (savedPosts !== null) {
        setLoading(false);
        console.log("Loaded saved posts for:", user.email);
        return;
      }

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        const firstPosts = data.slice(0, 10);

        console.log("GET response:", data);
        savePosts(firstPosts);
      } catch (error) {
        console.log("GET error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [storageKey]);

  // POST: Nayi post add karna
  async function addPost(event) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) return;

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            body,
            userId: 1,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      const result = await response.json();
      console.log("POST response:", result);

      const newPost = {
        ...result,
        id: Date.now(),
        title: title.trim(),
        body: body.trim(),
      };

      savePosts([newPost, ...posts]);
      setTitle("");
      setBody("");
      titleInputRef.current?.focus();
    } catch (error) {
      console.log("POST error:", error);
    }
  }

  // Edit ke liye post form mein lana
  function startEdit(post) {
    setEditingPostId(post.id);
    setTitle(post.title);
    setBody(post.body);
    titleInputRef.current?.focus();
  }

  // PATCH: Post update karna
  async function updatePost(event) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) return;

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${editingPostId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            body: body.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const result = await response.json();
      console.log("PATCH response:", result);

      const updatedPosts = posts.map((post) =>
        post.id === editingPostId
          ? {
              ...post,
              title: title.trim(),
              body: body.trim(),
            }
          : post,
      );

      savePosts(updatedPosts);
      cancelEdit();
    } catch (error) {
      console.log("PATCH error:", error);
    }
  }

  // DELETE: Post delete karna
  async function deletePost(id) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      console.log("DELETE response received for ID:", id);

      savePosts(posts.filter((post) => post.id !== id));

      if (editingPostId === id) {
        cancelEdit();
      }
    } catch (error) {
      console.log("DELETE error:", error);
    }
  }

  function cancelEdit() {
    setEditingPostId(null);
    setTitle("");
    setBody("");
  }

  return (
    <div className="container todo-page">
      <button onClick={onBack}>← Back to Todo List</button>

      <h1>Posts Manager</h1>
      <p>Logged in as: {user.email}</p>

      <form onSubmit={editingPostId ? updatePost : addPost}>
        <input
          ref={titleInputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Post title"
          required
        />

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Post description"
          required
        />

        <button type="submit">
          {editingPostId ? "Update Post" : "Add Post"}
        </button>

        {editingPostId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Posts</h2>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>

            <button onClick={() => startEdit(post)}>Edit</button>

            <button onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Posts;
