import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { InputNodeData, InputNodeType } from './InputNodeProps';

import './input_node.scss';
import BeautifulField from '../../beautiful_field/BeautifulField';

const InputNode: React.FC<NodeProps<InputNodeType>> = ({ id, data, selected }) => {
    const { setNodes, setEdges } = useReactFlow<InputNodeType>(); // Типизируем useReactFlow

    const handleChange = (field: keyof InputNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };

    const handleDeleteNode = () => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    };

    return (
        <div className={`tf-node-input ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-input__header">
                <span>Input</span>
                <button onClick={handleDeleteNode} className="delete-btn" title="Delete node">
                    <i className="bi bi-trash-fill"></i>
                </button>
            </div>

            {/* Поля */}
            <div className="tf-node-input__body">
                <BeautifulField
                    value={data.tf_layer_name}
                    onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                    type="text"
                    label="Name"
                    placeholder="Input layer name"
                    color="#D32F2F"
                />

                {/* <div className="property">
                    <label className="property__key">Name</label>
                    <input
                        className="nopan nodrag property__value"
                        type="text"
                        value={data.tf_layer_name}
                        onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                    />
                </div> */}

                <BeautifulField
                    value={data.tf_layer_neurons_count}
                    onChange={(e) => handleChange('tf_layer_neurons_count', Number(e.target.value))}
                    onWheel={(e) => {
                        e.preventDefault();
                        const step = e.deltaY > 0 ? -1 : 1; // Если прокрутка вниз, уменьшаем значение, если вверх — увеличиваем
                        handleChange(
                            'tf_layer_neurons_count',
                            Math.max(1, Math.min(1024, data.tf_layer_neurons_count + step))
                        );
                    }}
                    min={1}
                    max={1024}
                    step={1}
                    type="numeric"
                    label="Neurons"
                    color="#D32F2F"
                />

                {/* <div className="property">
                    <label className="property__key">Neurons</label>
                    <input
                        className="nopan nodrag nowheel property__value"
                        type="number"
                        value={data.tf_layer_neurons_count}
                        onChange={(e) => {
                            // e.stopPropagation();
                            handleChange(
                                'tf_layer_neurons_count',
                                Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 1)
                            );
                        }}
                        // onMouseUp={(e) => {
                        //     e.stopPropagation();
                        // }}
                        // TODO: Допилить измкенение значений при прокрутке колеса мыши
                        onWheel={(e) => {
                            e.preventDefault();
                            const step = e.deltaY > 0 ? -1 : 1; // Если прокрутка вниз, уменьшаем значение, если вверх — увеличиваем
                            handleChange(
                                'tf_layer_neurons_count',
                                Math.max(1, Math.min(1024, data.tf_layer_neurons_count + step))
                            );
                        }}
                        min={1}
                        max={1024}
                        step={1}
                    />
                </div> */}
            </div>

            {/* Выходной пин */}
            <Handle type="source" position={Position.Right} className="tf-node-input__connector" />
        </div>
    );
};

export default InputNode;
