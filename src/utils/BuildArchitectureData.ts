import { Node as RFNode, Edge as RFEdge } from '@xyflow/react';
import { Layer } from '../api/Types';

function is_typed_node(node: RFNode): node is RFNode & { type: string; data: any } {
    return typeof node.type === 'string' && !!node.data;
}

function validate_nodes(nodes: RFNode[]) {
    nodes.forEach(node => {
        if (!is_typed_node(node)) {
            throw new Error(`Узел ${node.id} имеет неполные данные!`);
        }
    })
}

function find_input_node(nodes: RFNode[]): RFNode {
    const input_nodes = nodes.filter(node => node.type === 'TF_INPUT_LAYER_NODE');

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

export const build_architecture_data = (nodes: RFNode[], edges: RFEdge[]): Layer[] => {
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

        architecture.push({
            type: current_node.type as Layer['type'],
            data: current_node.data
        });

        const next_id = edge_map.get(current_node.id);
        if (!next_id) break;

        current_node = nodes.find(n => n.id === next_id);
    }

    if (architecture.length !== nodes.length) {
        const missing = nodes.filter(
            n => !architecture.some(l => l.data.tf_layer_name === n.data?.tf_layer_name)
        );

        throw new Error(
            `Обнаружены несоединенные слои: ${missing.map(n => n.data?.tf_layer_name || 'unknown').join(', ')}`
        );
    }

    return architecture;
};