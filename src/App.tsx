import { Node } from '@xyflow/react'; // Add this import at the top
import { BackgroundVariant } from '@xyflow/react'; // Make sure BackgroundVariant is imported
import { useCallback, useEffect, useState } from 'react';
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

const initialEdges: any[] = []; // Define the type for initialEdges


const fetchCategories = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await response.json();
  return data.categories.slice(0, 5); // Get top-5 categories
};

const fetchMealsByCategory = async (categoryId:string) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`);
  const data = await response.json();
  return data.meals ? data.meals.slice(0, 5) : []; // Get top-5 meals for the category
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentViewMealsNodeId, setCurrentViewMealsNodeId] = useState<string | null>(null); // Track the current View Meals node ID

  const onConnect = useCallback(
    (params:any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleExploreClick = useCallback(async () => {
    // Fetch top-5 categories and create nodes
    const categories = await fetchCategories();
    const newNodes = categories.map((category:any, index:number) => ({
      id: category.idCategory,
      position: { x: 200, y: 100 + index * 100 }, // Vertical arrangement starting from (200, 100)
      data: {
        label: (
          <div
            className="p-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition cursor-pointer"
            onClick={() => handleCategoryClick(category.idCategory)}
          >
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

    // Update nodes and edges
    setNodes((nds) => [...nds, ...newNodes]);
    const newEdges = newNodes.map((node) => ({
      id: `e-explore-${node.id}`,
      source: 'explore',
      target: node.id,
      type: 'smoothstep', // Use smoothstep for a curved edge effect
    }));

    setEdges((eds) => [...eds, ...newEdges]);
  }, [setNodes, setEdges]);

  const handleCategoryClick = useCallback(async (categoryId:string) => {
    // Remove the previous View Meals node if it exists
    if (currentViewMealsNodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== currentViewMealsNodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== currentViewMealsNodeId));
    }


    // Create the new View Meals node
    const newViewMealsNodeId = `viewMeals-${categoryId}`;
    const newViewMealsNode = {
      id: newViewMealsNodeId,
      position: { x: 400, y: 100 }, // Position next to the selected category
      data: {
        label: (
          <div
            className="p-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition cursor-pointer"
            onClick={() => handleViewMealsClick(categoryId)} // Add click handler to View Meals node
          >
            View Meals
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
    };

    // Update nodes with the new View Meals node
    setNodes((nds) => [...nds, newViewMealsNode]);
    setCurrentViewMealsNodeId(newViewMealsNodeId); // Store the current View Meals node ID

    // Create edges from category to View Meals
    setEdges((eds) => [
      ...eds,
      {
        id: `e-${categoryId}-viewMeals`,
        source: categoryId,
        target: newViewMealsNodeId,
        type: 'smoothstep',
      },
    ]);
  }, [setNodes, setEdges, currentViewMealsNodeId]);

  const handleViewMealsClick = useCallback(async (categoryId:string) => {
    // Fetch meals for the selected category
    const meals: any[] = await fetchMealsByCategory(categoryId); // Ensure meals 

    // Create meal nodes and edges
    const mealNodes = meals.map((meal:any, index:number) => ({
      id: meal.idMeal,
      position: { x: 600, y: 100 + index * 100 }, // Vertical arrangement for meal nodes
      data: {
        label: (
          <div className="p-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition">
            {meal.strMeal}
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

    setNodes((nds) => [...nds, ...mealNodes]);
    const newMealEdges = mealNodes.map((node) => ({
      id: `e-viewMeals-${node.id}`,
      source: `viewMeals-${categoryId}`,
      target: node.id,
      type: 'smoothstep',
    }));

    setEdges((eds) => [...eds, ...newMealEdges]);
  }, [setNodes, setEdges]);

  useEffect(() => {
    // Update "Explore" node with click handler
    setNodes((nds) =>
      nds.map((node: Node) =>
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
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} /> 
      </ReactFlow>
    </div>
  );
}
