var express = require("express");
var router = express.Router();
const data = require("../data/role");
const auth = require("../middleware/auth");
const joi = require("joi");

//Get All Roles
router.get("/", auth, async function (req, res, next) {
  const roles = await data.getAllRoles();
  res.send(roles);
});

//Add role
router.post("/", async (req, res) => {
  const result = await data.addRole(req.body);
  res.send(result);
});

//Find Role
router.get("/:id", async (req, res) => {
  const role = await data.getRole(req.params.id);
  if (role) {
    res.json(role);
  } else {
    res.status(404).send("Not Found");
  }
});

//Update Role
router.post("/:id", auth, async (req, res) => {
  const schema = joi.object({
    //fecha: joi.string().alphanum().min(3).required(),
  });
  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {
    let role = req.body;
    role._id = req.params.id;
    role = await data.updateRole(role);
    res.json(role);
  }
});

//Delete Role
router.delete("/:id", async (req, res) => {
  const role = await data.getRole(req.params.id);
  if (!role) {
    res.status(404).send("Not Found");
  } else {
    data.deleteRole(req.params.id);
    res.status(200).send("Role Deleted");
  }
});

module.exports = router;
