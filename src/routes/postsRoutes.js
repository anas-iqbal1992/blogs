const express = require("express");
const {
    mongooseErrorFormatter,
} = require("../utils/validationFormatter");
const { validationResult } = require("express-validator");
const postRoute = express.Router();
const { requiredLogin } = require("../middlewares/requiredLogin");
const validateSchema = require("./../modules/posts/validation/postValidation");
const { uploadFile } = require("./../middlewares/multer");
const {
    addPost, getPost, editPost, getPosts, getPostEdit, deletePost
} = require("./../modules/posts/services/createService");


postRoute.post(
    "/posts/add-post",
    requiredLogin,
    uploadFile.single('image'),
    validateSchema,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash('formErrors', JSON.stringify(errors.mapped()))
                req.flash('formData', JSON.stringify(req.body))
                return res.redirect("/posts/add-post");
            }
            await addPost(req);
            const msg = {
                type: "success",
                body: "Post is created successfully!",
            };
            req.flash('messages', JSON.stringify(msg))
            return res.redirect("/posts");
        } catch (e) {
            const msg = {
                type: "error",
                body: "Validation Errors",
            };
            req.flash('messages', JSON.stringify(msg))
            req.flash('formErrors', mongooseErrorFormatter(e))
            req.flash('formData', JSON.stringify(req.body))
        }
        return res.redirect("/posts/add-post");
    }
);
postRoute.get(
    "/posts/add-post",
    requiredLogin,
    async (req, res) => {
        return res.render("posts/add", { title: "Create Posts" });
    }
);

postRoute.get('/posts/view/:slug', requiredLogin, async (req, res) => {
    try {
        const model = await getPost(req);
        return res.render("posts/view", { title: "View Posts", model });
    } catch (e) {
        const msg = {
            type: "error",
            body: "Some thing went wrong!",
        };
        req.flash('messages', JSON.stringify(msg))
    }
    return res.redirect('/')
})
postRoute.get('/posts/edit/:id', requiredLogin, async (req, res) => {
    try {
        const formData = await getPostEdit(req);
        return res.render("posts/edit", { title: "Edit Posts", formData });
    } catch (e) {
        const msg = {
            type: "error",
            body: "Some thing went wrong!",
        };
        req.flash('messages', JSON.stringify(msg))
    }
    return res.redirect('/')
})
postRoute.post('/posts/edit/:id', requiredLogin,
    uploadFile.single('image'),
    validateSchema,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash('formErrors', JSON.stringify(errors.mapped()))
                req.flash('formData', JSON.stringify(req.body))
                return res.redirect(`/posts/edit/${req.params.id}`);
            }
            await editPost(req);
            const msg = {
                type: "success",
                body: "Post is updated successfully!",
            };
            req.flash('messages', JSON.stringify(msg))
            return res.redirect("/posts");
        } catch (e) {
            const msg = {
                type: "error",
                body: "Validation Errors",
            };
            req.flash('messages', JSON.stringify(msg))
            req.flash('formErrors', mongooseErrorFormatter(e))
            req.flash('formData', JSON.stringify(req.body))
        }
        return res.redirect(`/posts/edit/${req.params.id}`);
    });
postRoute.post('/posts/remove/:id', requiredLogin, async (req, res) => {
    try {
        await deletePost(req);
        const msg = {
            type: "success",
            body: "Post is deleted successfully!",
        };
        req.flash('messages', JSON.stringify(msg))
    } catch (e) {
        const msg = {
            type: "error",
            body: "Some thing went wrong!",
        };
        req.flash('messages', JSON.stringify(msg))
    }
    return res.redirect('/');
})
postRoute.get(
    "/posts/:page?",
    requiredLogin,
    async (req, res) => {
        try {
            const model = await getPosts(req);
            return res.render("posts/index", { title: "Posts", model });
        } catch (e) {
            const msg = {
                type: "error",
                body: "Some thing went wrong!",
            };
            req.flash('messages', JSON.stringify(msg))
        }
        return res.redirect('/');
    }
);
module.exports = postRoute;