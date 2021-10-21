var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const NGSI = require("ngsijs");

const connection = new NGSI.Connection("http://localhost:1026");

router.get("/entities", auth, async (req, res, next) => {
  let arr = [];
  await connection.v2.listEntities().then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});

router.get("/entities/:id", auth, async (req, res) => {
  await connection.v2.getEntity(req.params.id).then((response) => {
      res.status(200).send(response)
  });
});

module.exports = router;
