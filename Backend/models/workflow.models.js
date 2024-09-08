const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
  workflow_id: String,
  nodes: Array,
  edges: Array,
});

Workflowmodel = mongoose.model("workflow", modelSchema);
module.exports = { Workflowmodel };
