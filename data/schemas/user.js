const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  usEmail: {
    type: String,
    unique: true,
    required: true
  },
  usName: {
    type: String,
    required: true
  },
  usLastName: {
    type: String,
    required: true
  },
  usPasswordHash: {
    type: String,
    required: true
  },
  usRole: {
    // Chequear type -> moongose.Schema.Type.ObjectId
    type: String,
    ref: "Role",
    required: true
  },
  usActive: {
    type: Boolean,
    required: true
  },
});

const UserModel = model("User", userSchema);

module.exports = { UserModel };
