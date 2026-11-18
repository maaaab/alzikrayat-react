import { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

function LoginRegister({ user: account, setUser: setAccount }) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [notice, setNotice] = useState("");

  const finishRegistration = () => {
    setShowRegistration(false);
    setNotice("Account created. Please log in.");
  };

  if (account) {
    return <Navigate to="/photos" replace />;
  }

  return (
    <section className="authPage">
      <h1>{showRegistration ? "Create an account" : "Login"}</h1>
      {notice && <p role="status">{notice}</p>}
      {showRegistration ? <RegisterForm registered={finishRegistration} /> : <LoginForm setUser={setAccount} />}
      <button type="button" className="switchForm" onClick={() => {
        setShowRegistration(!showRegistration);
        setNotice("");
      }}>
        {showRegistration ? "Already have an account? Login" : "Need an account? Register"}
      </button>
    </section>
  );
}

export default LoginRegister;
