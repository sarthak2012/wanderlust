const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;
// this userschema is for authentication and authorisation

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// passpost local mongoose by default stores username and hashed password and the salt value
// so we do not need to defim=ne username and password seperatley in the database schema

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
