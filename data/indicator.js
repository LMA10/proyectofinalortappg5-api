const connection = require("./connection");
const indicatorModel = require("./schemas/indicator");

async function getAllIndicators() {
  await connection.getConnection();
  const indicators = await indicatorModel.IndicatorModel.find({});
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

module.exports = { getAllIndicators, addIndicator, getIndicator };
