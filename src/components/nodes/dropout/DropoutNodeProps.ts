import { Node } from '@xyflow/react';

// Определяем ТОЛЬКО данные узла с использованием type
export type DropoutNodeData = {
    tf_layer_name: string;
    tf_layer_neurons_count: number;
}

// Создаем полный тип узла с указанием типа узла
export type DropoutNodeType = Node<DropoutNodeData, 'dropoutNode'>;