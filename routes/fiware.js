const { v4: uuidv4 } = require('uuid');
var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const NGSI = require("ngsijs");


// const conVM = process.env.URL_VM_ORION
const conVM = process.env.URL_LOCAL_ORION //LOCAL
const connection = new NGSI.Connection(`${conVM}`);

router.get("/entities", auth, async (req, res, next) => {
  let arr = [];
  await connection.v2.listEntities({limit:100}).then((response) => {
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


router.post("/entities/add", auth, async (req, res) => {

  let id = uuidv4()
  let body = {
    "id": "urn:ngsi-ld:" + req.body.type + ":" + id,
    "type": req.body.type,
    "name": {
      "type": "Text",
      "value": req.body.name
    }
  }
  if (req.body.type == "Eje") {
    body.refMunicipio = {
      "type": "Relationship",
      "value": req.body.id,
    }}
 else if(req.body.type == "SubEje") {
  body.refEje = {
    "type": "Relationship",
    "value": req.body.id,
  }  
 }
 else if(req.body.type == "Indicator") {
   body.indicatorType ={
     "type" : "Text",
     "value" : req.body.tipoDato
   }
   body.description ={
     "type" : "Text",
     "value" : req.body.descripcion
   }
  body.refSubEje = {
    "type": "Relationship",
    "value": req.body.id,
  }
  
}
  await connection.v2.createEntity(body).then((response) => {
    res.status(200).send(response.entity);
  })


});


module.exports = router;
