/**========================================================================
 **                            OLD
 *========================================================================**/

// import React, { useCallback, useState, type ChangeEventHandler } from 'react';
// import { 
//   ReactFlow,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   MiniMap,
//   Background,
//   BackgroundVariant,
//   Controls,
//   Connection,
//   Panel,
//   Position,
//   type Node,
//   type Edge,
//   type ColorMode,
//   type OnConnect,
// } from '@xyflow/react';

// import '@xyflow/react/dist/style.css';

// // const initialNodes = [
// //   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
// //   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// // ];
// // const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

// const nodeDefaults = {
//   sourcePosition: Position.Right,
//   targetPosition: Position.Left,
// };
 
// const initialNodes: Node[] = [
//   {
//     id: 'A',
//     type: 'input',
//     position: { x: 0, y: 150 },
//     data: { label: 'A' },
//     ...nodeDefaults,
//   },
//   {
//     id: 'B',
//     position: { x: 250, y: 0 },
//     data: { label: 'B' },
//     ...nodeDefaults,
//   },
//   {
//     id: 'C',
//     position: { x: 250, y: 150 },
//     data: { label: 'C' },
//     ...nodeDefaults,
//   },
//   {
//     id: 'D',
//     position: { x: 250, y: 300 },
//     data: { label: 'D' },
//     ...nodeDefaults,
//   },
// ];
 
// const initialEdges: Edge[] = [
//   {
//     id: 'A-B',
//     source: 'A',
//     target: 'B',
//   },
//   {
//     id: 'A-C',
//     source: 'A',
//     target: 'C',
//   },
//   {
//     id: 'A-D',
//     source: 'A',
//     target: 'D',
//   },
// ];

// const App = () => {
//   const [colorMode, setColorMode] = useState<ColorMode>('dark');
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params: Connection) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges],
//   );

//   const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
//     setColorMode(evt.target.value as ColorMode);
//   };

//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         colorMode={colorMode}
//         fitView
//       >
//         <Controls />
//         <MiniMap />
//         <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

//         <Panel position="top-right">
//           <select onChange={onChange} data-testid="colormode-select">
//             <option value="dark">dark</option>
//             <option value="light">light</option>
//             <option value="system">system</option>
//           </select>
//         </Panel>
//       </ReactFlow>
//     </div>
//   );
// };

// export default App;


/**========================================================================
 **                            NEW
 *========================================================================**/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// import Menu
import Menu from "./components/Menu";

// import pages
import Dataset from "./pages/Dataset";
import Training from "./pages/Training";
import Evaluation from "./pages/Evaluation";
import Settings from "./pages/Settings";
import About from "./pages/About";

const App = () => {
    return (
        <Router>
            <div className="d-flex vh-100">
                <Menu />
                <div className="flex-grow-1 p-4">
                    <Routes>
                        <Route path="/" element={<Dataset />} />
                        <Route path="/training" element={<Training />} />
                        <Route path="/evaluation" element={<Evaluation />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App