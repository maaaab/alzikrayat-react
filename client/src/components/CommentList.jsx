function CommentList({ comments: replies }) {
  return (
    <section className="comments">
      <h2>Comments</h2>
      {replies.length === 0 && <p>No comments yet.</p>}
      {replies.map((replyText) => (
        <article className="comment" key={replyText._id}>
          <p><strong>{replyText.userId ? `${replyText.userId.firstName} ${replyText.userId.lastName}` : "Unknown user"}</strong></p>
          <p className="commentText">{replyText.comment}</p>
          <p>{new Date(replyText.dateTime).toLocaleString()}</p>
        </article>
      ))}
    </section>
  );
}

export default CommentList;
