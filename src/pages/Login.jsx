function Login({ onLogin }) {
  return (
    <div className="container">
      <h1>Login</h1>

      <form onSubmit={onLogin}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
