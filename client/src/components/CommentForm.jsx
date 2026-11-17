import { useState } from "react";

function CommentForm({ photoId: pictureId, setComments: setReplies, setUser: setAccount }) {
  const [replyText, setReplyText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const submitComment = async (inputEvent) => {
    inputEvent.preventDefault();
    setErrorMessage("");
    setNotice("");

    if (!replyText.trim()) {
      setErrorMessage("Please write a comment.");
      return;
    }
    setIsBusy(true);

    try {
      const reply = await fetch(`/api/photos/${pictureId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: replyText.trim() }),
      });
      const payload = await reply.json();
      if (reply.status === 401) {
        setAccount(null);
        return;
      }
      if (!reply.ok) {
        setErrorMessage(typeof payload === "string" ? payload : payload.message || "Could not add comment.");
        return;
      }

      setReplies((replies) => [...replies, payload.comment]);
      setReplyText("");
      setNotice("Comment added.");
    } catch (errorMessage) {
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <form onSubmit={submitComment} className="commentForm">
      <label htmlFor="comment">Add a comment</label>
      <textarea id="comment" rows={3} required value={replyText} disabled={isBusy} onChange={(inputEvent) => setReplyText(inputEvent.target.value)} />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {notice && <p role="status">{notice}</p>}
      <button type="submit" disabled={isBusy}>{isBusy ? "Posting..." : "Post comment"}</button>
    </form>
  );
}

export default CommentForm;
