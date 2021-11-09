const NGSI = require("ngsijs");
const conVM = process.env.URL_VM_ORION;
const connection = new NGSI.Connection(`${conVM}`);
const fiwareData = require("../data/indicator");

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
  
  async function addHistoricalValue(entityId) {
    let today = new Date();
    let date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  
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

 module.exports = {addHistoricalValue, dataSubEjes, buscarSubEjes, buscarMunicipio, kpi, dataMunicipio}