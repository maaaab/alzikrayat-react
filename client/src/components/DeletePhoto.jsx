import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeletePhoto({ photoId: pictureId, setUser: setAccount }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const goTo = useNavigate();

  const deletePicture = async () => {
    setIsBusy(true);
    setErrorMessage("");

    try {
      const reply = await fetch(`/api/photos/${pictureId}`, { method: "DELETE" });
      const payload = await reply.json();
      if (reply.status === 401) {
        setAccount(null);
        return;
      }
      if (!reply.ok) {
        setErrorMessage(typeof payload === "string" ? payload : payload.message || "Could not delete photo.");
        return;
      }
      goTo("/photos");
    } catch (errorMessage) {
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="deletePhoto">
      {showConfirmation ? (
        <>
          <p>Delete this photo and all its comments? This cannot be undone.</p>
          <div className="deleteButtons">
            <button type="button" disabled={isBusy} onClick={deletePicture}>{isBusy ? "Deleting..." : "Confirm delete"}</button>
            <button type="button" disabled={isBusy} onClick={() => {
              setShowConfirmation(false);
              setErrorMessage("");
            }}>Cancel</button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => setShowConfirmation(true)}>Delete photo</button>
      )}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}

export default DeletePhoto;
