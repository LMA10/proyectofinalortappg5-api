const { Schema, model } = require("mongoose");

const indicatorSchema = new Schema({
  indicatorName: {
    type: String,
    required: true,
  },
  data: {
    type: Number,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
  },
  goalDate: {
    type: Date,
    required: true,
  },
  indicatorDate: {
    type: Date,
    required: true,
  },
  refSubEje: {
    type: String,
    required: true,
  },
  refEje: {
    type: String,
    required: true,
  },
  refMunicipio: {
    type: String,
    required: true,
  },
});

const IndicatorModel = model("Indicator", indicatorSchema, "indicators");

module.exports = { IndicatorModel };
