import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { GaussianNoiseNodeData, GaussianNoiseNodeType } from './GaussianNoiseNodeProps';

import './gaussian_noise_node.scss';
import BeautifulSlider from '../../beautiful_slider/BeautifulSlider';
import BeautifulField from '../../beautiful_field/BeautifulField';

const GaussianNoiseNode: React.FC<NodeProps<GaussianNoiseNodeType>> = ({ id, data, selected }) => {
    const { setNodes, setEdges } = useReactFlow<GaussianNoiseNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof GaussianNoiseNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };

    const handleDeleteNode = () => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    };
    
    return (
        <div className={`tf-node-gaussian-noise ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-gaussian-noise__header">
                <span>Gaussian Noise</span>
                <button onClick={handleDeleteNode} className="delete-btn" title="Delete node">
                    <i className="bi bi-trash-fill"></i>
                </button>
            </div>

            {/* Поля */}
            <div className="tf-node-gaussian-noise__body">
                <BeautifulField
                    value={data.tf_layer_name}
                    onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                    type="text"
                    label="Name"
                    placeholder='Input layer name'
                    color='#5D4037'
                />

                <BeautifulSlider
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
                    min={0}
                    max={1}
                    step={0.001}
                    color='#5D4037'
                    label='Stddev'
                />

                {/* <div className="property">
                    <div className="property__slider-wrapper">
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
                </div> */}
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
