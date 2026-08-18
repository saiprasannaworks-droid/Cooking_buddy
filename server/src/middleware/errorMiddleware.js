export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  if (
    err.name === "ValidationError" ||
    err.name === "CastError" ||
    err.name === "MulterError" ||
    err instanceof SyntaxError
  ) {
    statusCode = 400;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};