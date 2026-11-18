import { useEffect, useState } from "react";
import PhotoCard from "../components/PhotoCard.jsx";

function Gallery() {
  const [pictures, setPictures] = useState([]);
  const [isBusy, setIsBusy] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [layout, setLayout] = useState("grid");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadPictures = async () => {
      setIsBusy(true);
      setErrorMessage("");

      try {
        const reply = await fetch("/api/photos");
        if (!reply.ok) {
          throw new Error("Could not load photos. Please try again.");
        }
        const payload = await reply.json();
        if (isMounted) {
          setPictures(payload.photos);
        }
      } catch (errorMessage) {
        if (isMounted) {
          setErrorMessage("Could not load photos. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsBusy(false);
        }
      }
    };

    loadPictures();
    return () => {
      isMounted = false;
    };
  }, [refreshCount]);

  return (
    <>
      <div className="galleryToolbar">
        <h1>Gallery</h1>
        <div className="viewButtons">
          <button type="button" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")}>Grid</button>
          <button type="button" aria-pressed={layout === "list"} onClick={() => setLayout("list")}>List</button>
        </div>
      </div>
      {isBusy && <p role="status">Loading photos...</p>}
      {!isBusy && errorMessage && (
        <div>
          <p role="alert">{errorMessage}</p>
          <button type="button" onClick={() => setRefreshCount(refreshCount + 1)}>Try again</button>
        </div>
      )}
      {!isBusy && !errorMessage && pictures.length === 0 && <p>No photos yet.</p>}
      {!isBusy && !errorMessage && (
        <div className={layout === "grid" ? "photoGrid" : "photoList"}>
          {pictures.map((picture) => <PhotoCard key={picture._id} photo={picture} />)}
        </div>
      )}
    </>
  );
}

export default Gallery;
