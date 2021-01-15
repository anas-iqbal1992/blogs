const { model, Schema } = require("mongoose");
const slugify = require('slugify');
const mongoosePaginate = require("mongoose-paginate-v2");
const postSchema = new Schema({
    reference: {
        type: Schema.Types.Decimal128,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
});
postSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    next()
});

postSchema.plugin(mongoosePaginate);
module.exports = model("Post", postSchema);

