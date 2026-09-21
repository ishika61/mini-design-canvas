const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';

  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON request body';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Invalid request data';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with that value already exists';
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
