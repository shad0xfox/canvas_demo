const { getUserByEmail, USER_PROJECTIONS } = require("../../services/user");
const { compare } = require("../../lib/bcrypt");

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email, {
      projections: USER_PROJECTIONS.ID_NAME_AND_PASSWORD,
    });

    if (!user) {
      throw {
        status: 404,
        message: "Email is not registered",
      };
    }

    const match = await compare(password, user.password);

    if (!match) {
      throw {
        status: 403,
        message: "Wrong password",
      };
    }
    res.status(200).json({ userId: user.id, username: user.name });
  } catch (error) {
    next(error);
  }
};
