import { useState } from "react";

function LoginForm({ setUser: setAccount }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const submitLogin = async (inputEvent) => {
    inputEvent.preventDefault();
    setIsBusy(true);
    setErrorMessage("");

    try {
      const reply = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddress, password: passwordInput }),
      });
      const payload = await reply.json();
      if (!reply.ok) {
        setErrorMessage(payload.message || "Could not log in.");
        return;
      }
      setAccount(payload.user);
    } catch (errorMessage) {
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <form onSubmit={submitLogin} className="authForm">
      <label htmlFor="email">Email</label>
      <input id="email" type="email" autoComplete="email" required value={emailAddress} onChange={(inputEvent) => setEmailAddress(inputEvent.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete="current-password" required value={passwordInput} onChange={(inputEvent) => setPasswordInput(inputEvent.target.value)} />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <button type="submit" disabled={isBusy}>{isBusy ? "Logging in..." : "Login"}</button>
    </form>
  );
}

export default LoginForm;
