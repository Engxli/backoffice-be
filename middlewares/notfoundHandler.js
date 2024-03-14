const notfoundHandler = async (req, res, next) => {
  try {
    res.status(404).json({ message: "This route is not found!" });
  } catch (error) {
    next(error);
  }
};
module.exports = notfoundHandler;
