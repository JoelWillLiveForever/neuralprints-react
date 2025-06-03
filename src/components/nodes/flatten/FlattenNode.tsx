import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { FlattenNodeType } from './FlattenNodeProps';

import './flatten_node.scss';

const FlattenNode: React.FC<NodeProps<FlattenNodeType>> = ({ id, selected }) => {
    const { setNodes, setEdges } = useReactFlow<FlattenNodeType>(); // Типизируем useReactFlow

    const handleDeleteNode = () => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    };

    return (
        <div className={`tf-node-flatten ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-flatten__header">
                <span>Flatten</span>
                <button onClick={handleDeleteNode} className="delete-btn" title="Delete node">
                    <i className="bi bi-trash-fill"></i>
                </button>
            </div>

            {/* Поля */}
            <div className="tf-node-flatten__body">

                {/* AUXILIARY LAYER */}
                NO PARAMETERS

            </div>

            {/* Входной пин */}
            <Handle
                type="target"
                position={Position.Left}
                className="tf-node-flatten__connector tf-node-flatten__connector--target"
            />

            {/* Выходной пин */}
            <Handle
                type="source"
                position={Position.Right}
                className="tf-node-flatten__connector tf-node-flatten__connector--source"
            />
        </div>
    );
};

export default FlattenNode;
