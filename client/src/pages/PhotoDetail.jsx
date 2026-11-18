import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentList from "../components/CommentList.jsx";
import CommentForm from "../components/CommentForm.jsx";
import DeletePhoto from "../components/DeletePhoto.jsx";

function PhotoDetail({ user: account, setUser: setAccount }) {
  const { id } = useParams();
  const [picture, setPicture] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isBusy, setIsBusy] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadPicture = async () => {
      setIsBusy(true);
      setErrorMessage("");

      try {
        const reply = await fetch(`/api/photos/${id}`);
        if (!reply.ok) {
          if (reply.status === 404 || reply.status === 400) {
            throw new Error("Photo not found.");
          }
          throw new Error("Could not load photo. Please try again.");
        }
        const payload = await reply.json();
        if (isMounted) {
          setPicture(payload.foundPhoto);
          setReplies(payload.comments);
        }
      } catch (errorMessage) {
        if (isMounted) {
          setErrorMessage(errorMessage.message);
        }
      } finally {
        if (isMounted) {
          setIsBusy(false);
        }
      }
    };

    loadPicture();
    return () => {
      isMounted = false;
    };
  }, [id, refreshCount]);

  return (
    <section className="photoDetail">
      <Link to="/photos">Back to gallery</Link>
      {isBusy && <p role="status">Loading photo...</p>}
      {!isBusy && errorMessage && (
        <div>
          <p role="alert">{errorMessage}</p>
          <button type="button" onClick={() => setRefreshCount(refreshCount + 1)}>Try again</button>
        </div>
      )}
      {!isBusy && !errorMessage && picture && (
        <>
          <h1>{picture.title}</h1>
          <img className="fullPhoto" src={`/uploads/${encodeURIComponent(picture.fileName)}`} alt={picture.title} />
          {picture.description && <p className="photoDescription">{picture.description}</p>}
          <p>Uploaded by {picture.userId ? `${picture.userId.firstName} ${picture.userId.lastName}` : "Unknown user"}</p>
          <p>{new Date(picture.dateTime).toLocaleString()}</p>
          {account && account.id === picture.userId?._id && (
            <DeletePhoto key={picture._id} photoId={picture._id} setUser={setAccount} />
          )}
          <CommentList comments={replies} />
          {account ? (
            <CommentForm key={picture._id} photoId={picture._id} setComments={setReplies} setUser={setAccount} />
          ) : (
            <p>Please <Link to="/login">log in</Link> to add a comment.</p>
          )}
        </>
      )}
    </section>
  );
}

export default PhotoDetail;
