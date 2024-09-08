import React, { useState } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;
const Sidebar = () => {
  const [workflow_id, setWorkflow_id] = useState(Date.now());
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const workid = {
    workflow_id: workflow_id,
  };
  const getData = () => {
    const payload = {
      workflow_id: workflow_id,
      nodes: nodes,
      edges: edges, // Include edges to define connections between nodes
    };
    return axios.post(
      "https://backenddeploy-techstax.onrender.com/workflow",
      payload
    );
  };
  const handlesave = (e) => {
    e.preventDefault();
    getData().then((res) => {
      console.log(res.data.workflow_id);
      setWorkflow_id(res.data.workflow_id);
    });
  };
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">WorkFlow Node</div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "Start")}
        draggable
      >
        Start
      </div>

      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "Filter Data")}
        draggable
      >
        Filter Data
      </div>

      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "Wait")}
        draggable
      >
        Wait (60 seconds)
      </div>

      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "Convert Formate")}
        draggable
      >
        Convert Formate
      </div>

      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "Send Post Request")}
        draggable
      >
        Send Post Request
      </div>

      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "End")}
        draggable
      >
        End
      </div>

      <div className="inputtag">
        <p>
          Workflow ID:
          <span>{workflow_id}</span>
        </p>
        <br />
        <button className="btntag" onClick={handlesave}>
          Save Workflow
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
