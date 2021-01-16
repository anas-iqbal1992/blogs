const express = require("express");
const passport = require("passport");
const validateSchema = require("./../modules/users/validation/authValidation");
const forgetpassvalidateSchema = require("./../modules/users/validation/forgetpasswordValidation");
const resetPassvalidateSchema = require("./../modules/users/validation/resetPassValidation");
const authRoutes = express.Router();
const { checkLogin } = require("./../middlewares/checkLogin");
const { requiredLogin } = require("../middlewares/requiredLogin");
const { validationResult } = require("express-validator");
const {
  validateEmail, genrateToken, validateToken,updatePassword
} = require("./../modules/users/services/createService");
authRoutes.get("/", checkLogin, async (req, res) => {
  return res.render("auth/login", { layout: 'layouts/login' });
});

authRoutes.post(
  "/login", checkLogin, validateSchema,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('formErrors', JSON.stringify(errors.mapped()))
      req.flash('formData', JSON.stringify(req.body))
      return res.redirect("/");
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        const msg = {
          type: "error",
          body: "Login failed",
        };
        req.flash('messages', JSON.stringify(msg))
        return res.redirect("/");
      }
      if (!user) {
        const msg = {
          type: "error",
          body: info.error,
        };
        req.flash('messages', JSON.stringify(msg))
        return res.redirect("/");
      }

      req.logIn(user, (err) => {
        if (err) {
          const msg = {
            type: "error",
            body: "Login failed",
          };
          req.flash('messages', JSON.stringify(msg))
        }
        return res.redirect("/posts");
      });
    })(req, res, next);
  }
);
authRoutes.get('/logout', requiredLogin, (req, res) => {
  req.logout()
  const msg = {
    type: "success",
    body: "Logout success",
  };
  req.flash('messages', JSON.stringify(msg))
  return res.redirect('/')
})
authRoutes.get('/forget-password', checkLogin, (req, res) => {
  return res.render('auth/forget-password', { layout: 'layouts/login' });
});
authRoutes.post('/forget-password', checkLogin, forgetpassvalidateSchema, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('formErrors', JSON.stringify(errors.mapped()))
      req.flash('formData', JSON.stringify(req.body))
      return res.redirect("/forget-password");
    }
    const user = await validateEmail(req);
    const res = await genrateToken(user);
    const msg = {
      type: "success",
      body: 'Please check your email',
    };
    req.flash('messages', JSON.stringify(msg))
  } catch (e) {
    const msg = {
      type: "error",
      body: e,
    };
    req.flash('messages', JSON.stringify(msg))
  }
  return res.redirect("/forget-password");
});
authRoutes.get('/reset-password/:token', checkLogin, async (req, res) => {
  try {
   const ucode = await validateToken(req);
   return res.render('auth/reset-password', { layout: 'layouts/login',ucode })
  } catch (e) {
    const msg = {
      type: "error",
      body: e,
    };
    req.flash('messages', JSON.stringify(msg))
  }
  return res.redirect("/");
})
authRoutes.post('/reset-password', checkLogin, resetPassvalidateSchema, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('formErrors', JSON.stringify(errors.mapped()))
      req.flash('formData', JSON.stringify(req.body))
      return res.redirect("/forget-password");
    }
    await updatePassword(req);
  } catch (e) {
    const msg = {
      type: "error",
      body: e,
    };
    req.flash('messages', JSON.stringify(msg))
  }
  return res.redirect("/");
})
module.exports = authRoutes;
