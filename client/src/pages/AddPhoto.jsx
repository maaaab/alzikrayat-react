import { useState } from "react";
import { Link } from "react-router-dom";

function AddPhoto({ user: account, setUser: setAccount }) {
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const submitPhoto = async (inputEvent) => {
    inputEvent.preventDefault();
    const uploadForm = inputEvent.currentTarget;
    setErrorMessage("");
    setNotice("");

    if (!picture) {
      setErrorMessage("Please choose a photo.");
      return;
    }
    if (picture.size > 5 * 1024 * 1024) {
      setErrorMessage("Photo must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("title", photoTitle);
    formData.append("description", photoDescription);
    formData.append("photo", picture);
    setIsBusy(true);

    try {
      const reply = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });
      const payload = await reply.json();
      if (reply.status === 401) {
        setAccount(null);
        return;
      }
      if (!reply.ok) {
        setErrorMessage(typeof payload === "string" ? payload : payload.message || "Could not upload photo.");
        return;
      }

      setPhotoTitle("");
      setPhotoDescription("");
      setPicture(null);
      uploadForm.reset();
      setNotice("Photo uploaded successfully.");
    } catch (errorMessage) {
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  if (!account) {
    return <p>Please <Link to="/login">log in</Link> to upload a photo.</p>;
  }

  return (
    <section className="uploadPage">
      <h1>Add Photo</h1>
      <p>JPEG, PNG, or WebP. Maximum size: 5 MB.</p>
      {notice && <p role="status">{notice} <Link to="/photos">View gallery</Link></p>}
      <form onSubmit={submitPhoto} className="uploadForm">
        <label htmlFor="title">Title</label>
        <input id="title" required value={photoTitle} disabled={isBusy} onChange={(inputEvent) => setPhotoTitle(inputEvent.target.value)} />
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" rows={3} value={photoDescription} disabled={isBusy} onChange={(inputEvent) => setPhotoDescription(inputEvent.target.value)} />
        <label htmlFor="photo">Photo</label>
        <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" required disabled={isBusy} onChange={(inputEvent) => setPicture(inputEvent.target.files[0])} />
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <button type="submit" disabled={isBusy}>{isBusy ? "Uploading..." : "Upload"}</button>
      </form>
    </section>
  );
}

export default AddPhoto;
