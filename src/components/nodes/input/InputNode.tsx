import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { InputNodeData, InputNodeType } from './InputNodeProps';

import './input_node.scss';

const InputNode: React.FC<NodeProps<InputNodeType>> = ({ id, data, selected }) => {
    const { setNodes } = useReactFlow<InputNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof InputNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };

    return (
        <div className={`tf-node ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node__header">Input</div>

            {/* Поля */}
            <div className="tf-node__body">
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

            {/* Выходной пин */}
            <Handle type="source" position={Position.Right} className="tf-node__connector" />
        </div>
    );
};

export default InputNode;
