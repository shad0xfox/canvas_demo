const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {
  getUserByEmail,
  getUserById,
  USER_PROJECTIONS,
} = require("../services/user");
const { compare } = require("../lib/bcrypt");

function initialize() {
  setLoginStrategy();

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function ({ id }, done) {
    const user = await getUserById(id, { projections: USER_PROJECTIONS.MIN });

    done(null, user);
  });

  return passport.initialize();
}

function session() {
  return passport.session();
}

function setLoginStrategy() {
  const strategy = new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email);

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

        done(null, user);
      } catch (error) {
        error.email = email;

        done(error, null);
      }
    }
  );

  passport.use("PASSWORD_LOGIN", strategy);
}

function authenticateCredentials(strategy, req, res, next) {
  const cb = function (error, user) {
    if (error) {
      return next(error);
    }
    req.login(
      {
        id: user.id,
        username: user.name,
      },
      function (error) {
        if (error) {
          return next(error);
        }

        res.locals.user = user;

        next();
      }
    );
  };

  passport.authenticate(strategy, cb)(req, res, next);
}

module.exports = {
  initialize,
  session,
  authenticateCredentials,
};
