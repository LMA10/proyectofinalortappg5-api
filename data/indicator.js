const connection = require("./connection");
const indicatorModel = require("./schemas/indicator");

async function getHistoricalIndicators() {
  await connection.getConnection();
  const indicators = await indicatorModel.IndicatorModel.find({}).sort("refEje");
  return indicators;
}

async function getHistoricalIndicatorsByMunicipio(municipioId) {
  await connection.getConnection();
  const indicators = await indicatorModel.IndicatorModel.find({refMunicipio: municipioId});
  return indicators;
}

async function addIndicator(indicator) {
  await connection.getConnection();
  const newIndicator = await indicatorModel.IndicatorModel(indicator);
  await newIndicator.save();
  return newIndicator;
}

async function getIndicator(indicatorId) {
  await connection.getConnection();
  const indicatorById = await indicatorModel.IndicatorModel.findById(
    indicatorId
  );
  return indicatorById;
}

module.exports = { getHistoricalIndicators, getHistoricalIndicatorsByMunicipio, addIndicator, getIndicator };
