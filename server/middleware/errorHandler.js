import multer from "multer";

export const errorHandler = (problem, request, response, nextHandler) => {
  if (response.headersSent) {
    return nextHandler(problem);
  }

  if (problem instanceof multer.MulterError) {
    if (problem.code === "LIMIT_FILE_SIZE") {
      return response.status(413).json({ message: "Photo must be 5 MB or smaller" });
    }
    return response.status(400).json({ message: problem.message });
  }

  const statusCode = problem.status || 500;
  return response.status(statusCode).json({
    message: statusCode === 500 ? "An unexpected error occurred" : problem.message,
  });
};
