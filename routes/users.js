var express = require("express");
var router = express.Router();
const data = require("../data/user");
const auth = require("../middleware/auth");
const joi = require("joi");

// Get All Users

router.get("/", auth, async function (req, res, next) {
  const users = await data.getAllUsers();
  console.log(users);
  res.send(users);
});

router.get("/disabled", auth, async function (req, res, next) {
  const users = await data.getAllDisabledUsers();
  console.log(users);
  res.send(users);
});

//Add User
router.post("/", async (req, res) => {
  const schemaPost = joi.object({
    usEmail: joi
      .string()
      .email({ minDomainSegments: 2, tlds: true })
      .required(),
    usName: joi.string().pattern(new RegExp("^[a-zA-Z]{3,30}$")).required(),
    usLastName: joi.string().pattern(new RegExp("^[a-zA-Z]{3,30}$")).required(),
    usPasswordHash: joi.string().alphanum().min(6).required(),
    usActive: joi.required(),
    usRole: joi.required(),
    usMunicipio: joi.required(),
  });

  const result = schemaPost.validate(req.body);
  console.log("result:");
  console.log(result);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {
    try {
      let user = req.body;
      await data.addUser(user);
      res.status(201).send();
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
});

//Find User
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await data.getUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.log(error);
  }
});

//Login User
router.post("/login", async (req, res) => {
  console.log("Login Started");
  try {
    const user = await data.login(req.body.usEmail, req.body.usPasswordHash);
    console.log(user);
    const token = data.generateAuthToken(user);
    console.log(token);
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//Update User
router.post("/:id", auth, async (req, res) => {
  const schemaUpdate = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: true }),
    password: joi.string().alphanum().min(6),
    repeat_password: joi.ref("password"),
    state: joi.required(),
  });
  const result = schemaUpdate.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {
    let user = req.body;
    user._id = req.params.id;
    user = await data.updateUser(user);
    res.json(user);
  }
});

router.put("/enable/:id", auth, async function (req, res, next) {
  try {
    const user = await data.updateUser(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

//Delete User
router.delete("/:id", auth, async (req, res) => {
  if (!user) {
    res.status(404).send("Usuario no encontrado");
  } else {
    data.deleteUser(req.params.id);
    res.status(200).send("Usuario eliminado");
  }
});

//Change Users Password

router.put("/change/password", auth, async (req, res) =>{
  const schemaUpdate = joi.object({    
    password: joi.string().alphanum().min(6),
    new_password: joi.string().alphanum().min(6),    
  });
  const result = schemaUpdate.validate({
    password: req.body.password,
    new_password : req.body.newPassword,
  });

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {       
    user = await data.changePassword(req.body.email, req.body.password, req.body.newPassword);
    user.message ? res.status(404).send("Usuario no encontrado") : res.json(user);
  }
    

})

module.exports = router;
