// models/DataSet.js
const mongoose = require("mongoose");

const chartDatasetSchema = new mongoose.Schema(
  {
    xAxis: { type: String, default: null },
    yAxis: { type: String, default: null },
    data: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { _id: false, timestamps: false } // we don't need timestamps for nested schema
);

const dataSetSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rows: [mongoose.Schema.Types.Mixed],
  uploadedAt: { type: Date, default: Date.now }, // will always be set at creation
  chartType: {
    type: String,
    enum: ["bar", "line", "pie", "scatter", null],
    default: null,
    validate: {
      validator: function (v) {
        return v === null || ["bar", "line", "pie", "scatter"].includes(v);
      },
      message: (props) => `${props.value} is not a valid chart type!`
    }
  },
  dataset: {
    type: chartDatasetSchema,
    default: {
      xAxis: null,
      yAxis: null,
      data: null
    }
  }
});

module.exports = mongoose.model("DataSet", dataSetSchema);
