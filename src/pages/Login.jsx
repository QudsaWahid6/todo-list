function Login({ onLogin, onSignup }) {
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

      <p>
        Don't have an account?{" "}
        <button type="button" onClick={onSignup}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
