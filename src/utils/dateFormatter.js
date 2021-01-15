const dateFormats = require("dateformat");
const dateFormat = (date) => {
    return dateFormats(date, "mediumDate");
};
module.exports =  { dateFormat }
