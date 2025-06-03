import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { DropoutNodeData, DropoutNodeType } from './DropoutNodeProps';

import './dropout_node.scss';
import BeautifulSlider from '../../beautiful_slider/BeautifulSlider';
import BeautifulField from '../../beautiful_field/BeautifulField';

const DropoutNode: React.FC<NodeProps<DropoutNodeType>> = ({ id, data, selected }) => {
    const { setNodes, setEdges } = useReactFlow<DropoutNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof DropoutNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };

    // useEffect(() => {
    //     data.tf_layer_strength = 0.5;
    // });

    const handleDeleteNode = () => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    };

    return (
        <div className={`tf-node-dropout ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-dropout__header">
                <span>Gaussian Noise</span>
                <button onClick={handleDeleteNode} className="delete-btn" title="Delete node">
                    <i className="bi bi-trash-fill"></i>
                </button>
            </div>

            {/* Поля */}
            <div className="tf-node-dropout__body">
                <BeautifulField
                    value={data.tf_layer_name}
                    onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                    type="text"
                    label="Name"
                    placeholder="Input layer name"
                    color="#1976D2"
                />

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
                    color="#1976D2"
                    label="Strength"
                />

                {/* 
                <div className="property">
                    
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
                className="tf-node-dropout__connector tf-node-dropout__connector--target"
            />

            {/* Выходной пин */}
            <Handle
                type="source"
                position={Position.Right}
                className="tf-node-dropout__connector tf-node-dropout__connector--source"
            />
        </div>
    );
};

export default DropoutNode;
