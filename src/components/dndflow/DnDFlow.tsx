import React, { useRef, useCallback, useEffect } from 'react';

import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Background,
    Connection,
    Edge,
    BackgroundVariant,
    MiniMap,
} from '@xyflow/react';

import Sidebar from '../sidebar/Sidebar';
import { useDnD } from '../../context/DnDContext';

/* import styles */
import '@xyflow/react/dist/style.css';
import './dndflow.scss';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import useScreenSize from '../../hooks/useScreenSize';

const proOptions = { hideAttribution: false };

const initialNodes = [
    {
        id: '1',
        type: 'Input',
        data: { label: 'Input' },
        position: { x: 250, y: 5 },
    },
];

let id = 0;
const getId = () => `tensorflow_node_${id++}`;

const DnDFlow: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const { screenToFlowPosition } = useReactFlow();

    const [type] = useDnD();

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((edges) => addEdge(params, edges));
        },
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type}` },
            };

            // setNodes((nodes) => [...nodes, newNode]);
            setNodes((nodes) => nodes.concat(newNode));
        },
        [screenToFlowPosition, setNodes, type]
    );

    // const { width } = useContainerDimensions(); // or useScreenSize(), etc.
    // const { screenWidth, screenHeight } = useScreenSize(); // or useScreenSize(), etc.

    // useEffect(() => {
    //     console.log("MY SCREEN SIZE: " + window.innerWidth + " x " + window.innerHeight);

    // });

    // const sidebarMinSizePixels = 250;
    // const sidebarMinSizePercentage = (sidebarMinSizePixels / window.innerWidth) * 100;

    // const sidebarDefaultSizePixels = 350;
    // const sidebarDefaultSizePercentage = (sidebarDefaultSizePixels / window.innerWidth) * 100;

    return (
        <div className="dndflow">
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel defaultSize={75}>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView
                            proOptions={proOptions}
                            style={{ backgroundColor: '#fff' }}
                        >
                            <MiniMap />
                            <Controls />
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        </ReactFlow>
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel collapsible maxSize={25} defaultSize={20} minSize={15}>
                    <Sidebar />
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default DnDFlow;

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
// import './page_training.scss';

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

// const PageTraining = () => {
//   const [colorMode, setColorMode] = useState<ColorMode>('light');
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
//     <div style={{ width: '100%', height: '100%' }}>
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

//         {/* <Panel position="top-right">
//           <select onChange={onChange} data-testid="colormode-select">
//             <option value="dark">dark</option>
//             <option value="light">light</option>
//             <option value="system">system</option>
//           </select>
//         </Panel> */}
//       </ReactFlow>
//     </div>
//   )
// }

// export default PageTraining;
