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
        <div className={`tf-node-input ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-input__header">Input</div>

            {/* Поля */}
            <div className="tf-node-input__body">
                <div className="property">
                    <label className="property__key">Name</label>
                    <input
                        type="text"
                        value={data.tf_layer_name}
                        onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                        className="property__value"
                    />
                </div>

                <div className="property">
                    <label className="property__key">Neurons</label>
                    <input
                        type="number"
                        className="nopan nodrag property__value"
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
                        // onWheel={(e) => {
                        //     e.preventDefault();
                        //     const step = e.deltaY > 0 ? -1 : 1; // Если прокрутка вниз, уменьшаем значение, если вверх — увеличиваем
                        //     handleChange(
                        //         'tf_layer_neurons_count',
                        //         Math.max(1, Math.min(1024, data.tf_layer_neurons_count + step))
                        //     );
                        // }}
                        min={1}
                        max={1024}
                        step={1}
                    />
                </div>
            </div>

            {/* Выходной пин */}
            <Handle type="source" position={Position.Right} className="tf-node-input__connector" />
        </div>
    );
};

export default InputNode;
