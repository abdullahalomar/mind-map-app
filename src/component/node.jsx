import { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
} from "reactflow";
import { saveMindMap, loadMindMap } from "../storage";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Mind Map" },
    position: { x: 0, y: 0 },
    style: { border: "3px solid #0F1035", fontWeight: "bold" },
  },
];
const initialEdges = [];
const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

export default function MindNode() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");

  const addNode = () => {
    setNodes((e) =>
      e.concat({
        id: (e.length + 1).toString(),
        data: { label: `${name}` },
        position: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
        style: { border: "3px solid #0F1035", fontWeight: "bold" },
      })
    );
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const handleSaveClick = () => {
    saveMindMap(nodes, edges);
    console.log(nodes);
  };
  const handleLoadClick = () => {
    const loadedData = loadMindMap();
    if (loadedData) {
      setNodes(loadedData.nodes);
      setEdges(loadedData.edges);
      console.log(loadedData);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };
  // const nodeOrigin = [0.5, 0.5];
  const connectionLineStyle = {
    stroke: "#9999",
    strokeWidth: 5,
  };
  const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

  const [isLightMode, setIsLightMode] = useState(false);

  const toggleLightMode = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  const containerStyle = {
    backgroundColor: isLightMode ? "#E5D4FF" : "", // Set white background when light mode is active
  };

  const buttonStyle = {
    backgroundColor: isLightMode ? "bg-slate-500" : "",
  };
  const buttonColor = {
    color: isLightMode ? "text-white" : "",
  };

  return (
    <div className="">
      <div
        className="bg-slate-800 rounded-lg"
        style={containerStyle}
        id="container"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          onConnect={onConnect}
          onLoad={onLoad}
          fitView
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === "input") return "";

              return "#FFCC00";
            }}
          />
        </ReactFlow>
        <div className="flex justify-center mb-10">
          <div className="flex mt-2 me-3">
            <div className="">
              <input
                className="border-cyan-600 rounded-md"
                type="text"
                onChange={(e) => setName(e.target.value)}
                name="title"
              />
            </div>
            <div className="ms-2">
              <button
                className="bg-sky-600 py-2 px-8 text-white font-bold rounded-md hover:bg-sky-800"
                id="one"
                type="button"
                onClick={addNode}
              >
                Add Node
              </button>
            </div>
          </div>
          <div className="mt-2">
            {/* <button
              className="bg-green-600 py-2 px-8 text-white font-bold rounded-md hover:bg-green-800 me-2"
              id="two"
              onClick={handleSaveClick}
            >
              Save Mind Map
            </button> */}
            <button
              className="bg-yellow-500 py-2 px-8 text-white font-bold rounded-md hover:bg-yellow-600 me-2"
              id="three"
              onClick={handleLoadClick}
            >
              Load Mind Map
            </button>
            <button
              className="bg-red-500 py-2 px-8 text-white font-bold rounded-md hover:bg-red-600"
              id="four"
              onClick={refreshPage}
            >
              Refresh
            </button>
            <button
              id="dark"
              className={`bg-violet-200 py-2 px-8 text-black font-bold rounded-md ms-10 ${buttonStyle.backgroundColor} ${buttonColor.color}`}
              onClick={toggleLightMode}
            >
              {isLightMode ? "Dark mood" : "Light mood"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
