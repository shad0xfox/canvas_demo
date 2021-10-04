module.exports = async (req, res, next) => {
  try {
    const { user } = req.session.passport;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
