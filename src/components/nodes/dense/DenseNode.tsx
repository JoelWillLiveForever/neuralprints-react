import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { DenseNodeData, DenseNodeType } from './DenseNodeProps';

import './dense_node.scss';

const DenseNode: React.FC<NodeProps<DenseNodeType>> = ({ id, data, selected }) => {
    const { setNodes } = useReactFlow<DenseNodeType>();

    // // Устанавливаем начальное значение для tf_layer_neurons_count
    // useEffect(() => {
    //     data.tf_layer_neurons_count = 128;
    //     data.tf_layer_use_bias = true;
    // }, [data]);

    // // Инициализация состояния для DenseNode
    // const [data, setData] = useState({
    //     tf_layer_neurons_count: 128, // Начальное значение
    //     tf_layer_use_bias: true, // Начальное значение
    // });

    // // Используем useEffect для обновления значений после монтирования компонента
    // useEffect(() => {
    //     // Это будет выполнено только один раз после монтирования компонента
    //     setData((prevData) => ({
    //         ...prevData,
    //         tf_layer_neurons_count: 128,
    //         tf_layer_use_bias: true,
    //     }));
    // }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз

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
                        value={data.tf_layer_neurons_count}
                        onChange={(e) => handleChange('tf_layer_neurons_count', Number(e.target.value))}
                        className="nopan nodrag property__value"
                        min={1}
                        max={1024}
                        step={1}
                    />
                </div>

                <div className="property">
                    <label className="property__key">Activation</label>
                    <div className="property__select-wrapper">
                        <select
                            value={data.tf_layer_activation_function}
                            onChange={(e) => handleChange('tf_layer_activation_function', e.target.value)}
                            className="property__select"
                        >
                            <option value="" selected disabled hidden>
                                Select activation function
                            </option>

                            <option value="elu">ELU</option>
                            <option value="exponential">Exponential</option>
                            <option value="gelu">GELU</option>
                            <option value="hard_sigmoid">Hard sigmoid</option>
                            <option value="hard_silu">Hard SiLU</option>
                            <option value="hard_swish">Hard Swish</option>
                            <option value="leaky_swish">Leaky ReLU</option>
                            <option value="linear">Linear</option>
                            <option value="log_softmax">Log-Softmax</option>
                            <option value="mish">Mish</option>
                            <option value="relu">ReLU</option>
                            <option value="relu6">ReLU6</option>
                            <option value="selu">SELU</option>
                            <option value="sigmoid">Sigmoid</option>
                            <option value="silu">SiLU</option>
                            <option value="softmax">Softmax</option>
                            <option value="softplus">Softplus</option>
                            <option value="softsign">Softsign</option>
                            <option value="swish">Swish</option>
                            <option value="tanh">Hyperbolic Tangent (tanh)</option>
                        </select>
                    </div>
                </div>

                {/* Use Bias в виде combobox */}
                <div className="property">
                    <label className="property__key">Use Bias</label>
                    <div className="property__select-wrapper">
                        <select
                            value={data.tf_layer_use_bias ? 'yes' : 'no'}
                            onChange={(e) => handleChange('tf_layer_use_bias', e.target.value === 'yes' ? 1 : 0)}
                            className="property__select"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Входной пин */}
            <Handle
                type="target"
                position={Position.Left}
                className="tf-node-dense__connector tf-node-dense__connector--target"
            />

            {/* Выходной пин */}
            <Handle
                type="source"
                position={Position.Right}
                className="tf-node-dense__connector tf-node-dense__connector--source"
            />
        </div>
    );
};

export default DenseNode;
