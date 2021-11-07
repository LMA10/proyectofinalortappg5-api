const { v4: uuidv4 } = require("uuid");
var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const NGSI = require("ngsijs");
const moment = require("moment");
const { response } = require("express");
const fiwareData = require("../data/indicator");

const asyncWrapper = (cb) => {
  return (req, res, next) => cb(req, res, next).catch(next);
};

const conVM = process.env.URL_VM_ORION;
//const conVM = process.env.URL_LOCAL_ORION //LOCAL
const connection = new NGSI.Connection(`${conVM}`);

router.get("/entities", auth, async (req, res, next) => {
  let arr = [];
  await connection.v2.listEntities({ limit: 100 }).then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});

router.get("/entities/:id", auth, async (req, res) => {
  await connection.v2.getEntity(req.params.id).then((response) => {
    res.status(200).send(response);
  });
});

router.get("/historical", auth, async (req, res) => {
  const historical = await fiwareData.getHistoricalIndicators();
  res.send(historical);
});

router.get("/entities/type/:type", auth, async (req, res) => {
  let arr = [];
  let type = req.params.type;
  await connection.v2.listEntities({ type: type }).then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});
router.get("/entities/query/:query", auth, async (req, res) => {
  let arr = [];
  let query = req.params.query;
  await connection.v2.listEntities({ q: query }).then((response) => {
    response.results.forEach((entity) => {
      arr.push(entity);
    });
  });
  res.send(arr);
});

router.delete(
  "/entities",
  auth,
  asyncWrapper(async (req, res) => {
    let id = req.body.id;
    let type = req.body.type;
    let respuesta;

    switch (type) {
      case "Municipio":
        await deleteMunicipio(id);
        break;
      case "Eje":
        await deleteEje(id);
        break;
      case "SubEje":
        await deleteSubEje(id);
        break;
      case "Indicator":
        await deleteIndicator(id);
        break;
      default:
        respuesta = null;
        break;
    }

    async function deleteMunicipio(id) {
      await connection.v2
        .listEntities({ q: "refMunicipio==" + id })
        .then((response) => {
          response.results.forEach((entity) => {
            deleteEje(entity.id);
          });
        });
      await connection.v2.deleteEntity(id).then((response) => {
        respuesta = response;
      });
    }

    async function deleteEje(id) {
      await connection.v2
        .listEntities({ q: "refEje==" + id })
        .then((response) => {
          response.results.forEach((entity) => {
            deleteSubEje(entity.id);
          });
        });
      await connection.v2.deleteEntity(id).then((response) => {
        respuesta = response;
      });
    }

    async function deleteSubEje(id) {
      await connection.v2
        .listEntities({ q: "refSubEje==" + id })
        .then((response) => {
          response.results.forEach((entity) => {
            deleteIndicator(entity.id);
          });
        });
      await connection.v2.deleteEntity(id).then((response) => {
        respuesta = response;
      });
    }

    async function deleteIndicator(id) {
      await connection.v2.deleteEntity(id).then((response) => {
        respuesta = response;
      });
    }
    res.status(200).send(respuesta);
  })
);

//cambiar elseif por switch
router.post(
  "/entities/add",
  auth,
  asyncWrapper(async (req, res) => {
    let id = uuidv4();
    let body = {
      id: "urn:ngsi-ld:" + req.body.type + ":" + id,
      type: req.body.type,
      name: {
        type: "Text",
        value: req.body.name,
      },
    };
    if (req.body.type == "Eje") {
      body.refMunicipio = {
        type: "Relationship",
        value: req.body.id,
      };
    } else if (req.body.type == "SubEje") {
      body.refEje = {
        type: "Relationship",
        value: req.body.id,
      };
    } else if (req.body.type == "Indicator") {
      body.indicatorType = {
        type: "Text",
        value: req.body.tipoDato,
      };
      body.description = {
        type: "Text",
        value: req.body.descripcion,
      };
      body.data = {
        type: "Integer",
        value: 0,
      };
      body.indicatorDate = {
        type: "DateTime",
        value: moment(Date()).format("YYYY-MM-DDThh:mm:ss.ssZ"),
      };
      body.goal = {
        type: "Integer",
        value: 0,
      };
      body.goalDate = {
        type: "DateTime",
        value: moment(Date()).format("YYYY-MM-DDThh:mm:ss.ssZ"),
      };
      body.refSubEje = {
        type: "Relationship",
        value: req.body.id,
      };
    }
    await connection.v2.createEntity(body).then((response) => {
      res.status(200).send(response.entity);
    });
  })
);

router.put("/entities/change/goal", auth, async (req, res) => {
  await connection.v2
    .updateEntityAttributes({
      id: req.body.id,
      goal: {
        type: "Integer",
        value: req.body.monto,
      },
      goalDate: {
        type: "DateTime",
        value: moment(req.body.fecha).format("YYYY-MM-DDThh:mm:ss.ssZ"),
      },
    })
    .then((response) => {
      addHistoricalValue(req.body.id);
      res.status(200).send(response);
    });
});

router.put("/entities/load/dataIndicator", auth, async (req, res) => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const formatToday = today.toISOString();
  await connection.v2
    .updateEntityAttributes({
      id: req.body.id,
      data: {
        type: "Integer",
        value: req.body.actMonto,
      },
      indicatorDate: {
        type: "DateTime",
        value: formatToday,
      },
    })
    .then((response) => {
      addHistoricalValue(req.body.id);
      res.status(200).send(response);
    });
});

router.put(
  "/entities/update",
  auth,
  asyncWrapper(async (req, res) => {
    const response = await connection.v2.updateEntityAttributes({
      id: req.body.id,
      ...(req.body.name
        ? { name: { type: "Text", value: req.body.name } }
        : {}),
      ...(req.body.indicatorType
        ? { indicatorType: { type: "Text", value: req.body.indicatorType } }
        : {}),
      ...(req.body.description
        ? { description: { type: "Text", value: req.body.description } }
        : {}),
    });
    res.status(200).send(response);
  })
);

async function addHistoricalValue(entityId) {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  const indicator = await connection.v2
    .getEntity({ id: entityId, keyValues: true })
    .then((response) => {
      return response.entity;
    });

  const subEje = await connection.v2
    .getEntity({ id: indicator.refSubEje, keyValues: true })
    .then((res) => {
      return res.entity;
    });

  const eje = await connection.v2
    .getEntity({ id: subEje.refEje, keyValues: true })
    .then((res) => {
      return res.entity;
    });

  const newValue = {
    refEje: eje.name,
    refSubEje: subEje.name,
    indicatorName: indicator.name,
    data: indicator.data,
    indicatorDate: `${date}`,
    goal: indicator.goal,
    goalDate: indicator.goalDate,
  };

  fiwareData.addIndicator(newValue);
}

//Endpoins Grafico
router.get("/graph/labels/:id", auth, async (req, res) => {
  const id = req.params.id;
  const arrDatos = await buscarMunicipio(id).then((response) => {
    return response;
  });
  res.status(200).send(arrDatos);
});

router.get("/graph/subEjes/:id", auth, async (req, res) => {
  const id = req.params.id;
  const subEjes = await buscarSubEjes(id).then((response) => {
    return response;
  });
  res.status(200).send(subEjes);
});

router.get("/graph/data/:id/:refEje", auth, async (req, res) => {
  const id = req.params.id;
  const refEje = req.params.refEje;
  const datos = await dataSubEjes(id).then((res) => {
    return res;
  });
  const respuesta = { refEje: refEje, kpi: datos };
  res.status(200).send(respuesta);
});

// Funciones Auxiliares graficos(habira que mandarlas a otro archivo y exportarlas)

const buscarMunicipio = async (id) => {
  const arr = [];
  const muni = await connection.v2
    .listEntities({ q: "refMunicipio==" + id })
    .then((response) => {
      return response.results;
    });
  await dataMunicipio(muni, arr);
  return arr;
};

const dataMunicipio = async (municipio, arr) => {
  await municipio.forEach((eje) => {
    arr.push({ label: eje.name.value, id: "refEje==" + eje.id });
  });
};

const buscarSubEjes = async (id) => {
  const subEjes = await connection.v2
    .listEntities({ q: id })
    .then((response) => {
      return response.results;
    });
  const data = subEjes.map((subEje) => {
    return { refEje: id, id: "refSubEje==" + subEje.id };
  });
  return data;
};

const dataSubEjes = async (id) => {
  const datoKpi = await connection.v2
    .listEntities({ q: id })
    .then((response) => {
      return kpi(response.results);
    });

  return datoKpi;
};

const kpi = (arrayIndicador) => {
  var promedio = 0;
  arrayIndicador.forEach((i) => {
    promedio += (i.data.value * 100) / i.goal.value;
  });
  return promedio / arrayIndicador.length;
};

module.exports = router;
