
export const requireAuth = (request, response,nextHandler) => {
  if (!request.session.userId) {
    return response.status(401).json('Please log in');
  } else {
    nextHandler()
  }
}
