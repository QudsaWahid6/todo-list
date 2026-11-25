function Signup({ onSignup, onLogin }) {
  return (
    <div className="container">
      <h1>Create Account</h1>

      <form onSubmit={onSignup}>
        <label>Name</label>
        <input type="text" name="name" placeholder="Enter your name" required />

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
          placeholder="Create a password (minimum 8 characters)"
          minLength={8}
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
