import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { DropoutNodeData, DropoutNodeType } from './DropoutNodeProps';

import './dropout_node.scss';

const DropoutNode: React.FC<NodeProps<DropoutNodeType>> = ({ id, data, selected }) => {
    const { setNodes } = useReactFlow<DropoutNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof DropoutNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };

    return (
        <div className={`tf-node-dropout ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-dropout__header">Dropout</div>

            {/* Поля */}
            <div className="tf-node-dropout__body">
                <div className='property'>
                    <label className='property__key'>Name</label>
                    <input
                        type="text"
                        value={data.tf_layer_name}
                        onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                        className="property__value"
                    />
                </div>

                <div className='property'>
                    <label className='property__key'>Neurons</label>
                    <input
                        type="number"
                        value={data.tf_layer_neurons_count}
                        onChange={(e) => handleChange('tf_layer_neurons_count', Number(e.target.value))}
                        className="property__value"
                        min={1}
                    />
                </div>
            </div>

            {/* Входной пин */}
            <Handle type="target" position={Position.Left} className="tf-node-dropout__connector tf-node-dropout__connector--target" />

            {/* Выходной пин */}
            <Handle type="source" position={Position.Right} className="tf-node-dropout__connector tf-node-dropout__connector--source" />
        </div>
    );
};

export default DropoutNode;
