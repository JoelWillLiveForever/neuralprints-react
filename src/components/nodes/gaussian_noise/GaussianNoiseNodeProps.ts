import { Node } from '@xyflow/react';

// Определяем ТОЛЬКО данные узла с использованием type
export type GaussianNoiseNodeData = {
    tf_layer_name: string;
    tf_layer_stddev: number;
}

// Создаем полный тип узла с указанием типа узла
export type GaussianNoiseNodeType = Node<GaussianNoiseNodeData, 'TF_GAUSSIAN_NOISE_LAYER_NODE'>;