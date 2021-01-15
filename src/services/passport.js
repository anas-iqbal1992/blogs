const { Strategy } = require("passport-local");
  const User  = require("../modules/users/models/User");

module.exports =  (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await User.findById({ _id });
      return done(null, user)
    } catch (e) {
      done(e);
    }
  });
  passport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) return done(null, false, {
          error: "This email is not registered!",
        });
        if (await user.checkPassword(password)) return done(null, user);
        return done(null, false, {
          error: "Incorrect password!",
        });
      } catch (e) {
        return done(e);
      }
    })
  );
};
