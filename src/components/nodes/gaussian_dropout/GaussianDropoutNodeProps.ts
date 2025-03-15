import { Node } from '@xyflow/react';

// Определяем ТОЛЬКО данные узла с использованием type
export type GaussianDropoutNodeData = {
    tf_layer_name: string;
    tf_layer_strength: number;
}

// Создаем полный тип узла с указанием типа узла
export type GaussianDropoutNodeType = Node<GaussianDropoutNodeData, 'TF_GAUSSIAN_DROPOUT_LAYER_NODE'>;