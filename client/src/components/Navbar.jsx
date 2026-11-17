import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ user: account, setUser: setAccount }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const goTo = useNavigate();

  const signOut = async () => {
    setIsBusy(true);
    setErrorMessage("");

    try {
      const reply = await fetch("/api/auth/logout", { method: "POST" });
      if (!reply.ok) {
        throw new Error("Could not log out. Please try again.");
      }
      setAccount(null);
      goTo("/");
    } catch (errorMessage) {
      setErrorMessage("Could not log out. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <header>
      <nav>
        <Link to="/">Alzikrayat</Link>
        <div className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/photos">Gallery</Link>
          {account ? (
            <>
              <Link to="/photos/new">Add Photo</Link>
              <span>Hi {account.firstName}</span>
              <button type="button" onClick={signOut} disabled={isBusy}>
                {isBusy ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link to="/login">Please Login</Link>
          )}
        </div>
      </nav>
      {errorMessage && <p className="navError" role="alert">{errorMessage}</p>}
    </header>
  );
}

export default Navbar;
