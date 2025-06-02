import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

import type { Conv2DNodeData, Conv2DNodeType } from './Conv2DNodeProps';

import './conv_2d_node.scss';
import BeautifulComboBox from '../../beautiful_combo_box/BeautifulComboBox';
import BeautifulField from '../../beautiful_field/BeautifulField';

const Conv2DNode: React.FC<NodeProps<Conv2DNodeType>> = ({ id, data, selected }) => {
    const { setNodes, setEdges } = useReactFlow<Conv2DNodeType>();

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

    const handleChange = (field: keyof Conv2DNodeData, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node))
        );
    };

    const handleDoubleChange = (field: keyof Conv2DNodeData, index: number, value: number) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id !== id) return node;

                // Проверка типа данных
                const fieldValue = node.data[field];
                if (!Array.isArray(fieldValue)) {
                    console.error(`Field ${String(field)} is not an array`);
                    return node;
                }

                // Создание копии массива
                const newArray = [...fieldValue];
                newArray[index] = value;

                return {
                    ...node,
                    data: {
                        ...node.data,
                        [field]: newArray,
                    },
                };
            })
        );
    };

    const handleDeleteNode = () => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    };

    return (
        <div className={`tf-node-conv-2d ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
            {/* Заголовок */}
            <div className="tf-node-conv-2d__header">
                <span>Conv2D</span>
                <button onClick={handleDeleteNode} className="delete-btn" title="Delete node">
                    <i className="bi bi-trash-fill"></i>
                </button>
            </div>

            {/* Поля */}
            <div className="tf-node-conv-2d__body">
                <BeautifulField
                    value={data.tf_layer_name}
                    onChange={(e) => handleChange('tf_layer_name', e.target.value)}
                    type="text"
                    label="Name"
                    placeholder="Input layer name"
                    color="#E64A19"
                />

                <BeautifulField
                    value={data.tf_layer_filters_count}
                    onChange={(e) => handleChange('tf_layer_filters_count', Number(e.target.value))}
                    onWheel={(e) => {
                        e.preventDefault();
                        const step = e.deltaY > 0 ? -1 : 1; // Если прокрутка вниз, уменьшаем значение, если вверх — увеличиваем
                        handleChange(
                            'tf_layer_filters_count',
                            Math.max(1, Math.min(1024, data.tf_layer_filters_count + step))
                        );
                    }}
                    min={1}
                    max={1024}
                    step={1}
                    type="numeric"
                    // label="Filters"
                    label="Kernels"
                    color="#E64A19"
                />

                <BeautifulField
                    value_1={data.tf_layer_kernel_size[0]}
                    onChange_1={(e) => handleDoubleChange('tf_layer_kernel_size', 0, Number(e.target.value))}
                    onWheel_1={(e) => {
                        e.preventDefault();
                        const step = e.deltaY > 0 ? -1 : 1;
                        handleDoubleChange(
                            'tf_layer_kernel_size',
                            0,
                            Math.max(1, Math.min(9, data.tf_layer_kernel_size[0] + step))
                        );
                    }}
                    min_1={1}
                    max_1={9}
                    step_1={1}
                    value_2={data.tf_layer_kernel_size[1]}
                    onChange_2={(e) => handleDoubleChange('tf_layer_kernel_size', 1, Number(e.target.value))}
                    onWheel_2={(e) => {
                        e.preventDefault();
                        const step = e.deltaY > 0 ? -1 : 1;
                        handleDoubleChange(
                            'tf_layer_kernel_size',
                            1,
                            Math.max(1, Math.min(9, data.tf_layer_kernel_size[1] + step))
                        );
                    }}
                    min_2={1}
                    max_2={9}
                    step_2={1}
                    type="numeric-double"
                    label="Kernel size"
                    color="#E64A19"
                />

                <BeautifulComboBox
                    value={data.tf_layer_activation_function}
                    onChange={(e) => handleChange('tf_layer_activation_function', e.target.value)}
                    placeholder="Select activation function"
                    label="Activation"
                    color="#E64A19"
                >
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
                </BeautifulComboBox>

                {/* Use Bias в виде combobox */}
                <BeautifulComboBox
                    value={data.tf_layer_use_bias ? 'yes' : 'no'}
                    onChange={(e) => handleChange('tf_layer_use_bias', e.target.value === 'yes' ? 1 : 0)}
                    label="Use Bias"
                    color="#E64A19"
                >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </BeautifulComboBox>
            </div>

            {/* Входной пин */}
            <Handle
                type="target"
                position={Position.Left}
                className="tf-node-conv-2d__connector tf-node-conv-2d__connector--target"
            />

            {/* Выходной пин */}
            <Handle
                type="source"
                position={Position.Right}
                className="tf-node-conv-2d__connector tf-node-conv-2d__connector--source"
            />
        </div>
    );
};

export default Conv2DNode;
