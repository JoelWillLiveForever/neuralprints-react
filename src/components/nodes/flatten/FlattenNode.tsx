import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

import type { FlattenNodeType } from './FlattenNodeProps';

import './flatten_node.scss';

const FlattenNode: React.FC<NodeProps<FlattenNodeType>> = ({ selected }) => {
    return (
        <div className={`tf-node-flatten ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-flatten__header">Flatten</div>

            {/* Поля */}
            <div className="tf-node-flatten__body">

                AUXILIARY LAYER

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
