import React, { useState, useCallback } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, Node, Edge } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css'; // Import ReactFlow styles
import axios from 'axios';
import './App.css'; // Import Tailwind CSS

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Explore' },
    position: { x: 250, y: 0 },
    type: 'input',
  },
];

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const fetchTopCategories = async () => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
      const categories = response.data.categories.slice(0, 5).map((cat: any, index: number) => ({
        id: `cat-${index}`,
        data: { label: cat.strCategory },
        position: { x: 250 * (index + 1), y: 100 },
        type: 'default',
      }));
      setNodes((nds) => [...nds, ...categories]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.id === '1') {
      fetchTopCategories();
    } else {
      console.log('Node clicked:', node);
    }
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full h-full" style={{ height: '100vh', width: '100vw' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          style={{ backgroundColor: '#FAFAFA' }}
        />
      </div>
    </div>
  );
};

export default App;
