const { getUserByEmail, createUser } = require("../../services/user");
const { getHashedText } = require("../../lib/bcrypt");

module.exports = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const user = await getUserByEmail(email);
    if (user) {
      throw {
        status: 409,
        message: "Email has been registered",
      };
    }

    const hashedPassword = await getHashedText(password);
    const createdUser = await createUser({
      email,
      name: username,
      password: hashedPassword,
    });

    res
      .status(200)
      .json({ userId: createdUser.id, username: createdUser.name });
  } catch (error) {
    next(error);
  }
};
