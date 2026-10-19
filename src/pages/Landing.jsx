function Landing({ onGetStarted }) {
  return (
    <div className="container landing-page">
      <h1>Welcome to Todo List</h1>

      <p>Organize your daily tasks in one place.</p>

      <button onClick={onGetStarted}>Get Started</button>
    </div>
  );
}

export default Landing;
