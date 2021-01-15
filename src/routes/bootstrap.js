const authRoutes = require("./authRoutes");
const regRoutes = require("./registrationRoutes");
const postsRoutes = require("./postsRoutes");
const bootstrap = (app) => {
    app.use(authRoutes);
    app.use(regRoutes);
    app.use(postsRoutes);
}
module.exports = bootstrap;