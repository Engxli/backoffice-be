const errorHandler = async (err, req, res, next) => {
  try {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Something went wrong!" });
  } catch (error) {
    next(error);
  }
};
module.exports = errorHandler;
