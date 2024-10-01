import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'explore',
    position: { x: 50, y: 200 }, // Position for the "Explore" node on the left
    data: {
      label: (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Explore
        </button>
      ),
    },
    style: {
      borderRadius: '12px',
      padding: '10px',
      backgroundColor: '#F9FAFB',
      border: '1px solid #E5E7EB',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
  },
];
const initialEdges = [];

const fetchCategories = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await response.json();
  return data.categories.slice(0, 5); // Get top-5 categories
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isClicked, setIsClicked] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleExploreClick = useCallback(async () => {
    if (isClicked) return; // Prevent multiple clicks

    const categories = await fetchCategories();
    const newNodes = categories.map((category, index) => ({
      id: category.idCategory,
      position: { x: 200, y: 100 + index * 100 }, // Vertical arrangement starting from (200, 100)
      data: {
        label: (
          <div className="p-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition">
            {category.strCategory}
          </div>
        ),
      },
      style: {
        borderRadius: '12px',
        padding: '10px',
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    }));

    setNodes((nds) => [...nds, ...newNodes]);
    const newEdges = newNodes.map((node) => ({
      id: `e-explore-${node.id}`,
      source: 'explore',
      target: node.id,
      type: 'smoothstep',
    }));

    setEdges((eds) => [...eds, ...newEdges]);
    setIsClicked(true);
  }, [setNodes, setEdges, isClicked]);

  useEffect(() => {
    // Update "Explore" node with click handler
    setNodes((nds) =>
      nds.map((node) =>
        node.id === 'explore'
          ? {
              ...node,
              data: {
                label: (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={handleExploreClick}
                  >
                    Explore
                  </button>
                ),
              },
            }
          : node
      )
    );
  }, [setNodes, handleExploreClick]);

  return (
    <div className="w-screen h-screen bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
