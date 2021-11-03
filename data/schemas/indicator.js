const { Schema, model } = require("mongoose");

const indicatorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
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
  indicatorType: {
    type: String,
    required: true,
  },
  refSubEje : {
    type: String,
    required: true
  }
});

const IndicatorModel = model("Indicator", indicatorSchema, "indicators");

module.exports = { IndicatorModel };
