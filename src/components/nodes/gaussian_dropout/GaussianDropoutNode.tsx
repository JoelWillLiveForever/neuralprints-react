import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { GaussianDropoutNodeData, GaussianDropoutNodeType } from './GaussianDropoutNodeProps';

import './gaussian_dropout_node.scss';
import BeautifulSlider from '../../beautiful_slider/BeautifulSLider';

const GaussianDropoutNode: React.FC<NodeProps<GaussianDropoutNodeType>> = ({ id, data, selected }) => {
    const { setNodes } = useReactFlow<GaussianDropoutNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof GaussianDropoutNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };
    
    return (
        <div className={`tf-node-gaussian-dropout ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-gaussian-dropout__header">Gaussian Dropout</div>

            {/* Поля */}
            <div className="tf-node-gaussian-dropout__body">
                <div className="property">
                    <label className="property__key">Name</label>
                    <input
                        type="text"
                        value={data.tf_layer_name}
                        onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                        className="nopan nodrag property__value"
                    />
                </div>

                <BeautifulSlider
                    value={data.tf_layer_strength}
                    onChange={(e) => handleChange('tf_layer_strength', parseFloat(e.target.value))}
                    onWheel={(e) => {
                        e.preventDefault();

                        const step = 0.05;
                        const delta = e.deltaY < 0 ? step : -step;

                        let newValue = Number(data.tf_layer_strength) + delta;
                        newValue = Math.min(1, Math.max(0, newValue));

                        handleChange('tf_layer_strength', Number(newValue.toFixed(3)));
                    }}
                    min={0}
                    max={1}
                    step={0.001}
                    color='#00796B'
                />

                {/* <div className="property">
                    <div className="property__slider-wrapper">
                        <input
                            className="nopan nodrag nowheel slider-input"
                            type="range"
                            min={0}
                            max={1}
                            step={0.001}
                            value={data.tf_layer_strength}
                            onChange={(e) => handleChange('tf_layer_strength', parseFloat(e.target.value))}
                            onWheel={(e) => {
                                e.preventDefault();

                                const step = 0.05;
                                const delta = e.deltaY < 0 ? step : -step;

                                let newValue = Number(data.tf_layer_strength) + delta;
                                newValue = Math.min(1, Math.max(0, newValue));

                                handleChange('tf_layer_strength', Number(newValue.toFixed(3)));
                            }}
                        />
                        <div className="slider-overlay">
                            <span className="slider-label">Strength</span>
                            <span className="slider-value">{Number(data.tf_layer_strength).toFixed(3)}</span>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Входной пин */}
            <Handle
                type="target"
                position={Position.Left}
                className="tf-node-gaussian-dropout__connector tf-node-gaussian-dropout__connector--target"
            />

            {/* Выходной пин */}
            <Handle
                type="source"
                position={Position.Right}
                className="tf-node-gaussian-dropout__connector tf-node-gaussian-dropout__connector--source"
            />
        </div>
    );
};

export default GaussianDropoutNode;
