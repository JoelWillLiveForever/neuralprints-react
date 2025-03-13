import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { DenseNodeData, DenseNodeType } from './DenseNodeProps';

import './dense_node.scss';

const DenseNode: React.FC<NodeProps<DenseNodeType>> = ({ id, data, selected }) => {
    const { setNodes } = useReactFlow<DenseNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof DenseNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };

    return (
        <div className={`tf-node-dense ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-dense__header">Dense</div>

            {/* Поля */}
            <div className="tf-node-dense__body">
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
            <Handle type="target" position={Position.Left} className="tf-node-dense__connector tf-node-dense__connector--target" />

            {/* Выходной пин */}
            <Handle type="source" position={Position.Right} className="tf-node-dense__connector tf-node-dense__connector--source" />
        </div>
    );
};

export default DenseNode;
