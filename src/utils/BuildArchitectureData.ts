import { Node as RFNode, Edge as RFEdge } from '@xyflow/react';

// Импортируем данные каждого слоя из соответствующих компонентов
import { InputNodeData } from '../components/nodes/input/InputNodeProps';
import { DenseNodeData } from '../components/nodes/dense/DenseNodeProps';
import { DropoutNodeData } from '../components/nodes/dropout/DropoutNodeProps';
import { GaussianDropoutNodeData } from '../components/nodes/gaussian_dropout/GaussianDropoutNodeProps';
import { GaussianNoiseNodeData } from '../components/nodes/gaussian_noise/GaussianNoiseNodeProps';
import { FlattenNodeData } from '../components/nodes/flatten/FlattenNodeProps';
import { Conv2DNodeData } from '../components/nodes/conv_2d/Conv2DNodeProps';

import { Layer } from '../api/Types';

export type TypedNode = RFNode<{ [key: string]: unknown }, Layer['type']>;

function is_typed_node(node: RFNode): node is TypedNode {
    return typeof node.data === 'object' && node.data !== null;
}

// TODO: чекнуть потом
// function is_typed_node(node: RFNode): node is TypedNode {
//     return typeof node.data === 'object' && node.data !== null && 'tf_layer_name' in node.data;
// }

function validate_nodes(nodes: RFNode[]) {
    nodes.forEach((node) => {
        if (!is_typed_node(node)) {
            throw new Error(`Узел ${node.id} имеет неполные данные!`);
        }
    });
}

function find_input_node(nodes: RFNode[]): RFNode {
    const input_nodes = nodes.filter((node) => node.type === 'TF_INPUT_LAYER_NODE');

    if (input_nodes.length !== 1) {
        throw new Error('Должен присутствовать ровно один входной слой!');
    }

    return input_nodes[0];
}

function build_edge_map(edges: RFEdge[]): Map<string, string> {
    const map = new Map<string, string>();

    for (const edge of edges) {
        if (map.has(edge.source)) {
            throw new Error(`Несколько исходящих связей у узла ${edge.source}`);
        }
        map.set(edge.source, edge.target);
    }

    return map;
}

export const build_architecture_data = (nodes: TypedNode[], edges: RFEdge[]): Layer[] => {
    if (nodes.length === 0) {
        throw new Error('Нет слоев в архитектуре!');
    }

    validate_nodes(nodes);

    const input_node = find_input_node(nodes);
    const edge_map = build_edge_map(edges);

    const architecture: Layer[] = [];
    let current_node = input_node;

    while (current_node) {
        if (!is_typed_node(current_node)) {
            throw new Error(`Узел ${current_node.id} имеет неполные данные!`);
        }

        // architecture.push({
        //     type: current_node.type as Layer['type'],
        //     data: current_node.data
        // });

        const normalized_data = { ...current_node.data };

        if ('tf_layer_use_bias' in normalized_data) {
            normalized_data.tf_layer_use_bias = Boolean(normalized_data.tf_layer_use_bias);
        }

        switch (current_node.type) {
            case 'TF_INPUT_LAYER_NODE':
                architecture.push({
                    type: 'TF_INPUT_LAYER_NODE',
                    data: normalized_data as InputNodeData,
                });
                break;

            case 'TF_DENSE_LAYER_NODE':
                architecture.push({
                    type: 'TF_DENSE_LAYER_NODE',
                    data: normalized_data as DenseNodeData,
                });
                break;

            case 'TF_DROPOUT_LAYER_NODE':
                architecture.push({
                    type: 'TF_DROPOUT_LAYER_NODE',
                    data: normalized_data as DropoutNodeData,
                });
                break;

            case 'TF_GAUSSIAN_DROPOUT_LAYER_NODE':
                architecture.push({
                    type: 'TF_GAUSSIAN_DROPOUT_LAYER_NODE',
                    data: normalized_data as GaussianDropoutNodeData,
                });
                break;

            case 'TF_GAUSSIAN_NOISE_LAYER_NODE':
                architecture.push({
                    type: 'TF_GAUSSIAN_NOISE_LAYER_NODE',
                    data: normalized_data as GaussianNoiseNodeData,
                });
                break;

            case 'TF_CONV_2D_LAYER_NODE':
                architecture.push({
                    type: 'TF_CONV_2D_LAYER_NODE',
                    data: normalized_data as Conv2DNodeData,
                });
                break;

            case 'TF_FLATTEN_LAYER_NODE':
                architecture.push({
                    type: 'TF_FLATTEN_LAYER_NODE',
                    data: normalized_data as FlattenNodeData,
                });
                break;

            default:
                throw new Error(`Неизвестный тип слоя: ${current_node.type}`);
        }

        const next_id = edge_map.get(current_node.id);
        if (!next_id) break;

        const next_node = nodes.find((n) => n.id === next_id);
        if (!next_node) {
            throw new Error(`Не найден узел с id=${next_id}`);
        }

        current_node = next_node;

        // current_node = nodes.find(n => n.id === next_id);
    }

    if (architecture.length !== nodes.length) {
        // const missing = nodes.filter((n) => !architecture.some((l) => l.data.tf_layer_name === n.data?.tf_layer_name));
        const missing = nodes.filter((n) => {
            if (n.type === 'TF_FLATTEN_LAYER_NODE') return false; // Игнорируем Flatten узлы
            return !architecture.some((l) => l.data.tf_layer_name === n.data?.tf_layer_name);
        });

        throw new Error(
            `Обнаружены несоединенные слои: ${missing.map((n) => n.data?.tf_layer_name || 'unknown').join(', ')}`
        );
    }

    return architecture;
};
