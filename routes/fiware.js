var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const NGSI = require("ngsijs");
const { response } = require("express");
const moment = require("moment");
const conVM = process.env.URL_LOCAL_ORION
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
  let type = req.params.type
  await connection.v2.listEntities({ type: type }).then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});
router.get("/entities/query/:query", auth, async (req, res) => {
  let arr = [];
  let query = req.params.query
  await connection.v2.listEntities({ q: query }).then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});


router.put("/entities/add/goal", auth, async (req, res) => {
  await connection.v2.updateEntityAttributes({
    "id":req.body.id,
    "goal":{
      "type":"Integer",
      "value":req.body.monto,
    },
    "goalDate":{
      "type":"DateTime",
      "value":moment((req.body.fecha)).format('YYYY-MM-DDThh:mm:ss.ssZ')
    }
  }).then((response)=>{
    res.status(200).send(response)
  })
});



module.exports = router;
