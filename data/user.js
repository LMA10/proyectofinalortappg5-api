const connection = require("./connection");
const userModel = require("./schemas/user");
const bcrypt = require("bcryptjs");
const messages = require("../constants/messages");
const jwt = require("jsonwebtoken");
const tokenPass = process.env.SECRET;

async function addUserEmailValidation(user) {
  let users = await getAllUsers();
  let res = users.find((e) => e.usEmail == user.usEmail);
  return res === undefined ? false : true;
}

async function getAllUsers() {
  await connection.getConnection();
  const users = await userModel.UserModel.find({});
  return users;
}

async function getAllDisabledUsers() {
  await connection.getConnection();
  const users = await userModel.UserModel.find({ usActive: false });
  return users;
}

async function addUser(user) {
  await connection.getConnection();
  user.usEmail = user.usEmail.toLowerCase();
  if (!(await addUserEmailValidation(user))) {
    user.usPasswordHash = await bcrypt.hash(user.usPasswordHash, 8);
    const newUser = await new userModel.UserModel(user);
    await newUser.save();
    addUserStatus = newUser;
  } else {
    throw new Error(messages.ERROR_USER_EXIST);
  }
}

async function getUser(userId) {
  await connection.getConnection();
  const userById = await userModel.UserModel.findById(userId);
  return userById;
}

async function updateUser(userId) {
  console.log(userId);
  await connection.getConnection();
  let userById = await userModel.UserModel.findById({ _id: userId });
  console.log("Searching");
  console.log(userById);
  if (userById.usActive) {
    userById.usActive = false;
  } else {
    userById.usActive = true;
  }
  userById.save();
  return userById;
}

async function deleteUser(userId) {
  await connection.getConnection();
  await userModel.UserModel.findByIdAndDelete(userId);
}

async function login(email, password) {
  await connection.getConnection();
  const user = await userModel.UserModel.findOne({ usEmail: email });

  console.log("Email retrieved from login: ", user);
  if (!user) {
    throw new Error("Mail o Contraseña inválido");
  }
  const isMatch = await bcrypt.compare(password, user.usPasswordHash);
  console.log("Match: ", isMatch);
  if (!isMatch) {
    throw new Error("Mail o Contraseña inválido");
  } else {
    const userToSend = {
      usName: user.usName,
      usLastName: user.usLastName,
      usEmail: user.usEmail,
      usRole: user.usRole,
      usActive: user.usActive,
      usMunicipio: user.usMunicipio,
    };

    return userToSend;
  }
}

function generateAuthToken(user) {
  const token = jwt.sign({ _id: user._id }, tokenPass, { expiresIn: "15d" });
  return token;
}

async function changePassword(email, password, newPassword) {
  await connection.getConnection();
  try {
    let users = await getAllUsers();
    let user = users.find((e) => e.usEmail == email);
    let isMatch = await bcrypt.compare(password, user.usPasswordHash);
    if (!isMatch) {
      throw new Error("Ups! Algo ha salido mal!");
    } else {
      let newPasswordHash = await bcrypt.hash(newPassword, 8);
      user.usPasswordHash = newPasswordHash;
      user.save();
      return user;
    }
  } catch (Error) {
    return Error;
  }
}

module.exports = {
  getAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  generateAuthToken,
  getAllDisabledUsers,
  changePassword,
};
