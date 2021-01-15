const express = require("express");
const session = require("express-session");
require("dotenv").config();
const cors = require('cors')
const path = require("path");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const mongoDbConnection = require("./utils/db.config");
const mongo = require("connect-mongo");
const flash = require("connect-flash");
const { dateFormat } = require("./utils/dateFormatter");
const MongoStore = mongo(session);
const app = express();
app.use(cors())
require("./services/passport")(passport);
app.use(express.static("public"));
app.use(expressLayouts);
app.set('layout', 'layouts/dashboard');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const COOKEYSECRET = process.env.COOKEYSECRET;
app.use(session({
    secret: COOKEYSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MongoStore({ mongooseConnection: mongoDbConnection })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use((req, res, next) => {
    const message = req.flash('messages');
    const formErrors = req.flash('formErrors');
    const formData = req.flash('formData');
    res.locals.messages = message.length ? JSON.parse(message) : {};
    res.locals.formErrors = formErrors.length ? JSON.parse(formErrors) : {};
    res.locals.formData = formData.length ? JSON.parse(formData) : {};
    res.locals.user = req.user || {};
    res.locals.dateFormat = dateFormat;
    next()
});
require("./routes/bootstrap")(app);
app.listen(process.env.PORT, () => console.log(`server running on ${process.env.PORT} port`));
