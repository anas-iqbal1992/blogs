const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../../utils/helpers');
const _ = require('lodash');
const { uniqueCode, hashPassword } = require('../../../utils/helpers');
const { getMaxListeners } = require('../models/User');
const addUser = async (req) => {
    return new Promise(async (resolve, reject) => {
        const body = await req.body;
        const user = new User(body);
        user.ucode = uniqueCode();
        user.save((err, res) => {
            if (err) reject(err);
            resolve('sucessfully registred!');
        });
    });
};
const getUser = async (req) => {
    return await User.findOne({ ucode: req.user.ucode });
}
const updateUser = async (req) => {
    return new Promise(async (resolve, reject) => {
        const body = await req.body;
        const user = await User.findOne({ ucode: req.user.ucode });
        user.name = body.name;
        user.email = body.email;
        user.gender = body.gender;
        user.phone = body.phone;
        await user.save((err, res) => {
            if (err) reject(err);
            resolve('sucessfully Update Profile!');
        });
    });
}
const validateEmail = async (req) => {
    return new Promise(async (resolve, reject) => {
        const { email } = await req.body;
        const user = await User.findOne({ email });
        if (_.isEmpty(user)) reject('Email is not registred');
        resolve(user);
    });
}
const genrateToken = async (user) => {
    return new Promise(async (resolve, reject) => {
        const token = jwt.sign({ ucode: user.ucode }, process.env.RESET_PASS_KET, { expiresIn: '30m' })
        const data = {
            from: 'noreply@blog.com',
            to: user.email,
            subject: 'Forget Password Link',
            html: `<h3>Please click on given link to reset your Password</h3>
        <p>${process.env.BASE_URL}/reset-password/${token}</p>`
        }
        const update = await user.updateOne({ resetToken: token })
        if (!update) {
            reject('Some thing went wrong')
        }
        sendEmail(data)
        resolve('Please check your email');
    });
}
const validateToken = async (req) => {
    return await new Promise(async (resolve, reject) => {
        const { token } = await req.params
        const decoded = await jwt.verify(token, process.env.RESET_PASS_KET)
        if (_.isEmpty(decoded)) reject('Invalid Token')
        const user = await User.findOne({ resetToken: token })
        if (!user) reject('Invalid token')
        resolve(Object.values(decoded.ucode));
    })
}
const updatePassword = async (req) => {
    return await new Promise(async (resolve, reject) => {
        const { password, ucode } = req.body
        const user = await User.findOne({ ucode: ucode })
        user.password = password
        if (!user.save()) reject('something went wrong')
        resolve('password reset successfully');
    })
}
module.exports = { addUser, getUser, updateUser, validateEmail, genrateToken, validateToken, updatePassword }