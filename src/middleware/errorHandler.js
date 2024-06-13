function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ message: err.message });
  }

  if (err.name === 'DatabaseError') {
    return res
      .status(500)
      .json({ message: 'Database operation failed: ' + err.message });
  }

  return res
    .status(500)
    .json({ message: 'Internal server error: ' + err.message });
}

export default errorHandler;
