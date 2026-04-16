const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 500).json({
    success: false,
    message: err.message || "Server error",
  });
};

export { notFound, errorHandler };