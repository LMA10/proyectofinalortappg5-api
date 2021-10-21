const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  roDescription: {
    type: String,
    required: true,
    unique: true,
  },
});

const RoleModel = model("Role", roleSchema);

module.exports = { RoleModel };
