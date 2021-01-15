const mongoose = require("mongoose");
const url = process.env.MONGODB
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
});

module.exports = mongoose.connection