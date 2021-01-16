const express = require("express");
const validateSchema = require("./../modules/users/validation/registrationValidation");
const validateUpdateSchema = require("./../modules/users/validation/registrationUpdateValidation");
const { validationResult } = require("express-validator");
const { checkLogin } = require("./../middlewares/checkLogin");
const { requiredLogin } = require("../middlewares/requiredLogin");
const {
    mongooseErrorFormatter,
} = require("./../utils/validationFormatter");
const {
    addUser,getUser,updateUser
} = require("./../modules/users/services/createService");
const regRoute = express.Router();
regRoute.get(
    "/registration",
    checkLogin,
    async (req, res) => {
        return res.render("registration/create", { title: "Sign Up", layout: 'layouts/login' });
    }
);
regRoute.post("/registration", checkLogin, validateSchema, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped())
            req.flash('formErrors', JSON.stringify(errors.mapped()))
            req.flash('formData', JSON.stringify(req.body))
            return res.redirect("/registration");
        }
        await addUser(req);
        const msg = {
            type: "success",
            body: "User is Successfully registered!",
        };
        req.flash('messages', JSON.stringify(msg))
        return res.redirect("/");
    } catch (e) {
        const msg = {
            type: "error",
            body: "Validation Errors",
        };
        req.flash('messages', JSON.stringify(msg))
        req.flash('formErrors', mongooseErrorFormatter(e))
        req.flash('formData', JSON.stringify(req.body))
    }
    return res.redirect("/registration");
});
regRoute.get(
    "/registration/update",
    requiredLogin,
    async (req, res) => {
        try {
            const formData = await getUser(req);
            return res.render("registration/update", { title: "Profile", formData });
        } catch (e) {
            const msg = {
                type: "error",
                body: "Some thing went wrong!",
            };
            req.flash('messages', JSON.stringify(msg))
        }
        return res.redirect("/post");
    }
);
regRoute.post("/registration/update", requiredLogin, validateUpdateSchema, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped())
            req.flash('formErrors', JSON.stringify(errors.mapped()))
            req.flash('formData', JSON.stringify(req.body))
            return res.redirect("/registration/update");
        }
        await updateUser(req);
        const msg = {
            type: "success",
            body: "User is Successfully registered!",
        };
        req.flash('messages', JSON.stringify(msg))
        return res.redirect("/");
    } catch (e) {
        const msg = {
            type: "error",
            body: "Validation Errors",
        };
        req.flash('messages', JSON.stringify(msg))
        req.flash('formErrors', mongooseErrorFormatter(e))
        req.flash('formData', JSON.stringify(req.body))
    }
    return res.redirect("/registration/update");
});
module.exports = regRoute;