function Signup({ onSignup, onLogin }) {
  return (
    <div className="container">
      <h1>Create Account</h1>

      <form onSubmit={onSignup}>
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
          placeholder="Create a password"
          minLength={6}
          required
        />

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?{" "}
        <button type="button" onClick={onLogin}>
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;
