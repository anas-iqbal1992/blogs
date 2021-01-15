const { assign } = require('lodash');
const _ = require('lodash');
const Post = require('../models/Post');
const addPost = async (req) => {
    return new Promise(async (resolve, reject) => {
        const body = await req.body;
        const post = new Post(body);
        post.image = _.isEmpty(req.file.filename) ? '' : req.file.filename;
        post.reference = req.user.ucode;
        post.save((err, res) => {
            if (err) reject(err);
            resolve('Post created sucessfully!');
        });
    });
};
const getPosts = async (req) => {
    const page = _.isUndefined(req.params.page) ? 1 : req.params.page;
    const options = {
        sort: { createdAt: -1 },
        lean: true,
        page: page,
        limit: 5
    };
    return await Post.paginate({ reference: req.user.ucode }, options);
}

const getPost = async (req) => {
    return new Promise(async (resolve, reject) => {
        const post = await Post.findOne({ slug: req.params.slug })
        if (!post) reject('Post not found');
        resolve(post);
    })
}
const getPostEdit = async (req) => {
    return new Promise(async (resolve, reject) => {
        const post = await Post.findById(req.params.id)
        if (!post) reject('Post not found');
        resolve(post);
    })
}
const editPost = async (req) => {
    return new Promise(async (resolve, reject) => {
        const body = await req.body;
        const post = await Post.findById(req.params.id);
        post.image = _.isEmpty(req.file.filename) ? '' : req.file.filename;
        post.reference = req.user.ucode;
        post.title =  body.title;
        post.description = body.description;
        await post.save((err, res) => {
            console.log(err)
            if (err) reject(err);
            resolve('Post updated sucessfully!');
        });
    });
}
const deletePost = async (req) => {
    return Post.findByIdAndDelete(req.params.id)
}
module.exports = { addPost, getPosts, getPost, getPostEdit,editPost,deletePost }