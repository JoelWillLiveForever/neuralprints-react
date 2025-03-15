import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { GaussianNoiseNodeData, GaussianNoiseNodeType } from './GaussianNoiseNodeProps';

import './gaussian_noise_node.scss';

const GaussianNoiseNode: React.FC<NodeProps<GaussianNoiseNodeType>> = ({ id, data, selected }) => {
    const { setNodes } = useReactFlow<GaussianNoiseNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof GaussianNoiseNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };
    
    return (
        <div className={`tf-node-gaussian-noise ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-gaussian-noise__header">Gaussian Noise</div>

            {/* Поля */}
            <div className="tf-node-gaussian-noise__body">
                <div className="property">
                    <label className="property__key">Name</label>
                    <input
                        type="text"
                        value={data.tf_layer_name}
                        onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                        className="nopan nodrag property__value"
                    />
                </div>

                <div className="property">
                    <div className="property__slider-wrapper">
                        {/* <label className="property__key">Strength</label> */}
                        <input
                            className="nopan nodrag nowheel slider-input"
                            type="range"
                            min={0}
                            max={1}
                            step={0.001}
                            value={data.tf_layer_stddev}
                            onChange={(e) => handleChange('tf_layer_stddev', parseFloat(e.target.value))}
                            onWheel={(e) => {
                                e.preventDefault();

                                const step = 0.05;
                                const delta = e.deltaY < 0 ? step : -step;

                                let newValue = Number(data.tf_layer_stddev) + delta;
                                newValue = Math.min(1, Math.max(0, newValue));

                                handleChange('tf_layer_stddev', Number(newValue.toFixed(3)));
                            }}
                        />
                        <div className="slider-overlay">
                            <span className="slider-label">Strength</span>
                            <span className="slider-value">{Number(data.tf_layer_stddev).toFixed(3)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Входной пин */}
            <Handle
                type="target"
                position={Position.Left}
                className="tf-node-gaussian-noise__connector tf-node-gaussian-noise__connector--target"
            />

            {/* Выходной пин */}
            <Handle
                type="source"
                position={Position.Right}
                className="tf-node-gaussian-noise__connector tf-node-gaussian-noise__connector--source"
            />
        </div>
    );
};

export default GaussianNoiseNode;
