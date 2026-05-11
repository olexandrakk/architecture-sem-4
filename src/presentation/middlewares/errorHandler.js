const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.status === 400 && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload', message: 'Request body must be valid JSON.' });
  }

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Conflict: Resource already exists.' });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
};

module.exports = errorHandler;