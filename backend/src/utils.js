/* Shared helpers, so no layer has to hand-roll its own error shape. */

/* An error that carries the HTTP status it should be answered with.
   This is the piece that was duplicated: the middleware, the service
   and the controller each built an Error and set `.status` on it by
   hand. Now they all say what went wrong and how to answer it in one
   place, and no layer below the controller needs to import express. */
export class HttpError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/* A 400, which is most of what this API rejects: a missing file, a
   missing job description, an unreadable PDF. */
export function badRequest(message) {
  return new HttpError(message, 400);
}

/* Wrap an async route handler so a rejected promise reaches Express's
   error handler instead of hanging the request. Express 4 does not
   catch async throws on its own — this is why the old route had a
   try/catch in every handler. */
export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
