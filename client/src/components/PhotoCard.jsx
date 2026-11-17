import { Link } from "react-router-dom";

function PhotoCard({ photo: picture }) {
  return (
    <article className="photoCard">
      <Link to={`/photos/${picture._id}`} className="photoLink">
        <img src={`/uploads/${encodeURIComponent(picture.fileName)}`} alt={picture.title} loading="lazy" />
      </Link>
      <div className="photoInfo">
        <h2><Link to={`/photos/${picture._id}`}>{picture.title}</Link></h2>
        {picture.description && <p>{picture.description}</p>}
        <p>{new Date(picture.dateTime).toLocaleDateString()}</p>
      </div>
    </article>
  );
}

export default PhotoCard;
