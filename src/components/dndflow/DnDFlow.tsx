import React, { useRef, useCallback, useEffect, useState } from 'react';

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
    Node as RFNode,
    Edge as RFEdge,
    BackgroundVariant,
    MiniMap,
} from '@xyflow/react';

import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import Sidebar from '../sidebar/Sidebar';
import { useDnD } from '../../context/DnDContext';

import InputNode from '../nodes/input/InputNode';
import DenseNode from '../nodes/dense/DenseNode';
import DropoutNode from '../nodes/dropout/DropoutNode';
import GaussianDropoutNode from '../nodes/gaussian_dropout/GaussianDropoutNode';
import GaussianNoiseNode from '../nodes/gaussian_noise/GaussianNoiseNode';
import FlattenNode from '../nodes/flatten/FlattenNode';
import Conv2DNode from '../nodes/conv_2d/Conv2DNode';

import { useArchitectureStore } from '../../store/ArchitectureStore';

/* import styles */
import '@xyflow/react/dist/style.css';
import './dnd_flow.scss';

const proOptions = { hideAttribution: false };

export type NodeTypes = {
    TF_INPUT_LAYER_NODE: typeof InputNode;
    TF_DENSE_LAYER_NODE: typeof DenseNode;
    TF_DROPOUT_LAYER_NODE: typeof DropoutNode;
    TF_GAUSSIAN_DROPOUT_LAYER_NODE: typeof GaussianDropoutNode;
    TF_GAUSSIAN_NOISE_LAYER_NODE: typeof GaussianNoiseNode;
    TF_CONV_2D_LAYER_NODE: typeof Conv2DNode;
    TF_FLATTEN_LAYER_NODE: typeof FlattenNode;
};

const nodeTypes: NodeTypes = {
    TF_INPUT_LAYER_NODE: InputNode,
    TF_DENSE_LAYER_NODE: DenseNode,
    TF_DROPOUT_LAYER_NODE: DropoutNode,
    TF_GAUSSIAN_DROPOUT_LAYER_NODE: GaussianDropoutNode,
    TF_GAUSSIAN_NOISE_LAYER_NODE: GaussianNoiseNode,
    TF_CONV_2D_LAYER_NODE: Conv2DNode,
    TF_FLATTEN_LAYER_NODE: FlattenNode,
};

// const initialNodes = [
//     {
//         id: '1',
//         type: 'TF_INPUT_LAYER_NODE' as const,
//         position: { x: 0, y: 0 },
//         data: {
//             tf_layer_name: 'input_layer',
//             tf_layer_neurons_count: 128,
//         },
//     },
// ];

let id = 0;
const getId = () => `tensorflow_node_${id++}`;

const DnDFlow: React.FC = () => {
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange
    } = useArchitectureStore();

    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    // const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const { screenToFlowPosition } = useReactFlow();

    const [type] = useDnD();

    // sidebar panel
    const dndFlowWrapper = useRef<HTMLDivElement>(null);
    const sidebarWrapper = useRef<ImperativePanelHandle>(null);

    const { fitView } = useReactFlow();
    const [isFitViewExecuted, setIsFitViewExecuted] = useState(false);

    // const CURRENT_MENU_SIZE_IN_PX = menuSize / 100.0 * window.innerWidth;
    const PAGE_CONTAINER_WIDTH = dndFlowWrapper.current?.getBoundingClientRect().width || window.innerWidth;

    const SIDEBAR_DEFAULT_SIZE_IN_PX = 375;
    const [sidebarDefaultSize, setMenuDefaultSize] = useState(
        (SIDEBAR_DEFAULT_SIZE_IN_PX / PAGE_CONTAINER_WIDTH) * 100
    );

    const SIDEBAR_MIN_SIZE_IN_PX = 300;
    const [sidebarMinSize, setMenuMinSize] = useState((SIDEBAR_MIN_SIZE_IN_PX / PAGE_CONTAINER_WIDTH) * 100);

    const SIDEBAR_MAX_SIZE_IN_PX = 500;
    const [sidebarMaxSize, setMenuMaxSize] = useState((SIDEBAR_MAX_SIZE_IN_PX / PAGE_CONTAINER_WIDTH) * 100);

    // Обновляем размер меню при изменении окна
    useEffect(() => {
        // вызвать один раз при первом рендеринге страницы
        // центрирование диаграммы
        if (!isFitViewExecuted) {
            setTimeout(() => {
                fitView();
            }, 0);

            setIsFitViewExecuted(true);
        }

        const handleResize = () => {
            const dndFlowWidth = dndFlowWrapper.current?.getBoundingClientRect().width || window.innerWidth;
            // console.log('Текущая ширина меню:', dndFlowWidth);

            setMenuDefaultSize((SIDEBAR_DEFAULT_SIZE_IN_PX / dndFlowWidth) * 100);

            setMenuMinSize((SIDEBAR_MIN_SIZE_IN_PX / dndFlowWidth) * 100);
            setMenuMaxSize((SIDEBAR_MAX_SIZE_IN_PX / dndFlowWidth) * 100);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [fitView, isFitViewExecuted]);

    const onConnect = useCallback(
        (params: Connection) => {
            const newEdge = {
                ...params,
                id: `${params.source}-${params.target}`
            };
            // setEdges((edges) => addEdge(params, edges));
            setEdges(addEdge(newEdge, edges));
        },
        [edges, setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // const onDrop = useCallback(
    //     (event: React.DragEvent) => {
    //         event.preventDefault();

    //         if (!type) return;

    //         const position = screenToFlowPosition({
    //             x: event.clientX,
    //             y: event.clientY,
    //         });

    //         const newNode = {
    //             id: getId(),
    //             type,
    //             position,
    //             data: { label: `${type}` },
    //         };

    //         // setNodes((nodes) => [...nodes, newNode]);
    //         setNodes((nodes) => nodes.concat(newNode));
    //     },
    //     [screenToFlowPosition, setNodes, type]
    // );

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
                data: getNodeData(type),
            };

            // setNodes((nodes) => nodes.concat(newNode));
            setNodes([...nodes, newNode]);
        },
        [nodes, setNodes, type, screenToFlowPosition]
    );

    const getNodeData = (type: string) => {
        switch (type) {
            case 'TF_INPUT_LAYER_NODE':
                return {
                    tf_layer_name: 'new_input',
                    tf_layer_neurons_count: 64,
                };
            case 'TF_DENSE_LAYER_NODE':
                return {
                    tf_layer_name: 'new_dense',
                    tf_layer_neurons_count: 128,
                    tf_layer_activation_function: 'sigmoid',
                    tf_layer_use_bias: 1,
                };
            case 'TF_DROPOUT_LAYER_NODE':
                return {
                    tf_layer_name: 'new_dropout',
                    tf_layer_strength: 0.5,
                };
            case 'TF_GAUSSIAN_DROPOUT_LAYER_NODE':
                return {
                    tf_layer_name: 'new_gaussian_dropout',
                    tf_layer_strength: 0.5,
                };
            case 'TF_GAUSSIAN_NOISE_LAYER_NODE':
                return {
                    tf_layer_name: 'new_gaussian_noise',
                    tf_layer_stddev: 0.1,
                };
            case 'TF_CONV_2D_LAYER_NODE':
                return {
                    tf_layer_name: 'new_conv_2d',
                    tf_layer_filters_count: 64,
                    tf_layer_kernel_size: [3, 3],
                    // tf_layer_strides: [1, 1],
                    // tf_layer_padding: 'valid',
                    // tf_layer_data_format: 'channels_last',
                    // tf_layer_dilation_rate: [1, 1],
                    tf_layer_activation_function: 'sigmoid',
                    tf_layer_use_bias: 1,
                };
            case 'TF_FLATTEN_LAYER_NODE':
                return;
            default:
                return { label: type };
        }
    };

    return (
        <div className="dnd-flow" ref={dndFlowWrapper}>
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel defaultSize={100 - (sidebarWrapper.current?.getSize() || sidebarMaxSize)}>
                    <div className="react-flow-wrapper">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            proOptions={proOptions}
                            style={{ backgroundColor: '#fff' }}
                            fitView
                        >
                            <MiniMap />
                            <Controls />
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        </ReactFlow>
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel
                    collapsible
                    defaultSize={sidebarDefaultSize}
                    minSize={sidebarMinSize}
                    maxSize={sidebarMaxSize}
                    ref={sidebarWrapper}
                >
                    <Sidebar />
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default DnDFlow;