import React, { useState, useRef, useCallback } from "react";
import ReactFlow, {
  Background,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

import Sidebar from "./Sidebar";

import "./index.css";

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

const DnDFlow = () => {
  const [workflow_id, setWorkflow_id] = useState(Date.now());
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

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
  // const handlesave = (e) => {
  //   e.preventDefault();
  //   const workflowData = {
  //     workflow_id,
  //     nodes,
  //     edges,
  //   };
  //   axios
  //     .post(
  //       `https://backenddeploy-techstax.onrender.com/workflow`,
  //       workflowData
  //     )
  //     .then((res) => {
  //       console.log(res.data.workflow_id);
  //       setWorkflow_id(res.data.workflow_id);
  //     });
  // };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <Sidebar />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background />

            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
