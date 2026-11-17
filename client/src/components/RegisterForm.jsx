import { useState } from "react";

function RegisterForm({ registered: finishRegistration }) {
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const updateField = (inputEvent) => {
    setFields({ ...fields, [inputEvent.target.name]: inputEvent.target.value });
  };

  const submitRegistration = async (inputEvent) => {
    inputEvent.preventDefault();
    setIsBusy(true);
    setErrorMessage("");

    try {
      const reply = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const payload = await reply.json();
      if (!reply.ok) {
        setErrorMessage(payload.message || "Could not create your account. Check your details.");
        return;
      }
      finishRegistration();
    } catch (errorMessage) {
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <form onSubmit={submitRegistration} className="authForm">
      <label htmlFor="firstName">First name</label>
      <input id="firstName" name="firstName" autoComplete="given-name" required value={fields.firstName} onChange={updateField} />
      <label htmlFor="lastName">Last name</label>
      <input id="lastName" name="lastName" autoComplete="family-name" required value={fields.lastName} onChange={updateField} />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required value={fields.email} onChange={updateField} />
      <label htmlFor="password">Password (at least 8 characters)</label>
      <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required value={fields.password} onChange={updateField} />
      <label htmlFor="location">Location (optional)</label>
      <input id="location" name="location" autoComplete="address-level2" value={fields.location} onChange={updateField} />
      <label htmlFor="occupation">Occupation (optional)</label>
      <input id="occupation" name="occupation" value={fields.occupation} onChange={updateField} />
      <label htmlFor="description">About you (optional)</label>
      <textarea id="description" name="description" rows={3} value={fields.description} onChange={updateField} />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <button type="submit" disabled={isBusy}>{isBusy ? "Creating account..." : "Register"}</button>
    </form>
  );
}

export default RegisterForm;
