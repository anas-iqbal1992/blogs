const { model, Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  ucode :{
    type: Schema.Types.Decimal128,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid Email!`,
    },
    lowercase: true,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "User phone number required"],
  },
  password: { type: String, required: true },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  resetToken:{
    type:String,
  },
  createdAt: { type: Date, default: Date.now },
});
userSchema.plugin(uniqueValidator);
userSchema.path("phone").validate(async function (value) {
  return value.length == 10;
}, "Invalid Phone Number.");
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = model("User", userSchema);

