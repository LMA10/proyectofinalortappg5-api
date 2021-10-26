var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const NGSI = require("ngsijs");
const conVM = process.env.URL_VM_ORION
const connection = new NGSI.Connection(`${conVM}`);

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


router.get("/entities/type/:type", auth, async (req, res) => {
  let arr = [];
  let type=req.params.type
  await connection.v2.listEntities({type:type}).then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});
router.get("/entities/query/:query", auth, async (req, res) => {
  let arr = [];
  let query=req.params.query
  await connection.v2.listEntities({q:query}).then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});



module.exports = router;
